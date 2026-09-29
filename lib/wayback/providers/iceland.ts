import type { ArchiveProvider } from "./types";

export const icelandProvider: ArchiveProvider = {
  id: "iceland",
  name: "Icelandic Web Archive",
  supportsPreview: false,
  replayUrl: () => "https://vefsafn.is/",
  async fetchCaptures(url, opts = {}) {
    const params = new URLSearchParams({ url, output: "json" });
    if (opts.from) params.set("from", opts.from);
    if (opts.to) params.set("to", opts.to);
    params.set("limit", String(opts.limit ?? 5000));
    const res = await fetch(
      `https://vefsafn.is/cdx?${params.toString()}`,
      {
        signal: AbortSignal.timeout(20000),
        headers: { Accept: "application/json" },
      },
    );
    if (!res.ok) throw new Error(`Icelandic CDX error: ${res.status}`);
    const text = await res.text();
    return text
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const row = JSON.parse(line) as {
          timestamp: string;
          url: string;
          status: string;
          mime: string;
        };
        return {
          timestamp: row.timestamp,
          original: row.url,
          statuscode: row.status,
          mimetype: row.mime,
          provider: "iceland",
        };
      });
  },
};
