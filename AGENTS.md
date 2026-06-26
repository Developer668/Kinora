# Repository Guidelines

## Project Structure & Module Organization

Kinora is a Vite + React + TypeScript app with an Electron shell. `src/main.tsx` mounts the app, `src/App.tsx` is the top-level entry, reusable UI lives in `src/components/`, and sample book data lives in `src/data/books.ts`. Styling and design tokens are in `src/index.css` and `tailwind.config.js`. Electron code is under `electron/` (`main.ts`, `preload.ts`). Browser-served assets belong in `public/`; imported React assets belong in `src/assets/`. Product, architecture, and hackathon references live in `docs/` and `KINORA_COMPLETE_GUIDE.md`.

## Build, Test, and Development Commands

- `npm install` installs dependencies from `package-lock.json`.
- `npm run dev:web` starts Vite on port 5173.
- `npm run dev` starts Vite and launches the Electron shell.
- `npm run dev:electron` launches Electron against an already-running Vite server.
- `npm run typecheck` runs TypeScript without emitting files.
- `npm run build` type-checks the React app, builds Vite output, and compiles Electron.
- `npm run preview` serves the production web build locally.

## Coding Style & Naming Conventions

Use strict TypeScript and React function components. Follow the existing two-space indentation, semicolons, double-quoted imports, PascalCase component filenames, and camelCase variables/functions. Prefer the `@/` alias when it improves readability. Keep Tailwind classes close to JSX, reuse `kinora` color/font tokens, and follow existing `framer-motion` and `lucide-react` patterns.

## Testing Guidelines

There is no dedicated test runner configured yet. Every change should pass `npm run typecheck` and `npm run build`, then be smoke-tested with `npm run dev:web` or `npm run dev` for affected UI. When adding tests, use `*.test.ts` or `*.test.tsx`, colocated with source or under a future `src/__tests__/`, and prioritize stateful UI, data transforms, and Electron boundaries.

## Commit & Pull Request Guidelines

Recent commits use short, descriptive subjects with either a conventional prefix or a feature summary, such as `perf: optimize Lighthouse score` or `UI overhaul: simplified pages`. Keep commits focused on one logical change. Pull requests should include a concise summary, linked issue or requirement when available, verification commands run, screenshots or clips for visual changes, and notes for new assets, docs, or model/cloud assumptions.

## Security & Configuration Tips

Do not commit API keys or cloud credentials. Keep Electron security defaults intact (`nodeIntegration: false`, `contextIsolation: true`) unless a reviewed preload bridge requires a change. Use licensed or public-domain assets and document external Alibaba Cloud or model-service assumptions in `docs/`.
