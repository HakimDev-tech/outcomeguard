# OutcomeGuard — Architecture Decisions

## ADR-001 — Next.js as the Application Framework

### Decision

Use Next.js with React and TypeScript.

### Reason

Next.js provides:

* frontend rendering;
* API Route Handlers;
* server-side execution;
* deployment compatibility with Vercel;
* a single codebase for the MVP.

This reduces infrastructure complexity during the hackathon.

---

## ADR-002 — PostgreSQL + Supabase

### Decision

Use PostgreSQL through Supabase.

### Reason

The application requires relational data for:

* goals;
* requirements;
* resources;
* analyses;
* evidence;
* coverage results.

Supabase also provides PostgreSQL extensions such as pgvector for semantic retrieval.

---

## ADR-003 — pgvector for RAG

### Decision

Store resource embeddings directly in PostgreSQL using pgvector.

### Reason

The MVP does not need a separate vector database.

Keeping vectors with the application data:

* reduces infrastructure;
* simplifies development;
* keeps resource chunks and metadata together;
* makes the architecture easier to deploy.

---

## ADR-004 — Evidence-First Architecture

### Decision

The system must produce evidence before producing a coverage verdict.

### Reason

A simple LLM prompt asking:

> "Does this tutorial cover the goal?"

can produce unsupported conclusions.

OutcomeGuard instead uses:

```text
Requirement
    ↓
Retrieved Evidence
    ↓
Coverage
    ↓
Verification
    ↓
Verdict
```

This makes the result more traceable.

---

## ADR-005 — Independent Verification

### Decision

Use a separate verification step after coverage analysis.

### Reason

The verifier provides a second reasoning pass over the structured result.

Its purpose is not to blindly generate another answer.

It checks whether:

* coverage agrees with evidence;
* missing requirements were overlooked;
* the proposed verdict is consistent;
* the recommendation follows from the evidence.

---

## ADR-006 — Conservative Verdicts

### Decision

Unsupported claims should not automatically become "covered".

### Reason

The core product promise depends on avoiding false confidence.

When evidence is insufficient, the system can return:

```text
partial
missing
uncertain
```

instead of assuming coverage.

---

## ADR-007 — Structured AI Outputs

### Decision

AI responses are parsed and validated with Zod.

### Reason

Free-form model responses are difficult to process reliably.

Structured outputs allow the application to validate:

* requirement counts;
* coverage states;
* confidence values;
* verdicts;
* recommendations.

Invalid AI output is treated as an application error rather than trusted.

---

## ADR-008 — OpenAI-Compatible HTTP Abstraction

### Decision

The AI client is isolated behind:

```text
lib/ai/client.ts
```

### Reason

The rest of the application should not depend directly on a specific AI SDK.

This allows the provider implementation to change without rewriting the domain logic.

---

## ADR-009 — Server-Side AI and Database Access

### Decision

AI provider calls and privileged database operations occur on the server.

### Reason

API keys and the Supabase service-role key must not reach the browser.

The client communicates through Next.js API endpoints.

---

## ADR-010 — MVP Resource Scope

### Decision

The initial MVP supports:

```text
YouTube
Plain text
```

### Reason

The core product hypothesis is resource sufficiency analysis, not universal resource ingestion.

Supporting fewer resource types allows the team to focus on:

* evidence extraction;
* retrieval;
* requirement mapping;
* verification;
* presentation.

Additional sources can be added later.

---

## ADR-011 — No Authentication in the Initial MVP

### Decision

Authentication is intentionally excluded from the initial hackathon implementation.

### Reason

The hackathon MVP prioritizes demonstrating the core technical pipeline.

Authentication would add:

* user management;
* authorization rules;
* additional UI;
* database policies;
* session handling.

It can be added after validating the core product.

---

## ADR-012 — No AI-Generated Resource Summary as the Main Product

### Decision

Summarization is not the primary output.

### Reason

The central question is:

```text
"Is this resource sufficient for my goal?"
```

not:

```text
"What is this resource about?"
```

A summary may be useful as supporting information, but it does not replace requirement-level coverage analysis.

---

## ADR-013 — Requirement-Level Analysis

### Decision

Evaluate individual requirements rather than producing only one global score.

### Reason

A resource can be strong in one area and completely miss another critical requirement.

Example:

```text
CRUD              ✓
Database          ✓
Forms             ✓
Authentication    ⚠
Testing           ✗
```

This gives the user actionable information that a single percentage would hide.

---

## ADR-014 — Verdict Categories

### Decision

Use four verdict states:

```text
sufficient
partially_sufficient
insufficient
uncertain
```

### Reason

Binary yes/no results cannot adequately represent incomplete or ambiguous evidence.

The `uncertain` state explicitly represents cases where the system cannot establish sufficient evidence.

---

## ADR-015 — Hackathon Scope

### Decision

The project prioritizes a complete vertical slice over broad feature coverage.

### Target flow

```text
Goal
→ Requirements
→ Resource
→ RAG
→ Evidence
→ Coverage
→ Verification
→ Verdict
→ UI
```

A smaller complete pipeline is preferred to many unfinished integrations.
