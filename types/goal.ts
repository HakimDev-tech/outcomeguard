/**
 * OutcomeGuard
 * Domain model: Goal
 *
 * Represents the concrete outcome the user wants to achieve.
 */

export type GoalId = string;

export interface Goal {
  id: GoalId;

  /**
   * Human-readable statement of the desired outcome.
   *
   * Example:
   * "Build a production-ready Next.js CRUD application."
   */
  statement: string;

  /**
   * Optional additional context supplied by the user.
   */
  context?: string;

  /**
   * Requirements generated from this goal.
   */
  requirements: RequirementReference[];

  /**
   * ISO timestamp.
   */
  createdAt: string;

  /**
   * ISO timestamp.
   */
  updatedAt: string;
}

export interface RequirementReference {
  id: string;
}
