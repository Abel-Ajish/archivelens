import { NextRequest, NextResponse } from "next/server";
import { fetchFromAllProviders, mergeCaptures } from "@/lib/wayback/providers";
import { cached, CACHE_TTL } from "@/lib/wayback/cache";
import { isValidUrl, normalizeUrl } from "@/lib/wayback/utils";

export const dynamic = "force-dynamic";

interface SummaryData {
  url: string;
  firstCapture: string;
  lastCapture: string;
  totalCaptures: number;
  years: number[];
  yearCounts: Record<string, number>;
  providers: string[];
}

type SummaryResult =
  | { status: "ok"; data: SummaryData }
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
    const result = await cached<SummaryResult>(
      "summary",
      { url },
      CACHE_TTL.summary,
      async (): Promise<SummaryResult> => {
        const results = await fetchFromAllProviders(url, { limit: 2000 });
        const responded = results.filter((r) => !r.error);
        if (responded.length === 0) return { status: "unreachable" };
        const merged = mergeCaptures(results);
        if (merged.length === 0) return { status: "empty" };
        const timestamps = merged.map((c) => c.timestamp).sort();
        const years = [
          ...new Set(timestamps.map((t) => Number(t.slice(0, 4)))),
        ].sort((a, b) => a - b);
        const yearCounts: Record<string, number> = {};
        for (const t of timestamps) {
          const y = t.slice(0, 4);
          yearCounts[y] = (yearCounts[y] ?? 0) + 1;
        }
        return {
          status: "ok",
          data: {
            url,
            firstCapture: timestamps[0],
            lastCapture: timestamps[timestamps.length - 1],
            totalCaptures: merged.length,
            years,
            yearCounts,
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
