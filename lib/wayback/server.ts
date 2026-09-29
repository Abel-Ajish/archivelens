export async function verifyCapture(
  url: string,
  timestamp: string,
): Promise<boolean | null> {
  let response: Response;
  try {
    response = await fetch(
      `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(url)}&output=json&fl=timestamp&from=${timestamp}&to=${timestamp}&limit=1`,
      {
        signal: AbortSignal.timeout(15000),
        headers: { Accept: "application/json" },
      },
    );
  } catch {
    return null;
  }
  if (!response.ok) {
    return null;
  }
  const rows = (await response.json()) as string[][];
  return rows.slice(1).some((row) => row[0] === timestamp);
}
