import type { Metadata } from "next";
import Link from "next/link";
import { TimelineSection } from "@/components/timeline/timeline-section";

interface PageProps {
  params: Promise<{ url: string[] }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const url = (await params).url.join("/");
  return { title: url };
}

export default async function ArchivePage({ params }: PageProps) {
  const url = (await params).url.join("/");

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 sm:px-10">
      <nav aria-label="Breadcrumb" className="mb-10 text-sm text-ink-faint">
        <Link href="/" className="u-link hover:text-ink">
          ArchiveLens
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-ink-muted" aria-current="page">
          {url}
        </span>
      </nav>

      <h1 className="mb-12 font-serif text-4xl tracking-tight text-ink sm:text-5xl">
        {url}
      </h1>

      <TimelineSection url={url} />
    </div>
  );
}
