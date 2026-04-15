---
paths:
  - frontend/app/**
  - frontend/components/**
  - frontend/tailwind.config.*
---

# Design Rules

## Accuracy Standard
Target 99.8% design accuracy. Before writing any UI code, sketch the intended layout mentally. After writing it, ask: "Does this look exactly like the design I intended?" If not, revise before moving on. Never leave rough approximations — get spacing, color, and type exactly right.

## Brand Feel
Kayd is a cultural preservation project, not a tech startup. It should feel like a literary journal or archival library — warm, grounded, restrained. Reference: Poetry Foundation, Standard Ebooks, The Public Domain Review. Not: Notion, Vercel, or any SaaS dashboard.

## Colors
- Background: warm off-white (#F5F0E8)
- Cards: cream (#FAF7F2)
- Primary accent: terracotta (#C4633E) — CTAs, drop caps, links, tags, key metadata, active states
- Terracotta light: (#F5E8E2) — tag pill backgrounds
- Primary text: warm dark (#2C2420)
- Secondary text: stone (#6B5E54)
- Muted / borders: ash (#A69B91), border lines (#DDD5CA)
- Dark (admin): warm near-black (#1C1917), dark card (#2A2420)

**Rules:**
- Never pure black. Never blue as primary. Keep palette warm at all times.
- Terracotta = all accents (buttons, CTAs, drop caps, links, tags, nav). Single accent palette.
- Hover on text/links → revert to dark text (#2C2420), never white on light backgrounds.
- Hover on buttons → transparent background + terracotta border only (outline style).
- Color accent is used for meaning, not decoration.

## Typography
- Lora (serif): story titles, author names, headings, drop caps — anything content-related
- DM Sans (sans): UI, navigation, buttons, forms, metadata — anything functional
- Body in reader: Lora, 19–20px, line-height 1.75, max-width 680px (65–68 chars)
- Story title: Lora, 40–48px desktop, font-weight 700, line-height 1.15
- Author attribution: DM Sans small-caps, 14px, terracotta color
- Minimum body: 16px. Reading pages: 19px+
- Never serif for buttons/labels. Never sans for story titles.

## Layout Patterns

### Homepage (editorial, not algorithmic)
- Hero: ONE featured story or brand statement — large Lora title (52–60px), 2-line excerpt, terracotta CTA. Not 6 items above the fold.
- Below: section header in DM Sans small-caps + thin horizontal rule (print convention)
- "Recent Stories" grid: 3 columns desktop, 2 tablet, 1 mobile
- "Authors" spotlight: 2-column grid of author cards

### Story Reader Page (most important page)
- `max-width: 680px`, centered, no sidebar — EVER
- Structure (top to bottom):
  1. Breadcrumb (DM Sans, muted)
  2. Tags (teal pills)
  3. Story title (Lora, large)
  4. Author attribution (DM Sans small-caps, terracotta) + thin rule separator
  5. Story body with **drop cap on first paragraph** (Lora initial-letter, ~4em, terracotta color)
  6. End ornament (✦ centered, terracotta)
  7. Author bio card (teal left-border accent)
  8. "More from this author" (2–3 story cards below)
- Line-height: 1.75+. No ads, no social rails, no sticky share bars inside the reading column.

### Story Cards — active: StoryCardC (components/reader/StoryCardC.tsx)
- shadcn Card structure: tags (all-caps links) → title → author + rule divider → excerpt → footer
- Footer: small initial/thumbnail + reading time + "Read →" terracotta outline button
- Tags as plain all-caps terracotta links (no pill background in header)
- No heavy shadows (max shadow-md on hover)
- No star ratings, no view counts, no engagement metrics
- StoryCardB (components/reader/StoryCardB.tsx) kept as alternate — text-first, square drop-cap initial

### Author Cards — pending choice (B / C / D, see /card-preview)
- AuthorCardB: horizontal, square initial block, bio + terracotta story count
- AuthorCardC: shadcn Card, centered, circular avatar, story count footer
- AuthorCardD: masthead style — terracotta header band, overlapping circular avatar

### Navigation
- Slim top bar (64px), same background color as page (#F5F0E8) — no visual break
- Wordmark "Kayd" in Lora italic, 24px
- Nav links in DM Sans 14px — Stories, Authors, Collections, Search
- No heavy dropdown menus

### Footer (archival index style — like Poetry Foundation / NYRB)
- 3-column layout: Collections | Browse by Tag | About Kayd
- Slightly deeper cream background (#EDE7D9)
- Dense text links — signals depth and library-like organization

## Components
- Buttons: rounded-lg, not rounded-full (pills are for tags only)
- Tag pills: rounded-full, terracotta-light bg + terracotta text + terracotta/30 border on default, terracotta bg + white on active, transparent bg + terracotta border on hover
- Cards: 1px border, max shadow-sm — flat, index-card feel
- Section separators: thin horizontal rule (1px, #DDD5CA) — never decorative borders
- Drop cap: first letter of story body, Lora, ~4em, float left, terracotta, line-height 0.8
- Section label: DM Sans small-caps, terracotta, small tracking-wider (print convention)

## Spacing
- Use gap-4, gap-6, gap-8 — avoid odd values
- Card grids: 1 col mobile, 2 at sm, 3 at lg
- Page padding: px-4 mobile, px-6 tablet, px-8 desktop
- Reader column: max-w-2xl (680px), py-10 top/bottom

## Don'ts
- No gradients on backgrounds or cards
- No animations beyond subtle transitions (150–300ms)
- No stock photography — real author photos or initial avatars
- No center-aligned body text
- No sidebar in the story reader
- No social/engagement metrics on public pages
- No heavy shadows (nothing beyond shadow-sm)
- No pure rounded-full buttons
- Don't over-design the admin panel — clean and functional only
