import {
  embeddingError,
  externalServiceError,
} from "@/lib/utils/errors";

const EMBEDDING_API_URL =
  process.env.AI_EMBEDDING_API_URL ??
  "https://generativelanguage.googleapis.com/v1beta";

const EMBEDDING_MODEL =
  process.env.AI_EMBEDDING_MODEL ??
  "gemini-embedding-001";

const EMBEDDING_DIMENSIONS = Number(
  process.env.AI_EMBEDDING_DIMENSIONS ?? "1536",
);

const EMBEDDING_TIMEOUT_MS = 30_000;

interface EmbeddingResponse {
  embeddings?: Array<{
    values?: number[];
  }>;
  error?: {
    message?: string;
  };
}

function getApiKey(): string {
  const key = process.env.AI_API_KEY;

  if (!key) {
    throw embeddingError(
      "AI_API_KEY is not configured.",
    );
  }

  return key;
}

function validateEmbedding(
  embedding: unknown,
): number[] {
  if (!Array.isArray(embedding)) {
    throw embeddingError(
      "Embedding provider returned an invalid vector.",
    );
  }

  if (
    embedding.length !== EMBEDDING_DIMENSIONS
  ) {
    throw embeddingError(
      "Embedding dimension does not match the configured database dimension.",
      {
        expected: EMBEDDING_DIMENSIONS,
        received: embedding.length,
      },
    );
  }

  if (
    embedding.some(
      (value) =>
        typeof value !== "number" ||
        !Number.isFinite(value),
    )
  ) {
    throw embeddingError(
      "Embedding contains invalid numeric values.",
    );
  }

  return embedding;
}

async function requestEmbeddings(
  inputs: string[],
  taskType:
    | "RETRIEVAL_DOCUMENT"
    | "RETRIEVAL_QUERY",
): Promise<number[][]> {
  if (inputs.length === 0) {
    return [];
  }

  const apiKey = getApiKey();

  let response: Response;

  try {
    response = await fetch(
      `${EMBEDDING_API_URL}/models/${EMBEDDING_MODEL}:batchEmbedContents`,
      {
        method: "POST",
        headers: {
          "x-goog-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requests: inputs.map((content) => ({
            model: `models/${EMBEDDING_MODEL}`,
            content: {
              parts: [{ text: content }],
            },
            taskType,
            outputDimensionality:
              EMBEDDING_DIMENSIONS,
          })),
        }),
        signal: AbortSignal.timeout(
          EMBEDDING_TIMEOUT_MS,
        ),
        cache: "no-store",
      },
    );
  } catch (error) {
    throw externalServiceError(
      "Failed to connect to the Gemini embedding provider.",
      {
        cause:
          error instanceof Error
            ? error.message
            : String(error),
      },
    );
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");

    throw externalServiceError(
      "Gemini embedding provider returned an error.",
      {
        status: response.status,
        body: body.slice(0, 500),
      },
    );
  }

  let data: EmbeddingResponse;

  try {
    data =
      (await response.json()) as EmbeddingResponse;
  } catch {
    throw embeddingError(
      "Gemini embedding provider returned invalid JSON.",
    );
  }

  if (data.error) {
    throw embeddingError(
      data.error.message ??
        "Gemini embedding provider returned an error.",
    );
  }

  if (!Array.isArray(data.embeddings)) {
    throw embeddingError(
      "Gemini embedding provider returned no embeddings.",
    );
  }

  if (data.embeddings.length !== inputs.length) {
    throw embeddingError(
      "Gemini embedding provider returned an unexpected number of vectors.",
      {
        expected: inputs.length,
        received: data.embeddings.length,
      },
    );
  }

  return data.embeddings.map((item) =>
    validateEmbedding(item.values),
  );
}

export async function createEmbedding(
  input: string,
): Promise<number[]> {
  const normalized = input.trim();

  if (!normalized) {
    throw embeddingError(
      "Cannot create an embedding from empty text.",
    );
  }

  const [embedding] =
    await requestEmbeddings(
      [normalized],
      "RETRIEVAL_QUERY",
    );

  return embedding;
}

export async function createEmbeddings(
  inputs: string[],
): Promise<number[][]> {
  const normalized = inputs.map((input) =>
    input.trim(),
  );

  if (normalized.some((input) => !input)) {
    throw embeddingError(
      "Cannot create embeddings from empty text.",
    );
  }

  return requestEmbeddings(
    normalized,
    "RETRIEVAL_DOCUMENT",
  );
}

export function getEmbeddingConfiguration(): {
  model: string;
  dimensions: number;
} {
  return {
    model: EMBEDDING_MODEL,
    dimensions: EMBEDDING_DIMENSIONS,
  };
}
