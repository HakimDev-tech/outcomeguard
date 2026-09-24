/**
 * OutcomeGuard
 * Central AI client
 *
 * Uses the Gemini REST API with retry and model fallback
 * for transient provider capacity failures.
 */

import {
  aiError,
  aiInvalidResponseError,
  aiTimeoutError,
} from "@/lib/utils/errors";

const DEFAULT_TIMEOUT_MS = 60_000;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1_000;
const DEFAULT_FALLBACK_MODEL = "gemini-3.7-flash";

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
    fallbackModel:
      process.env.AI_FALLBACK_MODEL ?? DEFAULT_FALLBACK_MODEL,
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

async function generateWithModel(
  model: string,
  apiKey: string,
  options: GenerateTextOptions,
  signal: AbortSignal,
): Promise<Response> {
  const generationConfig: Record<string, number> = {
    maxOutputTokens: options.maxOutputTokens ?? 3000,
  };

  return requestWithRetry(
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
        generationConfig,
      }),
      signal,
      cache: "no-store",
    },
    MAX_RETRIES,
  );
}

/**
 * Generates text using Gemini generateContent.
 *
 * 408, 429 and 5xx errors are retried with exponential backoff.
 * A persistent 503 on the primary model falls back to a stable
 * secondary Flash model.
 */
export async function generateText(
  options: GenerateTextOptions,
): Promise<AIResponse> {
  const { apiKey, model, fallbackModel } =
    getAIConfiguration();

  const controller = new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  );

  try {
    let response = await generateWithModel(
      model,
      apiKey,
      options,
      controller.signal,
    );

    let usedModel = model;

    if (
      response.status === 503 &&
      fallbackModel &&
      fallbackModel !== model &&
      !controller.signal.aborted
    ) {
      response = await generateWithModel(
        fallbackModel,
        apiKey,
        options,
        controller.signal,
      );
      usedModel = fallbackModel;
    }

    if (!response.ok) {
      const errorBody = await response.text();

      throw aiError(
        `AI provider request failed with status ${response.status} after retrying model ${usedModel}.`,
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
