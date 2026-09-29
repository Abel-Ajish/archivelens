import type { Metadata } from "next";
import { TimelineSection } from "@/components/timeline/timeline-section";

interface PageProps {
  params: Promise<{ url: string[] }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const url = (await params).url.join("/");
  return { title: `Timeline — ${url}` };
}

export default async function TimelinePage({ params }: PageProps) {
  const url = (await params).url.join("/");

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 sm:px-10">
      <header className="mb-12">
        <h1 className="font-serif text-4xl tracking-tight text-ink sm:text-5xl">
          Website history
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-muted">
          Explore captures of {url} chronologically — by year, by month, and by
          individual snapshot.
        </p>
      </header>

      <TimelineSection url={url} showMetadata={false} yearFilter preview />
    </div>
  );
}
