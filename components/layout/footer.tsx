export function Footer() {
  return (
    <footer className="border-t border-warmline/60 bg-linen">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <p className="font-serif text-lg text-ink">ArchiveLens</p>
        <p className="text-sm text-ink-muted">
          Archived content provided by the{" "}
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
      </div>
    </footer>
  );
}
