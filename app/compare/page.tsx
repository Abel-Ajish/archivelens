import type { Metadata } from "next";
import { CompareView } from "@/components/compare/compare-view";

export const metadata: Metadata = { title: "Compare" };

interface PageProps {
  searchParams: Promise<{ url?: string; a?: string; b?: string; provider?: string }>;
}

export default async function ComparePage({ searchParams }: PageProps) {
  const { url, a, b, provider } = await searchParams;
  const target = url ?? "apple.com";

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 sm:px-10">
      <header className="mb-12">
        <h1 className="font-serif text-4xl tracking-tight text-ink sm:text-5xl">
          Compare snapshots
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-muted">
          Place two moments in {target}&apos;s history side by side. Drag the
          divider to reveal more of either version.
        </p>
      </header>

      <CompareView
        url={target}
        initialYearA={a}
        initialYearB={b}
        initialProvider={provider}
      />
    </div>
  );
}
