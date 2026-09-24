-- ============================================================
-- OutcomeGuard
-- Database Schema
-- PostgreSQL / Supabase
-- ============================================================

create extension if not exists vector;

-- ============================================================
-- ENUM TYPES
-- ============================================================

create type resource_type as enum (
  'youtube',
  'article',
  'documentation',
  'text',
  'github_repository'
);

create type resource_status as enum (
  'pending',
  'processing',
  'ready',
  'failed'
);

create type analysis_status as enum (
  'pending',
  'processing',
  'completed',
  'failed'
);

create type requirement_importance as enum (
  'critical',
  'high',
  'medium',
  'low'
);

create type coverage_status as enum (
  'covered',
  'partial',
  'missing',
  'uncertain'
);

create type verdict as enum (
  'sufficient',
  'partially_sufficient',
  'insufficient',
  'uncertain'
);

create type recommendation_action as enum (
  'use_resource',
  'use_with_supplement',
  'skip_resource',
  'review_manually'
);

create type evidence_type as enum (
  'transcript',
  'text',
  'documentation',
  'code',
  'metadata'
);

create type evidence_relevance as enum (
  'direct',
  'partial',
  'indirect',
  'irrelevant'
);

-- ============================================================
-- GOALS
-- ============================================================

create table goals (
  id uuid primary key default gen_random_uuid(),

  statement text not null,

  context text,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  constraint goals_statement_not_empty
    check (length(trim(statement)) > 0)
);

create index goals_created_at_idx
  on goals(created_at desc);

-- ============================================================
-- RESOURCES
-- ============================================================

create table resources (
  id uuid primary key default gen_random_uuid(),

  type resource_type not null,

  url text,

  title text not null,

  author text,

  content text,

  duration_seconds integer,

  status resource_status not null default 'pending',

  error_code text,

  error_message text,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  constraint resources_title_not_empty
    check (length(trim(title)) > 0),

  constraint resources_duration_valid
    check (
      duration_seconds is null
      or duration_seconds >= 0
    )
);

create index resources_created_at_idx
  on resources(created_at desc);

create index resources_status_idx
  on resources(status);

create index resources_type_idx
  on resources(type);

-- ============================================================
-- RESOURCE CHUNKS
-- ============================================================

create table resource_chunks (
  id uuid primary key default gen_random_uuid(),

  resource_id uuid not null
    references resources(id)
    on delete cascade,

  content text not null,

  chunk_index integer not null,

  start_position integer,

  end_position integer,

  location text,

  embedding vector(1536),

  created_at timestamptz not null default now(),

  constraint resource_chunks_content_not_empty
    check (length(trim(content)) > 0),

  constraint resource_chunks_index_valid
    check (chunk_index >= 0)
);

create index resource_chunks_resource_id_idx
  on resource_chunks(resource_id);

create index resource_chunks_chunk_index_idx
  on resource_chunks(resource_id, chunk_index);

-- ============================================================
-- REQUIREMENTS
-- ============================================================

create table requirements (
  id uuid primary key default gen_random_uuid(),

  goal_id uuid not null
    references goals(id)
    on delete cascade,

  description text not null,

  rationale text not null,

  importance requirement_importance not null,

  keywords text[] not null default '{}',

  expected_concepts text[] not null default '{}',

  position integer not null default 0,

  created_at timestamptz not null default now(),

  constraint requirements_description_not_empty
    check (length(trim(description)) > 0),

  constraint requirements_rationale_not_empty
    check (length(trim(rationale)) > 0),

  constraint requirements_position_valid
    check (position >= 0)
);

create index requirements_goal_id_idx
  on requirements(goal_id);

create index requirements_goal_position_idx
  on requirements(goal_id, position);

-- ============================================================
-- ANALYSES
-- ============================================================

create table analyses (
  id uuid primary key default gen_random_uuid(),

  goal_id uuid not null
    references goals(id)
    on delete cascade,

  resource_id uuid not null
    references resources(id)
    on delete cascade,

  status analysis_status not null default 'pending',

  verdict verdict,

  summary text,

  recommendation_action recommendation_action,

  recommendation_reason text,

  missing_topics text[] not null default '{}',

  resource_duration_seconds integer,

  relevant_duration_seconds integer,

  error_code text,

  error_message text,

  created_at timestamptz not null default now(),

  completed_at timestamptz,

  constraint analyses_resource_duration_valid
    check (
      resource_duration_seconds is null
      or resource_duration_seconds >= 0
    ),

  constraint analyses_relevant_duration_valid
    check (
      relevant_duration_seconds is null
      or relevant_duration_seconds >= 0
    )
);

create index analyses_goal_id_idx
  on analyses(goal_id);

create index analyses_resource_id_idx
  on analyses(resource_id);

create index analyses_created_at_idx
  on analyses(created_at desc);

create index analyses_status_idx
  on analyses(status);

-- ============================================================
-- EVIDENCE
-- ============================================================

create table evidence (
  id uuid primary key default gen_random_uuid(),

  resource_id uuid not null
    references resources(id)
    on delete cascade,

  requirement_id uuid
    references requirements(id)
    on delete set null,

  content text not null,

  type evidence_type not null,

  relevance evidence_relevance not null,

  similarity double precision,

  start_position integer,

  end_position integer,

  location text,

  confidence double precision not null,

  created_at timestamptz not null default now(),

  constraint evidence_content_not_empty
    check (length(trim(content)) > 0),

  constraint evidence_similarity_valid
    check (
      similarity is null
      or (
        similarity >= 0
        and similarity <= 1
      )
    ),

  constraint evidence_confidence_valid
    check (
      confidence >= 0
      and confidence <= 1
    ),

  constraint evidence_positions_valid
    check (
      (
        start_position is null
        and end_position is null
      )
      or (
        start_position is not null
        and end_position is not null
        and start_position >= 0
        and end_position >= start_position
      )
    )
);

create index evidence_resource_id_idx
  on evidence(resource_id);

create index evidence_requirement_id_idx
  on evidence(requirement_id);

create index evidence_relevance_idx
  on evidence(relevance);

-- ============================================================
-- COVERAGE RESULTS
-- ============================================================

create table coverage_results (
  id uuid primary key default gen_random_uuid(),

  analysis_id uuid not null
    references analyses(id)
    on delete cascade,

  requirement_id uuid not null
    references requirements(id)
    on delete cascade,

  status coverage_status not null,

  confidence double precision not null,

  explanation text not null,

  missing_concepts text[] not null default '{}',

  created_at timestamptz not null default now(),

  constraint coverage_confidence_valid
    check (
      confidence >= 0
      and confidence <= 1
    ),

  constraint coverage_explanation_not_empty
    check (length(trim(explanation)) > 0),

  unique (analysis_id, requirement_id)
);

create index coverage_results_analysis_id_idx
  on coverage_results(analysis_id);

create index coverage_results_requirement_id_idx
  on coverage_results(requirement_id);

create index coverage_results_status_idx
  on coverage_results(status);

-- ============================================================
-- COVERAGE ↔ EVIDENCE
-- ============================================================

create table coverage_evidence (
  coverage_result_id uuid not null
    references coverage_results(id)
    on delete cascade,

  evidence_id uuid not null
    references evidence(id)
    on delete cascade,

  created_at timestamptz not null default now(),

  primary key (coverage_result_id, evidence_id)
);

create index coverage_evidence_evidence_id_idx
  on coverage_evidence(evidence_id);

-- ============================================================
-- VECTOR SEARCH INDEX
-- ============================================================

create index resource_chunks_embedding_idx
  on resource_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

create or replace function update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger goals_updated_at
before update on goals
for each row
execute function update_updated_at();

create trigger resources_updated_at
before update on resources
for each row
execute function update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table goals enable row level security;
alter table resources enable row level security;
alter table resource_chunks enable row level security;
alter table requirements enable row level security;
alter table analyses enable row level security;
alter table evidence enable row level security;
alter table coverage_results enable row level security;
alter table coverage_evidence enable row level security;

-- ============================================================
-- MVP NOTE
-- ============================================================
--
-- Authentication is intentionally not implemented yet.
--
-- Therefore, no public RLS policies are created here.
-- Server-side operations will use the Supabase service role
-- where appropriate.
--
-- When authentication is introduced, policies must be added
-- based on ownership/user_id relationships.
-- ============================================================
