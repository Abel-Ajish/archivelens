import { NextRequest, NextResponse } from "next/server";
import { fetchArchiveSummary } from "@/lib/wayback/client";
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
  const url = normalizeUrl(raw);
  try {
    const summary = await fetchArchiveSummary(url);
    if (!summary.firstCapture) {
      return NextResponse.json(
        { error: "empty", message: "No archived captures found." },
        { status: 404 },
      );
    }
    return NextResponse.json(summary);
  } catch {
    return NextResponse.json(
      { error: "unreachable", message: "The archive couldn't be reached." },
      { status: 502 },
    );
  }
}
