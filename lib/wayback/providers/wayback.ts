import type { ArchiveProvider } from "./types";

export const waybackProvider: ArchiveProvider = {
  id: "wayback",
  name: "Wayback Machine",
  supportsPreview: true,
  replayUrl: (timestamp, url) =>
    `https://web.archive.org/web/${timestamp}id_/${url}`,
  async fetchCaptures(url, opts = {}) {
    const params = new URLSearchParams({
      url,
      output: "json",
      fl: "timestamp,original,statuscode,mimetype",
      filter: "statuscode:200",
    });
    if (opts.from) params.set("from", opts.from);
    if (opts.to) params.set("to", opts.to);
    if (opts.limit) params.set("limit", String(opts.limit));
    const res = await fetch(
      `https://web.archive.org/cdx/search/cdx?${params.toString()}`,
      {
        signal: AbortSignal.timeout(20000),
        headers: { Accept: "application/json" },
      },
    );
    if (!res.ok) throw new Error(`Wayback CDX error: ${res.status}`);
    const rows = (await res.json()) as string[][];
    return rows.slice(1).map((row) => ({
      timestamp: row[0],
      original: row[1],
      statuscode: row[2],
      mimetype: row[3],
      provider: "wayback",
    }));
  },
};
