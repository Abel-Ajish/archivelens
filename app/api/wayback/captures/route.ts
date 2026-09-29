import { NextRequest, NextResponse } from "next/server";
import { fetchCaptures } from "@/lib/wayback/client";
import { isValidUrl, normalizeUrl } from "@/lib/wayback/utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("url") ?? "";
  const from = request.nextUrl.searchParams.get("from") ?? "";
  const to = request.nextUrl.searchParams.get("to") ?? "";
  if (!isValidUrl(raw)) {
    return NextResponse.json(
      { error: "invalid", message: "That doesn't look like a valid website address." },
      { status: 400 },
    );
  }
  if (!/^\d{4}(\d{2})?$/.test(from) || !/^\d{4}(\d{2})?$/.test(to)) {
    return NextResponse.json(
      { error: "invalid", message: "Invalid date range." },
      { status: 400 },
    );
  }
  try {
    const captures = await fetchCaptures(normalizeUrl(raw), from, to);
    return NextResponse.json({ captures });
  } catch {
    return NextResponse.json(
      { error: "unreachable", message: "The archive couldn't be reached." },
      { status: 502 },
    );
  }
}
