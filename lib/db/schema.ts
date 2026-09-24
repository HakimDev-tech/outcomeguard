import type {
  AnalysisStatus,
  CoverageStatus,
  EvidenceRelevance,
  EvidenceType,
  Recommendation,
  RequirementImportance,
  ResourceStatus,
  ResourceType,
  Verdict,
} from "@/types/analysis";

export interface DatabaseGoal {
  id: string;
  statement: string;
  context: string | null;
  created_at: string;
  updated_at: string;
}

export interface DatabaseResource {
  id: string;
  type: ResourceType;
  url: string | null;
  title: string;
  author: string | null;
  content: string | null;
  duration_seconds: number | null;
  status: ResourceStatus;
  error_code: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface DatabaseResourceChunk {
  id: string;
  resource_id: string;
  content: string;
  chunk_index: number;
  start_position: number | null;
  end_position: number | null;
  location: string | null;
  embedding: number[] | null;
  created_at: string;
}

export interface DatabaseRequirement {
  id: string;
  goal_id: string;
  description: string;
  rationale: string;
  importance: RequirementImportance;
  keywords: string[];
  expected_concepts: string[];
  position: number;
  created_at: string;
}

export interface DatabaseAnalysis {
  id: string;
  goal_id: string;
  resource_id: string;
  status: AnalysisStatus;
  verdict: Verdict | null;
  summary: string | null;
  recommendation_action: Recommendation["action"] | null;
  recommendation_reason: string | null;
  missing_topics: string[];
  resource_duration_seconds: number | null;
  relevant_duration_seconds: number | null;
  error_code: string | null;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface DatabaseEvidence {
  id: string;
  resource_id: string;
  requirement_id: string | null;
  content: string;
  type: EvidenceType;
  relevance: EvidenceRelevance;
  similarity: number | null;
  start_position: number | null;
  end_position: number | null;
  location: string | null;
  confidence: number;
  created_at: string;
}

export interface DatabaseCoverageResult {
  id: string;
  analysis_id: string;
  requirement_id: string;
  status: CoverageStatus;
  confidence: number;
  explanation: string;
  missing_concepts: string[];
  created_at: string;
}

export interface DatabaseCoverageEvidence {
  coverage_result_id: string;
  evidence_id: string;
  created_at: string;
}
