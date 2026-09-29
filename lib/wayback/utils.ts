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
