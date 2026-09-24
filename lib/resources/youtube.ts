import { resourceError } from "@/lib/utils/errors";

export interface TextResourceInput {
  title: string;
  content: string;
  author?: string;
  url?: string;
}

export interface TextResourceContent {
  title: string;
  content: string;
  author?: string;
  url?: string;
  characterCount: number;
  wordCount: number;
}

const DEFAULT_MAX_CHARACTERS = 500_000;

function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\u0000/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function countWords(text: string): number {
  if (!text.trim()) {
    return 0;
  }

  return text.trim().split(/\s+/).length;
}

function validateTitle(title: string): string {
  const normalized = title.trim();

  if (!normalized) {
    throw resourceError("Text resource title is required.");
  }

  if (normalized.length > 500) {
    throw resourceError(
      "Text resource title is too long.",
      {
        maxLength: 500,
      },
    );
  }

  return normalized;
}

function validateUrl(url?: string): string | undefined {
  if (!url) {
    return undefined;
  }

  try {
    new URL(url);
    return url;
  } catch {
    throw resourceError("Text resource URL is invalid.", {
      url,
    });
  }
}

export function parseTextResource(
  input: TextResourceInput,
  maxCharacters = DEFAULT_MAX_CHARACTERS,
): TextResourceContent {
  const title = validateTitle(input.title);
  const content = normalizeText(input.content);
  const url = validateUrl(input.url);

  if (!content) {
    throw resourceError("Text resource content is empty.");
  }

  if (content.length > maxCharacters) {
    throw resourceError(
      "Text resource exceeds the maximum allowed size.",
      {
        characterCount: content.length,
        maxCharacters,
      },
    );
  }

  const author = input.author?.trim() || undefined;

  return {
    title,
    content,
    author,
    url,
    characterCount: content.length,
    wordCount: countWords(content),
  };
}

export function normalizeResourceText(content: string): string {
  return normalizeText(content);
}

export function getTextStatistics(content: string): {
  characterCount: number;
  wordCount: number;
  lineCount: number;
} {
  const normalized = normalizeText(content);

  return {
    characterCount: normalized.length,
    wordCount: countWords(normalized),
    lineCount: normalized ? normalized.split("\n").length : 0,
  };
}
