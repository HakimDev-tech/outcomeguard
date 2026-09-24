import { resourceError, externalServiceError } from "@/lib/utils/errors";

export interface YouTubeResource {
  metadata: {
    title: string;
    author?: string;
    url: string;
  };
  transcript: string;
}

interface TranscriptResponse {
  title?: string;
  author?: string;
  transcript?: string;
  text?: string;
}

function extractVideoId(url: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1).split("/")[0];
      if (id) return id;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const queryId = parsed.searchParams.get("v");
      if (queryId) return queryId;

      const match = parsed.pathname.match(/\/shorts\/([^/]+)/);
      if (match?.[1]) return match[1];
    }
  } catch {
    throw resourceError("Invalid YouTube URL.");
  }

  throw resourceError("Could not extract a YouTube video ID from the URL.");
}

export async function fetchYouTubeResource(url: string): Promise<YouTubeResource> {
  const videoId = extractVideoId(url);
  const endpoint = process.env.YOUTUBE_TRANSCRIPT_API_URL;

  if (!endpoint) {
    throw externalServiceError("YouTube transcript service is not configured.");
  }

  const apiUrl = new URL(endpoint);
  apiUrl.searchParams.set("video_id", videoId);

  const apiKey = process.env.YOUTUBE_TRANSCRIPT_API_KEY;
  const headers: HeadersInit = { Accept: "application/json" };

  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const response = await fetch(apiUrl, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw externalServiceError(
      `YouTube transcript service returned HTTP ${response.status}.`,
    );
  }

  const data = (await response.json()) as TranscriptResponse;
  const transcript = (data.transcript ?? data.text ?? "").trim();

  if (!transcript) {
    throw externalServiceError("YouTube transcript service returned no transcript.");
  }

  return {
    metadata: {
      title: data.title?.trim() || `YouTube video ${videoId}`,
      author: data.author?.trim() || undefined,
      url,
    },
    transcript,
  };
}
