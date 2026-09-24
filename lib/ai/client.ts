/**
 * OutcomeGuard
 * Central AI client
 *
 * Uses the Gemini REST API so the configured AI_API_KEY
 * is handled by the provider it belongs to.
 */

import {
  aiError,
  aiInvalidResponseError,
  aiTimeoutError,
} from "@/lib/utils/errors";

const DEFAULT_TIMEOUT_MS = 60_000;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1_000;

const GEMINI_API_URL =
  process.env.AI_API_URL ??
  "https://generativelanguage.googleapis.com/v1beta";

interface GenerateTextOptions {
  system: string;
  user: string;
  temperature?: number;
  maxOutputTokens?: number;
  timeoutMs?: number;
}

interface AIResponse {
  text: string;
}

function getRequiredEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}`,
    );
  }

  return value;
}

function getAIConfiguration() {
  return {
    apiKey: getRequiredEnvironmentVariable("AI_API_KEY"),
    model: getRequiredEnvironmentVariable("AI_MODEL"),
  };
}

function isRetryableStatus(status: number): boolean {
  return status === 408 || status === 429 || status >= 500;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestWithRetry(
  url: string,
  init: RequestInit,
  maxRetries: number,
): Promise<Response> {
  let lastResponse: Response | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const response = await fetch(url, init);

    if (response.ok || !isRetryableStatus(response.status)) {
      return response;
    }

    lastResponse = response;

    if (attempt < maxRetries) {
      const exponentialDelay =
        INITIAL_RETRY_DELAY_MS * 2 ** attempt;
      const jitter = Math.floor(Math.random() * 250);

      await sleep(exponentialDelay + jitter);
    }
  }

  if (!lastResponse) {
    throw new Error("AI provider request failed without a response.");
  }

  return lastResponse;
}

/**
 * Generates text using Gemini generateContent.
 *
 * Transient provider errors (408, 429, and 5xx) are retried
 * with exponential backoff and jitter.
 */
export async function generateText(
  options: GenerateTextOptions,
): Promise<AIResponse> {
  const { apiKey, model } = getAIConfiguration();

  const controller = new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  );

  try {
    const response = await requestWithRetry(
      `${GEMINI_API_URL}/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: options.system }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: options.user }],
            },
          ],
          generationConfig: {
            temperature: options.temperature ?? 0,
            maxOutputTokens: options.maxOutputTokens ?? 3000,
          },
        }),
        signal: controller.signal,
        cache: "no-store",
      },
      MAX_RETRIES,
    );

    if (!response.ok) {
      const errorBody = await response.text();

      throw aiError(
        `AI provider request failed with status ${response.status} after ${MAX_RETRIES + 1} attempts.`,
        errorBody.slice(0, 1000),
      );
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{
            text?: string;
          }>;
        };
      }>;
      error?: {
        message?: string;
      };
    };

    if (data.error) {
      throw aiError(
        data.error.message ?? "Gemini returned an error.",
      );
    }

    const text = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim();

    if (typeof text !== "string" || text.length === 0) {
      throw aiInvalidResponseError();
    }

    return { text };
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      throw aiTimeoutError();
    }

    if (
      error instanceof Error &&
      error.name === "AbortError"
    ) {
      throw aiTimeoutError();
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Parses a JSON response returned by the AI.
 */
export function parseAIJson<T>(text: string): T {
  try {
    const cleaned = text
      .replace(/^\`\`\`json\s*/i, "")
      .replace(/^\`\`\`\s*/i, "")
      .replace(/\s*\`\`\`$/i, "")
      .trim();

    return JSON.parse(cleaned) as T;
  } catch (error) {
    throw aiInvalidResponseError(
      "The AI provider returned invalid JSON.",
      {
        rawResponse: text,
        cause: error,
      },
    );
  }
}
