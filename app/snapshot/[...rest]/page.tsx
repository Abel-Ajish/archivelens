import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SnapshotViewer } from "@/components/snapshot/snapshot-viewer";
import { StateBlock } from "@/components/ui/state-block";
import { verifyCapture } from "@/lib/wayback/server";
import { formatDate } from "@/lib/wayback/utils";

interface PageProps {
  params: Promise<{ rest: string[] }>;
  searchParams: Promise<{ provider?: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { rest } = await params;
  const timestamp = rest[rest.length - 1] ?? "";
  return { title: `${rest.slice(0, -1).join("/")} — ${formatDate(timestamp)}` };
}

export default async function SnapshotPage({
  params,
  searchParams,
}: PageProps) {
  const { rest } = await params;
  const { provider } = await searchParams;
  const timestamp = rest[rest.length - 1] ?? "";
  const url = rest.slice(0, -1).join("/");

  if (!/^\d{14}$/.test(timestamp) || !url) {
    notFound();
  }

  const available = await verifyCapture(url, timestamp, provider);
  if (available === false) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-14 sm:px-10">
        <StateBlock
          title="This snapshot isn't available."
          actionLabel="Choose another capture"
          actionHref={`/archive/${url}`}
        >
          The Internet Archive doesn&apos;t have a capture at this exact
          moment.
        </StateBlock>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 sm:px-10">
      <nav aria-label="Breadcrumb" className="mb-10 text-sm text-ink-faint">
        <Link href="/" className="u-link hover:text-ink">
          ArchiveLens
        </Link>
        <span aria-hidden="true"> / </span>
        <Link href={`/archive/${url}`} className="u-link hover:text-ink">
          {url}
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-ink-muted" aria-current="page">
          {formatDate(timestamp)}
        </span>
      </nav>

      <header className="mb-10 flex flex-col gap-2">
        <p className="text-xs font-medium tracking-[0.2em] text-ink-faint uppercase">
          Archived snapshot
        </p>
        <p className="font-serif text-2xl text-ink sm:text-3xl">
          {formatDate(timestamp)}
        </p>
        <p className="text-sm text-ink-muted tabular-nums">
          {timestamp.slice(8, 10)}:{timestamp.slice(10, 12)}:
          {timestamp.slice(12, 14)} UTC
        </p>
      </header>

      <SnapshotViewer
        url={url}
        timestamp={timestamp}
        provider={provider ?? "wayback"}
      />
    </div>
  );
}
