import { resourceError } from "@/lib/utils/errors";

export interface TextChunk {
  index: number;
  content: string;
  startChar: number;
  endChar: number;
  tokenEstimate: number;
}

export interface ChunkOptions {
  chunkSize?: number;
  overlap?: number;
  minChunkSize?: number;
}

const DEFAULT_CHUNK_SIZE = 1_200;
const DEFAULT_OVERLAP = 200;
const DEFAULT_MIN_CHUNK_SIZE = 100;

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function findBoundary(
  text: string,
  targetEnd: number,
  maxEnd: number,
): number {
  if (targetEnd >= maxEnd) {
    return maxEnd;
  }

  const searchStart = Math.max(0, targetEnd - 250);
  const segment = text.slice(searchStart, targetEnd);

  const paragraphBoundary = segment.lastIndexOf("\n\n");

  if (paragraphBoundary !== -1) {
    return searchStart + paragraphBoundary + 2;
  }

  const lineBoundary = segment.lastIndexOf("\n");

  if (lineBoundary !== -1) {
    return searchStart + lineBoundary + 1;
  }

  const sentenceMatches = [...segment.matchAll(/[.!?]\s/g)];

  if (sentenceMatches.length > 0) {
    const lastMatch = sentenceMatches[sentenceMatches.length - 1];

    if (lastMatch.index !== undefined) {
      return searchStart + lastMatch.index + lastMatch[0].length;
    }
  }

  const spaceBoundary = segment.lastIndexOf(" ");

  if (spaceBoundary !== -1) {
    return searchStart + spaceBoundary + 1;
  }

  return targetEnd;
}

export function chunkText(
  input: string,
  options: ChunkOptions = {},
): TextChunk[] {
  const text = normalizeText(input);

  if (!text) {
    throw resourceError("Cannot chunk empty resource content.");
  }

  const chunkSize = options.chunkSize ?? DEFAULT_CHUNK_SIZE;
  const overlap = options.overlap ?? DEFAULT_OVERLAP;
  const minChunkSize =
    options.minChunkSize ?? DEFAULT_MIN_CHUNK_SIZE;

  if (chunkSize <= 0) {
    throw resourceError("Chunk size must be greater than zero.");
  }

  if (overlap < 0 || overlap >= chunkSize) {
    throw resourceError(
      "Chunk overlap must be >= 0 and smaller than chunk size.",
    );
  }

  const chunks: TextChunk[] = [];

  let start = 0;

  while (start < text.length) {
    const targetEnd = Math.min(
      start + chunkSize,
      text.length,
    );

    const end = findBoundary(
      text,
      targetEnd,
      text.length,
    );

    const content = text
      .slice(start, end)
      .trim();

    if (content.length >= minChunkSize || end >= text.length) {
      const leadingWhitespace =
        text.slice(start, end).search(/\S/);

      const actualStart =
        leadingWhitespace === -1
          ? start
          : start + leadingWhitespace;

      const actualEnd = actualStart + content.length;

      chunks.push({
        index: chunks.length,
        content,
        startChar: actualStart,
        endChar: actualEnd,
        tokenEstimate: estimateTokens(content),
      });
    }

    if (end >= text.length) {
      break;
    }

    const nextStart = Math.max(
      end - overlap,
      start + 1,
    );

    start = nextStart;
  }

  if (chunks.length === 0) {
    throw resourceError(
      "No usable chunks could be generated from the resource.",
    );
  }

  return chunks;
}
