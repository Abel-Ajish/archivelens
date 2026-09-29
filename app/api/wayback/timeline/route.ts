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
  const months = [
    ...new Set(merged.map((c) => c.timestamp.slice(0, 6))),
  ].sort();
  return NextResponse.json({
    url,
    months,
    providers: responded.map((r) => r.provider.id),
  });
}
