import { NextRequest, NextResponse } from "next/server";
import { fetchTimeline } from "@/lib/wayback/client";
import { isValidUrl, normalizeUrl } from "@/lib/wayback/utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("url") ?? "";
  if (!isValidUrl(raw)) {
    return NextResponse.json(
      { error: "invalid", message: "That doesn't look like a valid website address." },
      { status: 400 },
    );
  }
  try {
    const timeline = await fetchTimeline(normalizeUrl(raw));
    return NextResponse.json(timeline);
  } catch {
    return NextResponse.json(
      { error: "unreachable", message: "The archive couldn't be reached." },
      { status: 502 },
    );
  }
}
