# Akshay Jain — Portfolio

Personal portfolio site with projects, experience, a print-ready resume, and a small `/`-command terminal in the hero.

**Live:** https://akshayjain98.github.io

## Tech stack

Next.js 15 (App Router, static export) · React 19 · TypeScript · Tailwind CSS · Framer Motion

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

| Script          | Description                              |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Start the dev server (Turbopack)         |
| `npm run build` | Build the static site into `out/`        |
| `npm run start` | Serve a production build                 |
| `npm run lint`  | Run ESLint                               |

## Editing content

All site content lives in [`content/`](content/) as JSON (profile, experience, skills, one file per project). Edit those files and rebuild; no code changes are needed. See [`content/README.md`](content/README.md) for the fields.

The `/resume` page is generated from the same files, so it always matches the site.

## Project structure

```
content/          Site content (JSON)
public/           Static assets
src/app/          Pages, layout, and components
src/lib/          Content loading and types
```

## Deployment

Every push to `main` builds the site and deploys it to GitHub Pages via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
