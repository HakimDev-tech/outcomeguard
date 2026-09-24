import { describe, expect, it } from "vitest";
import { AppError, getPublicErrorMessage, normalizeError } from "@/lib/utils/errors";

describe("AppError", () => {
  it("creates an application error", () => {
    const error = new AppError("VALIDATION_ERROR", "Invalid input", { statusCode: 400 });
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("Invalid input");
    expect(error.code).toBe("VALIDATION_ERROR");
    expect(error.statusCode).toBe(400);
  });

  it("supports additional details", () => {
    const error = new AppError("RESOURCE_ERROR", "Resource failed", { statusCode: 500, details: { resourceId: "resource-123" } });
    expect(error.details).toEqual({ resourceId: "resource-123" });
  });
});

describe("normalizeError", () => {
  it("normalizes an AppError", () => {
    const error = new AppError("INTERNAL_ERROR", "Test error", { statusCode: 500 });
    expect(normalizeError(error).code).toBe("INTERNAL_ERROR");
    expect(normalizeError(error).message).toBe("Test error");
  });

  it("converts a standard Error", () => {
    const result = normalizeError(new Error("Something failed"));
    expect(result.code).toBe("INTERNAL_ERROR");
    expect(result.message).toBe("Something failed");
  });

  it("handles unknown values", () => {
    const result = normalizeError("unexpected error");
    expect(result.code).toBe("INTERNAL_ERROR");
  });
});

describe("getPublicErrorMessage", () => {
  it("returns a safe message for an application error", () => {
    expect(getPublicErrorMessage(new AppError("VALIDATION_ERROR", "Invalid request", { statusCode: 400 }))).toBe("Invalid request");
  });

  it("does not expose unknown internal errors", () => {
    expect(getPublicErrorMessage(new Error("Database password: secret"))).toBe("An unexpected error occurred.");
  });
});
