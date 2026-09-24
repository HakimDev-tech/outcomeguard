/**
 * OutcomeGuard
 * Domain models: Analysis
 *
 * Represents the complete evaluation of a resource against a goal.
 */

export type AnalysisId = string;

export type AnalysisStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export type CoverageStatus =
  | "covered"
  | "partial"
  | "missing"
  | "uncertain";

export type Verdict =
  | "sufficient"
  | "partially_sufficient"
  | "insufficient"
  | "uncertain";

export interface Analysis {
  id: AnalysisId;

  /**
   * Goal being evaluated.
   */
  goalId: string;

  /**
   * Resource being evaluated.
   */
  resourceId: string;

  /**
   * Current analysis state.
   */
  status: AnalysisStatus;

  /**
   * Requirements generated from the goal.
   */
  requirements: Requirement[];

  /**
   * Requirement-level evaluation results.
   */
  coverageResults: CoverageResult[];

  /**
   * Final decision.
   */
  verdict?: Verdict;

  /**
   * Human-readable explanation of the final verdict.
   */
  summary?: string;

  /**
   * Actionable recommendation for the user.
   */
  recommendation?: Recommendation;

  /**
   * Total resource duration when applicable.
   */
  resourceDurationSeconds?: number;

  /**
   * Estimated duration of relevant content.
   */
  relevantDurationSeconds?: number;

  /**
   * ISO timestamp.
   */
  createdAt: string;

  /**
   * ISO timestamp.
   */
  completedAt?: string;

  /**
   * Error information when analysis fails.
   */
  error?: AnalysisError;
}

export interface Requirement {
  id: string;

  /**
   * Requirement generated from the user's goal.
   *
   * Example:
   * "Implement authentication and authorization."
   */
  description: string;

  /**
   * Why this requirement is necessary to achieve the goal.
   */
  rationale: string;

  /**
   * Relative importance of the requirement.
   */
  importance: RequirementImportance;

  /**
   * Optional keywords used during retrieval.
   */
  keywords: string[];

  /**
   * Expected concepts that indicate meaningful coverage.
   */
  expectedConcepts: string[];
}

export type RequirementImportance =
  | "critical"
  | "high"
  | "medium"
  | "low";

export interface CoverageResult {
  requirementId: string;

  /**
   * Coverage classification.
   */
  status: CoverageStatus;

  /**
   * Confidence in this classification.
   *
   * Range: 0–1.
   */
  confidence: number;

  /**
   * Evidence supporting the classification.
   */
  evidence: EvidenceReference[];

  /**
   * Explanation of why the requirement received this status.
   */
  explanation: string;

  /**
   * Optional missing concepts.
   */
  missingConcepts: string[];
}

export interface EvidenceReference {
  evidenceId: string;

  /**
   * Short excerpt shown in the UI.
   */
  excerpt: string;

  /**
   * Human-readable source location.
   */
  location?: string;
}

export interface Recommendation {
  /**
   * Main action the user should take.
   */
  action:
    | "use_resource"
    | "use_with_supplement"
    | "skip_resource"
    | "review_manually";

  /**
   * Explanation of the recommendation.
   */
  reason: string;

  /**
   * Suggested additional topics/resources when applicable.
   */
  missingTopics: string[];
}

export interface AnalysisError {
  code: string;
  message: string;
}
