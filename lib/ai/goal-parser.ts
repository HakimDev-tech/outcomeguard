import { z } from "zod";

import {
  generateText,
  parseAIJson,
} from "@/lib/ai/client";

import {
  buildGoalParserPrompt,
  GOAL_PARSER_SYSTEM_PROMPT,
} from "@/lib/ai/prompts";

import {
  aiInvalidResponseError,
} from "@/lib/utils/errors";

import type {
  Requirement,
} from "@/types/analysis";

const goalParserResponseSchema =
  z.object({
    requirements: z
      .array(
        z.object({
          description: z.string().min(1),
          rationale: z.string().min(1),
          importance: z.enum([
            "critical",
            "high",
            "medium",
            "low",
          ]),
          keywords: z
            .array(z.string().min(1))
            .max(20),
          expectedConcepts: z
            .array(z.string().min(1))
            .max(20),
        })
      )
      .min(3)
      .max(12),
  });

export async function parseGoal(
  input: {
    statement: string;
    context?: string;
  }
): Promise<Requirement[]> {
  const response =
    await generateText({
      system:
        GOAL_PARSER_SYSTEM_PROMPT,

      user:
        buildGoalParserPrompt(input),

      temperature: 0,

      maxOutputTokens: 3000,
    });

  const parsed =
    parseAIJson<unknown>(
      response.text
    );

  const validated =
    goalParserResponseSchema.safeParse(
      parsed
    );

  if (!validated.success) {
    throw aiInvalidResponseError(
      "Goal parser returned an invalid requirement structure.",
      validated.error.flatten()
    );
  }

  return validated.data.requirements.map(
    (requirement, index) => ({
      id: crypto.randomUUID(),

      description:
        requirement.description,

      rationale:
        requirement.rationale,

      importance:
        requirement.importance,

      keywords:
        requirement.keywords,

      expectedConcepts:
        requirement.expectedConcepts,
    })
  );
}
