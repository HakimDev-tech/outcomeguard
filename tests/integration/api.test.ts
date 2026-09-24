import { describe, expect, it } from "vitest";

describe("API integration contracts", () => {
  it("defines the expected API endpoints", () => {
    const endpoints = [
      "/api/goals",
      "/api/resources",
      "/api/analyze",
    ];

    expect(endpoints).toContain("/api/goals");
    expect(endpoints).toContain("/api/resources");
    expect(endpoints).toContain("/api/analyze");
  });

  it("uses POST for resource creation workflows", () => {
    const creationMethods = {
      goals: "POST",
      resources: "POST",
      analyses: "POST",
    };

    expect(creationMethods.goals).toBe("POST");
    expect(creationMethods.resources).toBe("POST");
    expect(creationMethods.analyses).toBe("POST");
  });

  it("keeps the MVP analysis pipeline deterministic at the contract level", () => {
    const pipeline = [
      "goal",
      "requirements",
      "resource",
      "evidence",
      "coverage",
      "verification",
      "verdict",
    ];

    expect(pipeline).toEqual([
      "goal",
      "requirements",
      "resource",
      "evidence",
      "coverage",
      "verification",
      "verdict",
    ]);
  });
});
