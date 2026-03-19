# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server (localhost:4321)
npm run build    # static build → dist/
npm run preview  # preview dist/
```

No linter or test scripts exist.

## Architecture

**Astro static site** (`output: 'static'`) deployed to Vercel. The entire app is a single page — one Astro shell (`src/layouts/Layout.astro`) with one React island (`<App client:idle />`). All GitHub API calls happen in the browser; there is no backend.

### Data flow

1. User enters a GitHub username → `App.tsx` calls `scanUser()` from `src/lib/github.ts`
2. `scanUser()` fetches user profile + repos via GitHub REST API, then (if a token is provided) fetches per-repo language breakdowns and file trees in parallel using a custom `pLimit` (max 5 concurrent)
3. Skills are detected in `detectSkillsFromRepos()` via four signals: primary language, language breakdown, topic/description keyword matching (`TECH_KEYWORDS` in `src/lib/keywords.ts`), and repo file tree patterns (infra/testing tools)
4. Results are categorized via `SKILL_CATEGORIES` and returned as `ScanResult`
5. `App.tsx` renders `UserCard`, `SkillsList`, and `MarkdownPreview`
6. `generateMarkdown()` in `src/lib/markdown.ts` builds GitHub-flavored markdown with shields.io badges

All GitHub API responses are cached in `localStorage` for 1 hour. The user's GitHub token (optional, for higher rate limits and full repo scanning) is also stored in `localStorage`.

**Without a token:** only primary language + topics are scanned (fast, ~1–3 requests).
**With a token:** all repos get language breakdown + file tree analysis (~100+ requests, max 5 concurrent).

### URL routing

Profiles are addressable via path (`/:username`) or query param (`?u=username`). On scan, the URL is rewritten with `history.replaceState`. The base URL is injected at build time via `data-base-url` on `<body>` and read as `window.__BASE_URL__`.

### Adding new technology detection

- Add keywords to `TECH_KEYWORDS` in `src/lib/keywords.ts` for topic/description-based detection
- Add the skill name to a category in `SKILL_CATEGORIES` to control where it appears
- Add file-tree patterns inside `detectSkillsFromRepos()` in `src/lib/github.ts` for infra/tooling detection (e.g., config files, directories)

## Environment variables

| Variable | Used in | Purpose |
|---|---|---|
| `PUBLIC_SENTRY_DSN` | `sentry.client.config.js` | Sentry DSN (browser-accessible) |
| `ENABLE_SENTRY` | `astro.config.mjs` | Gates `@sentry/astro` integration at build time (`true`/`false`) |
| `SENTRY_AUTH_TOKEN` | `astro.config.mjs` | Sentry source map upload (build-time only, never goes to browser) |
| `PUBLIC_GA_ID` | `src/layouts/Layout.astro` | Google Analytics 4 ID (optional) |

Sentry is enabled only when `ENABLE_SENTRY=true`. The `sentry.server.config.js` exists for completeness but is effectively unused since the site is fully static.
