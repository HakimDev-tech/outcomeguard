/**
 * OutcomeGuard
 * Domain model: Resource
 *
 * Represents the learning/information resource evaluated against a goal.
 */

export type ResourceId = string;

export type ResourceType =
  | "youtube"
  | "article"
  | "documentation"
  | "text"
  | "github_repository";

export type ResourceStatus =
  | "pending"
  | "processing"
  | "ready"
  | "failed";

export interface Resource {
  id: ResourceId;

  /**
   * Resource type.
   */
  type: ResourceType;

  /**
   * Original resource URL when applicable.
   */
  url?: string;

  /**
   * Human-readable title.
   */
  title: string;

  /**
   * Source author, channel, organization, etc.
   */
  author?: string;

  /**
   * Raw or normalized textual content extracted from the resource.
   */
  content?: string;

  /**
   * Duration in seconds.
   *
   * Primarily useful for video resources.
   */
  durationSeconds?: number;

  /**
   * Current ingestion/processing state.
   */
  status: ResourceStatus;

  /**
   * Error information if processing failed.
   */
  error?: ResourceError;

  /**
   * ISO timestamp.
   */
  createdAt: string;

  /**
   * ISO timestamp.
   */
  updatedAt: string;
}

export interface ResourceError {
  code: string;
  message: string;
}
