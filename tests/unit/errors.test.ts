import { describe, expect, it } from "vitest";
import {
  AppError,
  ErrorCode,
  getPublicErrorMessage,
  normalizeError,
} from "@/lib/utils/errors";

describe("AppError", () => {
  it("creates an application error", () => {
    const error = new AppError(
      "Invalid input",
      ErrorCode.VALIDATION_ERROR,
      400,
    );

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("Invalid input");
    expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
    expect(error.statusCode).toBe(400);
  });

  it("supports additional details", () => {
    const error = new AppError(
      "Resource failed",
      ErrorCode.RESOURCE_ERROR,
      500,
      {
        resourceId: "resource-123",
      },
    );

    expect(error.details).toEqual({
      resourceId: "resource-123",
    });
  });
});

describe("normalizeError", () => {
  it("returns an AppError unchanged", () => {
    const error = new AppError(
      "Test error",
      ErrorCode.INTERNAL_ERROR,
      500,
    );

    expect(normalizeError(error)).toBe(error);
  });

  it("converts a standard Error", () => {
    const result = normalizeError(
      new Error("Something failed"),
    );

    expect(result).toBeInstanceOf(AppError);
    expect(result.message).toBe("Something failed");
    expect(result.code).toBe(ErrorCode.INTERNAL_ERROR);
  });

  it("handles unknown values", () => {
    const result = normalizeError("unexpected error");

    expect(result).toBeInstanceOf(AppError);
    expect(result.code).toBe(ErrorCode.INTERNAL_ERROR);
  });
});

describe("getPublicErrorMessage", () => {
  it("returns a safe message for an application error", () => {
    const error = new AppError(
      "Invalid request",
      ErrorCode.VALIDATION_ERROR,
      400,
    );

    expect(getPublicErrorMessage(error)).toBe(
      "Invalid request",
    );
  });

  it("does not expose unknown internal errors", () => {
    expect(
      getPublicErrorMessage(new Error("Database password: secret")),
    ).toBe("An unexpected error occurred.");
  });
});
