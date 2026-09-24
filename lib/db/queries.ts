import { supabaseAdmin } from "@/lib/db/client";
import type {
  DatabaseAnalysis,
  DatabaseEvidence,
  DatabaseGoal,
  DatabaseRequirement,
  DatabaseResource,
} from "@/lib/db/schema";
import type { Requirement, ResourceType, CoverageResult } from "@/types/analysis";
import { AppError } from "@/lib/utils/errors";
/* ============================================================
   GOALS
   ============================================================ */

export async function getRecentAnalyses(limit = 20) {
  const { data, error } = await supabaseAdmin
    .from("analyses")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(Math.min(limit, 100));

  if (error) {
    throw new AppError(
      "Failed to fetch recent analyses.",
      "DATABASE_ERROR",
      500,
      error,
    );
  }

  return data ?? [];
}
export async function createGoal(input: {
  statement: string;
  context?: string;
}): Promise<DatabaseGoal> {
  const { data, error } = await supabaseAdmin
    .from("goals")
    .insert({
      statement: input.statement,
      context: input.context ?? null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create goal: ${error.message}`);
  }

  return data as DatabaseGoal;
}

export async function getGoalById(
  goalId: string
): Promise<DatabaseGoal | null> {
  const { data, error } = await supabaseAdmin
    .from("goals")
    .select("*")
    .eq("id", goalId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch goal: ${error.message}`);
  }

  return data as DatabaseGoal | null;
}

/* ============================================================
   RESOURCES
   ============================================================ */

export async function createResource(input: {
  type: ResourceType;
  url?: string;
  title: string;
  author?: string;
  content?: string;
  status?: DatabaseResource["status"];
}): Promise<DatabaseResource> {
  const { data, error } = await supabaseAdmin
    .from("resources")
    .insert({
      type: input.type,
      url: input.url ?? null,
      title: input.title,
      author: input.author ?? null,
      content: input.content ?? null,
      status: input.status ?? "pending",
    })
    .select()
    .single();

  if (error) {
    throw new Error(
      `Failed to create resource: ${error.message}`
    );
  }

  return data as DatabaseResource;
}

export async function getResourceById(
  resourceId: string
): Promise<DatabaseResource | null> {
  const { data, error } = await supabaseAdmin
    .from("resources")
    .select("*")
    .eq("id", resourceId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to fetch resource: ${error.message}`
    );
  }

  return data as DatabaseResource | null;
}

export async function updateResourceStatus(
  resourceId: string,
  status: DatabaseResource["status"],
  errorDetails?: {
    code: string;
    message: string;
  }
): Promise<DatabaseResource> {
  const { data, error } = await supabaseAdmin
    .from("resources")
    .update({
      status,
      error_code: errorDetails?.code ?? null,
      error_message: errorDetails?.message ?? null,
    })
    .eq("id", resourceId)
    .select()
    .single();

  if (error) {
    throw new Error(
      `Failed to update resource status: ${error.message}`
    );
  }

  return data as DatabaseResource;
}

/* ============================================================
   RESOURCE CHUNKS
   ============================================================ */

export async function createResourceChunks(
  resourceId: string,
  chunks: Array<{
    chunkIndex: number;
    content: string;
    startChar?: number;
    endChar?: number;
    tokenEstimate?: number;
    embedding?: number[];
  }>,
): Promise<DatabaseResourceChunk[]> {
  if (chunks.length === 0) {
    return;
  }

  const rows = chunks.map((chunk) => ({
    resource_id: resourceId,
    content: chunk.content,
    chunk_index: chunk.chunkIndex,
    start_position: chunk.startChar ?? null,
    end_position: chunk.endChar ?? null,
    embedding: chunk.embedding ?? null,
  }));

  const { error } = await supabaseAdmin
    .from("resource_chunks")
    .insert(rows);

  if (error) throw new Error(`Failed to create resource chunks: ${error.message}`);
  return (data ?? []) as DatabaseResourceChunk[];
}

/* ============================================================
   REQUIREMENTS
   ============================================================ */

export async function createRequirements(
  goalId: string,
  requirements: Requirement[]
): Promise<DatabaseRequirement[]> {
  if (requirements.length === 0) {
    return [];
  }

  const rows = requirements.map((requirement, index) => ({
    id: requirement.id,
    goal_id: goalId,
    description: requirement.description,
    rationale: requirement.rationale,
    importance: requirement.importance,
    keywords: requirement.keywords,
    expected_concepts: requirement.expectedConcepts,
    position: index,
  }));

  const { data, error } = await supabaseAdmin
    .from("requirements")
    .insert(rows)
    .select();

  if (error) {
    throw new Error(
      `Failed to create requirements: ${error.message}`
    );
  }

  return (data ?? []) as DatabaseRequirement[];
}

export async function getRequirementsByGoalId(
  goalId: string
): Promise<DatabaseRequirement[]> {
  const { data, error } = await supabaseAdmin
    .from("requirements")
    .select("*")
    .eq("goal_id", goalId)
    .order("position", { ascending: true });

  if (error) {
    throw new Error(
      `Failed to fetch requirements: ${error.message}`
    );
  }

  return (data ?? []) as DatabaseRequirement[];
}

/* ============================================================
   ANALYSES
   ============================================================ */

export async function createAnalysis(input: { goalId: string; resourceId: string }): Promise<DatabaseAnalysis> {
  const { data, error } = await supabaseAdmin
    .from("analyses")
    .insert({
      goal_id: input.goalId,
      resource_id: input.resourceId,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    throw new Error(
      `Failed to create analysis: ${error.message}`
    );
  }

  return data as DatabaseAnalysis;
}

export async function getAnalysisById(
  analysisId: string
): Promise<DatabaseAnalysis | null> {
  const { data, error } = await supabaseAdmin
    .from("analyses")
    .select("*")
    .eq("id", analysisId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to fetch analysis: ${error.message}`
    );
  }

  return data as DatabaseAnalysis | null;
}

export async function updateAnalysis(
  analysisId: string,
  input: Partial<{
    status: DatabaseAnalysis["status"];
    verdict: DatabaseAnalysis["verdict"];
    summary: string;
    recommendation_action: DatabaseAnalysis["recommendation_action"];
    recommendation_reason: string;
    missing_topics: string[];
    resource_duration_seconds: number;
    relevant_duration_seconds: number;
    error_code: string;
    error_message: string;
    completed_at: string;
  }>
): Promise<DatabaseAnalysis> {
  const { data, error } = await supabaseAdmin
    .from("analyses")
    .update(input)
    .eq("id", analysisId)
    .select()
    .single();

  if (error) {
    throw new Error(
      `Failed to update analysis: ${error.message}`
    );
  }

  return data as DatabaseAnalysis;
}

/* ============================================================
   EVIDENCE
   ============================================================ */

export async function createEvidence(
  input: Omit<DatabaseEvidence, "id" | "created_at">
): Promise<DatabaseEvidence> {
  const { data, error } = await supabaseAdmin
    .from("evidence")
    .insert({
      resource_id: input.resource_id,
      requirement_id: input.requirement_id,
      content: input.content,
      type: input.type,
      relevance: input.relevance,
      similarity: input.similarity,
      start_position: input.start_position,
      end_position: input.end_position,
      location: input.location,
      confidence: input.confidence,
    })
    .select()
    .single();

  if (error) {
    throw new Error(
      `Failed to create evidence: ${error.message}`
    );
  }

  return data as DatabaseEvidence;
}

export async function getEvidenceByRequirementId(
  requirementId: string
): Promise<DatabaseEvidence[]> {
  const { data, error } = await supabaseAdmin
    .from("evidence")
    .select("*")
    .eq("requirement_id", requirementId)
    .order("confidence", { ascending: false });

  if (error) {
    throw new Error(
      `Failed to fetch evidence: ${error.message}`
    );
  }

  return (data ?? []) as DatabaseEvidence[];
}


export async function updateResource(resourceId: string, input: {
  title?: string; author?: string; url?: string; content?: string; status?: DatabaseResource["status"]; error?: string | null;
}): Promise<DatabaseResource> {
  const payload: Record<string, unknown> = {};
  if (input.title !== undefined) payload.title = input.title;
  if (input.author !== undefined) payload.author = input.author;
  if (input.url !== undefined) payload.url = input.url;
  if (input.content !== undefined) payload.content = input.content;
  if (input.status !== undefined) payload.status = input.status;
  if (input.error !== undefined) { payload.error_code = input.error ? "RESOURCE_ERROR" : null; payload.error_message = input.error ?? null; }
  const {data,error}=await supabaseAdmin.from("resources").update(payload).eq("id",resourceId).select().single();
  if(error) throw new AppError("DATABASE_ERROR", "Failed to update resource.", {statusCode:502,cause:error});
  return data as DatabaseResource;
}

export async function createCoverageResults(analysisId: string, results: CoverageResult[]) {
  if (!results.length) return [];
  const rows=results.map(result=>({analysis_id:analysisId,requirement_id:result.requirementId,status:result.status,confidence:result.confidence,explanation:result.explanation,missing_concepts:result.missingConcepts}));
  const {data,error}=await supabaseAdmin.from("coverage_results").insert(rows).select();
  if(error) throw new AppError("DATABASE_ERROR","Failed to create coverage results.",{statusCode:502,cause:error});
  return data ?? [];
}
