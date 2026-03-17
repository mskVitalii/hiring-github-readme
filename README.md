# Hiring GitHub Readme

Turn any GitHub profile into a structured skills summary and README-ready markdown for recruiters and hiring teams.

[![Deploy to GitHub Pages](https://img.shields.io/github/actions/workflow/status/mskvitalii/hiring-github-readme/deploy.yml?branch=main&label=deploy)](https://github.com/mskvitalii/hiring-github-readme/actions/workflows/deploy.yml)
[![License](https://img.shields.io/github/license/mskvitalii/hiring-github-readme)](LICENSE)
[![Repo Views](https://visitor-badge.laobi.icu/badge?page_id=mskvitalii.hiring-github-readme)](https://github.com/mskvitalii/hiring-github-readme)

Author: [Vitalii Popov](https://www.linkedin.com/in/mskvitalii/)

Live demo: https://mskvitalii.github.io/hiring-github-readme/

## Why This Project

- Parses a GitHub username or profile URL.
- Scans public repositories and languages.
- Detects technologies and groups them into categories useful for HR.
- Generates copyable markdown for GitHub profile README sections.

## Features

- GitHub profile scanning with progress stages
- Skill extraction from languages, topics, names, and descriptions
- Categorized output for recruiter-friendly reading
- Markdown preview and raw copy mode
- Linkable skill badges and anchors
- SEO-ready metadata (OG, Twitter, JSON-LD, sitemap, robots)

## Tech Stack

- Astro 6
- React 19
- TypeScript (strict)
- Tailwind CSS 4
- Bun
- GitHub REST API
- Optional Sentry integration
- Google Analytics 4 (optional)

## Quick Start

### Requirements

- Bun installed
- Node.js 22.12.0+ (for Astro 6 compatibility)

### Install

```bash
bun install
```

### Run locally

```bash
bun run dev
```

### Production build

```bash
bun run build
bun run preview
```

## Environment Variables

Use .env for local development. A template exists in .env.example.

```env
PUBLIC_GA_ID=
```

Notes:

- PUBLIC_GA_ID is optional.
- SENTRY_AUTH_TOKEN is only needed for source map upload in CI.

## Scripts

- bun run dev: start development server
- bun run build: build static output into dist
- bun run preview: preview build locally
- bun run astro: run Astro CLI commands

## Project Structure

```text
.
├─ public/
├─ src/
│  ├─ components/
│  ├─ lib/
│  ├─ layouts/
│  └─ pages/
├─ .github/workflows/deploy.yml
├─ astro.config.mjs
└─ package.json
```

## Deployment

GitHub Pages deployment is configured via GitHub Actions workflow at .github/workflows/deploy.yml.

Repository settings to verify:

- Pages source: GitHub Actions
- Repository variable: PUBLIC_GA_ID (optional)
- Repository secret: SENTRY_AUTH_TOKEN (optional)

## License

No license file is currently committed.

Recommended for this project: MIT License.

Why MIT:

- Simple and widely accepted in open-source
- Allows commercial and private use
- Keeps attribution requirement only

How to add:

1. Create a LICENSE file in repository root.
2. Use the standard MIT text.
3. Replace year and copyright holder.
4. Keep the license badge in this README.

## Contributing

Contributions are welcome.

1. Fork repository
2. Create a branch: feat/your-change
3. Commit with clear message
4. Open a Pull Request

## Repository Profile Checklist

To make the repository look complete for other developers, fill these GitHub fields:

- About description
- Website URL (live demo)
- Topics (for discovery)
- Social preview image (already prepared in public/og-image.png)
- Issue templates
- Pull request template
- LICENSE file

## View Counter in Repository

Yes, a view counter can be shown in README using an external badge provider.

Current badge in this README:

- visitor-badge.laobi.icu

Important:

- GitHub does not provide a native public all-time views counter for README badges.
- External counters are approximate and can count bot traffic.
