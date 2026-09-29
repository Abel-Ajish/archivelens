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
2. ArchiveLens queries the Internet Archive's CDX API (server-side, via
   `/api/wayback/*` route handlers) for capture metadata.
3. Captures are presented on an interactive timeline, grouped by year and
   month.
4. Select a capture to preview the archived page, served through the
   Internet Archive's own archived URL (`web.archive.org/web/<timestamp>id_/`).
5. Compare any two snapshots side by side with a draggable divider.

## Structure

```
app/
  page.tsx               Landing page
  archive/[...url]       Archive results + timeline
  timeline/[...url]      Full timeline explorer
  snapshot/[...rest]     Snapshot viewer
  compare/               Side-by-side comparison
  about/                 About page
  api/wayback/           CDX API proxy routes (summary, timeline, captures)
components/
  layout/                Header, footer
  navigation/            Site header with mobile nav
  ui/                    Buttons, inputs, states, search form
  timeline/              Year strip, capture list, timeline section
  snapshot/              Snapshot viewer
  compare/               Comparison view
lib/wayback/             Wayback integration (types, client, utils, server)
```

## Notes

- All archived content is provided by the Internet Archive. ArchiveLens does
  not host snapshots itself.
- No API credentials are required; the CDX API is accessed server-side.
