# OutcomeGuard

> Know whether a resource is actually sufficient to achieve your specific goal — before you waste time consuming it.

OutcomeGuard is an evidence-backed AI engine that evaluates learning resources against a specific goal.

Instead of asking whether a tutorial is simply "good", OutcomeGuard decomposes a goal into concrete requirements, retrieves relevant evidence from a resource, evaluates coverage, independently verifies the result, and produces an actionable verdict.

## Problem

A resource can mention the right technology without teaching everything required to achieve a particular outcome.

For example, a two-hour Next.js tutorial may cover:

* CRUD
* databases
* forms
* server actions

while completely missing:

* authentication
* testing
* deployment

The resource may still be useful, but it may not be sufficient for the user's actual goal.

OutcomeGuard makes those gaps explicit.

## How it works

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
Coverage Engine
    ↓
Independent Verification
    ↓
Final Verdict
```

## Example

### Goal

```text
Build a production-ready Next.js CRUD application.
```

### Resource

```text
2h18m Next.js tutorial
```

### Analysis

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
NOT SUFFICIENT
```

The user can then decide whether to supplement the resource, choose another resource, or manually review uncertain requirements.

## Core Features

* Goal-to-requirement decomposition
* YouTube resource ingestion
* Plain-text resource analysis
* Semantic chunk retrieval
* Vector embeddings
* Evidence-backed coverage analysis
* Requirement-level coverage map
* Independent verification
* Actionable recommendations
* Analysis history

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend

* Next.js Route Handlers
* TypeScript

### Database

* PostgreSQL
* Supabase
* pgvector

### AI

* OpenAI-compatible API
* LLM-based structured analysis
* Embeddings

### Validation and Testing

* Zod
* Vitest

### Deployment

* Vercel

## Project Structure

```text
outcomeguard/
├── app/
│   ├── api/
│   │   ├── analyze/
│   │   ├── goals/
│   │   └── resources/
│   ├── (dashboard)/
│   │   ├── analyze/
│   │   ├── history/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── analysis/
│   ├── dashboard/
│   ├── forms/
│   └── ui/
│
├── db/
│   └── schema.sql
│
├── docs/
│   ├── architecture.md
│   ├── decisions.md
│   └── hackathon.md
│
├── lib/
│   ├── ai/
│   ├── db/
│   ├── rag/
│   ├── resources/
│   └── utils/
│
├── tests/
│   ├── integration/
│   └── unit/
│
├── types/
│
├── public/
│   └── assets/
│
├── .env.example
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

## Getting Started

### Requirements

* Node.js 22+
* npm
* Supabase project
* AI API key
* YouTube transcript provider for YouTube analysis

### Installation

```bash
git clone https://github.com/HakimDev-tech/outcomeguard.git

cd outcomeguard

npm install
```

### Environment variables

Create a local environment file:

```bash
cp .env.example .env.local
```

Configure:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

AI_API_KEY=your_ai_api_key
AI_MODEL=your_ai_model

YOUTUBE_TRANSCRIPT_API_URL=your_transcript_api_url
YOUTUBE_TRANSCRIPT_API_KEY=your_transcript_api_key
```

Never commit `.env.local` or server-side API keys.

## Database Setup

Run the SQL contained in:

```text
db/schema.sql
```

inside the Supabase SQL editor.

The database requires the `vector` extension for semantic retrieval.

The RAG RPC function used by OutcomeGuard is also defined in the database setup.

## Development

Start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Quality Checks

Run linting:

```bash
npm run lint
```

Run TypeScript validation:

```bash
npm run typecheck
```

Run tests:

```bash
npm test
```

Run the production build:

```bash
npm run build
```

The complete local verification sequence is:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Architecture

The system is intentionally separated into independent layers:

```text
UI
 ↓
API
 ↓
Domain / AI
 ↓
RAG
 ↓
Database
```

See:

* `docs/architecture.md`
* `docs/decisions.md`
* `docs/hackathon.md`

## Design Principle

OutcomeGuard does not attempt to answer only:

```text
"Is this resource good?"
```

It answers:

```text
"Is this resource sufficient for this specific goal,
based on the available evidence,
and what is still missing?"
```

The distinction between the resource itself and the user's intended outcome is the foundation of the project.

## Current MVP Scope

The initial MVP focuses on:

* YouTube resources
* Plain text resources
* Goal decomposition
* Requirement-level analysis
* RAG-based evidence retrieval
* Coverage evaluation
* Independent verification
* Final recommendations

Additional resource types and user accounts can be added later.

## License

MIT
