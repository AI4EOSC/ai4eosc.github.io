<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)"
            srcset="https://raw.githubusercontent.com/AI4EOSC/ai4eosc-initiative-web/main/src/assets/logos/AI4-horizontal-dark.svg" />
    <source media="(prefers-color-scheme: light)"
            srcset="https://raw.githubusercontent.com/AI4EOSC/ai4eosc-initiative-web/main/src/assets/logos/AI4-horizontal-light.svg" />
    <img src="https://raw.githubusercontent.com/AI4EOSC/ai4eosc-initiative-web/main/src/assets/logos/AI4-horizontal-light.svg"
         alt="AI4EOSC Logo"
         width="320" />
  </picture>
</div>

<br>

Public website for the AI4EOSC initiative. Built with [Astro](https://astro.build) + Tailwind CSS.

## Commands

```sh
npm install          # install dependencies (Node >=22.12.0)
npm run dev          # local dev server at localhost:4321
npm run build        # production build to ./dist/
npm run preview      # preview the production build
npm run astro check  # TypeScript type checking
```

---

## Content editing guide

Site content is split into three layers based on how often it changes.

---

### 1. Collections (`src/content/`)

Structured entities with one file per item. Each folder contains a `_template.yml` / `_template.md` as a reference for all available fields.

#### Products — `src/content/products/*.yml`

The platform's own products (AI4EOSC Platform, LLM, Agents…).

- **Order**: manual via the `order: <number>` field inside each YAML. Change the number to reorder.
- **Add**: copy `_template.yml`, fill in the fields, and save with a descriptive filename.

#### Projects — `src/content/projects/*.yml`

EU-funded projects that originated or extend the platform.

- **Order**: automatic by end year extracted from the `period` field (e.g. `"2022 – 2024"` → sorts by 2024). Ongoing projects go last.
- **Add**: copy `_template.yml`. The `lead` field and the `partners` array must use the exact names defined in `src/data/partners.yml` (see Partners section below).

#### Communities — `src/content/communities/*.yml`

Scientific communities using the platform (Marine Science, Climate, Bioinformatics…).

- **Order**: automatic alphabetical by `title`. No order field needed.
- **Add**: copy `_template.yml`. The `slug` field must be unique and in kebab-case.

#### Gateways — `src/content/gateways/*.yml`

Platform deployments for specific projects or scientific domains.

- **Order**: automatic alphabetical by `title`. No order field needed.
- **Add**: copy `_template.yml`. The `slug` field must be unique and in kebab-case.

#### Stories — `src/content/stories/*.md`

Articles, news, case studies and videos. There are two types:

**Internal story** — full article written in Markdown below the frontmatter:

```markdown
---
title: Article title
type: Case study        # Case study | News | Research | Video
date: 2026-05-01
excerpt: Short summary shown on the card.
image: /images/stories/filename.jpg   # optional
icon: microscope                      # optional Lucide icon, used when there is no image
---

Full article content in Markdown here...
```

**External story** — links to an external URL (blog post, YouTube video…). No Markdown body needed:

```markdown
---
title: Article title
type: News
date: 2026-04-10
excerpt: Short description.
image: https://cdn.example.com/image.jpg   # optional
externalUrl: https://...
---
```

- **Order**: automatic by date descending (newest first).
- **File naming**: use the pattern `type-short-title.md` (e.g. `case-study-imagine.md`, `video-webinar-federated-learning.md`).
- **Template**: `_template.md` covers both internal and external cases with inline comments.
- **Images**: place story images in `public/images/stories/` and reference them as `/images/stories/filename.jpg` in the `image` field. External stories can also use a remote image URL directly.

#### OG preview images

Open Graph images (used by social media link previews) are **generated automatically at build time** for every page and story. No manual work needed — they are rendered from the page metadata and output to `dist/og/`:

```
dist/og/
├── home.png
├── about.png
├── products.png
├── projects.png
├── communities.png
├── gateways.png
├── stories.png
├── stories/
│   ├── case-study-imagine.png
│   └── ...
└── ...
```

Each story gets its own OG image generated from its `title`, `type` and `excerpt`. To trigger regeneration, run `npm run build`.

---

### 2. Editable data (`src/data/`)

YAML files with content that changes occasionally but does not have its own per-item entity.

| File | Content | Notes |
|---|---|---|
| `numbers.yml` | Metrics shown in the Numbers section | Some values are computed automatically (see comments in the file). Manual values must be updated by hand. |
| `testimonials.yml` | Quotes in the Testimonials section | Add or edit objects in the `items` array. |
| `faq.yml` | FAQ questions grouped by category | Edit questions/answers or add new categories. |
| `about.yml` | Timeline on the About page | Each `timeline` entry has `year` and `phase`. |
| `nav.yml` | Navbar labels and CTA | Change navigation labels. |
| `footer.yml` | Footer text and links | Brand name, description, and link columns. |

#### `partners.yml` — global partner registry

This file is a **lookup table** for all known partners in the ecosystem. It defines for each partner:

```yaml
items:
  - name: CSIC          # exact name — acts as the ID
    logo: CSIC.svg      # file in src/assets/logos/ (optional)
    url: https://...    # institutional website (optional)
    country: Spain
    lat: 40.4           # coordinates for the map (optional)
    lon: -3.7
```

**Important**: having a partner defined here does not make it appear on the site. Only partners referenced in the `lead` or `partners` fields of a project file (`src/content/projects/`) are actually used. The rest are ignored. Institution counts, country stats, and the logo marquee are all computed by cross-referencing both sources.

To show a new partner's logo in the marquee: (1) place the logo file in `src/assets/logos/`, add the partner to `partners.yml` referencing that filename, and (2) include their name in `lead` / `partners` in the relevant project file.

---

### 3. Static content

More stable copy (section titles, introductory descriptions, CTA text…) is written directly as constants inside Astro components and pages:

- `src/components/sections/*.astro` — landing page sections (Hero, HowItWorks, OpenSourceBanner…)
- `src/components/ui/*.astro` — reusable components (CtaFinal, PageHero…)
- `src/pages/*.astro` and `src/pages/**/*.astro` — copy specific to each interior page

To edit this content, modify the relevant `.astro` file directly.
