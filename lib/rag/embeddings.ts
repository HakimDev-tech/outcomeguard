import {
  embeddingError,
  externalServiceError,
} from "@/lib/utils/errors";

const EMBEDDING_API_URL =
  process.env.AI_EMBEDDING_API_URL ??
  "https://api.openai.com/v1/embeddings";

const EMBEDDING_MODEL =
  process.env.AI_EMBEDDING_MODEL ??
  "text-embedding-3-small";

const EMBEDDING_DIMENSIONS = Number(
  process.env.AI_EMBEDDING_DIMENSIONS ?? "1536",
);

const EMBEDDING_TIMEOUT_MS = 30_000;

interface EmbeddingResponse {
  data?: Array<{
    embedding?: number[];
    index?: number;
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
): Promise<number[][]> {
  if (inputs.length === 0) {
    return [];
  }

  const apiKey = getApiKey();

  let response: Response;

  try {
    response = await fetch(EMBEDDING_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: EMBEDDING_MODEL,
        input: inputs,
      }),
      signal: AbortSignal.timeout(
        EMBEDDING_TIMEOUT_MS,
      ),
      cache: "no-store",
    });
  } catch (error) {
    throw externalServiceError(
      "Failed to connect to the embedding provider.",
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
      "Embedding provider returned an error.",
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
      "Embedding provider returned invalid JSON.",
    );
  }

  if (data.error) {
    throw embeddingError(
      data.error.message ??
        "Embedding provider returned an error.",
    );
  }

  if (!Array.isArray(data.data)) {
    throw embeddingError(
      "Embedding provider returned no embeddings.",
    );
  }

  const sorted = [...data.data].sort(
    (a, b) => (a.index ?? 0) - (b.index ?? 0),
  );

  if (sorted.length !== inputs.length) {
    throw embeddingError(
      "Embedding provider returned an unexpected number of vectors.",
      {
        expected: inputs.length,
        received: sorted.length,
      },
    );
  }

  return sorted.map((item) =>
    validateEmbedding(item.embedding),
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
    await requestEmbeddings([normalized]);

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

  return requestEmbeddings(normalized);
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
