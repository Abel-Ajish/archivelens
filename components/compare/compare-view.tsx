"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ArchiveSummary, Capture } from "@/lib/wayback/types";
import { Button } from "@/components/ui/button";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { getProvider } from "@/lib/wayback/providers";
import {
  formatDate,
  formatYearMonth,
} from "@/lib/wayback/utils";

interface CompareViewProps {
  url: string;
  initialYearA?: string;
  initialYearB?: string;
  initialProvider?: string;
}

export function CompareView({
  url,
  initialYearA,
  initialYearB,
  initialProvider,
}: CompareViewProps) {
  const [summary, setSummary] = useState<ArchiveSummary | null>(null);
  const [captureA, setCaptureA] = useState<Capture | null>(null);
  const [captureB, setCaptureB] = useState<Capture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dividerPos, setDividerPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const router = useRouter();

  const years = summary?.years ?? [];
  const yearA =
    initialYearA && years.includes(Number(initialYearA))
      ? initialYearA
      : years[0] !== undefined
        ? String(years[0])
        : undefined;
  const yearB =
    initialYearB && years.includes(Number(initialYearB))
      ? initialYearB
      : years.length > 1
        ? String(years[years.length - 1])
        : undefined;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    async function load() {
      const res = await fetch(
        `/api/wayback/summary?url=${encodeURIComponent(url)}`,
      );
      if (cancelled) return;
      if (res.status === 404) {
        setError("empty");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError("unreachable");
        setLoading(false);
        return;
      }
      const data = (await res.json()) as ArchiveSummary;
      if (cancelled) return;
      setSummary(data);

      const [resA, resB] = await Promise.all([
        fetch(
          `/api/wayback/captures?url=${encodeURIComponent(url)}&from=${yearA}&to=${yearA}`,
        ),
        fetch(
          `/api/wayback/captures?url=${encodeURIComponent(url)}&from=${yearB}&to=${yearB}`,
        ),
      ]);
      if (cancelled) return;
      if (resA.ok && resB.ok) {
        const dataA = (await resA.json()) as { captures: Capture[] };
        const dataB = (await resB.json()) as { captures: Capture[] };
        if (!cancelled) {
          setCaptureA(dataA.captures[0] ?? null);
          setCaptureB(dataB.captures[0] ?? null);
        }
      }
      if (!cancelled) setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [url, yearA, yearB]);

  const updateDivider = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setDividerPos(Math.max(5, Math.min(95, pos)));
  }, []);

  function handlePointerDown(event: React.PointerEvent) {
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateDivider(event.clientX);
  }

  function handlePointerMove(event: React.PointerEvent) {
    if (!draggingRef.current) return;
    updateDivider(event.clientX);
  }

  function handlePointerUp() {
    draggingRef.current = false;
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setDividerPos((p) => Math.max(5, p - 4));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setDividerPos((p) => Math.min(95, p + 4));
    }
  }

  function stepYearB(delta: number) {
    if (!yearB) return;
    const index = years.indexOf(Number(yearB));
    const next = years[index + delta];
    if (next !== undefined) {
      router.push(
        `/compare?url=${encodeURIComponent(url)}&a=${yearA}&b=${next}&provider=${initialProvider ?? "wayback"}`,
      );
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <LoadingIndicator label="Preparing comparison…" />
        <p className="text-sm text-ink-faint">Loading both snapshots</p>
      </div>
    );
  }

  if (error === "empty") {
    return (
      <div className="py-16 text-center">
        <h2 className="font-serif text-2xl text-ink">No archived captures found.</h2>
        <p className="mt-3 text-sm text-ink-muted">
          The Internet Archive doesn&apos;t appear to have a snapshot for this
          address.
        </p>
        <div className="mt-6">
          <Button variant="secondary" href="/">
            Search another website
          </Button>
        </div>
      </div>
    );
  }

  if (error === "unreachable") {
    return (
      <div className="py-16 text-center">
        <h2 className="font-serif text-2xl text-ink">The archive couldn&apos;t be reached.</h2>
        <p className="mt-3 text-sm text-ink-muted">Please try again in a moment.</p>
        <div className="mt-6">
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const providerA = getProvider(captureA?.provider ?? initialProvider ?? "wayback");
  const providerB = getProvider(captureB?.provider ?? "wayback");
  const urlA = captureA ? providerA.replayUrl(captureA.timestamp, url) : "#";
  const urlB = captureB ? providerB.replayUrl(captureB.timestamp, url) : "#";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="secondary"
          onClick={() => stepYearB(-1)}
          disabled={!yearB || years.indexOf(Number(yearB)) <= 0}
        >
          ← Older
        </Button>
        <Button
          variant="secondary"
          onClick={() => stepYearB(1)}
          disabled={
            !yearB || years.indexOf(Number(yearB)) >= years.length - 1
          }
        >
          Newer →
        </Button>
        {captureA && (
          <Link
            href={`/snapshot/${url}/${captureA.timestamp}?provider=${captureA.provider}`}
            className="u-link ml-auto text-sm text-sienna-deep"
          >
            Open snapshot A ↗
          </Link>
        )}
        {captureB && (
          <a
            href={urlB}
            target="_blank"
            rel="noopener noreferrer"
            className="u-link text-sm text-sienna-deep"
          >
            Open snapshot B ↗
          </a>
        )}
      </div>

      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-xl border border-warmline/60 shadow-whisper"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="grid gap-0 sm:grid-cols-2">
          <div className="flex flex-col border-b border-warmline/60 sm:border-r sm:border-b-0">
            <div className="flex items-center justify-between px-5 py-3">
              <span className="text-xs font-medium tracking-[0.15em] text-ink-faint uppercase">
                Snapshot A
              </span>
              <span className="text-sm text-ink tabular-nums">{yearA}</span>
            </div>
            {captureA && (
              <iframe
                src={urlA}
                title={`Snapshot A — ${url} ${formatDate(captureA.timestamp)}`}
                className="h-[50vh] w-full border-0 bg-card sm:h-[60vh]"
                style={{ pointerEvents: "none" }}
                tabIndex={-1}
                aria-hidden="true"
              />
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center justify-between px-5 py-3">
              <span className="text-xs font-medium tracking-[0.15em] text-ink-faint uppercase">
                Snapshot B
              </span>
              <span className="text-sm text-ink tabular-nums">{yearB}</span>
            </div>
            {captureB && (
              <iframe
                src={urlB}
                title={`Snapshot B — ${url} ${formatDate(captureB.timestamp)}`}
                className="h-[50vh] w-full border-0 bg-card sm:h-[60vh]"
                style={{ pointerEvents: "none" }}
                tabIndex={-1}
                aria-hidden="true"
              />
            )}
          </div>
        </div>

        <div
          className="compare-divider absolute inset-y-0 z-10 w-0.5 bg-sienna"
          style={{ left: `${dividerPos}%` }}
          role="separator"
          aria-orientation="vertical"
          aria-label="Comparison divider"
          aria-valuenow={Math.round(dividerPos)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          <span
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-sienna text-card shadow-lift"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M4.5 2L1.5 7l3 5M9.5 2l3 5-3 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-10 gap-y-2 text-sm text-ink-muted">
        {captureA && (
          <span>
            A — {formatDate(captureA.timestamp)} ·{" "}
            {formatYearMonth(captureA.timestamp.slice(0, 6))} · {providerA.name}
          </span>
        )}
        {captureB && (
          <span>
            B — {formatDate(captureB.timestamp)} ·{" "}
            {formatYearMonth(captureB.timestamp.slice(0, 6))} · {providerB.name}
          </span>
        )}
      </div>
    </div>
  );
}
