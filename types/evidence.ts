/**
 * OutcomeGuard
 * Domain model: Evidence
 *
 * Represents a concrete piece of resource content that supports
 * or contradicts a requirement.
 */

export type EvidenceId = string;

export type EvidenceType =
  | "transcript"
  | "text"
  | "documentation"
  | "code"
  | "metadata";

export type EvidenceRelevance =
  | "direct"
  | "partial"
  | "indirect"
  | "irrelevant";

export interface Evidence {
  id: EvidenceId;

  /**
   * Resource from which the evidence was extracted.
   */
  resourceId: string;

  /**
   * Requirement potentially supported by this evidence.
   */
  requirementId?: string;

  /**
   * Original extracted text.
   */
  content: string;

  /**
   * Evidence source type.
   */
  type: EvidenceType;

  /**
   * Relevance determined by the analysis engine.
   */
  relevance: EvidenceRelevance;

  /**
   * Semantic similarity score returned by retrieval.
   *
   * This is a retrieval signal, not a final coverage score.
   */
  similarity?: number;

  /**
   * Position in the original resource when available.
   *
   * For YouTube this can represent seconds.
   */
  startPosition?: number;

  /**
   * End position in the original resource when available.
   */
  endPosition?: number;

  /**
   * Human-readable location.
   *
   * Example:
   * "12:43–14:18"
   */
  location?: string;

  /**
   * Confidence assigned by the evidence evaluator.
   */
  confidence: number;
}
