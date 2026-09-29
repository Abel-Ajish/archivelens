import type { ArchiveProvider } from "./types";

export const arquivoProvider: ArchiveProvider = {
  id: "arquivo",
  name: "Arquivo.pt",
  supportsPreview: true,
  replayUrl: (timestamp, url) =>
    `https://arquivo.pt/wayback/${timestamp}/${url}`,
  async fetchCaptures(url, opts = {}) {
    const params = new URLSearchParams({ url, output: "json" });
    if (opts.from) params.set("from", opts.from);
    if (opts.to) params.set("to", opts.to);
    params.set("limit", String(opts.limit ?? 10000));
    const res = await fetch(
      `https://arquivo.pt/wayback/cdx?${params.toString()}`,
      {
        signal: AbortSignal.timeout(25000),
        headers: { Accept: "application/json" },
      },
    );
    if (!res.ok) throw new Error(`Arquivo.pt CDX error: ${res.status}`);
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
          provider: "arquivo",
        };
      });
  },
};
