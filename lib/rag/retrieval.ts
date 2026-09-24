import { supabaseAdmin } from "@/lib/db/client";
import {
  databaseError,
  embeddingError,
  ragError,
} from "@/lib/utils/errors";
import { createEmbedding } from "./embeddings";

export interface RetrievedChunk {
  id: string;
  resourceId: string;
  chunkIndex: number;
  content: string;
  startChar?: number;
  endChar?: number;
  similarity: number;
}

export interface RetrievalOptions {
  resourceId?: string;
  limit?: number;
  minSimilarity?: number;
}

interface SearchRow {
  id: string;
  resource_id: string;
  chunk_index: number;
  content: string;
  start_char?: number | null;
  end_char?: number | null;
  similarity: number;
}

const DEFAULT_LIMIT = 8;
const DEFAULT_MIN_SIMILARITY = 0.35;

function validateOptions(
  options: RetrievalOptions,
): Required<RetrievalOptions> {
  const limit = options.limit ?? DEFAULT_LIMIT;
  const minSimilarity =
    options.minSimilarity ??
    DEFAULT_MIN_SIMILARITY;

  if (
    !Number.isInteger(limit) ||
    limit <= 0 ||
    limit > 50
  ) {
    throw ragError(
      "Retrieval limit must be an integer between 1 and 50.",
    );
  }

  if (
    minSimilarity < 0 ||
    minSimilarity > 1
  ) {
    throw ragError(
      "Minimum similarity must be between 0 and 1.",
    );
  }

  return {
    resourceId: options.resourceId ?? undefined,
    limit,
    minSimilarity,
  };
}

/**
 * Performs semantic search over resource_chunks using
 * PostgreSQL + pgvector.
 *
 * Requires a Supabase RPC function named:
 *
 *   match_resource_chunks
 *
 * Expected parameters:
 *   query_embedding
 *   match_resource_id
 *   match_threshold
 *   match_count
 */
export async function retrieveRelevantChunks(
  query: string,
  options: RetrievalOptions = {},
): Promise<RetrievedChunk[]> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    throw ragError(
      "Retrieval query cannot be empty.",
    );
  }

  const {
    resourceId,
    limit,
    minSimilarity,
  } = validateOptions(options);

  let embedding: number[];

  try {
    embedding =
      await createEmbedding(normalizedQuery);
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "AppError"
    ) {
      throw error;
    }

    throw embeddingError(
      "Failed to generate retrieval embedding.",
      {
        cause:
          error instanceof Error
            ? error.message
            : String(error),
      },
    );
  }

  let result;

  try {
    result = await supabaseAdmin.rpc(
      "match_resource_chunks",
      {
        query_embedding: embedding,
        match_resource_id: resourceId ?? null,
        match_threshold: minSimilarity,
        match_count: limit,
      },
    );
  } catch (error) {
    throw databaseError(
      "Failed to execute vector similarity search.",
      {
        cause:
          error instanceof Error
            ? error.message
            : String(error),
      },
    );
  }

  if (result.error) {
    throw databaseError(
      "Vector similarity search failed.",
      {
        message: result.error.message,
        code: result.error.code,
      },
    );
  }

  const rows =
    (result.data ?? []) as SearchRow[];

  return rows.map((row) => ({
    id: row.id,
    resourceId: row.resource_id,
    chunkIndex: row.chunk_index,
    content: row.content,
    startChar:
      row.start_char ?? undefined,
    endChar:
      row.end_char ?? undefined,
    similarity: Math.max(
      0,
      Math.min(1, Number(row.similarity)),
    ),
  }));
}

export function formatRetrievedEvidence(
  chunks: RetrievedChunk[],
): string {
  if (chunks.length === 0) {
    return "No relevant evidence was retrieved.";
  }

  return chunks
    .map(
      (chunk, index) =>
        `[Evidence ${index + 1}]
Chunk: ${chunk.chunkIndex}
Similarity: ${chunk.similarity.toFixed(3)}

${chunk.content}`,
    )
    .join("\n\n---\n\n");
}
