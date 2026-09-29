import { NextRequest, NextResponse } from "next/server";
import { fetchFromAllProviders, mergeCaptures } from "@/lib/wayback/providers";
import { cached, CACHE_TTL } from "@/lib/wayback/cache";
import { isValidUrl, normalizeUrl } from "@/lib/wayback/utils";

export const dynamic = "force-dynamic";

interface CapturesData {
  captures: ReturnType<typeof mergeCaptures>;
}

type CapturesResult =
  | { status: "ok"; data: CapturesData }
  | { status: "empty" }
  | { status: "unreachable" };

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
  try {
    const result = await cached<CapturesResult>(
      "captures",
      { url, from, to },
      CACHE_TTL.captures,
      async (): Promise<CapturesResult> => {
        const results = await fetchFromAllProviders(url, {
          from,
          to,
          limit: 5000,
        });
        const responded = results.filter((r) => !r.error);
        if (responded.length === 0) return { status: "unreachable" };
        const captures = mergeCaptures(results);
        return { status: "ok", data: { captures } };
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
