import { z } from "zod";
import { generateText, parseAIJson } from "@/lib/ai/client";
import {
  buildVerifierPrompt,
  VERIFIER_SYSTEM_PROMPT,
} from "@/lib/ai/prompts";
import { aiInvalidResponseError } from "@/lib/utils/errors";

const verificationSchema = z.object({
  verdict: z.enum([
    "sufficient",
    "partially_sufficient",
    "insufficient",
    "uncertain",
  ]),
  recommendation: z.object({
    action: z.enum([
      "use_resource",
      "use_with_supplement",
      "skip_resource",
      "review_manually",
    ]),
    reason: z.string().min(1),
    missingTopics: z.array(z.string()),
  }),
  consistencyChecks: z.object({
    allRequirementsEvaluated: z.boolean(),
    criticalRequirementsSupported: z.boolean(),
    evidenceConsistent: z.boolean(),
    recommendationConsistent: z.boolean(),
  }),
  explanation: z.string().min(1),
});

const verificationJsonSchema = {
  type: "OBJECT",
  properties: {
    verdict: {
      type: "STRING",
      enum: [
        "sufficient",
        "partially_sufficient",
        "insufficient",
        "uncertain",
      ],
    },
    recommendation: {
      type: "OBJECT",
      properties: {
        action: {
          type: "STRING",
          enum: [
            "use_resource",
            "use_with_supplement",
            "skip_resource",
            "review_manually",
          ],
        },
        reason: { type: "STRING" },
        missingTopics: {
          type: "ARRAY",
          items: { type: "STRING" },
        },
      },
      required: ["action", "reason", "missingTopics"],
    },
    consistencyChecks: {
      type: "OBJECT",
      properties: {
        allRequirementsEvaluated: { type: "BOOLEAN" },
        criticalRequirementsSupported: { type: "BOOLEAN" },
        evidenceConsistent: { type: "BOOLEAN" },
        recommendationConsistent: { type: "BOOLEAN" },
      },
      required: [
        "allRequirementsEvaluated",
        "criticalRequirementsSupported",
        "evidenceConsistent",
        "recommendationConsistent",
      ],
    },
    explanation: { type: "STRING" },
  },
  required: [
    "verdict",
    "recommendation",
    "consistencyChecks",
    "explanation",
  ],
};

export interface VerificationResult {
  verdict:
    | "sufficient"
    | "partially_sufficient"
    | "insufficient"
    | "uncertain";
  recommendation: {
    action:
      | "use_resource"
      | "use_with_supplement"
      | "skip_resource"
      | "review_manually";
    reason: string;
    missingTopics: string[];
  };
  consistencyChecks: {
    allRequirementsEvaluated: boolean;
    criticalRequirementsSupported: boolean;
    evidenceConsistent: boolean;
    recommendationConsistent: boolean;
  };
  explanation: string;
}

export async function verifyAnalysis(input: {
  requirements: unknown;
  coverageResults: unknown;
  proposedVerdict: string;
  proposedRecommendation: string;
}): Promise<VerificationResult> {
  const response = await generateText({
    system: VERIFIER_SYSTEM_PROMPT,
    user: buildVerifierPrompt(input),
    temperature: 0,
    maxOutputTokens: 3000,
    responseSchema: verificationJsonSchema,
  });

  const parsed = parseAIJson<unknown>(response.text);
  const validated = verificationSchema.safeParse(parsed);

  if (!validated.success) {
    throw aiInvalidResponseError(
      "Verification engine returned an invalid response.",
      validated.error.flatten(),
    );
  }

  return validated.data;
}
