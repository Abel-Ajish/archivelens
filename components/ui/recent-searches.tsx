"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "archivelens-recent";
const MAX_RECENT = 5;

function getRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(url: string): void {
  if (typeof window === "undefined") return;
  const recent = getRecent().filter((u) => u !== url);
  recent.unshift(url);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

export function RecentSearches() {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    setRecent(getRecent());
  }, []);

  if (recent.length === 0) return null;

  return (
    <div className="mt-10 flex flex-col items-center gap-3">
      <span className="text-sm text-ink-faint">Recent searches</span>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {recent.map((url) => (
          <Link
            key={url}
            href={`/archive/${url}`}
            className="u-link text-sm text-ink-muted hover:text-ink"
          >
            {url}
          </Link>
        ))}
      </div>
    </div>
  );
}
