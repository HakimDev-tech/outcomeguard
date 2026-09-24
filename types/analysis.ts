/** OutcomeGuard domain models. */
export type AnalysisId = string;
export type AnalysisStatus = "pending" | "processing" | "completed" | "failed";
export type CoverageStatus = "covered" | "partial" | "missing" | "uncertain";
export type Verdict = "sufficient" | "partially_sufficient" | "insufficient" | "uncertain";

export interface Analysis {
  id: AnalysisId;
  goalId: string;
  resourceId: string;
  status: AnalysisStatus;
  requirements: Requirement[];
  coverageResults: CoverageResult[];
  verdict?: Verdict;
  summary?: string;
  recommendation?: Recommendation;
  resourceDurationSeconds?: number;
  relevantDurationSeconds?: number;
  createdAt: string;
  completedAt?: string;
  error?: AnalysisError;
  goalStatement?: string;
  resourceTitle?: string;
}

export interface Requirement {
  id: string;
  description: string;
  rationale: string;
  importance: RequirementImportance;
  keywords: string[];
  expectedConcepts: string[];
}

export type RequirementImportance = "critical" | "high" | "medium" | "low";

export interface CoverageResult {
  requirementId: string;
  status: CoverageStatus;
  confidence: number;
  evidence: EvidenceReference[];
  explanation: string;
  missingConcepts: string[];
}

export interface EvidenceReference {
  evidenceId: string;
  excerpt: string;
  location?: string;
}

export interface Recommendation {
  action:
    | "use_resource"
    | "use_with_supplement"
    | "skip_resource"
    | "review_manually";
  reason: string;
  missingTopics: string[];
}

export interface AnalysisError {
  code: string;
  message: string;
}
