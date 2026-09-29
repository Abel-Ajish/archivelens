import type { ArchiveProvider, ProviderCapture, ProviderResult } from "./types";
import { waybackProvider } from "./wayback";
import { arquivoProvider } from "./arquivo";
import { commonCrawlProvider } from "./commoncrawl";

export const providers: ArchiveProvider[] = [
  waybackProvider,
  arquivoProvider,
  commonCrawlProvider,
];

export function getProvider(id: string | null): ArchiveProvider {
  return providers.find((p) => p.id === id) ?? waybackProvider;
}

export async function fetchFromAllProviders(
  url: string,
  opts?: { from?: string; to?: string; limit?: number },
): Promise<ProviderResult[]> {
  return Promise.all(
    providers.map(async (provider) => {
      try {
        const captures = await provider.fetchCaptures(url, opts);
        return { provider, captures };
      } catch (error) {
        return {
          provider,
          captures: [],
          error: error instanceof Error ? error.message : String(error),
        };
      }
    }),
  );
}

const PRIORITY = ["wayback", "arquivo", "commoncrawl"];

export function mergeCaptures(results: ProviderResult[]): ProviderCapture[] {
  const seen = new Set<string>();
  const merged: ProviderCapture[] = [];
  const sorted = [...results].sort(
    (a, b) => PRIORITY.indexOf(a.provider.id) - PRIORITY.indexOf(b.provider.id),
  );
  for (const result of sorted) {
    for (const capture of result.captures) {
      if (!seen.has(capture.timestamp)) {
        seen.add(capture.timestamp);
        merged.push(capture);
      }
    }
  }
  return merged.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}
