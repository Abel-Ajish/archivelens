import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

const FLOW = [
  { label: "Website URL", detail: "You enter an address" },
  { label: "Internet Archive", detail: "Captures are looked up" },
  { label: "Historical captures", detail: "Timestamps are parsed" },
  { label: "ArchiveLens", detail: "History is visualised" },
  { label: "Visual exploration", detail: "Browse and compare" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 sm:px-10">
      <p className="mb-6 text-xs font-medium tracking-[0.2em] text-ink-faint uppercase">
        About
      </p>
      <h1 className="font-serif text-4xl tracking-tight text-ink sm:text-5xl">
        What is ArchiveLens?
      </h1>

      <p className="mt-8 text-lg leading-relaxed text-ink-muted">
        ArchiveLens is a visual interface for exploring historical versions of
        websites preserved by the{" "}
        <a
          href="https://archive.org"
          target="_blank"
          rel="noopener noreferrer"
          className="u-link text-ink"
        >
          Internet Archive
        </a>
        .
      </p>

      <p className="mt-6 leading-relaxed text-ink-muted">
        The Wayback Machine has captured hundreds of billions of web pages
        since 1996. ArchiveLens turns that raw history into something calm and
        editorial — a timeline you can read, snapshots you can revisit, and
        versions you can place side by side.
      </p>

      <section className="mt-16" aria-labelledby="how-it-works">
        <h2
          id="how-it-works"
          className="font-serif text-2xl tracking-tight text-ink sm:text-3xl"
        >
          How it works
        </h2>
        <ol className="mt-10 flex flex-col gap-0">
          {FLOW.map((step, index) => (
            <li key={step.label} className="flex gap-6">
              <div className="flex flex-col items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-warmline bg-card text-sm text-ink shadow-whisper">
                  {index + 1}
                </span>
                {index < FLOW.length - 1 && (
                  <span aria-hidden="true" className="h-10 w-px bg-warmline" />
                )}
              </div>
              <div className="pb-10">
                <p className="font-medium text-ink">{step.label}</p>
                <p className="mt-1 text-sm text-ink-muted">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8 rounded-xl border border-warmline/60 bg-card p-8 shadow-whisper">
        <h2 className="font-serif text-xl text-ink">A note on sources</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          ArchiveLens draws on several web archives. If one archive is
          unreachable, it automatically falls back to the others:
        </p>
        <ul className="mt-4 flex flex-col gap-2">
          <li className="text-sm text-ink-muted">
            <a
              href="https://archive.org"
              target="_blank"
              rel="noopener noreferrer"
              className="u-link text-ink"
            >
              Internet Archive — Wayback Machine
            </a>{" "}
            — the largest and longest-running web archive
          </li>
          <li className="text-sm text-ink-muted">
            <a
              href="https://arquivo.pt"
              target="_blank"
              rel="noopener noreferrer"
              className="u-link text-ink"
            >
              Arquivo.pt
            </a>{" "}
            — the Portuguese web archive
          </li>
          <li className="text-sm text-ink-muted">
            <a
              href="https://commoncrawl.org"
              target="_blank"
              rel="noopener noreferrer"
              className="u-link text-ink"
            >
              Common Crawl
            </a>{" "}
            — a corpus of web crawl data
          </li>
          <li className="text-sm text-ink-muted">
            <a
              href="https://vefsafn.is"
              target="_blank"
              rel="noopener noreferrer"
              className="u-link text-ink"
            >
              Icelandic Web Archive
            </a>
          </li>
          <li className="text-sm text-ink-muted">
            Plus 90+ national web archives worldwide — UK, Stanford, Australia,
            New Zealand, Croatia, Czech Republic, Estonia, Japan, Bibliotheca
            Alexandrina, Archive-It, and many more.
          </li>
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-ink-muted">
          ArchiveLens does not host any snapshots itself — it fetches capture
          metadata and links to the archived copies served by these archives.
        </p>
      </section>
    </div>
  );
}
