"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ArchiveSummary, Capture } from "@/lib/wayback/types";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { StateBlock } from "@/components/ui/state-block";
import { YearStrip, type YearDensity } from "./year-strip";
import { CaptureList } from "./capture-list";
import { providers } from "@/lib/wayback/providers";
import { exportCaptures, formatDate, formatYearMonth } from "@/lib/wayback/utils";

interface TimelineSectionProps {
  url: string;
  showMetadata?: boolean;
  yearFilter?: boolean;
  preview?: boolean;
  onCaptureSelect?: (capture: Capture) => void;
}

type Status =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "empty" }
  | { kind: "ready"; summary: ArchiveSummary; years: YearDensity[] };

export function TimelineSection({
  url,
  showMetadata = true,
  yearFilter = false,
  preview = false,
  onCaptureSelect,
}: TimelineSectionProps) {
  const [status, setStatus] = useState<Status>({ kind: "loading" });
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>();
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [capturesLoading, setCapturesLoading] = useState(false);
  const [filterYear, setFilterYear] = useState<string>("all");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus({ kind: "loading" });
    setSelectedMonth(undefined);
    setCaptures([]);

    async function load() {
      const [summaryRes, timelineRes] = await Promise.all([
        fetch(`/api/wayback/summary?url=${encodeURIComponent(url)}`),
        fetch(`/api/wayback/timeline?url=${encodeURIComponent(url)}`),
      ]);
      if (cancelled) return;

      if (summaryRes.status === 400) {
        setStatus({
          kind: "error",
          message: "That doesn't look like a valid website address.",
        });
        return;
      }
      if (summaryRes.status === 404) {
        setStatus({ kind: "empty" });
        return;
      }
      if (!summaryRes.ok || !timelineRes.ok) {
        setStatus({ kind: "error", message: "unreachable" });
        return;
      }

      const summary = (await summaryRes.json()) as ArchiveSummary;
      const timeline = (await timelineRes.json()) as { months: string[] };

      const byYear = new Map<number, string[]>();
      for (const month of timeline.months) {
        const year = Number(month.slice(0, 4));
        const list = byYear.get(year) ?? [];
        list.push(month);
        byYear.set(year, list);
      }
      const years: YearDensity[] = [...byYear.entries()]
        .map(([year, months]) => ({ year, months }))
        .sort((a, b) => a.year - b.year);

      setStatus({ kind: "ready", summary, years });
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [url, reloadKey]);

  const loadCaptures = useCallback(
    async (month: string) => {
      setCapturesLoading(true);
      setSelectedMonth(month);
      try {
        const res = await fetch(
          `/api/wayback/captures?url=${encodeURIComponent(url)}&from=${month}&to=${month}`,
        );
        if (res.ok) {
          const data = (await res.json()) as { captures: Capture[] };
          setCaptures(data.captures);
        } else {
          setCaptures([]);
        }
      } catch {
        setCaptures([]);
      } finally {
        setCapturesLoading(false);
      }
    },
    [url],
  );

  const visibleYears = useMemo(() => {
    if (status.kind !== "ready" || filterYear === "all") {
      return status.kind === "ready" ? status.years : [];
    }
    return status.years.filter((y) => String(y.year) === filterYear);
  }, [status, filterYear]);

  if (status.kind === "loading") {
    return (
      <div className="flex flex-col gap-10" aria-busy="true" aria-label="Loading archive data">
        <div className="flex flex-wrap gap-x-12 gap-y-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-3 w-16 animate-pulse rounded bg-sand" />
              <div className="h-4 w-20 animate-pulse rounded bg-sand" />
            </div>
          ))}
        </div>
        <div className="flex items-end gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-1 flex-col items-center gap-1"
            >
              <div
                className="w-full animate-pulse rounded-t bg-sand"
                style={{ height: `${20 + Math.random() * 60}px` }}
              />
              <div className="h-2 w-6 animate-pulse rounded bg-sand" />
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-4 py-8">
          <LoadingIndicator label="Searching the archive…" />
          <p className="text-sm text-ink-faint">Looking through historical captures</p>
        </div>
      </div>
    );
  }

  if (status.kind === "error") {
    const invalid = status.message !== "unreachable";
    return (
      <StateBlock
        title={invalid ? "That doesn't look like a valid website address." : "The archive couldn't be reached."}
        actionLabel={invalid ? "Try again" : "Retry"}
        actionHref={invalid ? "/" : undefined}
        onAction={invalid ? undefined : () => setReloadKey((k) => k + 1)}
      >
        {invalid
          ? "Check the address and try again."
          : "Please try again in a moment."}
      </StateBlock>
    );
  }

  if (status.kind === "empty") {
    return (
      <StateBlock
        title="No archived captures found."
        actionLabel="Search another website"
        actionHref="/"
      >
        The Internet Archive doesn&apos;t appear to have a snapshot for this
        address.
      </StateBlock>
    );
  }

  const { summary, years } = status;

  return (
    <div className="flex flex-col gap-10">
      {showMetadata && (
        <dl className="flex flex-wrap gap-x-12 gap-y-4">
          <div>
            <dt className="text-xs tracking-wide text-ink-faint uppercase">First captured</dt>
            <dd className="mt-1 text-sm text-ink">
              {summary.firstCapture ? formatDate(summary.firstCapture) : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs tracking-wide text-ink-faint uppercase">Last captured</dt>
            <dd className="mt-1 text-sm text-ink">
              {summary.lastCapture ? formatDate(summary.lastCapture) : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs tracking-wide text-ink-faint uppercase">Total captures</dt>
            <dd className="mt-1 text-sm text-ink tabular-nums">
              {summary.totalCaptures !== null
                ? `~${summary.totalCaptures.toLocaleString()}`
                : "—"}
            </dd>
          </div>
          {summary.providers.length > 0 && (
            <div>
              <dt className="text-xs tracking-wide text-ink-faint uppercase">Sources</dt>
              <dd className="mt-1 text-sm text-ink">
                {summary.providers
                  .map((id) => providers.find((p) => p.id === id)?.name ?? id)
                  .join(", ")}
              </dd>
            </div>
          )}
        </dl>
      )}

      {showMetadata && summary.yearCounts && (
        <div className="flex flex-col gap-3">
          <h3 className="text-xs tracking-wide text-ink-faint uppercase">
            Captures per year
          </h3>
          <div className="flex items-end gap-1" aria-label="Captures per year">
            {years.map((y) => {
              const count = summary.yearCounts[String(y.year)] ?? 0;
              const maxCount = Math.max(
                ...years.map((yy) => summary.yearCounts[String(yy.year)] ?? 0),
              );
              const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
              return (
                <div
                  key={y.year}
                  className="flex flex-1 flex-col items-center gap-1"
                  title={`${y.year}: ${count} captures`}
                >
                  <div
                    className="w-full rounded-t bg-sienna/60 transition-all hover:bg-sienna"
                    style={{ height: `${Math.max(height, 4)}%`, minHeight: 4 }}
                  />
                  <span className="text-[10px] text-ink-faint tabular-nums">
                    {String(y.year).slice(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {yearFilter && years.length > 0 && (
        <div className="flex items-center gap-3">
          <label htmlFor="year-filter" className="text-sm text-ink-muted">
            Filter by year
          </label>
          <select
            id="year-filter"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="rounded-lg border border-warmline bg-card px-3 py-2 text-sm text-ink shadow-whisper focus:border-sienna focus:outline-none"
          >
            <option value="all">All years</option>
            {years.map((y) => (
              <option key={y.year} value={String(y.year)}>
                {y.year}
              </option>
            ))}
          </select>
        </div>
      )}

      {years.length > 0 ? (
        <YearStrip
          years={visibleYears}
          selectedMonth={selectedMonth}
          onSelect={(month) => loadCaptures(month)}
        />
      ) : (
        <p className="py-8 text-center text-sm text-ink-muted">
          No capture data available.
        </p>
      )}

      {selectedMonth && (
        <section
          aria-label={`Captures for ${formatYearMonth(selectedMonth)}`}
          className="rounded-xl border border-warmline/60 bg-card p-2 shadow-whisper"
        >
          <div className="flex items-center justify-between px-4 pt-3 pb-1">
            <h3 className="font-serif text-lg text-ink">
              {formatYearMonth(selectedMonth)}
            </h3>
            {captures.length > 0 && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => exportCaptures(captures, "json")}
                  className="u-link text-xs text-sienna-deep"
                >
                  Export JSON
                </button>
                <button
                  type="button"
                  onClick={() => exportCaptures(captures, "csv")}
                  className="u-link text-xs text-sienna-deep"
                >
                  Export CSV
                </button>
              </div>
            )}
          </div>
          {capturesLoading ? (
            <div className="px-4 py-6">
              <LoadingIndicator label="Loading captures…" />
            </div>
          ) : (
            <CaptureList
              url={url}
              captures={captures}
              onSelect={onCaptureSelect}
              preview={preview}
            />
          )}
        </section>
      )}

      {years.length > 0 && !selectedMonth && (
        <p className="text-center text-sm text-ink-faint">
          Select a point on the timeline to view its captures.
        </p>
      )}
    </div>
  );
}
