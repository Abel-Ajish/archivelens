import { NextRequest, NextResponse } from "next/server";
import { fetchFromAllProviders, mergeCaptures } from "@/lib/wayback/providers";
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
  const results = await fetchFromAllProviders(url, { limit: 10000 });
  const responded = results.filter((r) => !r.error);
  if (responded.length === 0) {
    return NextResponse.json(
      { error: "unreachable", message: "The archive couldn't be reached." },
      { status: 502 },
    );
  }
  const merged = mergeCaptures(results);
  if (merged.length === 0) {
    return NextResponse.json(
      { error: "empty", message: "No archived captures found." },
      { status: 404 },
    );
  }
  const timestamps = merged.map((c) => c.timestamp).sort();
  const years = [
    ...new Set(timestamps.map((t) => Number(t.slice(0, 4)))),
  ].sort((a, b) => a - b);
  return NextResponse.json({
    url,
    firstCapture: timestamps[0],
    lastCapture: timestamps[timestamps.length - 1],
    totalCaptures: merged.length,
    years,
    providers: responded.map((r) => r.provider.id),
  });
}
