import { z } from "zod";
import { generateText, parseAIJson } from "@/lib/ai/client";
import {
  buildCoveragePrompt,
  COVERAGE_ENGINE_SYSTEM_PROMPT,
} from "@/lib/ai/prompts";
import { aiInvalidResponseError } from "@/lib/utils/errors";
import type { CoverageResult } from "@/types/analysis";

const coverageResponseSchema = z.object({
  status: z.enum(["covered", "partial", "missing", "uncertain"]),
  confidence: z.number().min(0).max(1),
  explanation: z.string().min(1),
  missingConcepts: z.array(z.string()).max(20),
});

const coverageJsonSchema = {
  type: "OBJECT",
  properties: {
    status: {
      type: "STRING",
      enum: ["covered", "partial", "missing", "uncertain"],
    },
    confidence: { type: "NUMBER" },
    explanation: { type: "STRING" },
    missingConcepts: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
  },
  required: ["status", "confidence", "explanation", "missingConcepts"],
};

interface CoverageInput {
  requirement: {
    id: string;
    description: string;
    rationale: string;
    expectedConcepts: string[];
  };
  evidence: Array<{
    id: string;
    content: string;
    location?: string;
    similarity?: number;
  }>;
}

export async function evaluateCoverage(
  input: CoverageInput,
): Promise<CoverageResult> {
  const response = await generateText({
    system: COVERAGE_ENGINE_SYSTEM_PROMPT,
    user: buildCoveragePrompt({
      requirement: input.requirement.description,
      rationale: input.requirement.rationale,
      expectedConcepts: input.requirement.expectedConcepts,
      evidence: input.evidence.map((item) => ({
        content: item.content,
        location: item.location,
        similarity: item.similarity,
      })),
    }),
    maxOutputTokens: 2500,
    responseSchema: coverageJsonSchema,
  });

  const parsed = parseAIJson<unknown>(response.text);
  const validated = coverageResponseSchema.safeParse(parsed);

  if (!validated.success) {
    throw aiInvalidResponseError(
      "Coverage engine returned an invalid response.",
      validated.error.flatten(),
    );
  }

  return {
    requirementId: input.requirement.id,
    status: validated.data.status,
    confidence: validated.data.confidence,
    evidence: input.evidence.map((item) => ({
      evidenceId: item.id,
      excerpt: item.content,
      location: item.location,
    })),
    explanation: validated.data.explanation,
    missingConcepts: validated.data.missingConcepts,
  };
}
