"use client";

import { useRef, type KeyboardEvent } from "react";

export interface YearDensity {
  year: number;
  months: string[];
}

interface YearStripProps {
  years: YearDensity[];
  selectedMonth?: string;
  onSelect: (month: string) => void;
}

export function YearStrip({ years, selectedMonth, onSelect }: YearStripProps) {
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const flatMonths = years.flatMap((y) => y.months);

  function focusMonth(index: number) {
    const clamped = Math.max(0, Math.min(flatMonths.length - 1, index));
    dotRefs.current[clamped]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent, monthIndex: number) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      focusMonth(monthIndex + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      focusMonth(monthIndex - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusMonth(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusMonth(flatMonths.length - 1);
    }
  }

  let monthIndex = -1;

  return (
    <div
      className="warm-scroll overflow-x-auto pb-2"
      role="listbox"
      aria-label="Capture timeline by year"
    >
      <div className="flex min-w-max gap-10">
        {years.map(({ year, months }) => (
          <div key={year} className="flex flex-col items-center gap-4">
            <span className="text-sm font-medium text-ink-muted tabular-nums">
              {year}
            </span>
            <div className="flex h-4 flex-wrap items-center gap-1.5">
              {months.map((month) => {
                monthIndex += 1;
                const current = monthIndex;
                const selected = month === selectedMonth;
                return (
                  <button
                    key={month}
                    ref={(el) => {
                      dotRefs.current[current] = el;
                    }}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    aria-label={`${month.slice(0, 4)}-${month.slice(4, 6)}`}
                    data-selected={selected}
                    className="capture-dot h-2 w-2 rounded-full bg-sienna"
                    onClick={() => onSelect(month)}
                    onKeyDown={(e) => handleKeyDown(e, current)}
                    tabIndex={selected || (!selectedMonth && current === 0) ? 0 : -1}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
