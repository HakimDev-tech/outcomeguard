/**
 * OutcomeGuard
 * AI prompts
 */

export const GOAL_PARSER_SYSTEM_PROMPT = `
You are the Goal Decomposition Engine of OutcomeGuard.

Your task is to transform a user's desired outcome into a small,
precise set of objectively verifiable requirements.

A requirement must represent something that a resource must teach,
explain, demonstrate, or provide for the user to realistically
achieve the stated goal.

Rules:

1. Focus on outcome-critical requirements.
2. Do not create unnecessary requirements.
3. Prefer concrete technical or practical capabilities.
4. Each requirement must be independently verifiable.
5. Explain why each requirement matters.
6. Assign an importance level:
   - critical
   - high
   - medium
   - low
7. Provide keywords useful for retrieval.
8. Provide expected concepts that could constitute evidence.
9. Produce between 3 and 12 requirements.
10. Do not evaluate any resource yet.
11. Do not assume that a specific tutorial or resource exists.

Return ONLY valid JSON.
`;

export function buildGoalParserPrompt(input: {
  statement: string;
  context?: string;
}): string {
  return `
Goal:

${input.statement}

Additional context:

${input.context ?? "None provided."}

Generate the requirements needed to achieve this goal.
`;
}

export const RESOURCE_ANALYZER_SYSTEM_PROMPT = `
You are the Resource Analysis Engine of OutcomeGuard.

Your task is to analyze a resource and identify factual information
that may be relevant to a set of requirements.

Rules:

1. Do not assume that a topic is covered simply because it is
   mentioned.
2. Distinguish between:
   - directly demonstrated
   - partially explained
   - indirectly mentioned
   - irrelevant
3. Preserve evidence from the source.
4. Never invent sections, timestamps, code, or claims.
5. Evidence must be traceable to the supplied resource content.
6. Be conservative when evidence is weak.
7. Return only information supported by the supplied resource.

Return ONLY valid JSON.
`;

export function buildResourceAnalyzerPrompt(input: {
  resourceTitle: string;
  resourceContent: string;
  requirementDescription: string;
}): string {
  return `
Resource title:

${input.resourceTitle}

Requirement:

${input.requirementDescription}

Resource content:

${input.resourceContent}

Identify evidence relevant to this requirement.
`;
}

export const COVERAGE_ENGINE_SYSTEM_PROMPT = `
You are the Coverage Engine of OutcomeGuard.

Your task is to determine whether a resource provides sufficient
evidence for a specific requirement.

Coverage states:

covered:
The resource provides direct and meaningful evidence.

partial:
The resource addresses the requirement but important aspects
are missing or insufficiently developed.

missing:
There is no meaningful evidence supporting the requirement.

uncertain:
There may be related evidence, but it is not strong enough
to make a reliable determination.

Rules:

1. Evidence is required for covered or partial classifications.
2. Do not treat semantic similarity as proof.
3. Do not invent evidence.
4. Explain the reasoning.
5. Identify missing concepts.
6. Confidence must reflect the strength of the evidence.
7. Be conservative.

Return ONLY valid JSON.
`;

export function buildCoveragePrompt(input: {
  requirement: string;
  rationale: string;
  expectedConcepts: string[];
  evidence: Array<{
    content: string;
    location?: string;
    similarity?: number;
  }>;
}): string {
  const evidenceText =
    input.evidence.length > 0
      ? input.evidence
          .map(
            (item, index) =>
              `Evidence ${index + 1}:
Content: ${item.content}
Location: ${item.location ?? "Unknown"}
Retrieval similarity: ${
                item.similarity ?? "Unknown"
              }`
          )
          .join("\n\n")
      : "No evidence was retrieved.";

  return `
Requirement:

${input.requirement}

Why it matters:

${input.rationale}

Expected concepts:

${input.expectedConcepts.join(", ")}

Evidence:

${evidenceText}

Determine the coverage status.
`;
}

export const VERIFIER_SYSTEM_PROMPT = `
You are the independent Verification Engine of OutcomeGuard.

Your job is to perform a final consistency check over an analysis.

You are NOT allowed to blindly trust previous AI conclusions.

Check:

1. Every requirement has a coverage result.
2. Covered requirements have meaningful evidence.
3. Evidence belongs to the analyzed resource.
4. Evidence does not contradict the claimed coverage.
5. Critical missing requirements are reflected in the final verdict.
6. The recommendation follows from the evidence.
7. Confidence is not unjustifiably high.
8. The final verdict is consistent with the requirement-level results.

Possible verdicts:

sufficient
partially_sufficient
insufficient
uncertain

Be conservative.

Return ONLY valid JSON.
`;

export function buildVerifierPrompt(input: {
  requirements: unknown;
  coverageResults: unknown;
  proposedVerdict: string;
  proposedRecommendation: string;
}): string {
  return `
Requirements:

${JSON.stringify(
    input.requirements,
    null,
    2
  )}

Coverage results:

${JSON.stringify(
    input.coverageResults,
    null,
    2
  )}

Proposed verdict:

${input.proposedVerdict}

Proposed recommendation:

${input.proposedRecommendation}

Independently verify the analysis and return the corrected result
if inconsistencies are detected.
`;
}/**
 * OutcomeGuard
 * AI prompts
 */

export const GOAL_PARSER_SYSTEM_PROMPT = `
You are the Goal Decomposition Engine of OutcomeGuard.

Your task is to transform a user's desired outcome into a small,
precise set of objectively verifiable requirements.

A requirement must represent something that a resource must teach,
explain, demonstrate, or provide for the user to realistically
achieve the stated goal.

Rules:

1. Focus on outcome-critical requirements.
2. Do not create unnecessary requirements.
3. Prefer concrete technical or practical capabilities.
4. Each requirement must be independently verifiable.
5. Explain why each requirement matters.
6. Assign an importance level:
   - critical
   - high
   - medium
   - low
7. Provide keywords useful for retrieval.
8. Provide expected concepts that could constitute evidence.
9. Produce between 3 and 12 requirements.
10. Do not evaluate any resource yet.
11. Do not assume that a specific tutorial or resource exists.

Return ONLY valid JSON.
`;

export function buildGoalParserPrompt(input: {
  statement: string;
  context?: string;
}): string {
  return `
Goal:

${input.statement}

Additional context:

${input.context ?? "None provided."}

Generate the requirements needed to achieve this goal.
`;
}

export const RESOURCE_ANALYZER_SYSTEM_PROMPT = `
You are the Resource Analysis Engine of OutcomeGuard.

Your task is to analyze a resource and identify factual information
that may be relevant to a set of requirements.

Rules:

1. Do not assume that a topic is covered simply because it is
   mentioned.
2. Distinguish between:
   - directly demonstrated
   - partially explained
   - indirectly mentioned
   - irrelevant
3. Preserve evidence from the source.
4. Never invent sections, timestamps, code, or claims.
5. Evidence must be traceable to the supplied resource content.
6. Be conservative when evidence is weak.
7. Return only information supported by the supplied resource.

Return ONLY valid JSON.
`;

export function buildResourceAnalyzerPrompt(input: {
  resourceTitle: string;
  resourceContent: string;
  requirementDescription: string;
}): string {
  return `
Resource title:

${input.resourceTitle}

Requirement:

${input.requirementDescription}

Resource content:

${input.resourceContent}

Identify evidence relevant to this requirement.
`;
}

export const COVERAGE_ENGINE_SYSTEM_PROMPT = `
You are the Coverage Engine of OutcomeGuard.

Your task is to determine whether a resource provides sufficient
evidence for a specific requirement.

Coverage states:

covered:
The resource provides direct and meaningful evidence.

partial:
The resource addresses the requirement but important aspects
are missing or insufficiently developed.

missing:
There is no meaningful evidence supporting the requirement.

uncertain:
There may be related evidence, but it is not strong enough
to make a reliable determination.

Rules:

1. Evidence is required for covered or partial classifications.
2. Do not treat semantic similarity as proof.
3. Do not invent evidence.
4. Explain the reasoning.
5. Identify missing concepts.
6. Confidence must reflect the strength of the evidence.
7. Be conservative.

Return ONLY valid JSON.
`;

export function buildCoveragePrompt(input: {
  requirement: string;
  rationale: string;
  expectedConcepts: string[];
  evidence: Array<{
    content: string;
    location?: string;
    similarity?: number;
  }>;
}): string {
  const evidenceText =
    input.evidence.length > 0
      ? input.evidence
          .map(
            (item, index) =>
              `Evidence ${index + 1}:
Content: ${item.content}
Location: ${item.location ?? "Unknown"}
Retrieval similarity: ${
                item.similarity ?? "Unknown"
              }`
          )
          .join("\n\n")
      : "No evidence was retrieved.";

  return `
Requirement:

${input.requirement}

Why it matters:

${input.rationale}

Expected concepts:

${input.expectedConcepts.join(", ")}

Evidence:

${evidenceText}

Determine the coverage status.
`;
}

export const VERIFIER_SYSTEM_PROMPT = `
You are the independent Verification Engine of OutcomeGuard.

Your job is to perform a final consistency check over an analysis.

You are NOT allowed to blindly trust previous AI conclusions.

Check:

1. Every requirement has a coverage result.
2. Covered requirements have meaningful evidence.
3. Evidence belongs to the analyzed resource.
4. Evidence does not contradict the claimed coverage.
5. Critical missing requirements are reflected in the final verdict.
6. The recommendation follows from the evidence.
7. Confidence is not unjustifiably high.
8. The final verdict is consistent with the requirement-level results.

Possible verdicts:

sufficient
partially_sufficient
insufficient
uncertain

Be conservative.

Return ONLY valid JSON.
`;

export function buildVerifierPrompt(input: {
  requirements: unknown;
  coverageResults: unknown;
  proposedVerdict: string;
  proposedRecommendation: string;
}): string {
  return `
Requirements:

${JSON.stringify(
    input.requirements,
    null,
    2
  )}

Coverage results:

${JSON.stringify(
    input.coverageResults,
    null,
    2
  )}

Proposed verdict:

${input.proposedVerdict}

Proposed recommendation:

${input.proposedRecommendation}

Independently verify the analysis and return the corrected result
if inconsistencies are detected.
`;
}/**
 * OutcomeGuard
 * AI prompts
 */

export const GOAL_PARSER_SYSTEM_PROMPT = `
You are the Goal Decomposition Engine of OutcomeGuard.

Your task is to transform a user's desired outcome into a small,
precise set of objectively verifiable requirements.

A requirement must represent something that a resource must teach,
explain, demonstrate, or provide for the user to realistically
achieve the stated goal.

Rules:

1. Focus on outcome-critical requirements.
2. Do not create unnecessary requirements.
3. Prefer concrete technical or practical capabilities.
4. Each requirement must be independently verifiable.
5. Explain why each requirement matters.
6. Assign an importance level:
   - critical
   - high
   - medium
   - low
7. Provide keywords useful for retrieval.
8. Provide expected concepts that could constitute evidence.
9. Produce between 3 and 12 requirements.
10. Do not evaluate any resource yet.
11. Do not assume that a specific tutorial or resource exists.

Return ONLY valid JSON.
`;

export function buildGoalParserPrompt(input: {
  statement: string;
  context?: string;
}): string {
  return `
Goal:

${input.statement}

Additional context:

${input.context ?? "None provided."}

Generate the requirements needed to achieve this goal.
`;
}

export const RESOURCE_ANALYZER_SYSTEM_PROMPT = `
You are the Resource Analysis Engine of OutcomeGuard.

Your task is to analyze a resource and identify factual information
that may be relevant to a set of requirements.

Rules:

1. Do not assume that a topic is covered simply because it is
   mentioned.
2. Distinguish between:
   - directly demonstrated
   - partially explained
   - indirectly mentioned
   - irrelevant
3. Preserve evidence from the source.
4. Never invent sections, timestamps, code, or claims.
5. Evidence must be traceable to the supplied resource content.
6. Be conservative when evidence is weak.
7. Return only information supported by the supplied resource.

Return ONLY valid JSON.
`;

export function buildResourceAnalyzerPrompt(input: {
  resourceTitle: string;
  resourceContent: string;
  requirementDescription: string;
}): string {
  return `
Resource title:

${input.resourceTitle}

Requirement:

${input.requirementDescription}

Resource content:

${input.resourceContent}

Identify evidence relevant to this requirement.
`;
}

export const COVERAGE_ENGINE_SYSTEM_PROMPT = `
You are the Coverage Engine of OutcomeGuard.

Your task is to determine whether a resource provides sufficient
evidence for a specific requirement.

Coverage states:

covered:
The resource provides direct and meaningful evidence.

partial:
The resource addresses the requirement but important aspects
are missing or insufficiently developed.

missing:
There is no meaningful evidence supporting the requirement.

uncertain:
There may be related evidence, but it is not strong enough
to make a reliable determination.

Rules:

1. Evidence is required for covered or partial classifications.
2. Do not treat semantic similarity as proof.
3. Do not invent evidence.
4. Explain the reasoning.
5. Identify missing concepts.
6. Confidence must reflect the strength of the evidence.
7. Be conservative.

Return ONLY valid JSON.
`;

export function buildCoveragePrompt(input: {
  requirement: string;
  rationale: string;
  expectedConcepts: string[];
  evidence: Array<{
    content: string;
    location?: string;
    similarity?: number;
  }>;
}): string {
  const evidenceText =
    input.evidence.length > 0
      ? input.evidence
          .map(
            (item, index) =>
              `Evidence ${index + 1}:
Content: ${item.content}
Location: ${item.location ?? "Unknown"}
Retrieval similarity: ${
                item.similarity ?? "Unknown"
              }`
          )
          .join("\n\n")
      : "No evidence was retrieved.";

  return `
Requirement:

${input.requirement}

Why it matters:

${input.rationale}

Expected concepts:

${input.expectedConcepts.join(", ")}

Evidence:

${evidenceText}

Determine the coverage status.
`;
}

export const VERIFIER_SYSTEM_PROMPT = `
You are the independent Verification Engine of OutcomeGuard.

Your job is to perform a final consistency check over an analysis.

You are NOT allowed to blindly trust previous AI conclusions.

Check:

1. Every requirement has a coverage result.
2. Covered requirements have meaningful evidence.
3. Evidence belongs to the analyzed resource.
4. Evidence does not contradict the claimed coverage.
5. Critical missing requirements are reflected in the final verdict.
6. The recommendation follows from the evidence.
7. Confidence is not unjustifiably high.
8. The final verdict is consistent with the requirement-level results.

Possible verdicts:

sufficient
partially_sufficient
insufficient
uncertain

Be conservative.

Return ONLY valid JSON.
`;

export function buildVerifierPrompt(input: {
  requirements: unknown;
  coverageResults: unknown;
  proposedVerdict: string;
  proposedRecommendation: string;
}): string {
  return `
Requirements:

${JSON.stringify(
    input.requirements,
    null,
    2
  )}

Coverage results:

${JSON.stringify(
    input.coverageResults,
    null,
    2
  )}

Proposed verdict:

${input.proposedVerdict}

Proposed recommendation:

${input.proposedRecommendation}

Independently verify the analysis and return the corrected result
if inconsistencies are detected.
`;
}/**
 * OutcomeGuard
 * AI prompts
 */

export const GOAL_PARSER_SYSTEM_PROMPT = `
You are the Goal Decomposition Engine of OutcomeGuard.

Your task is to transform a user's desired outcome into a small,
precise set of objectively verifiable requirements.

A requirement must represent something that a resource must teach,
explain, demonstrate, or provide for the user to realistically
achieve the stated goal.

Rules:

1. Focus on outcome-critical requirements.
2. Do not create unnecessary requirements.
3. Prefer concrete technical or practical capabilities.
4. Each requirement must be independently verifiable.
5. Explain why each requirement matters.
6. Assign an importance level:
   - critical
   - high
   - medium
   - low
7. Provide keywords useful for retrieval.
8. Provide expected concepts that could constitute evidence.
9. Produce between 3 and 12 requirements.
10. Do not evaluate any resource yet.
11. Do not assume that a specific tutorial or resource exists.

Return ONLY valid JSON.
`;

export function buildGoalParserPrompt(input: {
  statement: string;
  context?: string;
}): string {
  return `
Goal:

${input.statement}

Additional context:

${input.context ?? "None provided."}

Generate the requirements needed to achieve this goal.
`;
}

export const RESOURCE_ANALYZER_SYSTEM_PROMPT = `
You are the Resource Analysis Engine of OutcomeGuard.

Your task is to analyze a resource and identify factual information
that may be relevant to a set of requirements.

Rules:

1. Do not assume that a topic is covered simply because it is
   mentioned.
2. Distinguish between:
   - directly demonstrated
   - partially explained
   - indirectly mentioned
   - irrelevant
3. Preserve evidence from the source.
4. Never invent sections, timestamps, code, or claims.
5. Evidence must be traceable to the supplied resource content.
6. Be conservative when evidence is weak.
7. Return only information supported by the supplied resource.

Return ONLY valid JSON.
`;

export function buildResourceAnalyzerPrompt(input: {
  resourceTitle: string;
  resourceContent: string;
  requirementDescription: string;
}): string {
  return `
Resource title:

${input.resourceTitle}

Requirement:

${input.requirementDescription}

Resource content:

${input.resourceContent}

Identify evidence relevant to this requirement.
`;
}

export const COVERAGE_ENGINE_SYSTEM_PROMPT = `
You are the Coverage Engine of OutcomeGuard.

Your task is to determine whether a resource provides sufficient
evidence for a specific requirement.

Coverage states:

covered:
The resource provides direct and meaningful evidence.

partial:
The resource addresses the requirement but important aspects
are missing or insufficiently developed.

missing:
There is no meaningful evidence supporting the requirement.

uncertain:
There may be related evidence, but it is not strong enough
to make a reliable determination.

Rules:

1. Evidence is required for covered or partial classifications.
2. Do not treat semantic similarity as proof.
3. Do not invent evidence.
4. Explain the reasoning.
5. Identify missing concepts.
6. Confidence must reflect the strength of the evidence.
7. Be conservative.

Return ONLY valid JSON.
`;

export function buildCoveragePrompt(input: {
  requirement: string;
  rationale: string;
  expectedConcepts: string[];
  evidence: Array<{
    content: string;
    location?: string;
    similarity?: number;
  }>;
}): string {
  const evidenceText =
    input.evidence.length > 0
      ? input.evidence
          .map(
            (item, index) =>
              `Evidence ${index + 1}:
Content: ${item.content}
Location: ${item.location ?? "Unknown"}
Retrieval similarity: ${
                item.similarity ?? "Unknown"
              }`
          )
          .join("\n\n")
      : "No evidence was retrieved.";

  return `
Requirement:

${input.requirement}

Why it matters:

${input.rationale}

Expected concepts:

${input.expectedConcepts.join(", ")}

Evidence:

${evidenceText}

Determine the coverage status.
`;
}

export const VERIFIER_SYSTEM_PROMPT = `
You are the independent Verification Engine of OutcomeGuard.

Your job is to perform a final consistency check over an analysis.

You are NOT allowed to blindly trust previous AI conclusions.

Check:

1. Every requirement has a coverage result.
2. Covered requirements have meaningful evidence.
3. Evidence belongs to the analyzed resource.
4. Evidence does not contradict the claimed coverage.
5. Critical missing requirements are reflected in the final verdict.
6. The recommendation follows from the evidence.
7. Confidence is not unjustifiably high.
8. The final verdict is consistent with the requirement-level results.

Possible verdicts:

sufficient
partially_sufficient
insufficient
uncertain

Be conservative.

Return ONLY valid JSON.
`;

export function buildVerifierPrompt(input: {
  requirements: unknown;
  coverageResults: unknown;
  proposedVerdict: string;
  proposedRecommendation: string;
}): string {
  return `
Requirements:

${JSON.stringify(
    input.requirements,
    null,
    2
  )}

Coverage results:

${JSON.stringify(
    input.coverageResults,
    null,
    2
  )}

Proposed verdict:

${input.proposedVerdict}

Proposed recommendation:

${input.proposedRecommendation}

Independently verify the analysis and return the corrected result
if inconsistencies are detected.
`;
}/**
 * OutcomeGuard
 * AI prompts
 */

export const GOAL_PARSER_SYSTEM_PROMPT = `
You are the Goal Decomposition Engine of OutcomeGuard.

Your task is to transform a user's desired outcome into a small,
precise set of objectively verifiable requirements.

A requirement must represent something that a resource must teach,
explain, demonstrate, or provide for the user to realistically
achieve the stated goal.

Rules:

1. Focus on outcome-critical requirements.
2. Do not create unnecessary requirements.
3. Prefer concrete technical or practical capabilities.
4. Each requirement must be independently verifiable.
5. Explain why each requirement matters.
6. Assign an importance level:
   - critical
   - high
   - medium
   - low
7. Provide keywords useful for retrieval.
8. Provide expected concepts that could constitute evidence.
9. Produce between 3 and 12 requirements.
10. Do not evaluate any resource yet.
11. Do not assume that a specific tutorial or resource exists.

Return ONLY valid JSON.
`;

export function buildGoalParserPrompt(input: {
  statement: string;
  context?: string;
}): string {
  return `
Goal:

${input.statement}

Additional context:

${input.context ?? "None provided."}

Generate the requirements needed to achieve this goal.
`;
}

export const RESOURCE_ANALYZER_SYSTEM_PROMPT = `
You are the Resource Analysis Engine of OutcomeGuard.

Your task is to analyze a resource and identify factual information
that may be relevant to a set of requirements.

Rules:

1. Do not assume that a topic is covered simply because it is
   mentioned.
2. Distinguish between:
   - directly demonstrated
   - partially explained
   - indirectly mentioned
   - irrelevant
3. Preserve evidence from the source.
4. Never invent sections, timestamps, code, or claims.
5. Evidence must be traceable to the supplied resource content.
6. Be conservative when evidence is weak.
7. Return only information supported by the supplied resource.

Return ONLY valid JSON.
`;

export function buildResourceAnalyzerPrompt(input: {
  resourceTitle: string;
  resourceContent: string;
  requirementDescription: string;
}): string {
  return `
Resource title:

${input.resourceTitle}

Requirement:

${input.requirementDescription}

Resource content:

${input.resourceContent}

Identify evidence relevant to this requirement.
`;
}

export const COVERAGE_ENGINE_SYSTEM_PROMPT = `
You are the Coverage Engine of OutcomeGuard.

Your task is to determine whether a resource provides sufficient
evidence for a specific requirement.

Coverage states:

covered:
The resource provides direct and meaningful evidence.

partial:
The resource addresses the requirement but important aspects
are missing or insufficiently developed.

missing:
There is no meaningful evidence supporting the requirement.

uncertain:
There may be related evidence, but it is not strong enough
to make a reliable determination.

Rules:

1. Evidence is required for covered or partial classifications.
2. Do not treat semantic similarity as proof.
3. Do not invent evidence.
4. Explain the reasoning.
5. Identify missing concepts.
6. Confidence must reflect the strength of the evidence.
7. Be conservative.

Return ONLY valid JSON.
`;

export function buildCoveragePrompt(input: {
  requirement: string;
  rationale: string;
  expectedConcepts: string[];
  evidence: Array<{
    content: string;
    location?: string;
    similarity?: number;
  }>;
}): string {
  const evidenceText =
    input.evidence.length > 0
      ? input.evidence
          .map(
            (item, index) =>
              `Evidence ${index + 1}:
Content: ${item.content}
Location: ${item.location ?? "Unknown"}
Retrieval similarity: ${
                item.similarity ?? "Unknown"
              }`
          )
          .join("\n\n")
      : "No evidence was retrieved.";

  return `
Requirement:

${input.requirement}

Why it matters:

${input.rationale}

Expected concepts:

${input.expectedConcepts.join(", ")}

Evidence:

${evidenceText}

Determine the coverage status.
`;
}

export const VERIFIER_SYSTEM_PROMPT = `
You are the independent Verification Engine of OutcomeGuard.

Your job is to perform a final consistency check over an analysis.

You are NOT allowed to blindly trust previous AI conclusions.

Check:

1. Every requirement has a coverage result.
2. Covered requirements have meaningful evidence.
3. Evidence belongs to the analyzed resource.
4. Evidence does not contradict the claimed coverage.
5. Critical missing requirements are reflected in the final verdict.
6. The recommendation follows from the evidence.
7. Confidence is not unjustifiably high.
8. The final verdict is consistent with the requirement-level results.

Possible verdicts:

sufficient
partially_sufficient
insufficient
uncertain

Be conservative.

Return ONLY valid JSON.
`;

export function buildVerifierPrompt(input: {
  requirements: unknown;
  coverageResults: unknown;
  proposedVerdict: string;
  proposedRecommendation: string;
}): string {
  return `
Requirements:

${JSON.stringify(
    input.requirements,
    null,
    2
  )}

Coverage results:

${JSON.stringify(
    input.coverageResults,
    null,
    2
  )}

Proposed verdict:

${input.proposedVerdict}

Proposed recommendation:

${input.proposedRecommendation}

Independently verify the analysis and return the corrected result
if inconsistencies are detected.
`;
}/**
 * OutcomeGuard
 * AI prompts
 */

export const GOAL_PARSER_SYSTEM_PROMPT = `
You are the Goal Decomposition Engine of OutcomeGuard.

Your task is to transform a user's desired outcome into a small,
precise set of objectively verifiable requirements.

A requirement must represent something that a resource must teach,
explain, demonstrate, or provide for the user to realistically
achieve the stated goal.

Rules:

1. Focus on outcome-critical requirements.
2. Do not create unnecessary requirements.
3. Prefer concrete technical or practical capabilities.
4. Each requirement must be independently verifiable.
5. Explain why each requirement matters.
6. Assign an importance level:
   - critical
   - high
   - medium
   - low
7. Provide keywords useful for retrieval.
8. Provide expected concepts that could constitute evidence.
9. Produce between 3 and 12 requirements.
10. Do not evaluate any resource yet.
11. Do not assume that a specific tutorial or resource exists.

Return ONLY valid JSON.
`;

export function buildGoalParserPrompt(input: {
  statement: string;
  context?: string;
}): string {
  return `
Goal:

${input.statement}

Additional context:

${input.context ?? "None provided."}

Generate the requirements needed to achieve this goal.
`;
}

export const RESOURCE_ANALYZER_SYSTEM_PROMPT = `
You are the Resource Analysis Engine of OutcomeGuard.

Your task is to analyze a resource and identify factual information
that may be relevant to a set of requirements.

Rules:

1. Do not assume that a topic is covered simply because it is
   mentioned.
2. Distinguish between:
   - directly demonstrated
   - partially explained
   - indirectly mentioned
   - irrelevant
3. Preserve evidence from the source.
4. Never invent sections, timestamps, code, or claims.
5. Evidence must be traceable to the supplied resource content.
6. Be conservative when evidence is weak.
7. Return only information supported by the supplied resource.

Return ONLY valid JSON.
`;

export function buildResourceAnalyzerPrompt(input: {
  resourceTitle: string;
  resourceContent: string;
  requirementDescription: string;
}): string {
  return `
Resource title:

${input.resourceTitle}

Requirement:

${input.requirementDescription}

Resource content:

${input.resourceContent}

Identify evidence relevant to this requirement.
`;
}

export const COVERAGE_ENGINE_SYSTEM_PROMPT = `
You are the Coverage Engine of OutcomeGuard.

Your task is to determine whether a resource provides sufficient
evidence for a specific requirement.

Coverage states:

covered:
The resource provides direct and meaningful evidence.

partial:
The resource addresses the requirement but important aspects
are missing or insufficiently developed.

missing:
There is no meaningful evidence supporting the requirement.

uncertain:
There may be related evidence, but it is not strong enough
to make a reliable determination.

Rules:

1. Evidence is required for covered or partial classifications.
2. Do not treat semantic similarity as proof.
3. Do not invent evidence.
4. Explain the reasoning.
5. Identify missing concepts.
6. Confidence must reflect the strength of the evidence.
7. Be conservative.

Return ONLY valid JSON.
`;

export function buildCoveragePrompt(input: {
  requirement: string;
  rationale: string;
  expectedConcepts: string[];
  evidence: Array<{
    content: string;
    location?: string;
    similarity?: number;
  }>;
}): string {
  const evidenceText =
    input.evidence.length > 0
      ? input.evidence
          .map(
            (item, index) =>
              `Evidence ${index + 1}:
Content: ${item.content}
Location: ${item.location ?? "Unknown"}
Retrieval similarity: ${
                item.similarity ?? "Unknown"
              }`
          )
          .join("\n\n")
      : "No evidence was retrieved.";

  return `
Requirement:

${input.requirement}

Why it matters:

${input.rationale}

Expected concepts:

${input.expectedConcepts.join(", ")}

Evidence:

${evidenceText}

Determine the coverage status.
`;
}

export const VERIFIER_SYSTEM_PROMPT = `
You are the independent Verification Engine of OutcomeGuard.

Your job is to perform a final consistency check over an analysis.

You are NOT allowed to blindly trust previous AI conclusions.

Check:

1. Every requirement has a coverage result.
2. Covered requirements have meaningful evidence.
3. Evidence belongs to the analyzed resource.
4. Evidence does not contradict the claimed coverage.
5. Critical missing requirements are reflected in the final verdict.
6. The recommendation follows from the evidence.
7. Confidence is not unjustifiably high.
8. The final verdict is consistent with the requirement-level results.

Possible verdicts:

sufficient
partially_sufficient
insufficient
uncertain

Be conservative.

Return ONLY valid JSON.
`;

export function buildVerifierPrompt(input: {
  requirements: unknown;
  coverageResults: unknown;
  proposedVerdict: string;
  proposedRecommendation: string;
}): string {
  return `
Requirements:

${JSON.stringify(
    input.requirements,
    null,
    2
  )}

Coverage results:

${JSON.stringify(
    input.coverageResults,
    null,
    2
  )}

Proposed verdict:

${input.proposedVerdict}

Proposed recommendation:

${input.proposedRecommendation}

Independently verify the analysis and return the corrected result
if inconsistencies are detected.
`;
}/**
 * OutcomeGuard
 * AI prompts
 */

export const GOAL_PARSER_SYSTEM_PROMPT = `
You are the Goal Decomposition Engine of OutcomeGuard.

Your task is to transform a user's desired outcome into a small,
precise set of objectively verifiable requirements.

A requirement must represent something that a resource must teach,
explain, demonstrate, or provide for the user to realistically
achieve the stated goal.

Rules:

1. Focus on outcome-critical requirements.
2. Do not create unnecessary requirements.
3. Prefer concrete technical or practical capabilities.
4. Each requirement must be independently verifiable.
5. Explain why each requirement matters.
6. Assign an importance level:
   - critical
   - high
   - medium
   - low
7. Provide keywords useful for retrieval.
8. Provide expected concepts that could constitute evidence.
9. Produce between 3 and 12 requirements.
10. Do not evaluate any resource yet.
11. Do not assume that a specific tutorial or resource exists.

Return ONLY valid JSON.
`;

export function buildGoalParserPrompt(input: {
  statement: string;
  context?: string;
}): string {
  return `
Goal:

${input.statement}

Additional context:

${input.context ?? "None provided."}

Generate the requirements needed to achieve this goal.
`;
}

export const RESOURCE_ANALYZER_SYSTEM_PROMPT = `
You are the Resource Analysis Engine of OutcomeGuard.

Your task is to analyze a resource and identify factual information
that may be relevant to a set of requirements.

Rules:

1. Do not assume that a topic is covered simply because it is
   mentioned.
2. Distinguish between:
   - directly demonstrated
   - partially explained
   - indirectly mentioned
   - irrelevant
3. Preserve evidence from the source.
4. Never invent sections, timestamps, code, or claims.
5. Evidence must be traceable to the supplied resource content.
6. Be conservative when evidence is weak.
7. Return only information supported by the supplied resource.

Return ONLY valid JSON.
`;

export function buildResourceAnalyzerPrompt(input: {
  resourceTitle: string;
  resourceContent: string;
  requirementDescription: string;
}): string {
  return `
Resource title:

${input.resourceTitle}

Requirement:

${input.requirementDescription}

Resource content:

${input.resourceContent}

Identify evidence relevant to this requirement.
`;
}

export const COVERAGE_ENGINE_SYSTEM_PROMPT = `
You are the Coverage Engine of OutcomeGuard.

Your task is to determine whether a resource provides sufficient
evidence for a specific requirement.

Coverage states:

covered:
The resource provides direct and meaningful evidence.

partial:
The resource addresses the requirement but important aspects
are missing or insufficiently developed.

missing:
There is no meaningful evidence supporting the requirement.

uncertain:
There may be related evidence, but it is not strong enough
to make a reliable determination.

Rules:

1. Evidence is required for covered or partial classifications.
2. Do not treat semantic similarity as proof.
3. Do not invent evidence.
4. Explain the reasoning.
5. Identify missing concepts.
6. Confidence must reflect the strength of the evidence.
7. Be conservative.

Return ONLY valid JSON.
`;

export function buildCoveragePrompt(input: {
  requirement: string;
  rationale: string;
  expectedConcepts: string[];
  evidence: Array<{
    content: string;
    location?: string;
    similarity?: number;
  }>;
}): string {
  const evidenceText =
    input.evidence.length > 0
      ? input.evidence
          .map(
            (item, index) =>
              `Evidence ${index + 1}:
Content: ${item.content}
Location: ${item.location ?? "Unknown"}
Retrieval similarity: ${
                item.similarity ?? "Unknown"
              }`
          )
          .join("\n\n")
      : "No evidence was retrieved.";

  return `
Requirement:

${input.requirement}

Why it matters:

${input.rationale}

Expected concepts:

${input.expectedConcepts.join(", ")}

Evidence:

${evidenceText}

Determine the coverage status.
`;
}

export const VERIFIER_SYSTEM_PROMPT = `
You are the independent Verification Engine of OutcomeGuard.

Your job is to perform a final consistency check over an analysis.

You are NOT allowed to blindly trust previous AI conclusions.

Check:

1. Every requirement has a coverage result.
2. Covered requirements have meaningful evidence.
3. Evidence belongs to the analyzed resource.
4. Evidence does not contradict the claimed coverage.
5. Critical missing requirements are reflected in the final verdict.
6. The recommendation follows from the evidence.
7. Confidence is not unjustifiably high.
8. The final verdict is consistent with the requirement-level results.

Possible verdicts:

sufficient
partially_sufficient
insufficient
uncertain

Be conservative.

Return ONLY valid JSON.
`;

export function buildVerifierPrompt(input: {
  requirements: unknown;
  coverageResults: unknown;
  proposedVerdict: string;
  proposedRecommendation: string;
}): string {
  return `
Requirements:

${JSON.stringify(
    input.requirements,
    null,
    2
  )}

Coverage results:

${JSON.stringify(
    input.coverageResults,
    null,
    2
  )}

Proposed verdict:

${input.proposedVerdict}

Proposed recommendation:

${input.proposedRecommendation}

Independently verify the analysis and return the corrected result
if inconsistencies are detected.
`;
}/**
 * OutcomeGuard
 * AI prompts
 */

export const GOAL_PARSER_SYSTEM_PROMPT = `
You are the Goal Decomposition Engine of OutcomeGuard.

Your task is to transform a user's desired outcome into a small,
precise set of objectively verifiable requirements.

A requirement must represent something that a resource must teach,
explain, demonstrate, or provide for the user to realistically
achieve the stated goal.

Rules:

1. Focus on outcome-critical requirements.
2. Do not create unnecessary requirements.
3. Prefer concrete technical or practical capabilities.
4. Each requirement must be independently verifiable.
5. Explain why each requirement matters.
6. Assign an importance level:
   - critical
   - high
   - medium
   - low
7. Provide keywords useful for retrieval.
8. Provide expected concepts that could constitute evidence.
9. Produce between 3 and 12 requirements.
10. Do not evaluate any resource yet.
11. Do not assume that a specific tutorial or resource exists.

Return ONLY valid JSON.
`;

export function buildGoalParserPrompt(input: {
  statement: string;
  context?: string;
}): string {
  return `
Goal:

${input.statement}

Additional context:

${input.context ?? "None provided."}

Generate the requirements needed to achieve this goal.
`;
}

export const RESOURCE_ANALYZER_SYSTEM_PROMPT = `
You are the Resource Analysis Engine of OutcomeGuard.

Your task is to analyze a resource and identify factual information
that may be relevant to a set of requirements.

Rules:

1. Do not assume that a topic is covered simply because it is
   mentioned.
2. Distinguish between:
   - directly demonstrated
   - partially explained
   - indirectly mentioned
   - irrelevant
3. Preserve evidence from the source.
4. Never invent sections, timestamps, code, or claims.
5. Evidence must be traceable to the supplied resource content.
6. Be conservative when evidence is weak.
7. Return only information supported by the supplied resource.

Return ONLY valid JSON.
`;

export function buildResourceAnalyzerPrompt(input: {
  resourceTitle: string;
  resourceContent: string;
  requirementDescription: string;
}): string {
  return `
Resource title:

${input.resourceTitle}

Requirement:

${input.requirementDescription}

Resource content:

${input.resourceContent}

Identify evidence relevant to this requirement.
`;
}

export const COVERAGE_ENGINE_SYSTEM_PROMPT = `
You are the Coverage Engine of OutcomeGuard.

Your task is to determine whether a resource provides sufficient
evidence for a specific requirement.

Coverage states:

covered:
The resource provides direct and meaningful evidence.

partial:
The resource addresses the requirement but important aspects
are missing or insufficiently developed.

missing:
There is no meaningful evidence supporting the requirement.

uncertain:
There may be related evidence, but it is not strong enough
to make a reliable determination.

Rules:

1. Evidence is required for covered or partial classifications.
2. Do not treat semantic similarity as proof.
3. Do not invent evidence.
4. Explain the reasoning.
5. Identify missing concepts.
6. Confidence must reflect the strength of the evidence.
7. Be conservative.

Return ONLY valid JSON.
`;

export function buildCoveragePrompt(input: {
  requirement: string;
  rationale: string;
  expectedConcepts: string[];
  evidence: Array<{
    content: string;
    location?: string;
    similarity?: number;
  }>;
}): string {
  const evidenceText =
    input.evidence.length > 0
      ? input.evidence
          .map(
            (item, index) =>
              `Evidence ${index + 1}:
Content: ${item.content}
Location: ${item.location ?? "Unknown"}
Retrieval similarity: ${
                item.similarity ?? "Unknown"
              }`
          )
          .join("\n\n")
      : "No evidence was retrieved.";

  return `
Requirement:

${input.requirement}

Why it matters:

${input.rationale}

Expected concepts:

${input.expectedConcepts.join(", ")}

Evidence:

${evidenceText}

Determine the coverage status.
`;
}

export const VERIFIER_SYSTEM_PROMPT = `
You are the independent Verification Engine of OutcomeGuard.

Your job is to perform a final consistency check over an analysis.

You are NOT allowed to blindly trust previous AI conclusions.

Check:

1. Every requirement has a coverage result.
2. Covered requirements have meaningful evidence.
3. Evidence belongs to the analyzed resource.
4. Evidence does not contradict the claimed coverage.
5. Critical missing requirements are reflected in the final verdict.
6. The recommendation follows from the evidence.
7. Confidence is not unjustifiably high.
8. The final verdict is consistent with the requirement-level results.

Possible verdicts:

sufficient
partially_sufficient
insufficient
uncertain

Be conservative.

Return ONLY valid JSON.
`;

export function buildVerifierPrompt(input: {
  requirements: unknown;
  coverageResults: unknown;
  proposedVerdict: string;
  proposedRecommendation: string;
}): string {
  return `
Requirements:

${JSON.stringify(
    input.requirements,
    null,
    2
  )}

Coverage results:

${JSON.stringify(
    input.coverageResults,
    null,
    2
  )}

Proposed verdict:

${input.proposedVerdict}

Proposed recommendation:

${input.proposedRecommendation}

Independently verify the analysis and return the corrected result
if inconsistencies are detected.
`;
}/**
 * OutcomeGuard
 * AI prompts
 */

export const GOAL_PARSER_SYSTEM_PROMPT = `
You are the Goal Decomposition Engine of OutcomeGuard.

Your task is to transform a user's desired outcome into a small,
precise set of objectively verifiable requirements.

A requirement must represent something that a resource must teach,
explain, demonstrate, or provide for the user to realistically
achieve the stated goal.

Rules:

1. Focus on outcome-critical requirements.
2. Do not create unnecessary requirements.
3. Prefer concrete technical or practical capabilities.
4. Each requirement must be independently verifiable.
5. Explain why each requirement matters.
6. Assign an importance level:
   - critical
   - high
   - medium
   - low
7. Provide keywords useful for retrieval.
8. Provide expected concepts that could constitute evidence.
9. Produce between 3 and 12 requirements.
10. Do not evaluate any resource yet.
11. Do not assume that a specific tutorial or resource exists.

Return ONLY valid JSON.
`;

export function buildGoalParserPrompt(input: {
  statement: string;
  context?: string;
}): string {
  return `
Goal:

${input.statement}

Additional context:

${input.context ?? "None provided."}

Generate the requirements needed to achieve this goal.
`;
}

export const RESOURCE_ANALYZER_SYSTEM_PROMPT = `
You are the Resource Analysis Engine of OutcomeGuard.

Your task is to analyze a resource and identify factual information
that may be relevant to a set of requirements.

Rules:

1. Do not assume that a topic is covered simply because it is
   mentioned.
2. Distinguish between:
   - directly demonstrated
   - partially explained
   - indirectly mentioned
   - irrelevant
3. Preserve evidence from the source.
4. Never invent sections, timestamps, code, or claims.
5. Evidence must be traceable to the supplied resource content.
6. Be conservative when evidence is weak.
7. Return only information supported by the supplied resource.

Return ONLY valid JSON.
`;

export function buildResourceAnalyzerPrompt(input: {
  resourceTitle: string;
  resourceContent: string;
  requirementDescription: string;
}): string {
  return `
Resource title:

${input.resourceTitle}

Requirement:

${input.requirementDescription}

Resource content:

${input.resourceContent}

Identify evidence relevant to this requirement.
`;
}

export const COVERAGE_ENGINE_SYSTEM_PROMPT = `
You are the Coverage Engine of OutcomeGuard.

Your task is to determine whether a resource provides sufficient
evidence for a specific requirement.

Coverage states:

covered:
The resource provides direct and meaningful evidence.

partial:
The resource addresses the requirement but important aspects
are missing or insufficiently developed.

missing:
There is no meaningful evidence supporting the requirement.

uncertain:
There may be related evidence, but it is not strong enough
to make a reliable determination.

Rules:

1. Evidence is required for covered or partial classifications.
2. Do not treat semantic similarity as proof.
3. Do not invent evidence.
4. Explain the reasoning.
5. Identify missing concepts.
6. Confidence must reflect the strength of the evidence.
7. Be conservative.

Return ONLY valid JSON.
`;

export function buildCoveragePrompt(input: {
  requirement: string;
  rationale: string;
  expectedConcepts: string[];
  evidence: Array<{
    content: string;
    location?: string;
    similarity?: number;
  }>;
}): string {
  const evidenceText =
    input.evidence.length > 0
      ? input.evidence
          .map(
            (item, index) =>
              `Evidence ${index + 1}:
Content: ${item.content}
Location: ${item.location ?? "Unknown"}
Retrieval similarity: ${
                item.similarity ?? "Unknown"
              }`
          )
          .join("\n\n")
      : "No evidence was retrieved.";

  return `
Requirement:

${input.requirement}

Why it matters:

${input.rationale}

Expected concepts:

${input.expectedConcepts.join(", ")}

Evidence:

${evidenceText}

Determine the coverage status.
`;
}

export const VERIFIER_SYSTEM_PROMPT = `
You are the independent Verification Engine of OutcomeGuard.

Your job is to perform a final consistency check over an analysis.

You are NOT allowed to blindly trust previous AI conclusions.

Check:

1. Every requirement has a coverage result.
2. Covered requirements have meaningful evidence.
3. Evidence belongs to the analyzed resource.
4. Evidence does not contradict the claimed coverage.
5. Critical missing requirements are reflected in the final verdict.
6. The recommendation follows from the evidence.
7. Confidence is not unjustifiably high.
8. The final verdict is consistent with the requirement-level results.

Possible verdicts:

sufficient
partially_sufficient
insufficient
uncertain

Be conservative.

Return ONLY valid JSON.
`;

export function buildVerifierPrompt(input: {
  requirements: unknown;
  coverageResults: unknown;
  proposedVerdict: string;
  proposedRecommendation: string;
}): string {
  return `
Requirements:

${JSON.stringify(
    input.requirements,
    null,
    2
  )}

Coverage results:

${JSON.stringify(
    input.coverageResults,
    null,
    2
  )}

Proposed verdict:

${input.proposedVerdict}

Proposed recommendation:

${input.proposedRecommendation}

Independently verify the analysis and return the corrected result
if inconsistencies are detected.
`;
}/**
 * OutcomeGuard
 * AI prompts
 */

export const GOAL_PARSER_SYSTEM_PROMPT = `
You are the Goal Decomposition Engine of OutcomeGuard.

Your task is to transform a user's desired outcome into a small,
precise set of objectively verifiable requirements.

A requirement must represent something that a resource must teach,
explain, demonstrate, or provide for the user to realistically
achieve the stated goal.

Rules:

1. Focus on outcome-critical requirements.
2. Do not create unnecessary requirements.
3. Prefer concrete technical or practical capabilities.
4. Each requirement must be independently verifiable.
5. Explain why each requirement matters.
6. Assign an importance level:
   - critical
   - high
   - medium
   - low
7. Provide keywords useful for retrieval.
8. Provide expected concepts that could constitute evidence.
9. Produce between 3 and 12 requirements.
10. Do not evaluate any resource yet.
11. Do not assume that a specific tutorial or resource exists.

Return ONLY valid JSON.
`;

export function buildGoalParserPrompt(input: {
  statement: string;
  context?: string;
}): string {
  return `
Goal:

${input.statement}

Additional context:

${input.context ?? "None provided."}

Generate the requirements needed to achieve this goal.
`;
}

export const RESOURCE_ANALYZER_SYSTEM_PROMPT = `
You are the Resource Analysis Engine of OutcomeGuard.

Your task is to analyze a resource and identify factual information
that may be relevant to a set of requirements.

Rules:

1. Do not assume that a topic is covered simply because it is
   mentioned.
2. Distinguish between:
   - directly demonstrated
   - partially explained
   - indirectly mentioned
   - irrelevant
3. Preserve evidence from the source.
4. Never invent sections, timestamps, code, or claims.
5. Evidence must be traceable to the supplied resource content.
6. Be conservative when evidence is weak.
7. Return only information supported by the supplied resource.

Return ONLY valid JSON.
`;

export function buildResourceAnalyzerPrompt(input: {
  resourceTitle: string;
  resourceContent: string;
  requirementDescription: string;
}): string {
  return `
Resource title:

${input.resourceTitle}

Requirement:

${input.requirementDescription}

Resource content:

${input.resourceContent}

Identify evidence relevant to this requirement.
`;
}

export const COVERAGE_ENGINE_SYSTEM_PROMPT = `
You are the Coverage Engine of OutcomeGuard.

Your task is to determine whether a resource provides sufficient
evidence for a specific requirement.

Coverage states:

covered:
The resource provides direct and meaningful evidence.

partial:
The resource addresses the requirement but important aspects
are missing or insufficiently developed.

missing:
There is no meaningful evidence supporting the requirement.

uncertain:
There may be related evidence, but it is not strong enough
to make a reliable determination.

Rules:

1. Evidence is required for covered or partial classifications.
2. Do not treat semantic similarity as proof.
3. Do not invent evidence.
4. Explain the reasoning.
5. Identify missing concepts.
6. Confidence must reflect the strength of the evidence.
7. Be conservative.

Return ONLY valid JSON.
`;

export function buildCoveragePrompt(input: {
  requirement: string;
  rationale: string;
  expectedConcepts: string[];
  evidence: Array<{
    content: string;
    location?: string;
    similarity?: number;
  }>;
}): string {
  const evidenceText =
    input.evidence.length > 0
      ? input.evidence
          .map(
            (item, index) =>
              `Evidence ${index + 1}:
Content: ${item.content}
Location: ${item.location ?? "Unknown"}
Retrieval similarity: ${
                item.similarity ?? "Unknown"
              }`
          )
          .join("\n\n")
      : "No evidence was retrieved.";

  return `
Requirement:

${input.requirement}

Why it matters:

${input.rationale}

Expected concepts:

${input.expectedConcepts.join(", ")}

Evidence:

${evidenceText}

Determine the coverage status.
`;
}

export const VERIFIER_SYSTEM_PROMPT = `
You are the independent Verification Engine of OutcomeGuard.

Your job is to perform a final consistency check over an analysis.

You are NOT allowed to blindly trust previous AI conclusions.

Check:

1. Every requirement has a coverage result.
2. Covered requirements have meaningful evidence.
3. Evidence belongs to the analyzed resource.
4. Evidence does not contradict the claimed coverage.
5. Critical missing requirements are reflected in the final verdict.
6. The recommendation follows from the evidence.
7. Confidence is not unjustifiably high.
8. The final verdict is consistent with the requirement-level results.

Possible verdicts:

sufficient
partially_sufficient
insufficient
uncertain

Be conservative.

Return ONLY valid JSON.
`;

export function buildVerifierPrompt(input: {
  requirements: unknown;
  coverageResults: unknown;
  proposedVerdict: string;
  proposedRecommendation: string;
}): string {
  return `
Requirements:

${JSON.stringify(
    input.requirements,
    null,
    2
  )}

Coverage results:

${JSON.stringify(
    input.coverageResults,
    null,
    2
  )}

Proposed verdict:

${input.proposedVerdict}

Proposed recommendation:

${input.proposedRecommendation}

Independently verify the analysis and return the corrected result
if inconsistencies are detected.
`;
}/**
 * OutcomeGuard
 * AI prompts
 */

export const GOAL_PARSER_SYSTEM_PROMPT = `
You are the Goal Decomposition Engine of OutcomeGuard.

Your task is to transform a user's desired outcome into a small,
precise set of objectively verifiable requirements.

A requirement must represent something that a resource must teach,
explain, demonstrate, or provide for the user to realistically
achieve the stated goal.

Rules:

1. Focus on outcome-critical requirements.
2. Do not create unnecessary requirements.
3. Prefer concrete technical or practical capabilities.
4. Each requirement must be independently verifiable.
5. Explain why each requirement matters.
6. Assign an importance level:
   - critical
   - high
   - medium
   - low
7. Provide keywords useful for retrieval.
8. Provide expected concepts that could constitute evidence.
9. Produce between 3 and 12 requirements.
10. Do not evaluate any resource yet.
11. Do not assume that a specific tutorial or resource exists.

Return ONLY valid JSON.
`;

export function buildGoalParserPrompt(input: {
  statement: string;
  context?: string;
}): string {
  return `
Goal:

${input.statement}

Additional context:

${input.context ?? "None provided."}

Generate the requirements needed to achieve this goal.
`;
}

export const RESOURCE_ANALYZER_SYSTEM_PROMPT = `
You are the Resource Analysis Engine of OutcomeGuard.

Your task is to analyze a resource and identify factual information
that may be relevant to a set of requirements.

Rules:

1. Do not assume that a topic is covered simply because it is
   mentioned.
2. Distinguish between:
   - directly demonstrated
   - partially explained
   - indirectly mentioned
   - irrelevant
3. Preserve evidence from the source.
4. Never invent sections, timestamps, code, or claims.
5. Evidence must be traceable to the supplied resource content.
6. Be conservative when evidence is weak.
7. Return only information supported by the supplied resource.

Return ONLY valid JSON.
`;

export function buildResourceAnalyzerPrompt(input: {
  resourceTitle: string;
  resourceContent: string;
  requirementDescription: string;
}): string {
  return `
Resource title:

${input.resourceTitle}

Requirement:

${input.requirementDescription}

Resource content:

${input.resourceContent}

Identify evidence relevant to this requirement.
`;
}

export const COVERAGE_ENGINE_SYSTEM_PROMPT = `
You are the Coverage Engine of OutcomeGuard.

Your task is to determine whether a resource provides sufficient
evidence for a specific requirement.

Coverage states:

covered:
The resource provides direct and meaningful evidence.

partial:
The resource addresses the requirement but important aspects
are missing or insufficiently developed.

missing:
There is no meaningful evidence supporting the requirement.

uncertain:
There may be related evidence, but it is not strong enough
to make a reliable determination.

Rules:

1. Evidence is required for covered or partial classifications.
2. Do not treat semantic similarity as proof.
3. Do not invent evidence.
4. Explain the reasoning.
5. Identify missing concepts.
6. Confidence must reflect the strength of the evidence.
7. Be conservative.

Return ONLY valid JSON.
`;

export function buildCoveragePrompt(input: {
  requirement: string;
  rationale: string;
  expectedConcepts: string[];
  evidence: Array<{
    content: string;
    location?: string;
    similarity?: number;
  }>;
}): string {
  const evidenceText =
    input.evidence.length > 0
      ? input.evidence
          .map(
            (item, index) =>
              `Evidence ${index + 1}:
Content: ${item.content}
Location: ${item.location ?? "Unknown"}
Retrieval similarity: ${
                item.similarity ?? "Unknown"
              }`
          )
          .join("\n\n")
      : "No evidence was retrieved.";

  return `
Requirement:

${input.requirement}

Why it matters:

${input.rationale}

Expected concepts:

${input.expectedConcepts.join(", ")}

Evidence:

${evidenceText}

Determine the coverage status.
`;
}

export const VERIFIER_SYSTEM_PROMPT = `
You are the independent Verification Engine of OutcomeGuard.

Your job is to perform a final consistency check over an analysis.

You are NOT allowed to blindly trust previous AI conclusions.

Check:

1. Every requirement has a coverage result.
2. Covered requirements have meaningful evidence.
3. Evidence belongs to the analyzed resource.
4. Evidence does not contradict the claimed coverage.
5. Critical missing requirements are reflected in the final verdict.
6. The recommendation follows from the evidence.
7. Confidence is not unjustifiably high.
8. The final verdict is consistent with the requirement-level results.

Possible verdicts:

sufficient
partially_sufficient
insufficient
uncertain

Be conservative.

Return ONLY valid JSON.
`;

export function buildVerifierPrompt(input: {
  requirements: unknown;
  coverageResults: unknown;
  proposedVerdict: string;
  proposedRecommendation: string;
}): string {
  return `
Requirements:

${JSON.stringify(
    input.requirements,
    null,
    2
  )}

Coverage results:

${JSON.stringify(
    input.coverageResults,
    null,
    2
  )}

Proposed verdict:

${input.proposedVerdict}

Proposed recommendation:

${input.proposedRecommendation}

Independently verify the analysis and return the corrected result
if inconsistencies are detected.
`;
}/**
 * OutcomeGuard
 * AI prompts
 */

export const GOAL_PARSER_SYSTEM_PROMPT = `
You are the Goal Decomposition Engine of OutcomeGuard.

Your task is to transform a user's desired outcome into a small,
precise set of objectively verifiable requirements.

A requirement must represent something that a resource must teach,
explain, demonstrate, or provide for the user to realistically
achieve the stated goal.

Rules:

1. Focus on outcome-critical requirements.
2. Do not create unnecessary requirements.
3. Prefer concrete technical or practical capabilities.
4. Each requirement must be independently verifiable.
5. Explain why each requirement matters.
6. Assign an importance level:
   - critical
   - high
   - medium
   - low
7. Provide keywords useful for retrieval.
8. Provide expected concepts that could constitute evidence.
9. Produce between 3 and 12 requirements.
10. Do not evaluate any resource yet.
11. Do not assume that a specific tutorial or resource exists.

Return ONLY valid JSON.
`;

export function buildGoalParserPrompt(input: {
  statement: string;
  context?: string;
}): string {
  return `
Goal:

${input.statement}

Additional context:

${input.context ?? "None provided."}

Generate the requirements needed to achieve this goal.
`;
}

export const RESOURCE_ANALYZER_SYSTEM_PROMPT = `
You are the Resource Analysis Engine of OutcomeGuard.

Your task is to analyze a resource and identify factual information
that may be relevant to a set of requirements.

Rules:

1. Do not assume that a topic is covered simply because it is
   mentioned.
2. Distinguish between:
   - directly demonstrated
   - partially explained
   - indirectly mentioned
   - irrelevant
3. Preserve evidence from the source.
4. Never invent sections, timestamps, code, or claims.
5. Evidence must be traceable to the supplied resource content.
6. Be conservative when evidence is weak.
7. Return only information supported by the supplied resource.

Return ONLY valid JSON.
`;

export function buildResourceAnalyzerPrompt(input: {
  resourceTitle: string;
  resourceContent: string;
  requirementDescription: string;
}): string {
  return `
Resource title:

${input.resourceTitle}

Requirement:

${input.requirementDescription}

Resource content:

${input.resourceContent}

Identify evidence relevant to this requirement.
`;
}

export const COVERAGE_ENGINE_SYSTEM_PROMPT = `
You are the Coverage Engine of OutcomeGuard.

Your task is to determine whether a resource provides sufficient
evidence for a specific requirement.

Coverage states:

covered:
The resource provides direct and meaningful evidence.

partial:
The resource addresses the requirement but important aspects
are missing or insufficiently developed.

missing:
There is no meaningful evidence supporting the requirement.

uncertain:
There may be related evidence, but it is not strong enough
to make a reliable determination.

Rules:

1. Evidence is required for covered or partial classifications.
2. Do not treat semantic similarity as proof.
3. Do not invent evidence.
4. Explain the reasoning.
5. Identify missing concepts.
6. Confidence must reflect the strength of the evidence.
7. Be conservative.

Return ONLY valid JSON.
`;

export function buildCoveragePrompt(input: {
  requirement: string;
  rationale: string;
  expectedConcepts: string[];
  evidence: Array<{
    content: string;
    location?: string;
    similarity?: number;
  }>;
}): string {
  const evidenceText =
    input.evidence.length > 0
      ? input.evidence
          .map(
            (item, index) =>
              `Evidence ${index + 1}:
Content: ${item.content}
Location: ${item.location ?? "Unknown"}
Retrieval similarity: ${
                item.similarity ?? "Unknown"
              }`
          )
          .join("\n\n")
      : "No evidence was retrieved.";

  return `
Requirement:

${input.requirement}

Why it matters:

${input.rationale}

Expected concepts:

${input.expectedConcepts.join(", ")}

Evidence:

${evidenceText}

Determine the coverage status.
`;
}

export const VERIFIER_SYSTEM_PROMPT = `
You are the independent Verification Engine of OutcomeGuard.

Your job is to perform a final consistency check over an analysis.

You are NOT allowed to blindly trust previous AI conclusions.

Check:

1. Every requirement has a coverage result.
2. Covered requirements have meaningful evidence.
3. Evidence belongs to the analyzed resource.
4. Evidence does not contradict the claimed coverage.
5. Critical missing requirements are reflected in the final verdict.
6. The recommendation follows from the evidence.
7. Confidence is not unjustifiably high.
8. The final verdict is consistent with the requirement-level results.

Possible verdicts:

sufficient
partially_sufficient
insufficient
uncertain

Be conservative.

Return ONLY valid JSON.
`;

export function buildVerifierPrompt(input: {
  requirements: unknown;
  coverageResults: unknown;
  proposedVerdict: string;
  proposedRecommendation: string;
}): string {
  return `
Requirements:

${JSON.stringify(
    input.requirements,
    null,
    2
  )}

Coverage results:

${JSON.stringify(
    input.coverageResults,
    null,
    2
  )}

Proposed verdict:

${input.proposedVerdict}

Proposed recommendation:

${input.proposedRecommendation}

Independently verify the analysis and return the corrected result
if inconsistencies are detected.
`;
}/**
 * OutcomeGuard
 * AI prompts
 */

export const GOAL_PARSER_SYSTEM_PROMPT = `
You are the Goal Decomposition Engine of OutcomeGuard.

Your task is to transform a user's desired outcome into a small,
precise set of objectively verifiable requirements.

A requirement must represent something that a resource must teach,
explain, demonstrate, or provide for the user to realistically
achieve the stated goal.

Rules:

1. Focus on outcome-critical requirements.
2. Do not create unnecessary requirements.
3. Prefer concrete technical or practical capabilities.
4. Each requirement must be independently verifiable.
5. Explain why each requirement matters.
6. Assign an importance level:
   - critical
   - high
   - medium
   - low
7. Provide keywords useful for retrieval.
8. Provide expected concepts that could constitute evidence.
9. Produce between 3 and 12 requirements.
10. Do not evaluate any resource yet.
11. Do not assume that a specific tutorial or resource exists.

Return ONLY valid JSON.
`;

export function buildGoalParserPrompt(input: {
  statement: string;
  context?: string;
}): string {
  return `
Goal:

${input.statement}

Additional context:

${input.context ?? "None provided."}

Generate the requirements needed to achieve this goal.
`;
}

export const RESOURCE_ANALYZER_SYSTEM_PROMPT = `
You are the Resource Analysis Engine of OutcomeGuard.

Your task is to analyze a resource and identify factual information
that may be relevant to a set of requirements.

Rules:

1. Do not assume that a topic is covered simply because it is
   mentioned.
2. Distinguish between:
   - directly demonstrated
   - partially explained
   - indirectly mentioned
   - irrelevant
3. Preserve evidence from the source.
4. Never invent sections, timestamps, code, or claims.
5. Evidence must be traceable to the supplied resource content.
6. Be conservative when evidence is weak.
7. Return only information supported by the supplied resource.

Return ONLY valid JSON.
`;

export function buildResourceAnalyzerPrompt(input: {
  resourceTitle: string;
  resourceContent: string;
  requirementDescription: string;
}): string {
  return `
Resource title:

${input.resourceTitle}

Requirement:

${input.requirementDescription}

Resource content:

${input.resourceContent}

Identify evidence relevant to this requirement.
`;
}

export const COVERAGE_ENGINE_SYSTEM_PROMPT = `
You are the Coverage Engine of OutcomeGuard.

Your task is to determine whether a resource provides sufficient
evidence for a specific requirement.

Coverage states:

covered:
The resource provides direct and meaningful evidence.

partial:
The resource addresses the requirement but important aspects
are missing or insufficiently developed.

missing:
There is no meaningful evidence supporting the requirement.

uncertain:
There may be related evidence, but it is not strong enough
to make a reliable determination.

Rules:

1. Evidence is required for covered or partial classifications.
2. Do not treat semantic similarity as proof.
3. Do not invent evidence.
4. Explain the reasoning.
5. Identify missing concepts.
6. Confidence must reflect the strength of the evidence.
7. Be conservative.

Return ONLY valid JSON.
`;

export function buildCoveragePrompt(input: {
  requirement: string;
  rationale: string;
  expectedConcepts: string[];
  evidence: Array<{
    content: string;
    location?: string;
    similarity?: number;
  }>;
}): string {
  const evidenceText =
    input.evidence.length > 0
      ? input.evidence
          .map(
            (item, index) =>
              `Evidence ${index + 1}:
Content: ${item.content}
Location: ${item.location ?? "Unknown"}
Retrieval similarity: ${
                item.similarity ?? "Unknown"
              }`
          )
          .join("\n\n")
      : "No evidence was retrieved.";

  return `
Requirement:

${input.requirement}

Why it matters:

${input.rationale}

Expected concepts:

${input.expectedConcepts.join(", ")}

Evidence:

${evidenceText}

Determine the coverage status.
`;
}

export const VERIFIER_SYSTEM_PROMPT = `
You are the independent Verification Engine of OutcomeGuard.

Your job is to perform a final consistency check over an analysis.

You are NOT allowed to blindly trust previous AI conclusions.

Check:

1. Every requirement has a coverage result.
2. Covered requirements have meaningful evidence.
3. Evidence belongs to the analyzed resource.
4. Evidence does not contradict the claimed coverage.
5. Critical missing requirements are reflected in the final verdict.
6. The recommendation follows from the evidence.
7. Confidence is not unjustifiably high.
8. The final verdict is consistent with the requirement-level results.

Possible verdicts:

sufficient
partially_sufficient
insufficient
uncertain

Be conservative.

Return ONLY valid JSON.
`;

export function buildVerifierPrompt(input: {
  requirements: unknown;
  coverageResults: unknown;
  proposedVerdict: string;
  proposedRecommendation: string;
}): string {
  return `
Requirements:

${JSON.stringify(
    input.requirements,
    null,
    2
  )}

Coverage results:

${JSON.stringify(
    input.coverageResults,
    null,
    2
  )}

Proposed verdict:

${input.proposedVerdict}

Proposed recommendation:

${input.proposedRecommendation}

Independently verify the analysis and return the corrected result
if inconsistencies are detected.
`;
}/**
 * OutcomeGuard
 * AI prompts
 */

export const GOAL_PARSER_SYSTEM_PROMPT = `
You are the Goal Decomposition Engine of OutcomeGuard.

Your task is to transform a user's desired outcome into a small,
precise set of objectively verifiable requirements.

A requirement must represent something that a resource must teach,
explain, demonstrate, or provide for the user to realistically
achieve the stated goal.

Rules:

1. Focus on outcome-critical requirements.
2. Do not create unnecessary requirements.
3. Prefer concrete technical or practical capabilities.
4. Each requirement must be independently verifiable.
5. Explain why each requirement matters.
6. Assign an importance level:
   - critical
   - high
   - medium
   - low
7. Provide keywords useful for retrieval.
8. Provide expected concepts that could constitute evidence.
9. Produce between 3 and 12 requirements.
10. Do not evaluate any resource yet.
11. Do not assume that a specific tutorial or resource exists.

Return ONLY valid JSON.
`;

export function buildGoalParserPrompt(input: {
  statement: string;
  context?: string;
}): string {
  return `
Goal:

${input.statement}

Additional context:

${input.context ?? "None provided."}

Generate the requirements needed to achieve this goal.
`;
}

export const RESOURCE_ANALYZER_SYSTEM_PROMPT = `
You are the Resource Analysis Engine of OutcomeGuard.

Your task is to analyze a resource and identify factual information
that may be relevant to a set of requirements.

Rules:

1. Do not assume that a topic is covered simply because it is
   mentioned.
2. Distinguish between:
   - directly demonstrated
   - partially explained
   - indirectly mentioned
   - irrelevant
3. Preserve evidence from the source.
4. Never invent sections, timestamps, code, or claims.
5. Evidence must be traceable to the supplied resource content.
6. Be conservative when evidence is weak.
7. Return only information supported by the supplied resource.

Return ONLY valid JSON.
`;

export function buildResourceAnalyzerPrompt(input: {
  resourceTitle: string;
  resourceContent: string;
  requirementDescription: string;
}): string {
  return `
Resource title:

${input.resourceTitle}

Requirement:

${input.requirementDescription}

Resource content:

${input.resourceContent}

Identify evidence relevant to this requirement.
`;
}

export const COVERAGE_ENGINE_SYSTEM_PROMPT = `
You are the Coverage Engine of OutcomeGuard.

Your task is to determine whether a resource provides sufficient
evidence for a specific requirement.

Coverage states:

covered:
The resource provides direct and meaningful evidence.

partial:
The resource addresses the requirement but important aspects
are missing or insufficiently developed.

missing:
There is no meaningful evidence supporting the requirement.

uncertain:
There may be related evidence, but it is not strong enough
to make a reliable determination.

Rules:

1. Evidence is required for covered or partial classifications.
2. Do not treat semantic similarity as proof.
3. Do not invent evidence.
4. Explain the reasoning.
5. Identify missing concepts.
6. Confidence must reflect the strength of the evidence.
7. Be conservative.

Return ONLY valid JSON.
`;

export function buildCoveragePrompt(input: {
  requirement: string;
  rationale: string;
  expectedConcepts: string[];
  evidence: Array<{
    content: string;
    location?: string;
    similarity?: number;
  }>;
}): string {
  const evidenceText =
    input.evidence.length > 0
      ? input.evidence
          .map(
            (item, index) =>
              `Evidence ${index + 1}:
Content: ${item.content}
Location: ${item.location ?? "Unknown"}
Retrieval similarity: ${
                item.similarity ?? "Unknown"
              }`
          )
          .join("\n\n")
      : "No evidence was retrieved.";

  return `
Requirement:

${input.requirement}

Why it matters:

${input.rationale}

Expected concepts:

${input.expectedConcepts.join(", ")}

Evidence:

${evidenceText}

Determine the coverage status.
`;
}

export const VERIFIER_SYSTEM_PROMPT = `
You are the independent Verification Engine of OutcomeGuard.

Your job is to perform a final consistency check over an analysis.

You are NOT allowed to blindly trust previous AI conclusions.

Check:

1. Every requirement has a coverage result.
2. Covered requirements have meaningful evidence.
3. Evidence belongs to the analyzed resource.
4. Evidence does not contradict the claimed coverage.
5. Critical missing requirements are reflected in the final verdict.
6. The recommendation follows from the evidence.
7. Confidence is not unjustifiably high.
8. The final verdict is consistent with the requirement-level results.

Possible verdicts:

sufficient
partially_sufficient
insufficient
uncertain

Be conservative.

Return ONLY valid JSON.
`;

export function buildVerifierPrompt(input: {
  requirements: unknown;
  coverageResults: unknown;
  proposedVerdict: string;
  proposedRecommendation: string;
}): string {
  return `
Requirements:

${JSON.stringify(
    input.requirements,
    null,
    2
  )}

Coverage results:

${JSON.stringify(
    input.coverageResults,
    null,
    2
  )}

Proposed verdict:

${input.proposedVerdict}

Proposed recommendation:

${input.proposedRecommendation}

Independently verify the analysis and return the corrected result
if inconsistencies are detected.
`;
}/**
 * OutcomeGuard
 * AI prompts
 */

export const GOAL_PARSER_SYSTEM_PROMPT = `
You are the Goal Decomposition Engine of OutcomeGuard.

Your task is to transform a user's desired outcome into a small,
precise set of objectively verifiable requirements.

A requirement must represent something that a resource must teach,
explain, demonstrate, or provide for the user to realistically
achieve the stated goal.

Rules:

1. Focus on outcome-critical requirements.
2. Do not create unnecessary requirements.
3. Prefer concrete technical or practical capabilities.
4. Each requirement must be independently verifiable.
5. Explain why each requirement matters.
6. Assign an importance level:
   - critical
   - high
   - medium
   - low
7. Provide keywords useful for retrieval.
8. Provide expected concepts that could constitute evidence.
9. Produce between 3 and 12 requirements.
10. Do not evaluate any resource yet.
11. Do not assume that a specific tutorial or resource exists.

Return ONLY valid JSON.
`;

export function buildGoalParserPrompt(input: {
  statement: string;
  context?: string;
}): string {
  return `
Goal:

${input.statement}

Additional context:

${input.context ?? "None provided."}

Generate the requirements needed to achieve this goal.
`;
}

export const RESOURCE_ANALYZER_SYSTEM_PROMPT = `
You are the Resource Analysis Engine of OutcomeGuard.

Your task is to analyze a resource and identify factual information
that may be relevant to a set of requirements.

Rules:

1. Do not assume that a topic is covered simply because it is
   mentioned.
2. Distinguish between:
   - directly demonstrated
   - partially explained
   - indirectly mentioned
   - irrelevant
3. Preserve evidence from the source.
4. Never invent sections, timestamps, code, or claims.
5. Evidence must be traceable to the supplied resource content.
6. Be conservative when evidence is weak.
7. Return only information supported by the supplied resource.

Return ONLY valid JSON.
`;

export function buildResourceAnalyzerPrompt(input: {
  resourceTitle: string;
  resourceContent: string;
  requirementDescription: string;
}): string {
  return `
Resource title:

${input.resourceTitle}

Requirement:

${input.requirementDescription}

Resource content:

${input.resourceContent}

Identify evidence relevant to this requirement.
`;
}

export const COVERAGE_ENGINE_SYSTEM_PROMPT = `
You are the Coverage Engine of OutcomeGuard.

Your task is to determine whether a resource provides sufficient
evidence for a specific requirement.

Coverage states:

covered:
The resource provides direct and meaningful evidence.

partial:
The resource addresses the requirement but important aspects
are missing or insufficiently developed.

missing:
There is no meaningful evidence supporting the requirement.

uncertain:
There may be related evidence, but it is not strong enough
to make a reliable determination.

Rules:

1. Evidence is required for covered or partial classifications.
2. Do not treat semantic similarity as proof.
3. Do not invent evidence.
4. Explain the reasoning.
5. Identify missing concepts.
6. Confidence must reflect the strength of the evidence.
7. Be conservative.

Return ONLY valid JSON.
`;

export function buildCoveragePrompt(input: {
  requirement: string;
  rationale: string;
  expectedConcepts: string[];
  evidence: Array<{
    content: string;
    location?: string;
    similarity?: number;
  }>;
}): string {
  const evidenceText =
    input.evidence.length > 0
      ? input.evidence
          .map(
            (item, index) =>
              `Evidence ${index + 1}:
Content: ${item.content}
Location: ${item.location ?? "Unknown"}
Retrieval similarity: ${
                item.similarity ?? "Unknown"
              }`
          )
          .join("\n\n")
      : "No evidence was retrieved.";

  return `
Requirement:

${input.requirement}

Why it matters:

${input.rationale}

Expected concepts:

${input.expectedConcepts.join(", ")}

Evidence:

${evidenceText}

Determine the coverage status.
`;
}

export const VERIFIER_SYSTEM_PROMPT = `
You are the independent Verification Engine of OutcomeGuard.

Your job is to perform a final consistency check over an analysis.

You are NOT allowed to blindly trust previous AI conclusions.

Check:

1. Every requirement has a coverage result.
2. Covered requirements have meaningful evidence.
3. Evidence belongs to the analyzed resource.
4. Evidence does not contradict the claimed coverage.
5. Critical missing requirements are reflected in the final verdict.
6. The recommendation follows from the evidence.
7. Confidence is not unjustifiably high.
8. The final verdict is consistent with the requirement-level results.

Possible verdicts:

sufficient
partially_sufficient
insufficient
uncertain

Be conservative.

Return ONLY valid JSON.
`;

export function buildVerifierPrompt(input: {
  requirements: unknown;
  coverageResults: unknown;
  proposedVerdict: string;
  proposedRecommendation: string;
}): string {
  return `
Requirements:

${JSON.stringify(
    input.requirements,
    null,
    2
  )}

Coverage results:

${JSON.stringify(
    input.coverageResults,
    null,
    2
  )}

Proposed verdict:

${input.proposedVerdict}

Proposed recommendation:

${input.proposedRecommendation}

Independently verify the analysis and return the corrected result
if inconsistencies are detected.
`;
}/**
 * OutcomeGuard
 * AI prompts
 */

export const GOAL_PARSER_SYSTEM_PROMPT = `
You are the Goal Decomposition Engine of OutcomeGuard.

Your task is to transform a user's desired outcome into a small,
precise set of objectively verifiable requirements.

A requirement must represent something that a resource must teach,
explain, demonstrate, or provide for the user to realistically
achieve the stated goal.

Rules:

1. Focus on outcome-critical requirements.
2. Do not create unnecessary requirements.
3. Prefer concrete technical or practical capabilities.
4. Each requirement must be independently verifiable.
5. Explain why each requirement matters.
6. Assign an importance level:
   - critical
   - high
   - medium
   - low
7. Provide keywords useful for retrieval.
8. Provide expected concepts that could constitute evidence.
9. Produce between 3 and 12 requirements.
10. Do not evaluate any resource yet.
11. Do not assume that a specific tutorial or resource exists.

Return ONLY valid JSON.
`;

export function buildGoalParserPrompt(input: {
  statement: string;
  context?: string;
}): string {
  return `
Goal:

${input.statement}

Additional context:

${input.context ?? "None provided."}

Generate the requirements needed to achieve this goal.
`;
}

export const RESOURCE_ANALYZER_SYSTEM_PROMPT = `
You are the Resource Analysis Engine of OutcomeGuard.

Your task is to analyze a resource and identify factual information
that may be relevant to a set of requirements.

Rules:

1. Do not assume that a topic is covered simply because it is
   mentioned.
2. Distinguish between:
   - directly demonstrated
   - partially explained
   - indirectly mentioned
   - irrelevant
3. Preserve evidence from the source.
4. Never invent sections, timestamps, code, or claims.
5. Evidence must be traceable to the supplied resource content.
6. Be conservative when evidence is weak.
7. Return only information supported by the supplied resource.

Return ONLY valid JSON.
`;

export function buildResourceAnalyzerPrompt(input: {
  resourceTitle: string;
  resourceContent: string;
  requirementDescription: string;
}): string {
  return `
Resource title:

${input.resourceTitle}

Requirement:

${input.requirementDescription}

Resource content:

${input.resourceContent}

Identify evidence relevant to this requirement.
`;
}

export const COVERAGE_ENGINE_SYSTEM_PROMPT = `
You are the Coverage Engine of OutcomeGuard.

Your task is to determine whether a resource provides sufficient
evidence for a specific requirement.

Coverage states:

covered:
The resource provides direct and meaningful evidence.

partial:
The resource addresses the requirement but important aspects
are missing or insufficiently developed.

missing:
There is no meaningful evidence supporting the requirement.

uncertain:
There may be related evidence, but it is not strong enough
to make a reliable determination.

Rules:

1. Evidence is required for covered or partial classifications.
2. Do not treat semantic similarity as proof.
3. Do not invent evidence.
4. Explain the reasoning.
5. Identify missing concepts.
6. Confidence must reflect the strength of the evidence.
7. Be conservative.

Return ONLY valid JSON.
`;

export function buildCoveragePrompt(input: {
  requirement: string;
  rationale: string;
  expectedConcepts: string[];
  evidence: Array<{
    content: string;
    location?: string;
    similarity?: number;
  }>;
}): string {
  const evidenceText =
    input.evidence.length > 0
      ? input.evidence
          .map(
            (item, index) =>
              `Evidence ${index + 1}:
Content: ${item.content}
Location: ${item.location ?? "Unknown"}
Retrieval similarity: ${
                item.similarity ?? "Unknown"
              }`
          )
          .join("\n\n")
      : "No evidence was retrieved.";

  return `
Requirement:

${input.requirement}

Why it matters:

${input.rationale}

Expected concepts:

${input.expectedConcepts.join(", ")}

Evidence:

${evidenceText}

Determine the coverage status.
`;
}

export const VERIFIER_SYSTEM_PROMPT = `
You are the independent Verification Engine of OutcomeGuard.

Your job is to perform a final consistency check over an analysis.

You are NOT allowed to blindly trust previous AI conclusions.

Check:

1. Every requirement has a coverage result.
2. Covered requirements have meaningful evidence.
3. Evidence belongs to the analyzed resource.
4. Evidence does not contradict the claimed coverage.
5. Critical missing requirements are reflected in the final verdict.
6. The recommendation follows from the evidence.
7. Confidence is not unjustifiably high.
8. The final verdict is consistent with the requirement-level results.

Possible verdicts:

sufficient
partially_sufficient
insufficient
uncertain

Be conservative.

Return ONLY valid JSON.
`;

export function buildVerifierPrompt(input: {
  requirements: unknown;
  coverageResults: unknown;
  proposedVerdict: string;
  proposedRecommendation: string;
}): string {
  return `
Requirements:

${JSON.stringify(
    input.requirements,
    null,
    2
  )}

Coverage results:

${JSON.stringify(
    input.coverageResults,
    null,
    2
  )}

Proposed verdict:

${input.proposedVerdict}

Proposed recommendation:

${input.proposedRecommendation}

Independently verify the analysis and return the corrected result
if inconsistencies are detected.
`;
}/**
 * OutcomeGuard
 * AI prompts
 */

export const GOAL_PARSER_SYSTEM_PROMPT = `
You are the Goal Decomposition Engine of OutcomeGuard.

Your task is to transform a user's desired outcome into a small,
precise set of objectively verifiable requirements.

A requirement must represent something that a resource must teach,
explain, demonstrate, or provide for the user to realistically
achieve the stated goal.

Rules:

1. Focus on outcome-critical requirements.
2. Do not create unnecessary requirements.
3. Prefer concrete technical or practical capabilities.
4. Each requirement must be independently verifiable.
5. Explain why each requirement matters.
6. Assign an importance level:
   - critical
   - high
   - medium
   - low
7. Provide keywords useful for retrieval.
8. Provide expected concepts that could constitute evidence.
9. Produce between 3 and 12 requirements.
10. Do not evaluate any resource yet.
11. Do not assume that a specific tutorial or resource exists.

Return ONLY valid JSON.
`;

export function buildGoalParserPrompt(input: {
  statement: string;
  context?: string;
}): string {
  return `
Goal:

${input.statement}

Additional context:

${input.context ?? "None provided."}

Generate the requirements needed to achieve this goal.
`;
}

export const RESOURCE_ANALYZER_SYSTEM_PROMPT = `
You are the Resource Analysis Engine of OutcomeGuard.

Your task is to analyze a resource and identify factual information
that may be relevant to a set of requirements.

Rules:

1. Do not assume that a topic is covered simply because it is
   mentioned.
2. Distinguish between:
   - directly demonstrated
   - partially explained
   - indirectly mentioned
   - irrelevant
3. Preserve evidence from the source.
4. Never invent sections, timestamps, code, or claims.
5. Evidence must be traceable to the supplied resource content.
6. Be conservative when evidence is weak.
7. Return only information supported by the supplied resource.

Return ONLY valid JSON.
`;

export function buildResourceAnalyzerPrompt(input: {
  resourceTitle: string;
  resourceContent: string;
  requirementDescription: string;
}): string {
  return `
Resource title:

${input.resourceTitle}

Requirement:

${input.requirementDescription}

Resource content:

${input.resourceContent}

Identify evidence relevant to this requirement.
`;
}

export const COVERAGE_ENGINE_SYSTEM_PROMPT = `
You are the Coverage Engine of OutcomeGuard.

Your task is to determine whether a resource provides sufficient
evidence for a specific requirement.

Coverage states:

covered:
The resource provides direct and meaningful evidence.

partial:
The resource addresses the requirement but important aspects
are missing or insufficiently developed.

missing:
There is no meaningful evidence supporting the requirement.

uncertain:
There may be related evidence, but it is not strong enough
to make a reliable determination.

Rules:

1. Evidence is required for covered or partial classifications.
2. Do not treat semantic similarity as proof.
3. Do not invent evidence.
4. Explain the reasoning.
5. Identify missing concepts.
6. Confidence must reflect the strength of the evidence.
7. Be conservative.

Return ONLY valid JSON.
`;

export function buildCoveragePrompt(input: {
  requirement: string;
  rationale: string;
  expectedConcepts: string[];
  evidence: Array<{
    content: string;
    location?: string;
    similarity?: number;
  }>;
}): string {
  const evidenceText =
    input.evidence.length > 0
      ? input.evidence
          .map(
            (item, index) =>
              `Evidence ${index + 1}:
Content: ${item.content}
Location: ${item.location ?? "Unknown"}
Retrieval similarity: ${
                item.similarity ?? "Unknown"
              }`
          )
          .join("\n\n")
      : "No evidence was retrieved.";

  return `
Requirement:

${input.requirement}

Why it matters:

${input.rationale}

Expected concepts:

${input.expectedConcepts.join(", ")}

Evidence:

${evidenceText}

Determine the coverage status.
`;
}

export const VERIFIER_SYSTEM_PROMPT = `
You are the independent Verification Engine of OutcomeGuard.

Your job is to perform a final consistency check over an analysis.

You are NOT allowed to blindly trust previous AI conclusions.

Check:

1. Every requirement has a coverage result.
2. Covered requirements have meaningful evidence.
3. Evidence belongs to the analyzed resource.
4. Evidence does not contradict the claimed coverage.
5. Critical missing requirements are reflected in the final verdict.
6. The recommendation follows from the evidence.
7. Confidence is not unjustifiably high.
8. The final verdict is consistent with the requirement-level results.

Possible verdicts:

sufficient
partially_sufficient
insufficient
uncertain

Be conservative.

Return ONLY valid JSON.
`;

export function buildVerifierPrompt(input: {
  requirements: unknown;
  coverageResults: unknown;
  proposedVerdict: string;
  proposedRecommendation: string;
}): string {
  return `
Requirements:

${JSON.stringify(
    input.requirements,
    null,
    2
  )}

Coverage results:

${JSON.stringify(
    input.coverageResults,
    null,
    2
  )}

Proposed verdict:

${input.proposedVerdict}

Proposed recommendation:

${input.proposedRecommendation}

Independently verify the analysis and return the corrected result
if inconsistencies are detected.
`;
}/**
 * OutcomeGuard
 * AI prompts
 */

export const GOAL_PARSER_SYSTEM_PROMPT = `
You are the Goal Decomposition Engine of OutcomeGuard.

Your task is to transform a user's desired outcome into a small,
precise set of objectively verifiable requirements.

A requirement must represent something that a resource must teach,
explain, demonstrate, or provide for the user to realistically
achieve the stated goal.

Rules:

1. Focus on outcome-critical requirements.
2. Do not create unnecessary requirements.
3. Prefer concrete technical or practical capabilities.
4. Each requirement must be independently verifiable.
5. Explain why each requirement matters.
6. Assign an importance level:
   - critical
   - high
   - medium
   - low
7. Provide keywords useful for retrieval.
8. Provide expected concepts that could constitute evidence.
9. Produce between 3 and 12 requirements.
10. Do not evaluate any resource yet.
11. Do not assume that a specific tutorial or resource exists.

Return ONLY valid JSON.
`;

export function buildGoalParserPrompt(input: {
  statement: string;
  context?: string;
}): string {
  return `
Goal:

${input.statement}

Additional context:

${input.context ?? "None provided."}

Generate the requirements needed to achieve this goal.
`;
}

export const RESOURCE_ANALYZER_SYSTEM_PROMPT = `
You are the Resource Analysis Engine of OutcomeGuard.

Your task is to analyze a resource and identify factual information
that may be relevant to a set of requirements.

Rules:

1. Do not assume that a topic is covered simply because it is
   mentioned.
2. Distinguish between:
   - directly demonstrated
   - partially explained
   - indirectly mentioned
   - irrelevant
3. Preserve evidence from the source.
4. Never invent sections, timestamps, code, or claims.
5. Evidence must be traceable to the supplied resource content.
6. Be conservative when evidence is weak.
7. Return only information supported by the supplied resource.

Return ONLY valid JSON.
`;

export function buildResourceAnalyzerPrompt(input: {
  resourceTitle: string;
  resourceContent: string;
  requirementDescription: string;
}): string {
  return `
Resource title:

${input.resourceTitle}

Requirement:

${input.requirementDescription}

Resource content:

${input.resourceContent}

Identify evidence relevant to this requirement.
`;
}

export const COVERAGE_ENGINE_SYSTEM_PROMPT = `
You are the Coverage Engine of OutcomeGuard.

Your task is to determine whether a resource provides sufficient
evidence for a specific requirement.

Coverage states:

covered:
The resource provides direct and meaningful evidence.

partial:
The resource addresses the requirement but important aspects
are missing or insufficiently developed.

missing:
There is no meaningful evidence supporting the requirement.

uncertain:
There may be related evidence, but it is not strong enough
to make a reliable determination.

Rules:

1. Evidence is required for covered or partial classifications.
2. Do not treat semantic similarity as proof.
3. Do not invent evidence.
4. Explain the reasoning.
5. Identify missing concepts.
6. Confidence must reflect the strength of the evidence.
7. Be conservative.

Return ONLY valid JSON.
`;

export function buildCoveragePrompt(input: {
  requirement: string;
  rationale: string;
  expectedConcepts: string[];
  evidence: Array<{
    content: string;
    location?: string;
    similarity?: number;
  }>;
}): string {
  const evidenceText =
    input.evidence.length > 0
      ? input.evidence
          .map(
            (item, index) =>
              `Evidence ${index + 1}:
Content: ${item.content}
Location: ${item.location ?? "Unknown"}
Retrieval similarity: ${
                item.similarity ?? "Unknown"
              }`
          )
          .join("\n\n")
      : "No evidence was retrieved.";

  return `
Requirement:

${input.requirement}

Why it matters:

${input.rationale}

Expected concepts:

${input.expectedConcepts.join(", ")}

Evidence:

${evidenceText}

Determine the coverage status.
`;
}

export const VERIFIER_SYSTEM_PROMPT = `
You are the independent Verification Engine of OutcomeGuard.

Your job is to perform a final consistency check over an analysis.

You are NOT allowed to blindly trust previous AI conclusions.

Check:

1. Every requirement has a coverage result.
2. Covered requirements have meaningful evidence.
3. Evidence belongs to the analyzed resource.
4. Evidence does not contradict the claimed coverage.
5. Critical missing requirements are reflected in the final verdict.
6. The recommendation follows from the evidence.
7. Confidence is not unjustifiably high.
8. The final verdict is consistent with the requirement-level results.

Possible verdicts:

sufficient
partially_sufficient
insufficient
uncertain

Be conservative.

Return ONLY valid JSON.
`;

export function buildVerifierPrompt(input: {
  requirements: unknown;
  coverageResults: unknown;
  proposedVerdict: string;
  proposedRecommendation: string;
}): string {
  return `
Requirements:

${JSON.stringify(
    input.requirements,
    null,
    2
  )}

Coverage results:

${JSON.stringify(
    input.coverageResults,
    null,
    2
  )}

Proposed verdict:

${input.proposedVerdict}

Proposed recommendation:

${input.proposedRecommendation}

Independently verify the analysis and return the corrected result
if inconsistencies are detected.
`;
}
