import { z } from "zod";
import { generateText, parseAIJson } from "@/lib/ai/client";
import {
  buildResourceAnalyzerPrompt,
  RESOURCE_ANALYZER_SYSTEM_PROMPT,
} from "@/lib/ai/prompts";
import { aiInvalidResponseError } from "@/lib/utils/errors";

const resourceAnalysisSchema = z.object({
  evidence: z.array(
    z.object({
      content: z.string().min(1).max(10000),
      relevance: z.enum(["direct", "partial", "indirect", "irrelevant"]),
      location: z.string().optional(),
      startPosition: z.number().int().nonnegative().optional(),
      endPosition: z.number().int().nonnegative().optional(),
      confidence: z.number().min(0).max(1),
    }),
  ),
});

const resourceAnalysisJsonSchema = {
  type: "OBJECT",
  properties: {
    evidence: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          content: { type: "STRING" },
          relevance: {
            type: "STRING",
            enum: ["direct", "partial", "indirect", "irrelevant"],
          },
          location: { type: "STRING" },
          startPosition: { type: "INTEGER" },
          endPosition: { type: "INTEGER" },
          confidence: { type: "NUMBER" },
        },
        required: ["content", "relevance", "confidence"],
      },
    },
  },
  required: ["evidence"],
};

export interface ResourceEvidenceCandidate {
  content: string;
  relevance:
    | "direct"
    | "partial"
    | "indirect"
    | "irrelevant";
  location?: string;
  startPosition?: number;
  endPosition?: number;
  confidence: number;
}

export async function analyzeResource(input: {
  resourceTitle: string;
  resourceContent: string;
  requirementDescription: string;
}): Promise<ResourceEvidenceCandidate[]> {
  if (!input.resourceContent.trim()) {
    return [];
  }

  const response = await generateText({
    system: RESOURCE_ANALYZER_SYSTEM_PROMPT,
    user: buildResourceAnalyzerPrompt(input),
    temperature: 0,
    maxOutputTokens: 4000,
    responseSchema: resourceAnalysisJsonSchema,
  });

  const parsed = parseAIJson<unknown>(response.text);
  const validated = resourceAnalysisSchema.safeParse(parsed);

  if (!validated.success) {
    throw aiInvalidResponseError(
      "Resource analyzer returned an invalid response.",
      validated.error.flatten(),
    );
  }

  return validated.data.evidence;
}
