import { z } from "zod";

/**
 * ============================================================
 * Generic helpers
 * ============================================================
 */

export function parseWithSchema<T>(
  schema: z.ZodType<T>,
  input: unknown
): T {
  return schema.parse(input);
}

export function safeParseWithSchema<T>(
  schema: z.ZodType<T>,
  input: unknown
):
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: z.ZodError;
    } {
  const result = schema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      error: result.error,
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

/**
 * ============================================================
 * Primitive schemas
 * ============================================================
 */

export const uuidSchema = z.string().uuid();

export const nonEmptyStringSchema = z
  .string()
  .trim()
  .min(1);

export const optionalNonEmptyStringSchema = z
  .string()
  .trim()
  .min(1)
  .optional();

export const urlSchema = z
  .string()
  .trim()
  .url();

export const confidenceSchema = z
  .number()
  .min(0)
  .max(1);

/**
 * ============================================================
 * Goal validation
 * ============================================================
 */

export const createGoalSchema = z.object({
  statement: z
    .string()
    .trim()
    .min(10, "Goal must contain at least 10 characters.")
    .max(
      2000,
      "Goal must not exceed 2000 characters."
    ),

  context: z
    .string()
    .trim()
    .max(
      5000,
      "Goal context must not exceed 5000 characters."
    )
    .optional(),
});

export type CreateGoalInput = z.infer<
  typeof createGoalSchema
>;

/**
 * ============================================================
 * Resource validation
 * ============================================================
 */

export const resourceTypeSchema = z.enum([
  "youtube",
  "article",
  "documentation",
  "text",
  "github_repository",
]);

export const createResourceSchema = z
  .object({
    type: resourceTypeSchema,

    url: z
      .string()
      .trim()
      .url()
      .optional(),

    title: z
      .string()
      .trim()
      .min(
        1,
        "Resource title cannot be empty."
      )
      .max(
        500,
        "Resource title must not exceed 500 characters."
      ),

    author: z
      .string()
      .trim()
      .max(
        300,
        "Resource author must not exceed 300 characters."
      )
      .optional(),
  })
  .superRefine((value, context) => {
    const urlRequiredTypes = [
      "youtube",
      "article",
      "documentation",
      "github_repository",
    ];

    if (
      urlRequiredTypes.includes(value.type) &&
      !value.url
    ) {
      context.addIssue({
        code: "custom",
        path: ["url"],
        message:
          "A URL is required for this resource type.",
      });
    }
  });

export type CreateResourceInput = z.infer<
  typeof createResourceSchema
>;

/**
 * ============================================================
 * Analysis validation
 * ============================================================
 */

export const createAnalysisSchema = z.object({
  goalId: uuidSchema,

  resourceId: uuidSchema,
});

export type CreateAnalysisInput = z.infer<
  typeof createAnalysisSchema
>;

/**
 * ============================================================
 * Requirement validation
 * ============================================================
 */

export const requirementImportanceSchema =
  z.enum([
    "critical",
    "high",
    "medium",
    "low",
  ]);

export const requirementSchema = z.object({
  id: z.string().min(1),

  description: z
    .string()
    .trim()
    .min(1)
    .max(1000),

  rationale: z
    .string()
    .trim()
    .min(1)
    .max(2000),

  importance: requirementImportanceSchema,

  keywords: z
    .array(
      z
        .string()
        .trim()
        .min(1)
        .max(100)
    )
    .max(20),

  expectedConcepts: z
    .array(
      z
        .string()
        .trim()
        .min(1)
        .max(200)
    )
    .max(20),
});

export const requirementsSchema = z
  .array(requirementSchema)
  .min(1)
  .max(12);

export type ValidatedRequirement = z.infer<
  typeof requirementSchema
>;

/**
 * ============================================================
 * Evidence validation
 * ============================================================
 */

export const evidenceTypeSchema = z.enum([
  "transcript",
  "text",
  "documentation",
  "code",
  "metadata",
]);

export const evidenceRelevanceSchema =
  z.enum([
    "direct",
    "partial",
    "indirect",
    "irrelevant",
  ]);

export const evidenceSchema = z.object({
  id: uuidSchema,

  resourceId: uuidSchema,

  requirementId: uuidSchema.optional(),

  content: z
    .string()
    .trim()
    .min(1)
    .max(10000),

  type: evidenceTypeSchema,

  relevance: evidenceRelevanceSchema,

  similarity: confidenceSchema.optional(),

  startPosition: z
    .number()
    .int()
    .nonnegative()
    .optional(),

  endPosition: z
    .number()
    .int()
    .nonnegative()
    .optional(),

  location: z
    .string()
    .trim()
    .max(500)
    .optional(),

  confidence: confidenceSchema,
});

export type ValidatedEvidence = z.infer<
  typeof evidenceSchema
>;

/**
 * ============================================================
 * Coverage validation
 * ============================================================
 */

export const coverageStatusSchema =
  z.enum([
    "covered",
    "partial",
    "missing",
    "uncertain",
  ]);

export const coverageResultSchema = z.object({
  requirementId: uuidSchema,

  status: coverageStatusSchema,

  confidence: confidenceSchema,

  evidence: z
    .array(
      z.object({
        evidenceId: uuidSchema,

        excerpt: z
          .string()
          .trim()
          .min(1)
          .max(2000),

        location: z
          .string()
          .trim()
          .max(500)
          .optional(),
      })
    )
    .max(5),

  explanation: z
    .string()
    .trim()
    .min(1)
    .max(3000),

  missingConcepts: z
    .array(
      z
        .string()
        .trim()
        .min(1)
        .max(300)
    )
    .max(20),
});

export type ValidatedCoverageResult = z.infer<
  typeof coverageResultSchema
>;

/**
 * ============================================================
 * Utility validators
 * ============================================================
 */

export function isValidUuid(
  value: unknown
): value is string {
  return uuidSchema.safeParse(value).success;
}

export function isValidUrl(
  value: unknown
): value is string {
  return urlSchema.safeParse(value).success;
}

export function clampConfidence(
  value: number
): number {
  return Math.min(
    1,
    Math.max(0, value)
  );
}
