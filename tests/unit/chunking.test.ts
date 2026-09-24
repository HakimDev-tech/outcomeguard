import { describe, expect, it } from "vitest";
import {
  chunkText,
  estimateTokens,
} from "@/lib/rag/chunking";

describe("estimateTokens", () => {
  it("returns a reasonable estimate", () => {
    const text = "This is a simple sentence.";

    const result = estimateTokens(text);

    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(text.length);
  });

  it("returns zero for empty text", () => {
    expect(estimateTokens("")).toBe(0);
  });
});

describe("chunkText", () => {
  it("creates chunks from long content", () => {
    const text = Array.from(
      { length: 100 },
      (_, index) =>
        `Paragraph ${index}: This is sample learning content.`,
    ).join("\n\n");

    const chunks = chunkText(text, {
      maxChars: 500,
      overlapChars: 50,
    });

    expect(chunks.length).toBeGreaterThan(1);
  });

  it("preserves the original content", () => {
    const text =
      "First paragraph.\n\nSecond paragraph.\n\nThird paragraph.";

    const chunks = chunkText(text, {
      maxChars: 1000,
      overlapChars: 100,
    });

    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks[0].content).toContain("First paragraph.");
  });

  it("assigns sequential chunk indexes", () => {
    const text = Array.from(
      { length: 50 },
      (_, index) => `Content block ${index}.`,
    ).join("\n");

    const chunks = chunkText(text, {
      maxChars: 100,
      overlapChars: 20,
    });

    chunks.forEach((chunk, index) => {
      expect(chunk.index).toBe(index);
    });
  });

  it("returns character positions", () => {
    const text =
      "Introduction.\n\nDatabase design.\n\nAuthentication.";

    const chunks = chunkText(text, {
      maxChars: 1000,
      overlapChars: 50,
    });

    for (const chunk of chunks) {
      expect(chunk.startChar).toBeGreaterThanOrEqual(0);
      expect(chunk.endChar).toBeGreaterThan(chunk.startChar);
    }
  });
});
