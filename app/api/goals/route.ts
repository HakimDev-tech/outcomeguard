import { NextRequest, NextResponse } from "next/server";

import { parseGoal } from "@/lib/ai/goal-parser";
import {
  createGoal,
  createRequirements,
} from "@/lib/db/queries";
import { normalizeError } from "@/lib/utils/errors";
import { createGoalSchema } from "@/lib/utils/validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = createGoalSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid goal input.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const goal = await createGoal({
      statement: parsed.data.statement,
      context: parsed.data.context,
    });

    const requirements = await parseGoal({
      statement: goal.statement,
      context: goal.context ?? undefined,
    });

    const savedRequirements =
      await createRequirements(
        goal.id,
        requirements,
      );

    return NextResponse.json(
      {
        goal,
        requirements: savedRequirements,
      },
      { status: 201 },
    );
  } catch (error) {
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
