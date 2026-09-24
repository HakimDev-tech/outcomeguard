# OutcomeGuard — Architecture

## 1. Overview

OutcomeGuard is an evidence-backed AI engine that evaluates whether a resource is sufficient to achieve a specific goal.

The system does not simply summarize a resource.

It performs the following process:

```text
User Goal
   ↓
Goal Parser
   ↓
Requirements
   ↓
Resource Ingestion
   ↓
Chunking
   ↓
Embeddings
   ↓
Semantic Retrieval
   ↓
Evidence Analysis
   ↓
Requirement Coverage
   ↓
Independent Verification
   ↓
Final Verdict
```

The final result identifies:

* requirements covered by the resource;
* requirements only partially covered;
* requirements not covered;
* supporting evidence;
* missing concepts;
* an overall verdict;
* a recommended action.

---

## 2. System Architecture

```text
┌──────────────────────────────┐
│            User              │
│ Goal + Resource              │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       Next.js Application    │
│                              │
│ UI + API Route Handlers      │
└───────┬──────────────┬───────┘
        │              │
        ▼              ▼
┌──────────────┐  ┌──────────────┐
│ Goal Engine  │  │   Resource   │
│              │  │   Ingestion  │
└──────┬───────┘  └──────┬───────┘
       │                 │
       ▼                 ▼
┌──────────────┐  ┌──────────────┐
│ Requirements │  │    Chunks     │
└──────┬───────┘  └──────┬───────┘
       │                 │
       │                 ▼
       │          ┌──────────────┐
       │          │  Embeddings  │
       │          └──────┬───────┘
       │                 │
       └────────┬────────┘
                ▼
       ┌──────────────────┐
       │ Evidence / RAG   │
       └────────┬─────────┘
                ▼
       ┌──────────────────┐
       │ Coverage Engine  │
       └────────┬─────────┘
                ▼
       ┌──────────────────┐
       │    Verifier      │
       └────────┬─────────┘
                ▼
       ┌──────────────────┐
       │ Final Verdict    │
       └──────────────────┘
```

---

## 3. Main Layers

### 3.1 Presentation Layer

Located primarily in:

```text
app/
components/
```

Responsibilities:

* collect goals;
* collect resources;
* display requirements;
* display evidence;
* display coverage;
* display verdicts;
* display analysis history.

The UI does not directly access the database.

---

### 3.2 API Layer

Located in:

```text
app/api/
```

Main endpoints:

```text
POST /api/goals
POST /api/resources
POST /api/analyze
```

Responsibilities:

* validate requests;
* orchestrate application services;
* handle errors;
* return structured responses.

---

### 3.3 Domain / AI Layer

Located in:

```text
lib/ai/
```

Main components:

```text
goal-parser.ts
resource-analyzer.ts
coverage-engine.ts
verifier.ts
```

Responsibilities:

* convert goals into requirements;
* identify evidence;
* determine requirement coverage;
* independently verify the proposed result.

---

### 3.4 Resource Layer

Located in:

```text
lib/resources/
```

Responsibilities:

* retrieve YouTube content;
* process plain text;
* normalize resource content;
* expose a consistent internal representation.

---

### 3.5 RAG Layer

Located in:

```text
lib/rag/
```

Responsibilities:

* split resources into chunks;
* generate embeddings;
* retrieve semantically relevant chunks;
* transform retrieved chunks into evidence candidates.

---

### 3.6 Persistence Layer

Located in:

```text
lib/db/
db/
```

Supabase/PostgreSQL stores:

* goals;
* requirements;
* resources;
* resource chunks;
* analyses;
* evidence;
* coverage results.

PostgreSQL with pgvector is used for semantic retrieval.

---

## 4. Analysis Pipeline

### Step 1 — Goal Parsing

Input:

```text
"Build a production-ready Next.js CRUD application"
```

The AI converts the goal into structured requirements.

Example:

```text
CRUD
Database
Forms
Server Actions
Authentication
Testing
Deployment
```

Each requirement contains:

* description;
* rationale;
* importance;
* keywords;
* expected concepts.

---

### Step 2 — Resource Ingestion

The resource is retrieved and normalized.

Supported MVP resources:

```text
YouTube
Plain text
```

The content is stored and divided into chunks.

---

### Step 3 — Chunking

Large resources are split into manageable chunks.

Each chunk contains:

```text
chunk index
content
start position
end position
token estimate
```

---

### Step 4 — Embeddings

Each chunk receives an embedding vector.

The embedding is stored in PostgreSQL using pgvector.

This allows semantic rather than exact keyword retrieval.

---

### Step 5 — Evidence Retrieval

For each requirement, OutcomeGuard generates a retrieval query.

Example:

```text
Requirement:
Authentication

Query:
Next.js authentication implementation,
login, sessions, protected routes,
authorization
```

The system retrieves the most relevant chunks.

---

### Step 6 — Evidence Analysis

The AI evaluates retrieved content and identifies evidence related to the requirement.

Evidence is classified as:

```text
direct
partial
indirect
irrelevant
```

The system records:

* evidence content;
* source location;
* relevance;
* similarity;
* confidence.

---

### Step 7 — Coverage Analysis

The Coverage Engine determines whether a requirement is:

```text
covered
partial
missing
uncertain
```

A coverage result references the evidence supporting that decision.

---

### Step 8 — Independent Verification

The Verifier receives:

* original requirements;
* coverage results;
* proposed verdict;
* recommendation.

It checks for inconsistencies such as:

```text
Requirement marked covered
but evidence does not support it.
```

The verifier can adjust the final result.

---

### Step 9 — Final Verdict

Possible verdicts:

```text
sufficient
partially_sufficient
insufficient
uncertain
```

Possible recommendations:

```text
use_resource
use_with_supplement
skip_resource
review_manually
```

---

## 5. Database Relationships

```text
goals
  │
  ├── requirements
  │
  └── analyses
         │
         ├── coverage_results
         │
         └── evidence
                │
                └── resource
                       │
                       └── resource_chunks
```

Evidence can be associated with a requirement and points back to the resource from which it originated.

---

## 6. Security Boundaries

The Supabase service-role key is server-only.

It must never be exposed to client-side code.

```text
Client
  │
  ▼
Next.js API
  │
  ▼
Server-only Supabase client
  │
  ▼
PostgreSQL
```

Environment variables containing secrets are never committed.

---

## 7. Failure Handling

Failures are explicitly represented.

Examples:

```text
Invalid user input
Resource retrieval failure
Missing transcript
AI timeout
AI invalid response
Embedding failure
Database failure
RAG failure
```

The application converts internal errors into safe public error messages.

---

## 8. Design Principle

The central architectural principle is:

```text
Goal
→ Requirements
→ Evidence
→ Coverage
→ Verification
→ Decision
```

OutcomeGuard should never treat an AI-generated explanation alone as proof.

Evidence must remain connected to the underlying resource.
