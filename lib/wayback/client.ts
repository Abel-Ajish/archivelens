import type { ArchiveSummary, Capture, TimelineData } from "./types";
import { WaybackError } from "./types";

async function getJson<T>(url: string, timeoutMs = 20000): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs),
      headers: { Accept: "application/json" },
    });
  } catch {
    throw new WaybackError("The archive couldn't be reached.", "unreachable");
  }
  if (!response.ok) {
    throw new WaybackError("The archive couldn't be reached.", "unreachable");
  }
  return (await response.json()) as T;
}

export async function fetchArchiveSummary(url: string): Promise<ArchiveSummary> {
  const base = `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(url)}&output=json&filter=statuscode:200`;

  const [yearly, countResult] = await Promise.all([
    getJson<string[][]>(`${base}&fl=timestamp&collapse=timestamp:4&limit=-1`),
    getJson<{ pages?: number }>(
      `${base}&fl=timestamp&showNumPages=true&pageSize=10000`,
    ),
  ]);

  const years = yearly
    .slice(1)
    .map((row) => Number(row[0].slice(0, 4)))
    .filter((y) => Number.isInteger(y))
    .sort((a, b) => a - b);

  const timestamps = yearly.slice(1).map((row) => row[0]).sort();

  return {
    url,
    firstCapture: timestamps[0] ?? null,
    lastCapture: timestamps[timestamps.length - 1] ?? null,
    totalCaptures:
      typeof countResult?.pages === "number" ? countResult.pages * 10000 : null,
    years,
  };
}

export async function fetchTimeline(url: string): Promise<TimelineData> {
  const result = await getJson<string[][]>(
    `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(url)}&output=json&fl=timestamp&filter=statuscode:200&collapse=timestamp:6&limit=-1`,
  );

  const months = [
    ...new Set(result.slice(1).map((row) => row[0].slice(0, 6))),
  ].sort();

  return { url, months };
}

export async function fetchCaptures(
  url: string,
  from: string,
  to: string,
): Promise<Capture[]> {
  const result = await getJson<string[][]>(
    `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(url)}&output=json&fl=timestamp,original,statuscode,mimetype&filter=statuscode:200&from=${from}&to=${to}&collapse=timestamp:8&limit=-1`,
  );

  return result.slice(1).map((row) => ({
    timestamp: row[0],
    original: row[1],
    statuscode: row[2],
    mimetype: row[3],
  }));
}
