export interface ProviderCapture {
  timestamp: string;
  original: string;
  statuscode: string;
  mimetype: string;
  provider: string;
}

export interface FetchOptions {
  from?: string;
  to?: string;
  limit?: number;
}

export interface ArchiveProvider {
  id: string;
  name: string;
  supportsPreview: boolean;
  fetchCaptures(url: string, opts?: FetchOptions): Promise<ProviderCapture[]>;
  replayUrl(timestamp: string, url: string): string;
}

export interface ProviderResult {
  provider: ArchiveProvider;
  captures: ProviderCapture[];
  error?: string;
}
