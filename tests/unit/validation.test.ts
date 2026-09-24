import { describe, expect, it } from "vitest";
import {
  createGoalSchema,
  createResourceSchema,
  createAnalysisSchema,
} from "@/lib/utils/validation";

describe("createGoalSchema", () => {
  it("accepts a valid goal", () => {
    const result = createGoalSchema.safeParse({
      statement:
        "Build a production-ready Next.js CRUD application",
      context: "I want to be able to deploy it to production.",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty goal", () => {
    const result = createGoalSchema.safeParse({
      statement: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an excessively long goal", () => {
    const result = createGoalSchema.safeParse({
      statement: "a".repeat(2001),
    });

    expect(result.success).toBe(false);
  });
});

describe("createResourceSchema", () => {
  it("accepts a YouTube resource", () => {
    const result = createResourceSchema.safeParse({
      type: "youtube",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      title: "Next.js Tutorial",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid resource type", () => {
    const result = createResourceSchema.safeParse({
      type: "video",
      title: "Tutorial",
    });

    expect(result.success).toBe(false);
  });

  it("requires a URL for YouTube resources", () => {
    const result = createResourceSchema.safeParse({
      type: "youtube",
      title: "Tutorial",
    });

    expect(result.success).toBe(false);
  });

  it("accepts plain text resources without a URL", () => {
    const result = createResourceSchema.safeParse({
      type: "text",
      title: "My notes",
      content: "Some learning material.",
    });

    expect(result.success).toBe(true);
  });
});

describe("createAnalysisSchema", () => {
  it("accepts valid UUIDs", () => {
    const result = createAnalysisSchema.safeParse({
      goalId: "550e8400-e29b-41d4-a716-446655440000",
      resourceId: "550e8400-e29b-41d4-a716-446655440001",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid UUIDs", () => {
    const result = createAnalysisSchema.safeParse({
      goalId: "invalid",
      resourceId: "invalid",
    });

    expect(result.success).toBe(false);
  });
});
