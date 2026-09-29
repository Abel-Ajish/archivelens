import type { ArchiveProvider } from "./types";
import { cached, CACHE_TTL } from "../cache";

export const commonCrawlProvider: ArchiveProvider = {
  id: "commoncrawl",
  name: "Common Crawl",
  supportsPreview: false,
  replayUrl: () => "https://commoncrawl.org/",
  async fetchCaptures(url, opts = {}) {
    const indexes = await cached<{ id: string }[]>(
      "collinfo",
      {},
      CACHE_TTL.collinfo,
      async () => {
        const res = await fetch(
          "https://index.commoncrawl.org/collinfo.json",
          { signal: AbortSignal.timeout(15000) },
        );
        if (!res.ok) throw new Error("Common Crawl collinfo error");
        return res.json();
      },
    );
    const latest = indexes[0]?.id;
    if (!latest) throw new Error("No Common Crawl indexes available");

    const params = new URLSearchParams({ url, output: "json" });
    if (opts.limit) params.set("limit", String(opts.limit));
    const res = await fetch(
      `https://index.commoncrawl.org/${latest}-index?${params.toString()}`,
      {
        signal: AbortSignal.timeout(30000),
        headers: { Accept: "application/json" },
      },
    );
    if (!res.ok) throw new Error(`Common Crawl query error: ${res.status}`);
    const text = await res.text();
    return text
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const row = JSON.parse(line) as {
          timestamp: string;
          original: string;
          status: string;
          mimetype: string;
        };
        return {
          timestamp: row.timestamp,
          original: row.original,
          statuscode: row.status,
          mimetype: row.mimetype,
          provider: "commoncrawl",
        };
      });
  },
};
