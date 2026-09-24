/**
 * ============================================================
 * OutcomeGuard
 * Application error system
 * ============================================================
 */

export type AppErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "RESOURCE_ERROR"
  | "AI_ERROR"
  | "AI_TIMEOUT"
  | "AI_INVALID_RESPONSE"
  | "DATABASE_ERROR"
  | "DATABASE_NOT_FOUND"
  | "RAG_ERROR"
  | "EMBEDDING_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "RATE_LIMITED"
  | "EXTERNAL_SERVICE_ERROR"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  public readonly code: AppErrorCode;

  public readonly statusCode: number;

  public readonly details?: unknown;

  public readonly cause?: unknown;

  constructor(
    code: AppErrorCode,
    message: string,
    options?: {
      statusCode?: number;
      details?: unknown;
      cause?: unknown;
    }
  ) {
    super(message);

    this.name = "AppError";

    this.code = code;

    this.statusCode =
      options?.statusCode ??
      getDefaultStatusCode(code);

    this.details = options?.details;

    this.cause = options?.cause;

    Object.setPrototypeOf(
      this,
      new.target.prototype
    );
  }
}

/**
 * ============================================================
 * Default HTTP status mapping
 * ============================================================
 */

function getDefaultStatusCode(
  code: AppErrorCode
): number {
  switch (code) {
    case "VALIDATION_ERROR":
      return 400;

    case "UNAUTHORIZED":
      return 401;

    case "FORBIDDEN":
      return 403;

    case "NOT_FOUND":
    case "DATABASE_NOT_FOUND":
      return 404;

    case "RATE_LIMITED":
      return 429;

    case "RESOURCE_ERROR":
    case "AI_ERROR":
    case "AI_TIMEOUT":
    case "AI_INVALID_RESPONSE":
    case "DATABASE_ERROR":
    case "RAG_ERROR":
    case "EMBEDDING_ERROR":
    case "EXTERNAL_SERVICE_ERROR":
      return 502;

    case "INTERNAL_ERROR":
    default:
      return 500;
  }
}

/**
 * ============================================================
 * Factory helpers
 * ============================================================
 */

export function validationError(
  message: string,
  details?: unknown
): AppError {
  return new AppError(
    "VALIDATION_ERROR",
    message,
    {
      statusCode: 400,
      details,
    }
  );
}

export function notFoundError(
  resource: string,
  id?: string
): AppError {
  const suffix = id
    ? ` with id "${id}"`
    : "";

  return new AppError(
    "NOT_FOUND",
    `${resource}${suffix} was not found.`,
    {
      statusCode: 404,
    }
  );
}

export function databaseError(
  message: string,
  cause?: unknown
): AppError {
  return new AppError(
    "DATABASE_ERROR",
    message,
    {
      statusCode: 502,
      cause,
    }
  );
}

export function aiError(
  message: string,
  cause?: unknown
): AppError {
  return new AppError(
    "AI_ERROR",
    message,
    {
      statusCode: 502,
      cause,
    }
  );
}

export function aiTimeoutError(
  message = "The AI provider did not respond within the allowed time."
): AppError {
  return new AppError(
    "AI_TIMEOUT",
    message,
    {
      statusCode: 504,
    }
  );
}

export function aiInvalidResponseError(
  message = "The AI provider returned an invalid response.",
  details?: unknown
): AppError {
  return new AppError(
    "AI_INVALID_RESPONSE",
    message,
    {
      statusCode: 502,
      details,
    }
  );
}

export function ragError(
  message: string,
  cause?: unknown
): AppError {
  return new AppError(
    "RAG_ERROR",
    message,
    {
      statusCode: 502,
      cause,
    }
  );
}

export function embeddingError(
  message: string,
  cause?: unknown
): AppError {
  return new AppError(
    "EMBEDDING_ERROR",
    message,
    {
      statusCode: 502,
      cause,
    }
  );
}

export function resourceError(
  message: string,
  cause?: unknown
): AppError {
  return new AppError(
    "RESOURCE_ERROR",
    message,
    {
      statusCode: 502,
      cause,
    }
  );
}

/**
 * ============================================================
 * Error detection
 * ============================================================
 */

export function isAppError(
  error: unknown
): error is AppError {
  return error instanceof AppError;
}

/**
 * ============================================================
 * Error normalization
 * ============================================================
 */

export interface NormalizedError {
  code: AppErrorCode;
  message: string;
  statusCode: number;
  details?: unknown;
}

export function normalizeError(
  error: unknown
): NormalizedError {
  if (isAppError(error)) {
    return {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return {
      code: "INTERNAL_ERROR",
      message: error.message,
      statusCode: 500,
    };
  }

  return {
    code: "INTERNAL_ERROR",
    message: "An unexpected error occurred.",
    statusCode: 500,
  };
}

/**
 * ============================================================
 * Safe error response
 * ============================================================
 */

export function getPublicErrorMessage(
  error: unknown
): string {
  const normalized = normalizeError(error);

  /**
   * Do not expose internal implementation details
   * to clients for unexpected errors.
   */
  if (
    normalized.code === "INTERNAL_ERROR"
  ) {
    return "An unexpected error occurred.";
  }

  return normalized.message;
}
export function externalServiceError(message: string, cause?: unknown): AppError {
  return new AppError("EXTERNAL_SERVICE_ERROR", message, { statusCode: 502, cause });
}
