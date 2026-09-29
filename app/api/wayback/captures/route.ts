import { NextRequest, NextResponse } from "next/server";
import { fetchFromAllProviders, mergeCaptures } from "@/lib/wayback/providers";
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
  const url = normalizeUrl(raw);
  const results = await fetchFromAllProviders(url, { from, to, limit: 5000 });
  const responded = results.filter((r) => !r.error);
  if (responded.length === 0) {
    return NextResponse.json(
      { error: "unreachable", message: "The archive couldn't be reached." },
      { status: 502 },
    );
  }
  const captures = mergeCaptures(results);
  return NextResponse.json({ captures });
}
