import { NextRequest, NextResponse } from "next/server";
import { fetchFromAllProviders, mergeCaptures } from "@/lib/wayback/providers";
import { cached, CACHE_TTL } from "@/lib/wayback/cache";
import { isValidUrl, normalizeUrl } from "@/lib/wayback/utils";

export const dynamic = "force-dynamic";

interface TimelineData {
  url: string;
  months: string[];
  providers: string[];
}

type TimelineResult =
  | { status: "ok"; data: TimelineData }
  | { status: "empty" }
  | { status: "unreachable" };

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
    const result = await cached<TimelineResult>(
      "timeline",
      { url },
      CACHE_TTL.timeline,
      async (): Promise<TimelineResult> => {
        const results = await fetchFromAllProviders(url, { limit: 3000 });
        const responded = results.filter((r) => !r.error);
        if (responded.length === 0) return { status: "unreachable" };
        const merged = mergeCaptures(results);
        const months = [
          ...new Set(merged.map((c) => c.timestamp.slice(0, 6))),
        ].sort();
        return {
          status: "ok",
          data: {
            url,
            months,
            providers: responded.map((r) => r.provider.id),
          },
        };
      },
    );
    if (result.status === "empty") {
      return NextResponse.json(
        { error: "empty", message: "No archived captures found." },
        { status: 404 },
      );
    }
    if (result.status === "unreachable") {
      return NextResponse.json(
        { error: "unreachable", message: "The archive couldn't be reached." },
        { status: 502 },
      );
    }
    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json(
      { error: "unreachable", message: "The archive couldn't be reached." },
      { status: 502 },
    );
  }
}
