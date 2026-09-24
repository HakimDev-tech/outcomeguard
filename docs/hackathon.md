# OutcomeGuard — Hackathon

## 1. Project

**Name:** OutcomeGuard

**Category:** AI / Developer Tools / Learning

**Core idea:**

> OutcomeGuard tells you whether a resource is actually sufficient to achieve your specific goal before you spend time consuming it.

---

## 2. Problem

People frequently choose tutorials, documentation, courses, videos, and other learning resources based on:

* title;
* popularity;
* duration;
* recommendations;
* search ranking;
* superficial topic overlap.

The important question is different:

```text
Does this specific resource contain enough information
to achieve my specific outcome?
```

Traditional search and recommendation systems generally do not answer this requirement-level question.

---

## 3. Solution

OutcomeGuard transforms a goal into explicit requirements.

It then analyzes a resource against those requirements using:

* resource ingestion;
* semantic retrieval;
* evidence extraction;
* requirement-level coverage;
* independent verification.

The result explains not only the verdict but also why the verdict was reached.

---

## 4. Example

### User goal

```text
Build a production-ready Next.js CRUD application.
```

### Resource

```text
2h18m Next.js tutorial
```

### Extracted requirements

| Requirement    | Coverage |
| -------------- | -------- |
| CRUD           | Covered  |
| Database       | Covered  |
| Forms          | Covered  |
| Server Actions | Covered  |
| Authentication | Partial  |
| Testing        | Missing  |
| Deployment     | Missing  |

### Result

```text
VERDICT: NOT SUFFICIENT
```

The user can then decide whether to:

* use the resource together with supplementary material;
* find another resource;
* inspect the uncertain requirements manually.

---

## 5. Technical Differentiator

OutcomeGuard is designed around an evidence chain:

```text
Goal
 ↓
Requirement
 ↓
Retrieved Resource Evidence
 ↓
Coverage
 ↓
Verification
 ↓
Verdict
```

This is fundamentally different from asking an LLM to give a generic opinion about whether a tutorial is "good".

---

## 6. MVP

### Supported inputs

```text
Goal
YouTube resource
Plain text resource
```

### Processing

```text
Goal parsing
Resource ingestion
Chunking
Embeddings
Semantic retrieval
Evidence analysis
Coverage analysis
Verification
```

### Output

```text
Requirements
Evidence
Coverage map
Missing concepts
Final verdict
Recommendation
```

---

## 7. Technology Stack

```text
Frontend
    Next.js
    React
    TypeScript
    Tailwind CSS

Backend
    Next.js Route Handlers
    TypeScript

Database
    PostgreSQL
    Supabase
    pgvector

AI
    OpenAI-compatible API
    LLM
    Embeddings

Validation
    Zod

Testing
    Vitest

Deployment
    Vercel

Version Control
    Git
    GitHub
```

---

## 8. Hackathon Development Strategy

The implementation follows a vertical-slice strategy.

### Stage 1 — Foundation

```text
Project setup
Database
Types
Validation
Error handling
```

### Stage 2 — Intelligence

```text
Goal parser
Resource ingestion
Chunking
Embeddings
Retrieval
Coverage
Verification
```

### Stage 3 — Product

```text
Dashboard
Analysis interface
Evidence visualization
Coverage map
Verdict
History
```

### Stage 4 — Reliability

```text
Tests
Error handling
Loading states
Validation
Deployment
```

### Stage 5 — Presentation

```text
README
Architecture documentation
Demo
Screenshots
Hackathon submission
```

---

## 9. Demo Narrative

The demonstration should focus on one clear user journey.

### 1. Start with the problem

Show a realistic learning goal.

```text
I want to build a production-ready Next.js CRUD application.
```

### 2. Add a resource

Provide a tutorial or learning resource.

### 3. Show the extracted requirements

OutcomeGuard identifies the capabilities required to achieve the goal.

### 4. Show evidence

Demonstrate that the system retrieves actual portions of the resource relevant to each requirement.

### 5. Show the coverage map

Display:

```text
Covered
Partial
Missing
Uncertain
```

### 6. Show the verdict

The system determines whether the resource is sufficient.

### 7. Explain the value

The user now knows:

```text
What the resource teaches
What it does not teach
What evidence supports the conclusion
What should be learned elsewhere
```

---

## 10. Technical Story

The technical story should emphasize the complete pipeline:

```text
Structured goal decomposition
        ↓
Requirement generation
        ↓
Resource ingestion
        ↓
Chunking
        ↓
Embedding generation
        ↓
Vector retrieval
        ↓
Evidence extraction
        ↓
Requirement coverage
        ↓
Independent verification
        ↓
Actionable verdict
```

The system combines deterministic application logic with AI reasoning rather than delegating the entire decision to a single prompt.

---

## 11. Learning & Engineering Story

The project demonstrates practical learning across:

* Next.js;
* React;
* TypeScript;
* PostgreSQL;
* Supabase;
* pgvector;
* RAG;
* embeddings;
* structured LLM outputs;
* API design;
* validation;
* error handling;
* testing;
* deployment;
* Git/GitHub workflows.

The architecture intentionally separates these concerns so each part can be inspected and improved independently.

---

## 12. Future Extensions

Potential post-MVP extensions include:

```text
Documentation websites
GitHub repositories
Articles
Courses
PDFs
Multiple resources per goal
Resource comparison
Personal learning paths
Progress tracking
Source reliability signals
Authentication
User accounts
Saved analyses
```

These features are outside the initial MVP unless implementation time permits.

---

## 13. Core Product Principle

OutcomeGuard should never answer only:

> "Is this resource good?"

It should answer:

```text
Is this resource sufficient
for THIS goal,
based on THIS evidence,
and what is still missing?
```

That distinction defines the product.
