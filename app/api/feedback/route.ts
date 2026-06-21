import { NextResponse } from "next/server";
import { buildLocalFeedback, normalizeWritingType } from "@/lib/feedback";

export async function POST(request: Request) {
  const body = (await request.json()) as { text?: string; writingType?: unknown };
  const text = body.text?.trim() ?? "";
  const writingType = normalizeWritingType(body.writingType);

  if (text.length < 20) {
    return NextResponse.json(
      { message: "글을 조금 더 작성한 뒤 코칭을 받아 보세요." },
      { status: 400 }
    );
  }

  return NextResponse.json(buildLocalFeedback(text, writingType));
}
