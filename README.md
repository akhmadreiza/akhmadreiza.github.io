# araweb

Personal website of Akhmad Reiza Armando, built with [Astro](https://astro.build), MDX, Tailwind CSS, and TypeScript.

- **Live site:** https://akhmadreiza.github.io
- **Repository:** https://github.com/akhmadreiza/akhmadreiza.github.io

---

## Commands

Run all commands from the project root:

| Command           | What it does                                    |
| :---------------- | :---------------------------------------------- |
| `npm install`     | Install dependencies (first time / after clone) |
| `npm run dev`     | Start dev server at `http://localhost:4321`     |
| `npm run build`   | Build for production into `./dist/`             |
| `npm run preview` | Preview the production build locally            |

---

## Daily operations

### Adding a blog post

1. Create a new `.mdx` file in `src/content/blog/`:

   ```
   src/content/blog/your-post-slug.mdx
   ```

   The filename becomes the URL: `/blog/your-post-slug`

2. Start the file with this frontmatter:

   ```mdx
   ---
   title: "Your Post Title"
   description: "One or two sentence summary shown in cards and meta tags."
   pubDate: 2026-05-07
   tags: ["tag-one", "tag-two"]
   heroImage: "/images/blog/your-cover.jpg"
   draft: false
   ---

   Your content here...
   ```

3. Frontmatter reference:

   | Field         | Required | Notes                                                  |
   | :------------ | :------- | :----------------------------------------------------- |
   | `title`       | Yes      |                                                        |
   | `description` | Yes      | Shown in card listings and `<meta>` description        |
   | `pubDate`     | Yes      | Format: `YYYY-MM-DD`                                   |
   | `tags`        | No       | Array of strings; each tag gets its own filtered page  |
   | `heroImage`   | No       | Path relative to `public/`. Falls back to default art  |
   | `updatedDate` | No       | Format: `YYYY-MM-DD`; shown on the post page if set    |
   | `draft`       | No       | Set `true` to hide from all listings and builds        |

4. **Adding a cover image** — put the file in `public/images/blog/` and reference it as:

   ```yaml
   heroImage: "/images/blog/your-cover.jpg"
   ```

   Without `heroImage` the post shows the default gradient thumbnail automatically.

---

### Adding a project

1. Create a new `.mdx` file in `src/content/projects/`:

   ```
   src/content/projects/your-project-slug.mdx
   ```

2. Frontmatter:

   ```mdx
   ---
   title: "Project Name"
   description: "What this project does."
   pubDate: 2026-05-07
   techStack: ["Astro", "TypeScript", "Tailwind"]
   githubUrl: "https://github.com/akhmadreiza/your-repo"
   liveUrl: "https://yoursite.com"
   featured: true
   heroImage: "/images/projects/your-cover.jpg"
   ---

   Longer description of the project...
   ```

3. Frontmatter reference:

   | Field         | Required | Notes                                                        |
   | :------------ | :------- | :----------------------------------------------------------- |
   | `title`       | Yes      |                                                              |
   | `description` | Yes      | Shown in the project card                                    |
   | `pubDate`     | Yes      | Used to sort the projects listing                            |
   | `techStack`   | Yes      | Array of strings; rendered as pills on the card              |
   | `githubUrl`   | No       | Full URL; shows "GitHub →" link on the card                  |
   | `liveUrl`     | No       | Full URL; shows "Live →" link on the card                    |
   | `featured`    | No       | Set `true` to show in the homepage Featured Projects section |
   | `heroImage`   | No       | Path relative to `public/`. Falls back to default art        |

---

### Adding a static page

1. Create a new `.astro` file in `src/pages/`:

   ```
   src/pages/your-page.astro
   ```

   This becomes the URL `/your-page`.

2. Use the `Page` layout for a standard page:

   ```astro
   ---
   import Page from '../layouts/Page.astro';
   ---

   <Page title="Page Title" description="Optional meta description.">
     <div class="prose">
       <p>Your content here.</p>
     </div>
   </Page>
   ```

3. Or use the `Base` layout if you need full control of the page body:

   ```astro
   ---
   import Base from '../layouts/Base.astro';
   ---

   <Base title="Page Title">
     <!-- anything here -->
   </Base>
   ```

---

### Managing tags

Tags are declared in each post's frontmatter — there is no separate registry. A tag page at `/blog/tag/<name>` is generated automatically for every unique tag that appears across all non-draft posts.

To rename a tag, do a find-and-replace across `src/content/blog/`.

---

### Images

| Purpose           | Where to put the file                 | Frontmatter value                      |
| :---------------- | :------------------------------------ | :------------------------------------- |
| Blog cover        | `public/images/blog/`                 | `heroImage: "/images/blog/…"`          |
| Project cover     | `public/images/projects/`             | `heroImage: "/images/projects/…"`      |
| Profile photo     | `public/images/profile.jpg`           | — (hardcoded in `index.astro`)         |
| Default thumbnail | `public/images/default-thumbnail.svg` | — (automatic fallback, no action needed) |

Supported formats: `.jpg`, `.png`, `.webp`, `.svg`. Recommended cover size: **1200 × 630 px**.

---

### Draft posts

Set `draft: true` in frontmatter to hide a post from all listings, tag pages, the RSS feed, and the sitemap. The post is excluded at build time, not just hidden in the UI.

Remove the field (or set `draft: false`) when ready to publish, then rebuild.

---

## Project structure

```
src/
├── components/
│   ├── Nav.astro           # Site navigation + dark mode toggle
│   ├── Footer.astro        # Footer with RSS and GitHub links
│   ├── PostCard.astro      # Blog post card (used in listings)
│   └── ProjectCard.astro   # Project card (used in listings)
├── content/
│   ├── blog/               # Blog posts (.mdx) — add new posts here
│   └── projects/           # Project entries (.mdx) — add new projects here
├── content.config.ts       # Collection schemas (Zod); edit to add new fields
├── layouts/
│   ├── Base.astro          # Root HTML shell (nav + footer + dark mode + SEO meta/OG/Twitter Card tags)
│   ├── BlogPost.astro      # Layout for individual blog posts (includes share buttons)
│   └── Page.astro          # Layout for simple static pages
├── pages/
│   ├── index.astro         # Homepage
│   ├── about.astro         # About page
│   ├── blog/
│   │   ├── index.astro     # Blog listing
│   │   ├── [slug].astro    # Individual post route (auto-generated)
│   │   └── tag/[tag].astro # Tag-filtered listing (auto-generated)
│   ├── projects/
│   │   └── index.astro     # Projects listing
│   └── rss.xml.js          # RSS feed
└── styles/
    └── global.css          # Tailwind imports + prose styles + dark mode
public/
├── robots.txt              # Crawler rules; points to sitemap
├── favicon.svg             # Primary favicon (circle "R" lettermark)
├── favicon.ico             # Fallback favicon for older browsers/apps
└── images/
    ├── profile.jpg         # Your profile photo (replace to update)
    ├── blog/               # Blog cover images
    └── projects/           # Project cover images
```

---

## Dark mode

The site supports light and dark mode. The preference is saved in `localStorage` and falls back to the OS `prefers-color-scheme` setting. The toggle is the moon/sun icon in the top-right of the nav bar.

---

## SEO

Every page includes `<meta>` description, author, canonical URL, Open Graph tags, and Twitter Card tags — all rendered by `Base.astro`. The sitemap is auto-generated by `@astrojs/sitemap` at `/sitemap-index.xml` and referenced in both `robots.txt` and the `<head>`. Blog posts use their `heroImage` as the social preview image; other pages fall back to `/images/profile.jpg`.

---

## RSS feed

Available at `/rss.xml`. Includes all non-draft blog posts sorted by date. Linked automatically in the `<head>` of every page.
