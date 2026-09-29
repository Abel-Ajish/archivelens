"use client";

import Link from "next/link";
import { useState } from "react";
import type { Capture } from "@/lib/wayback/types";
import { formatDate, formatTime } from "@/lib/wayback/utils";
import { ProviderTag } from "@/components/ui/provider-tag";

interface CaptureListProps {
  url: string;
  captures: Capture[];
  selectedTimestamp?: string;
  onSelect?: (capture: Capture) => void;
  preview?: boolean;
}

function CaptureRow({
  url,
  capture,
  selected,
  onSelect,
  preview,
}: {
  url: string;
  capture: Capture;
  selected: boolean;
  onSelect?: (capture: Capture) => void;
  preview: boolean;
}) {
  const [thumbOk, setThumbOk] = useState(true);

  return (
    <li className="group relative">
      <div
        className={`flex w-full items-center justify-between gap-4 px-4 py-3.5 ${
          selected ? "bg-sienna-soft/50" : ""
        }`}
      >
        <button
          type="button"
          onClick={() => onSelect?.(capture)}
          className="flex flex-1 flex-col text-left"
          aria-current={selected ? "true" : undefined}
        >
          <span className="text-sm font-medium text-ink">
            {formatDate(capture.timestamp)}
          </span>
          <span className="text-xs text-ink-muted tabular-nums">
            {formatTime(capture.timestamp)}
          </span>
        </button>
        <span className="flex items-center gap-3">
          <ProviderTag providerId={capture.provider} />
          <Link
            href={`/snapshot/${url}/${capture.timestamp}?provider=${capture.provider}`}
            className="u-link text-sm text-sienna-deep"
          >
            View snapshot →
          </Link>
        </span>
      </div>

      {preview && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-full left-1/2 z-20 hidden w-56 -translate-x-1/2 translate-y-2 rounded-lg border border-warmline/60 bg-card p-3 shadow-lift group-hover:block"
        >
          {thumbOk ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`https://web.archive.org/web/${capture.timestamp}im_/${url}`}
              alt=""
              className="h-28 w-full rounded-md bg-sand object-cover"
              onError={() => setThumbOk(false)}
            />
          ) : (
            <div className="flex h-28 w-full items-center justify-center rounded-md bg-sand text-xs text-ink-faint">
              No preview
            </div>
          )}
          <p className="mt-2 text-xs font-medium text-ink">
            {formatDate(capture.timestamp)}
          </p>
          <p className="text-xs text-ink-muted tabular-nums">
            {formatTime(capture.timestamp)}
          </p>
          <p className="mt-1 text-xs text-sienna-deep">Open →</p>
        </div>
      )}
    </li>
  );
}

export function CaptureList({
  url,
  captures,
  selectedTimestamp,
  onSelect,
  preview = false,
}: CaptureListProps) {
  if (captures.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-ink-muted">
        No captures found for this period.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-warmline/50" aria-label="Captures">
      {captures.map((capture) => (
        <CaptureRow
          key={capture.timestamp}
          url={url}
          capture={capture}
          selected={capture.timestamp === selectedTimestamp}
          onSelect={onSelect}
          preview={preview}
        />
      ))}
    </ul>
  );
}
