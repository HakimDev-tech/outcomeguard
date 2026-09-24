"use client";

import { FormEvent, useState } from "react";

interface ResourceFormProps {
  onCreated?: (data: {
    resourceId: string;
  }) => void;
}

type ResourceType =
  | "youtube"
  | "text";

export default function ResourceForm({
  onCreated,
}: ResourceFormProps) {
  const [type, setType] =
    useState<ResourceType>("youtube");

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Resource title is required.");
      return;
    }

    if (
      type === "youtube" &&
      !url.trim()
    ) {
      setError("YouTube URL is required.");
      return;
    }

    if (
      type === "text" &&
      !content.trim()
    ) {
      setError("Resource content is required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/resources",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type,
            title: title.trim(),
            url:
              type === "youtube"
                ? url.trim()
                : undefined,
            content:
              type === "text"
                ? content.trim()
                : undefined,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Failed to ingest resource.",
        );
      }

      onCreated?.({
        resourceId: data.resource.id,
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
        <label className="mb-2 block text-sm font-medium">
          Resource type
        </label>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() =>
              setType("youtube")
            }
            disabled={loading}
            className={`rounded-xl border p-3 text-left text-sm transition ${
              type === "youtube"
                ? "border-zinc-950 bg-zinc-950 text-white"
                : "border-zinc-300 bg-white hover:border-zinc-500"
            }`}
          >
            <span className="block font-medium">
              YouTube
            </span>

            <span
              className={
                type === "youtube"
                  ? "text-zinc-300"
                  : "text-zinc-500"
              }
            >
              Analyze a video
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              setType("text")
            }
            disabled={loading}
            className={`rounded-xl border p-3 text-left text-sm transition ${
              type === "text"
                ? "border-zinc-950 bg-zinc-950 text-white"
                : "border-zinc-300 bg-white hover:border-zinc-500"
            }`}
          >
            <span className="block font-medium">
              Text
            </span>

            <span
              className={
                type === "text"
                  ? "text-zinc-300"
                  : "text-zinc-500"
              }
            >
              Paste an article
            </span>
          </button>
        </div>
      </div>

      <div>
        <label
          htmlFor="resource-title"
          className="mb-2 block text-sm font-medium"
        >
          Title
        </label>

        <input
          id="resource-title"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          placeholder="Resource title"
          maxLength={500}
          disabled={loading}
          className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-sm outline-none focus:border-zinc-900"
        />
      </div>

      {type === "youtube" && (
        <div>
          <label
            htmlFor="resource-url"
            className="mb-2 block text-sm font-medium"
          >
            YouTube URL
          </label>

          <input
            id="resource-url"
            type="url"
            value={url}
            onChange={(event) =>
              setUrl(event.target.value)
            }
            placeholder="https://www.youtube.com/watch?v=..."
            disabled={loading}
            className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-sm outline-none focus:border-zinc-900"
          />
        </div>
      )}

      {type === "text" && (
        <div>
          <label
            htmlFor="resource-content"
            className="mb-2 block text-sm font-medium"
          >
            Content
          </label>

          <textarea
            id="resource-content"
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            placeholder="Paste the resource content here..."
            rows={10}
            disabled={loading}
            className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-sm outline-none focus:border-zinc-900"
          />
        </div>
      )}

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
          ? "Processing resource..."
          : "Add resource"}
      </button>
    </form>
  );
}
