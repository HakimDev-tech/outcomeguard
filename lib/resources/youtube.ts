import {
  externalServiceError,
  resourceError,
} from "@/lib/utils/errors";

export interface YouTubeMetadata {
  videoId: string;
  title: string;
  author?: string;
  durationSeconds?: number;
  url: string;
}

export interface YouTubeResourceContent {
  metadata: YouTubeMetadata;
  transcript: string;
}

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
]);

function isYouTubeHost(hostname: string): boolean {
  return YOUTUBE_HOSTS.has(hostname.toLowerCase());
}

export function extractYouTubeVideoId(input: string): string {
  let url: URL;

  try {
    url = new URL(input);
  } catch {
    throw resourceError("Invalid YouTube URL.", {
      url: input,
    });
  }

  if (!isYouTubeHost(url.hostname)) {
    throw resourceError("URL is not a supported YouTube URL.", {
      hostname: url.hostname,
    });
  }

  if (url.hostname === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];

    if (!id) {
      throw resourceError("Could not extract YouTube video ID.");
    }

    return id;
  }

  const videoId = url.searchParams.get("v");

  if (!videoId) {
    throw resourceError("Could not extract YouTube video ID.");
  }

  return videoId;
}

function normalizeTranscript(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function assertNonEmpty(value: string, field: string): string {
  const normalized = value.trim();

  if (!normalized) {
    throw resourceError(`YouTube ${field} is empty.`);
  }

  return normalized;
}

/**
 * Fetches YouTube metadata and transcript.
 *
 * The actual external transcript provider is intentionally abstracted behind
 * environment variables so the application does not depend directly on a
 * specific third-party implementation.
 *
 * Required:
 *   YOUTUBE_TRANSCRIPT_API_URL
 *
 * Optional:
 *   YOUTUBE_TRANSCRIPT_API_KEY
 */
export async function fetchYouTubeResource(
  url: string,
): Promise<YouTubeResourceContent> {
  const videoId = extractYouTubeVideoId(url);

  const transcriptApiUrl = process.env.YOUTUBE_TRANSCRIPT_API_URL;

  if (!transcriptApiUrl) {
    throw externalServiceError(
      "YouTube transcript service is not configured.",
      {
        videoId,
      },
    );
  }

  const endpoint = new URL(transcriptApiUrl);

  endpoint.searchParams.set("videoId", videoId);

  const apiKey = process.env.YOUTUBE_TRANSCRIPT_API_KEY;

  const headers: HeadersInit = {
    Accept: "application/json",
  };

  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  let response: Response;

  try {
    response = await fetch(endpoint.toString(), {
      method: "GET",
      headers,
      signal: AbortSignal.timeout(30_000),
      cache: "no-store",
    });
  } catch (error) {
    throw externalServiceError(
      "Failed to connect to the YouTube transcript service.",
      {
        videoId,
        cause: error instanceof Error ? error.message : String(error),
      },
    );
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");

    throw externalServiceError(
      "YouTube transcript service returned an error.",
      {
        videoId,
        status: response.status,
        body: body.slice(0, 500),
      },
    );
  }

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    throw externalServiceError(
      "YouTube transcript service returned invalid JSON.",
      {
        videoId,
      },
    );
  }

  if (!data || typeof data !== "object") {
    throw externalServiceError(
      "Invalid YouTube transcript response.",
      {
        videoId,
      },
    );
  }

  const payload = data as Record<string, unknown>;

  const title =
    typeof payload.title === "string"
      ? payload.title
      : `YouTube video ${videoId}`;

  const author =
    typeof payload.author === "string"
      ? payload.author
      : undefined;

  const durationSeconds =
    typeof payload.durationSeconds === "number" &&
    Number.isFinite(payload.durationSeconds)
      ? payload.durationSeconds
      : undefined;

  const transcript =
    typeof payload.transcript === "string"
      ? normalizeTranscript(payload.transcript)
      : "";

  if (!transcript) {
    throw resourceError(
      "No transcript is available for this YouTube video.",
      {
        videoId,
      },
    );
  }

  return {
    metadata: {
      videoId,
      title: assertNonEmpty(title, "title"),
      author,
      durationSeconds,
      url,
    },
    transcript,
  };
}
