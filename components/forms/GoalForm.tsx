"use client";

import { FormEvent, useState } from "react";

interface GoalFormProps {
  onCreated?: (data: {
    goalId: string;
    requirements: unknown[];
  }) => void;
}

export default function GoalForm({
  onCreated,
}: GoalFormProps) {
  const [statement, setStatement] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (!statement.trim()) {
      setError("Describe the goal first.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/goals",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            statement: statement.trim(),
            context: context.trim() || undefined,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ?? "Failed to create goal.",
        );
      }

      onCreated?.({
        goalId: data.goal.id,
        requirements:
          data.requirements ?? [],
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label
          htmlFor="goal"
          className="mb-2 block text-sm font-medium"
        >
          What do you want to achieve?
        </label>

        <textarea
          id="goal"
          value={statement}
          onChange={(event) =>
            setStatement(event.target.value)
          }
          placeholder="Example: Build a production-ready Next.js CRUD application"
          rows={4}
          maxLength={2000}
          disabled={loading}
          className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-sm outline-none transition focus:border-zinc-900"
        />

        <p className="mt-1 text-xs text-zinc-500">
          Be specific about the outcome you want.
        </p>
      </div>

      <div>
        <label
          htmlFor="context"
          className="mb-2 block text-sm font-medium"
        >
          Context
          <span className="ml-1 font-normal text-zinc-500">
            (optional)
          </span>
        </label>

        <textarea
          id="context"
          value={context}
          onChange={(event) =>
            setContext(event.target.value)
          }
          placeholder="Your current level, constraints, target stack, etc."
          rows={3}
          maxLength={3000}
          disabled={loading}
          className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-sm outline-none transition focus:border-zinc-900"
        />
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Analyzing goal..."
          : "Define requirements"}
      </button>
    </form>
  );
}
