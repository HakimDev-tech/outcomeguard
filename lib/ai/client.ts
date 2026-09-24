/**
 * OutcomeGuard
 * Central AI client
 *
 * The rest of the application communicates with the AI provider
 * through this abstraction instead of importing a provider SDK
 * everywhere.
 */

import {
  aiError,
  aiInvalidResponseError,
  aiTimeoutError,
} from "@/lib/utils/errors";

const DEFAULT_TIMEOUT_MS = 60_000;

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

function getRequiredEnvironmentVariable(
  name: string
): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}`
    );
  }

  return value;
}

function getAIConfiguration() {
  return {
    apiKey: getRequiredEnvironmentVariable(
      "AI_API_KEY"
    ),
    model: getRequiredEnvironmentVariable(
      "AI_MODEL"
    ),
  };
}

/**
 * Generates text using the configured AI provider.
 *
 * The provider implementation is intentionally isolated here.
 */
export async function generateText(
  options: GenerateTextOptions
): Promise<AIResponse> {
  const { apiKey, model } =
    getAIConfiguration();

  const controller =
    new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ??
      DEFAULT_TIMEOUT_MS
  );

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },

        body: JSON.stringify({
          model,

          messages: [
            {
              role: "system",
              content: options.system,
            },
            {
              role: "user",
              content: options.user,
            },
          ],

          temperature:
            options.temperature ?? 0,

          max_tokens:
            options.maxOutputTokens ?? 3000,
        }),

        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const errorBody =
        await response.text();

      throw aiError(
        `AI provider request failed with status ${response.status}.`,
        errorBody
      );
    }

    const data = (await response.json()) as {
      choices?: Array<{
        message?: {
          content?: string | null;
        };
      }>;
    };

    const text =
      data.choices?.[0]?.message?.content;

    if (
      typeof text !== "string" ||
      text.trim().length === 0
    ) {
      throw aiInvalidResponseError();
    }

    return {
      text: text.trim(),
    };
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
 *
 * JSON validation against a Zod schema should happen at the
 * caller level because each AI operation has a different schema.
 */
export function parseAIJson<T>(
  text: string
): T {
  try {
    const cleaned =
      text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

    return JSON.parse(cleaned) as T;
  } catch (error) {
    throw aiInvalidResponseError(
      "The AI provider returned invalid JSON.",
      {
        rawResponse: text,
        cause: error,
      }
    );
  }
}
