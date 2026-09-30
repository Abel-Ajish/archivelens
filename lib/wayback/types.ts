export interface Capture {
  timestamp: string;
  original: string;
  statuscode: string;
  mimetype: string;
  provider: string;
}

export interface ArchiveSummary {
  url: string;
  firstCapture: string | null;
  lastCapture: string | null;
  totalCaptures: number | null;
  years: number[];
  yearCounts: Record<string, number>;
  providers: string[];
}

export interface TimelineData {
  url: string;
  months: string[];
  providers: string[];
}
