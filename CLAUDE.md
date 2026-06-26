# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Docs vs. reality — read this first

There is a large gap between what the docs describe and what the code is:

- **`README.md`, `KINORA_COMPLETE_GUIDE.md`, and everything in `docs/`** describe an *aspirational* product — an AI pipeline that turns books/PDFs into page-synced video using a crew of Qwen/Wan agents, an MCP canon server, a scheduler, and an Alibaba Cloud backend. **None of that is implemented.** These are design/hackathon planning documents.
- **The actual repository is a frontend-only UI prototype**: a React + Vite single-page app packaged as an Electron desktop shell, with hardcoded sample data and no backend, no AI, no PDF rendering, and no networking beyond fetching book-cover images from OpenLibrary.

When asked to "implement" something from the design docs, assume you are building it from scratch in the frontend (or scaffolding new services) — do not assume any of it already exists. Treat `docs/` as product spec, not as a map of the codebase.

## Commands

`node_modules` is not checked in — run `npm install` first.

| Command | What it does |
|---|---|
| `npm run dev:web` | Vite dev server only, on `http://localhost:5173`. **Use this for UI work** — cross-platform and the fastest loop. |
| `npm run dev` | Vite **+ Electron** together (concurrently). ⚠️ Windows-only as written — see gotcha below. |
| `npm run dev:electron` | Launch Electron against an already-running dev server. ⚠️ Windows-only. |
| `npm run build` | Full build: `tsc` (typecheck `src`) → `vite build` (→ `dist/`) → `tsc -p electron/tsconfig.json` (→ `dist-electron/`). |
| `npm run typecheck` | `tsc --noEmit`. **This is the only static-analysis gate** — there is no ESLint, Prettier, or test runner configured. Run it before considering changes done. |
| `npm run preview` | Serve the production `dist/` build. |

There are **no tests** and **no linter**. "Does it typecheck and run" is the bar. TypeScript is `strict: true`, but `noUnusedLocals`/`noUnusedParameters` are off.

## Architecture

**Stack:** Vite 5 + React 18 + TypeScript + Tailwind 3 + Framer Motion, wrapped in Electron 33 for desktop. Path alias `@/` → `src/`.

### Navigation is state-based, not routed

There is **no router** (no `react-router`). The whole app is one page with client-side view switching:

- `src/App.tsx` is a trivial wrapper that renders `HomePage`.
- **`src/components/HomePage.tsx` is the real app shell.** It owns `activePage` (a string) and `selectedBook` state, and defines a `pages: Record<string, ReactNode>` map. It renders `Navbar` + `AnimatedPageSwitch` (which displays `pages[activePage]`) + footer + a `BookReader` overlay.
- `src/components/Navbar.tsx` exports the `navItems` array — the **single source of truth for primary nav** (Home / Library / Watch / Favorites / Notes). It calls `onNavigate(label)` with the label string. Secondary destinations (Edit Profile / Settings / Pricing) are reached from the profile dropdown.
- `src/components/AnimatedPageSwitch.tsx` remounts (via a changing `key`) and replays a fade whenever `active` changes.

**To add a page:** (1) add a `lazy(() => import(...))` and an entry in the `pages` record in `HomePage.tsx`; (2) if it belongs in primary nav, add it to `navItems` in `Navbar.tsx` — otherwise wire a button to `onNavigate("Your Page")`. The `Home` page content is eager; all other pages are `React.lazy` + `Suspense`.

Note `Navbar` renders nav twice — a top header bar and a floating bottom dock — and swaps between them based on scroll position (`scrollState`). `dockHiddenPages` suppresses the dock on form-like pages.

### Data and state

- All content is **hardcoded** in `src/data/books.ts`: the `Book` interface plus shelf arrays (`continueReading`, `recentlyAdded`, `popularOnKinora`, `recommended`, etc.). Cover images come from `https://covers.openlibrary.org/.../<isbn>` via the `cover()` helper; `onError` handlers hide broken images.
- **No global state management and no persistence** — just local `useState`. "Reading" / "watching" are visual mockups (`BookReader` shows hardcoded placeholder prose; `WatchPage` is a play/pause UI with no real video).

### Electron layer

- `electron/main.ts`: creates the `BrowserWindow`; loads `process.env.VITE_DEV_SERVER_URL` in dev, else `dist/index.html`. `contextIsolation: true`, `nodeIntegration: false`.
- `electron/preload.ts` is intentionally empty — there is **no IPC bridge / `window.electron` API yet**. Adding native↔renderer communication starts here.
- Built separately to `dist-electron/` as CommonJS via `electron/tsconfig.json`.

## Design system (the bulk of the actual code)

This is a heavily design-focused UI; most components are visual. The look is a dark "liquid glass" aesthetic. Match existing conventions rather than introducing new patterns:

- **Theme tokens** live in `tailwind.config.js` under the `kinora` color namespace (`bg`, `bg-deep`, `text`, `muted`, `subtle`, `gold`, `gold-light`) and two font families: `font-serif` = Fraunces (headings), `font-sans` = DM Sans (body, loaded in `index.html`).
- **`src/index.css` is central** — reusable classes do the heavy lifting and are reused everywhere: `.kinora-bg` (the gradient backdrop), `.liquid-glass-dock`, `.glass-card`, `.glass-input`, `.nav-btn-active` / `.nav-btn-hover`, the 3D book effect (`.book-3d-wrapper` / `.book-cover` with `::before`/`::after` page edges), `.tab-fade`, and progress-ring classes. Components combine these with heavy inline `style={{}}` (hand-tuned `rgba`/`backdrop-filter`) for one-off polish.
- Animations use **Framer Motion** (`motion`, `AnimatePresence`) for overlays/transitions; spring curves are defined as CSS vars in `:root`.

### Performance conventions (a prior commit tuned Lighthouse — preserve these)

- `content-visibility: auto` + `contain-intrinsic-size` on `.shelf-container` and `.footer-glass` to skip off-screen rendering.
- Manual Vite chunk splitting in `vite.config.ts` (`react-vendor`, `motion-vendor`).
- Fonts loaded via the `media="print"` → `onload="this.media='all'"` swap trick in `index.html`; hero image (`public/hero-bg.jpg`) is preloaded.
- Lazy-loaded images (`loading="lazy"`) and route-level `lazy()` splitting; `prefers-reduced-motion` is respected in CSS.

Keep these in place when editing the relevant files.

## Gotchas

- **`launch.cjs` is Windows-only.** It hardcodes `node_modules/electron/dist/electron.exe`. On macOS/Linux this path doesn't exist, so `npm run dev` and `npm run dev:electron` will fail. This repo's dev environment is macOS — **use `npm run dev:web` for UI work**, and fix the binary path in `launch.cjs` (or invoke `electron` directly) if you need the desktop shell here.
- README/docs describe unbuilt features — see the top section. Don't cite them as existing behavior.
