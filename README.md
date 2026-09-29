# ArchiveLens

**See the web through time.**

ArchiveLens is a visual interface for exploring historical versions of websites
preserved by the Internet Archive's Wayback Machine. It turns raw capture
history into something calm and editorial — a timeline you can read, snapshots
you can revisit, and versions you can place side by side.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start the dev server     |
| `npm run build`   | Build for production     |
| `npm run start`   | Run the production build |
| `npm run lint`    | Lint the codebase        |
| `npm run typecheck` | Type-check with tsc    |

## How it works

1. Enter a website URL.
2. ArchiveLens queries multiple web archives (server-side, via
   `/api/wayback/*` route handlers) for capture metadata.
3. Captures are merged and presented on an interactive timeline, grouped by
   year and month.
4. Select a capture to preview the archived page, served through the
   archive's own replay URL.
5. Compare any two snapshots side by side with a draggable divider.

## Archive providers

ArchiveLens queries several web archives and merges their captures. If one
archive is unreachable, it falls back to the others:

- **Internet Archive — Wayback Machine** (`web.archive.org`) — the largest
  and longest-running web archive.
- **Arquivo.pt** (`arquivo.pt`) — the Portuguese web archive.
- **Common Crawl** (`index.commoncrawl.org`) — a corpus of web crawl data.

## Structure

```
app/
  page.tsx               Landing page
  archive/[...url]       Archive results + timeline
  timeline/[...url]      Full timeline explorer
  snapshot/[...rest]     Snapshot viewer
  compare/               Side-by-side comparison
  about/                 About page
  api/wayback/           Archive API proxy routes (summary, timeline, captures)
components/
  layout/                Header, footer
  navigation/            Site header with mobile nav
  ui/                    Buttons, inputs, states, search form, provider tag
  timeline/              Year strip, capture list, timeline section
  snapshot/              Snapshot viewer
  compare/               Comparison view
lib/wayback/             Archive integration (types, utils, server)
  providers/             Wayback, Arquivo.pt, Common Crawl + merge/fallback
```

## Notes

- All archived content is provided by the web archives listed above.
  ArchiveLens does not host snapshots itself.
- No API credentials are required; the archive APIs are accessed server-side.
