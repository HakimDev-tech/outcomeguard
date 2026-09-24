/**
 * OutcomeGuard - central Gemini client.
 */

import {
  aiError,
  aiInvalidResponseError,
  aiTimeoutError,
} from "@/lib/utils/errors";

const DEFAULT_TIMEOUT_MS = 60_000;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1_000;
const DEFAULT_MODEL = "gemini-3.8-flash";

const GEMINI_API_URL =
  process.env.AI_API_URL ??
  "https://generativelanguage.googleapis.com/v1beta";

interface GenerateTextOptions {
  system: string;
  user: string;
  maxOutputTokens?: number;
  timeoutMs?: number;
  responseSchema?: Record<string, unknown>;
}

interface AIResponse {
  text: string;
}

function getRequiredEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getAIConfiguration() {
  return {
    apiKey: getRequiredEnvironmentVariable("AI_API_KEY"),
    model: process.env.AI_MODEL?.trim() || DEFAULT_MODEL,
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
      await sleep(
        INITIAL_RETRY_DELAY_MS * 2 ** attempt +
          Math.floor(Math.random() * 250),
      );
    }
  }

  if (!lastResponse) {
    throw new Error("AI provider request failed without a response.");
  }

  return lastResponse;
}

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
    // Gemini 3.8 Flash does not accept legacy temperature.
    const generationConfig: Record<string, unknown> = {
      maxOutputTokens: options.maxOutputTokens ?? 3000,
      responseMimeType: "application/json",
    };

    if (options.responseSchema) {
      generationConfig.responseSchema = options.responseSchema;
    }

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
          generationConfig,
        }),
        signal: controller.signal,
        cache: "no-store",
      },
      MAX_RETRIES,
    );

    if (!response.ok) {
      const errorBody = await response.text();
      let providerMessage = errorBody.slice(0, 2000);

      try {
        const parsed = JSON.parse(errorBody) as {
          error?: {
            message?: string;
            status?: string;
            code?: number;
          };
        };

        if (parsed.error?.message) {
          providerMessage = [
            parsed.error.message,
            parsed.error.status ? `status=${parsed.error.status}` : null,
            parsed.error.code ? `code=${parsed.error.code}` : null,
          ]
            .filter(Boolean)
            .join(" | ");
        }
      } catch {}

      throw aiError(
        `AI provider request failed with status ${response.status}: ${providerMessage}`,
        {
          provider: "google-gemini",
          model,
          message: providerMessage,
        },
      );
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
        finishReason?: string;
      }>;
      error?: { message?: string };
    };

    if (data.error) {
      throw aiError(
        data.error.message ?? "Gemini returned an error.",
        { provider: "google-gemini", model },
      );
    }

    const text = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim();

    if (!text) {
      throw aiInvalidResponseError(
        "Gemini returned an empty structured response.",
        {
          model,
          finishReason: data.candidates?.[0]?.finishReason,
        },
      );
    }

    return { text };
  } catch (error) {
    if (
      (error instanceof DOMException && error.name === "AbortError") ||
      (error instanceof Error && error.name === "AbortError")
    ) {
      throw aiTimeoutError();
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export function parseAIJson<T>(text: string): T {
  const cleaned = text
    .replace(/^\`\`\`json\s*/i, "")
    .replace(/^\`\`\`\s*/i, "")
    .replace(/\s*\`\`\`$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const objectStart = cleaned.indexOf("{");
    const objectEnd = cleaned.lastIndexOf("}");

    if (objectStart >= 0 && objectEnd > objectStart) {
      try {
        return JSON.parse(cleaned.slice(objectStart, objectEnd + 1)) as T;
      } catch {}
    }

    const arrayStart = cleaned.indexOf("[");
    const arrayEnd = cleaned.lastIndexOf("]");

    if (arrayStart >= 0 && arrayEnd > arrayStart) {
      try {
        return JSON.parse(cleaned.slice(arrayStart, arrayEnd + 1)) as T;
      } catch {}
    }

    throw aiInvalidResponseError(
      "The AI provider returned invalid JSON.",
      { rawResponse: text.slice(0, 4000) },
    );
  }
}
