export interface Capture {
  timestamp: string;
  original: string;
  statuscode: string;
  mimetype: string;
}

export interface ArchiveSummary {
  url: string;
  firstCapture: string | null;
  lastCapture: string | null;
  totalCaptures: number | null;
  years: number[];
}

export interface TimelineData {
  url: string;
  months: string[];
}

export class WaybackError extends Error {
  constructor(
    message: string,
    public readonly kind: "invalid" | "unreachable" | "empty",
  ) {
    super(message);
    this.name = "WaybackError";
  }
}
