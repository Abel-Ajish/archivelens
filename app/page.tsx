import { Button } from "@/components/ui/button";
import { SearchForm } from "@/components/ui/search-form";

const EXAMPLES = ["apple.com", "nasa.gov", "wikipedia.org", "archive.org"];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-10">
      <section className="flex flex-col items-center py-24 text-center sm:py-36">
        <p className="mb-6 text-xs font-medium tracking-[0.2em] text-ink-faint uppercase">
          A visual interface for web history
        </p>
        <h1 className="max-w-3xl font-serif text-5xl leading-[1.08] tracking-tight text-ink sm:text-7xl">
          See the web through time.
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-muted">
          Explore, revisit, and compare historical versions of websites
          preserved by the Internet Archive.
        </p>

        <div className="mt-10">
          <Button href="#explore" ariaLabel="Explore an archive">
            Explore an archive
          </Button>
        </div>

        <div id="explore" className="mt-10 w-full max-w-xl scroll-mt-10">
          <SearchForm />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <span className="text-sm text-ink-faint">Try an example</span>
          {EXAMPLES.map((domain) => (
            <a
              key={domain}
              href={`/archive/${domain}`}
              className="u-link text-sm text-ink-muted hover:text-ink"
            >
              {domain}
            </a>
          ))}
        </div>
      </section>

      <section className="border-t border-warmline/60 py-20">
        <div className="grid gap-12 sm:grid-cols-3">
          <div>
            <p className="font-serif text-xl text-ink">Explore</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              Search the Internet Archive for any website and see its full
              capture history at a glance.
            </p>
          </div>
          <div>
            <p className="font-serif text-xl text-ink">Revisit</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              Open preserved snapshots exactly as they appeared — through the
              Internet Archive&apos;s own archived copies.
            </p>
          </div>
          <div>
            <p className="font-serif text-xl text-ink">Compare</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              Place two moments in a site&apos;s history side by side and watch
              the web change.
            </p>
          </div>
        </div>
        <div className="mt-14 flex justify-center">
          <Button href="/timeline" variant="secondary">
            Browse examples
          </Button>
        </div>
      </section>
    </div>
  );
}
