# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server at http://localhost:4321
npm run build    # production build → dist/
npm run preview  # preview the production build locally
```

There are no lint or test scripts.

## Architecture

### Content pipeline

Content lives in `src/content/blog/` and `src/content/projects/` as `.mdx` files. Schemas are defined in `src/content.config.ts` using Astro's Content Layer API (v6) with `glob` loaders — **not** the legacy `src/content/config.ts` format. Any new collection fields must be added to the Zod schema there before use in frontmatter.

Entries are accessed via `getCollection('blog')` / `getCollection('projects')` in page frontmatter. Individual post rendering uses `render(entry)` imported from `astro:content` (not `entry.render()` — that's the old API). Routes use `entry.id` not `entry.slug`.

### Routing

| URL pattern | File |
| :--- | :--- |
| `/blog/[slug]` | `src/pages/blog/[slug].astro` — `getStaticPaths` maps `post.id` → param |
| `/blog/tag/[tag]` | `src/pages/blog/tag/[tag].astro` — tags collected from all non-draft posts at build time |
| `/rss.xml` | `src/pages/rss.xml.js` |

Draft posts (`draft: true`) are filtered out with a `getCollection` filter callback and excluded from all routes, the RSS feed, and the sitemap.

### Layouts

Three layouts in `src/layouts/`:
- `Base.astro` — root HTML shell; imports `global.css`, renders `<Nav>` and `<Footer>`, contains the FOUC-prevention inline script for dark mode, all SEO/OG/Twitter Card meta tags, and the Umami analytics script. Accepts an optional `ogImage` prop (path string, defaults to `/images/profile.jpg`) — pass a custom image to override the OG/Twitter Card social preview image for that page.
- `BlogPost.astro` — wraps `Base`, renders hero image, title, date, reading time, tags, `<slot />` inside `.prose`, then prev/next post navigation, and share buttons (X, LinkedIn, copy link) at the bottom. Code blocks inside `.prose` get a copy button injected via an inline script. Passes `heroImage` as `ogImage` to `Base` automatically.
- `Page.astro` — thin wrapper around `Base` for static pages

### Images

Two locations with different behaviour:
- `src/assets/` — imported images (e.g. `import img from '../assets/profile.jpg'`). Astro optimizes these at build time: converts to WebP, resizes, generates hashes. Use `<Image>` from `astro:assets`. The profile photo lives here.
- `public/images/` — content images referenced as strings in frontmatter (`heroImage: "/images/blog/…"`). Not optimized by Astro (no WebP conversion), but `<img>` tags include `loading="lazy"` and explicit dimensions to prevent layout shift.

### Utilities

- `src/utils/readingTime.ts` — exports `readingTime(body: string): string`. Takes raw MDX body text, counts words at 200wpm, returns e.g. `"4 min read"`. Used in `PostCard.astro` and passed as a prop from `[slug].astro` to `BlogPost.astro`.

### Dark mode

Class-based. `@custom-variant dark (&:where(.dark, .dark *))` in `global.css` overrides Tailwind v4's default media-query dark variant. The `.dark` class is toggled on `<html>` by the Nav button and persisted to `localStorage`. An inline script in `Base.astro`'s `<head>` applies the class before paint to prevent flash.

Prose dark mode is handled with plain CSS (`.dark .prose { … }`) in `global.css`, not Tailwind utilities.

### Tailwind setup

Tailwind v4 — configured via the Vite plugin (`@tailwindcss/vite`), not a `tailwind.config.js`. All customisation goes in `src/styles/global.css` using `@import "tailwindcss"` and `@custom-variant`.

### Deployment

GitHub Actions workflow at `.github/workflows/deploy.yml` builds on push to `main` and deploys to GitHub Pages using `actions/deploy-pages`. Requires Node 22+ (Astro 6 minimum). The Pages source must be set to **GitHub Actions** in repo settings, not a branch.

Live site: https://akhmadreiza.github.io  
Repository: https://github.com/akhmadreiza/akhmadreiza.github.io
