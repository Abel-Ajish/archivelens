"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Capture } from "@/lib/wayback/types";
import { Button } from "@/components/ui/button";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import {
  formatDate,
  formatTime,
  monthOf,
  snapshotOpenUrl,
  snapshotPreviewUrl,
} from "@/lib/wayback/utils";

function shiftMonth(month: string, delta: number): string {
  const year = Number(month.slice(0, 4));
  const m = Number(month.slice(4, 6));
  const date = new Date(year, m - 1 + delta, 1);
  const y = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}${mm}`;
}

interface SnapshotViewerProps {
  url: string;
  timestamp: string;
}

export function SnapshotViewer({ url, timestamp }: SnapshotViewerProps) {
  const [neighbors, setNeighbors] = useState<{
    prev?: Capture;
    next?: Capture;
  }>({});
  const [loading, setLoading] = useState(true);

  const loadNeighbors = useCallback(async () => {
    setLoading(true);
    const month = monthOf(timestamp);
    try {
      const res = await fetch(
        `/api/wayback/captures?url=${encodeURIComponent(url)}&from=${month}&to=${month}`,
      );
      if (!res.ok) return;
      const data = (await res.json()) as { captures: Capture[] };
      const index = data.captures.findIndex((c) => c.timestamp === timestamp);
      const result: { prev?: Capture; next?: Capture } = {};
      if (index > 0) {
        result.prev = data.captures[index - 1];
      } else {
        const prevRes = await fetch(
          `/api/wayback/captures?url=${encodeURIComponent(url)}&from=${shiftMonth(month, -1)}&to=${shiftMonth(month, -1)}`,
        );
        if (prevRes.ok) {
          const prevData = (await prevRes.json()) as { captures: Capture[] };
          result.prev = prevData.captures[prevData.captures.length - 1];
        }
      }
      if (index >= 0 && index < data.captures.length - 1) {
        result.next = data.captures[index + 1];
      } else {
        const nextRes = await fetch(
          `/api/wayback/captures?url=${encodeURIComponent(url)}&from=${shiftMonth(month, 1)}&to=${shiftMonth(month, 1)}`,
        );
        if (nextRes.ok) {
          const nextData = (await nextRes.json()) as { captures: Capture[] };
          result.next = nextData.captures[0];
        }
      }
      setNeighbors(result);
    } finally {
      setLoading(false);
    }
  }, [url, timestamp]);

  useEffect(() => {
    loadNeighbors();
  }, [loadNeighbors]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        {neighbors.prev ? (
          <Button
            variant="secondary"
            href={`/snapshot/${url}/${neighbors.prev.timestamp}`}
            ariaLabel="Previous snapshot"
          >
            ← Older
          </Button>
        ) : (
          <Button variant="secondary" disabled ariaLabel="Previous snapshot">
            ← Older
          </Button>
        )}
        {neighbors.next ? (
          <Button
            variant="secondary"
            href={`/snapshot/${url}/${neighbors.next.timestamp}`}
            ariaLabel="Next snapshot"
          >
            Newer →
          </Button>
        ) : (
          <Button variant="secondary" disabled ariaLabel="Next snapshot">
            Newer →
          </Button>
        )}
        <Button
          variant="secondary"
          href={`/compare?url=${encodeURIComponent(url)}&a=${timestamp}&b=${neighbors.next?.timestamp ?? ""}`}
          disabled={!neighbors.next}
        >
          Compare
        </Button>
        <a
          href={snapshotOpenUrl(timestamp, url)}
          target="_blank"
          rel="noopener noreferrer"
          className="u-link ml-auto text-sm text-sienna-deep"
        >
          Open archived page ↗
        </a>
      </div>

      {loading && (
        <div className="px-1 py-2">
          <LoadingIndicator label="Locating neighbouring captures…" />
        </div>
      )}

      <div className="snapshot-frame overflow-hidden rounded-xl border border-warmline/60">
        <iframe
          src={snapshotPreviewUrl(timestamp, url)}
          title={`Archived snapshot of ${url} from ${formatDate(timestamp)}`}
          className="h-[70vh] w-full border-0 bg-card"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>

      <dl className="grid gap-x-12 gap-y-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs tracking-wide text-ink-faint uppercase">Original URL</dt>
          <dd className="mt-1 text-sm text-ink">{url}</dd>
        </div>
        <div>
          <dt className="text-xs tracking-wide text-ink-faint uppercase">Captured</dt>
          <dd className="mt-1 text-sm text-ink">
            {formatDate(timestamp)} · {formatTime(timestamp).replace(" UTC", "")} UTC
          </dd>
        </div>
        <div>
          <dt className="text-xs tracking-wide text-ink-faint uppercase">Archive timestamp</dt>
          <dd className="mt-1 text-sm text-ink tabular-nums">{timestamp}</dd>
        </div>
        <div>
          <dt className="text-xs tracking-wide text-ink-faint uppercase">Status</dt>
          <dd className="mt-1 text-sm text-ink">Available</dd>
        </div>
      </dl>
    </div>
  );
}
