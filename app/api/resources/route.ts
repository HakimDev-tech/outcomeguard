import { NextRequest, NextResponse } from "next/server";

import { fetchYouTubeResource } from "@/lib/resources/youtube";
import { parseTextResource } from "@/lib/resources/text";

import {
  createResource,
  updateResource,
  createResourceChunks,
} from "@/lib/db/queries";

import { chunkText } from "@/lib/rag/chunking";
import { createEmbeddings } from "@/lib/rag/embeddings";

import {
  normalizeError,
  resourceError,
} from "@/lib/utils/errors";

import {
  createResourceSchema,
} from "@/lib/utils/validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let resourceId: string | undefined;

  try {
    const body = await request.json();

    const parsed =
      createResourceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid resource input.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const input = parsed.data;

    const resource = await createResource({
      type: input.type,
      url: input.url,
      title: input.title,
      author: input.author,
      content: input.content,
      status: "processing",
    });

    resourceId = resource.id;

    let title = resource.title;
    let author = resource.author;
    let url = resource.url;
    let content = resource.content;

    if (input.type === "youtube") {
      if (!input.url) {
        throw resourceError(
          "YouTube resource requires a URL.",
        );
      }

      const youtube =
        await fetchYouTubeResource(input.url);

      title = youtube.metadata.title;
      author = youtube.metadata.author;
      url = youtube.metadata.url;
      content = youtube.transcript;
    } else if (input.type === "text") {
      if (!input.content) {
        throw resourceError(
          "Text resource requires content.",
        );
      }

      const text =
        parseTextResource({
          title: input.title,
          content: input.content,
          author: input.author,
          url: input.url,
        });

      title = text.title;
      author = text.author;
      url = text.url;
      content = text.content;
    } else {
      throw resourceError(
        `Resource type "${input.type}" is not implemented yet.`,
      );
    }

    if (!content?.trim()) {
      throw resourceError(
        "Resource contains no usable content.",
      );
    }

    const chunks = chunkText(content);

    const embeddings = await createEmbeddings(
      chunks.map((chunk) => chunk.content),
    );

    const savedChunks =
      await createResourceChunks(
        resource.id,
        chunks.map((chunk, index) => ({
          chunkIndex: chunk.index,
          content: chunk.content,
          startChar: chunk.startChar,
          endChar: chunk.endChar,
          tokenEstimate: chunk.tokenEstimate,
          embedding: embeddings[index],
        })),
      );

    const updatedResource =
      await updateResource(resource.id, {
        title,
        author,
        url: url ?? undefined,
        content,
        status: "ready",
        error: null,
      });

    return NextResponse.json(
      {
        resource: updatedResource,
        chunksCreated: savedChunks.length,
      },
      { status: 201 },
    );
  } catch (error) {
    if (resourceId) {
      try {
        await updateResource(resourceId, {
          status: "failed",
          error:
            error instanceof Error
              ? error.message
              : "Resource ingestion failed.",
        });
      } catch {
        // Preserve the original error.
      }
    }

    const normalized = normalizeError(error);

    return NextResponse.json(
      {
        error: normalized.message,
        code: normalized.code,
      },
      {
        status: normalized.statusCode,
      },
    );
  }
}
