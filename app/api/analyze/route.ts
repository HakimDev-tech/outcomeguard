import { NextRequest, NextResponse } from "next/server";

import {
  getGoalById,
  getResourceById,
  getRequirementsByGoalId,
  createAnalysis,
  updateAnalysis,
  createEvidence,
  createCoverageResults,
} from "@/lib/db/queries";

import { retrieveRelevantChunks } from "@/lib/rag/retrieval";

import { analyzeResource } from "@/lib/ai/resource-analyzer";
import { evaluateCoverage } from "@/lib/ai/coverage-engine";
import { verifyAnalysis } from "@/lib/ai/verifier";

import {
  normalizeError,
  notFoundError,
  resourceError,
} from "@/lib/utils/errors";

import {
  createAnalysisSchema,
} from "@/lib/utils/validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let analysisId: string | undefined;

  try {
    const body = await request.json();

    const parsed =
      createAnalysisSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid analysis input.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const {
      goalId,
      resourceId,
    } = parsed.data;

    const goal =
      await getGoalById(goalId);

    if (!goal) {
      throw notFoundError(
        "Goal not found.",
        { goalId },
      );
    }

    const resource =
      await getResourceById(resourceId);

    if (!resource) {
      throw notFoundError(
        "Resource not found.",
        { resourceId },
      );
    }

    if (resource.status !== "ready") {
      throw resourceError(
        "Resource is not ready for analysis.",
        {
          resourceId,
          status: resource.status,
        },
      );
    }

    const requirements =
      await getRequirementsByGoalId(goalId);

    if (requirements.length === 0) {
      throw resourceError(
        "Goal has no requirements.",
        { goalId },
      );
    }

    const analysis = await createAnalysis({ goalId, resourceId });
    await updateAnalysis(analysis.id, { status: "processing" });

    analysisId = analysis.id;

    const allEvidence = [];

    for (const requirement of requirements) {
      const query = [
        requirement.description,
        ...requirement.expectedConcepts,
        ...requirement.keywords,
      ].join(" ");

      const retrieved =
        await retrieveRelevantChunks(query, {
          resourceId,
          limit: 6,
          minSimilarity: 0.35,
        });

      if (retrieved.length === 0) {
        continue;
      }

      const evidence =
        await analyzeResource({
          resourceTitle: resource.title,
          resourceContent: retrieved
            .map((chunk) => chunk.content)
            .join("\n\n"),
          requirement: requirement.description,
        });

      for (const item of evidence) {
        const saved =
          await createEvidence({
            resource_id: resourceId,
            requirement_id: requirement.id,
            content: item.content,
            type: "text",
            relevance: item.relevance,
            similarity: undefined,
            start_position: item.startPosition ?? null,
            end_position: item.endPosition ?? null,
            confidence: item.confidence,
          });

        allEvidence.push(saved);
      }
    }

    const coverageResults = [];

    for (const requirement of requirements) {
      const requirementEvidence = allEvidence.filter((evidence) => evidence.requirement_id === requirement.id);

      const coverage =
        await evaluateCoverage({
          requirement,
          evidence: requirementEvidence,
        });

      coverageResults.push(coverage);
    }

    await createCoverageResults(
      analysis.id,
      coverageResults,
    );

    const proposedVerdict =
      calculatePreliminaryVerdict(
        coverageResults,
      );

    const verification =
      await verifyAnalysis({
        requirements,
        coverageResults,
        proposedVerdict:
          proposedVerdict.verdict,
        proposedRecommendation:
          proposedVerdict.recommendation,
      });

    const completed = await updateAnalysis(analysis.id, {
      status: "completed",
      verdict: verification.verdict,
      recommendation_action: verification.recommendation.action,
      recommendation_reason: verification.recommendation.reason,
      missing_topics: verification.recommendation.missingTopics,
      summary: verification.explanation,
      completed_at: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        analysis: completed,
        requirements,
        evidence: allEvidence,
        coverageResults,
        verification,
      },
      { status: 200 },
    );
  } catch (error) {
    if (analysisId) {
      try {
        await updateAnalysis(
          analysisId,
          {
            status: "failed",
            error_message: error instanceof Error ? error.message : "Analysis failed.",
            error_code: "INTERNAL_ERROR",
          },
        );
      } catch {
        // Preserve original error.
      }
    }

    const normalized =
      normalizeError(error);

    return NextResponse.json(
      {
        error: normalized.message,
        code: normalized.code,
      },
      {
        status: normalized.statusCode,
      },
    );
  }
}

function calculatePreliminaryVerdict(
  coverageResults: Array<{
    status:
      | "covered"
      | "partial"
      | "missing"
      | "uncertain";
    confidence: number;
  }>,
) {
  if (coverageResults.length === 0) {
    return {
      verdict: "uncertain" as const,
      recommendation: {
        action: "review_manually" as const,
        reason:
          "No coverage results were produced.",
        missingTopics: [],
      },
    };
  }

  const criticalMissing =
    coverageResults.some(
      (result) =>
        result.status === "missing",
    );

  const uncertain =
    coverageResults.some(
      (result) =>
        result.status === "uncertain",
    );

  const partial =
    coverageResults.some(
      (result) =>
        result.status === "partial",
    );

  if (criticalMissing) {
    return {
      verdict: "insufficient" as const,
      recommendation: {
        action: "use_with_supplement" as const,
        reason:
          "One or more required concepts are missing.",
        missingTopics: [],
      },
    };
  }

  if (uncertain) {
    return {
      verdict: "uncertain" as const,
      recommendation: {
        action: "review_manually" as const,
        reason:
          "Some requirements could not be verified confidently.",
        missingTopics: [],
      },
    };
  }

  if (partial) {
    return {
      verdict: "partially_sufficient" as const,
      recommendation: {
        action: "use_with_supplement" as const,
        reason:
          "The resource covers the goal only partially.",
        missingTopics: [],
      },
    };
  }

  return {
    verdict: "sufficient" as const,
    recommendation: {
      action: "use_resource" as const,
      reason:
        "All requirements have sufficient evidence.",
      missingTopics: [],
    },
  };
}
