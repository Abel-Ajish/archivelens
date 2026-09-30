const HOSTNAME_PATTERN = /^(?!-)([a-z0-9-]{1,63}(?<!-)\.)+[a-z]{2,}$/i;

export function normalizeUrl(input: string): string {
  let value = input.trim().toLowerCase();
  value = value.replace(/^[a-z][a-z0-9+.-]*:\/\//, "");
  value = value.replace(/^www\./, "");
  value = value.replace(/\/+$/, "");
  value = value.split(/[?#]/)[0];
  return value;
}

export function isValidUrl(input: string): boolean {
  const value = normalizeUrl(input);
  if (!value || value.length > 2048) return false;
  if (/\s/.test(value)) return false;
  const host = value.split("/")[0];
  if (!host.includes(".")) return false;
  return HOSTNAME_PATTERN.test(host);
}

export function getUrlValidationError(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return "Please enter a website address.";
  if (/\s/.test(trimmed)) return "The address shouldn't contain spaces.";
  const value = normalizeUrl(trimmed);
  const host = value.split("/")[0];
  if (!host.includes(".")) {
    return "That doesn't look like a valid website address. Try something like example.com.";
  }
  if (!HOSTNAME_PATTERN.test(host)) {
    return "That doesn't look like a valid website address. Check the domain and try again.";
  }
  return null;
}

export function yearOf(timestamp: string): number {
  return Number(timestamp.slice(0, 4));
}

export function monthOf(timestamp: string): string {
  return timestamp.slice(0, 6);
}

export function dayOf(timestamp: string): string {
  return timestamp.slice(0, 8);
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatDate(timestamp: string): string {
  const year = timestamp.slice(0, 4);
  const month = Number(timestamp.slice(4, 6));
  const day = Number(timestamp.slice(6, 8));
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

export function formatTime(timestamp: string): string {
  const time = timestamp.slice(8, 14);
  return `${time.slice(0, 2)}:${time.slice(2, 4)}:${time.slice(4, 6)} UTC`;
}

export function formatYearMonth(ym: string): string {
  const year = ym.slice(0, 4);
  const month = Number(ym.slice(4, 6));
  return `${MONTHS[month - 1]} ${year}`;
}

export function snapshotPreviewUrl(timestamp: string, url: string): string {
  return `https://web.archive.org/web/${timestamp}id_/${url}`;
}

export function snapshotOpenUrl(timestamp: string, url: string): string {
  return `https://web.archive.org/web/${timestamp}/${url}`;
}

export function exportCaptures(
  captures: { timestamp: string; original: string; statuscode: string; mimetype: string; provider: string }[],
  format: "json" | "csv",
): void {
  let content: string;
  let mimeType: string;
  let extension: string;

  if (format === "json") {
    content = JSON.stringify(captures, null, 2);
    mimeType = "application/json";
    extension = "json";
  } else {
    const header = "timestamp,original,statuscode,mimetype,provider";
    const rows = captures.map((c) =>
      [c.timestamp, c.original, c.statuscode, c.mimetype, c.provider]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    content = [header, ...rows].join("\n");
    mimeType = "text/csv";
    extension = "csv";
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `captures.${extension}`;
  a.click();
  URL.revokeObjectURL(url);
}
