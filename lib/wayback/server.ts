import { getProvider } from "./providers";

export async function verifyCapture(
  url: string,
  timestamp: string,
  providerId?: string,
): Promise<boolean | null> {
  const provider = getProvider(providerId ?? null);
  try {
    const captures = await provider.fetchCaptures(url, {
      from: timestamp,
      to: timestamp,
      limit: 1,
    });
    if (captures.length > 0) return true;
  } catch {
    return null;
  }
  if (provider.id === "wayback") {
    try {
      const res = await fetch(
        `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(url)}&output=json&fl=timestamp&from=${timestamp}&to=${timestamp}&limit=1`,
        { signal: AbortSignal.timeout(15000) },
      );
      if (res.ok) {
        const rows = (await res.json()) as string[][];
        return rows.slice(1).some((row) => row[0] === timestamp);
      }
    } catch {
      return null;
    }
  }
  return false;
}
