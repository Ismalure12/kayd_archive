---
paths:
  - frontend/app/**
  - frontend/components/**
  - frontend/tailwind.config.*
---

# Design Rules

## Accuracy Standard
Target 99.8% design accuracy. Before writing any UI code, sketch the intended layout mentally. After writing it, ask: "Does this look exactly like the design I intended?" If not, revise before moving on.

## Brand Feel
Kayd is a cultural preservation project — it should feel like a serious literary journal or print archive. Reference: Paris Review, Times Literary Supplement, Poetry Foundation. Not: Notion, Vercel, or any SaaS dashboard.

## Color Tokens (OKLCH)

All colors use OKLCH for perceptual consistency. They are defined as CSS custom properties and Tailwind theme tokens.

| Token         | Value                    | Role                                     |
|---------------|--------------------------|------------------------------------------|
| `paper`       | oklch(0.965 0.012 78)    | Page background — warm off-white         |
| `paper-2`     | oklch(0.935 0.018 78)    | Hover states, admin sidebar bg           |
| `paper-3`     | oklch(0.895 0.022 78)    | Deeper hover, portrait bg                |
| `ink`         | oklch(0.20 0.015 60)     | Primary text, headings                   |
| `ink-2`       | oklch(0.35 0.015 60)     | Secondary text, author names             |
| `ink-3`       | oklch(0.55 0.015 60)     | Muted text, metadata, mono labels        |
| `rule`        | oklch(0.82 0.018 70)     | Borders, dividers                        |
| `rule-soft`   | oklch(0.88 0.015 70)     | Subtle row separators                    |
| `accent`      | oklch(0.62 0.14 55)      | Burnt ochre — CTAs, links, active states |
| `accent-ink`  | oklch(0.38 0.12 50)      | Darker ochre — hover on accent elements  |
| `accent-wash` | oklch(0.93 0.04 70)      | Very light ochre — tag pill backgrounds  |

**Dark theme** — all tokens have dark equivalents via `[data-theme="dark"]` CSS selector.

**Rules:**
- Never pure black (`#000`). Never blue as primary. Palette is always warm.
- Single accent color: burnt ochre (`accent`). Use for links, CTAs, active borders, drop caps.
- Hover on text/links → `text-ink` (primary dark), never white on light backgrounds.
- Hover on buttons → transparent bg + `accent` border (outline style).
- Color is used for meaning, not decoration.

## Typography

Three typefaces — no others:

| Role     | Font              | Tailwind class   | Usage                                    |
|----------|-------------------|------------------|------------------------------------------|
| Display  | Instrument Serif  | `font-display`   | Story titles, page headings, wordmark    |
| Body     | Newsreader        | `font-body`      | Story body, excerpts, bios, UI text      |
| Mono     | JetBrains Mono    | `font-mono`      | Nav links, metadata, labels, all-caps UI |

**Key sizes:**
- Story title (reader): `clamp(44px, 6vw, 76px)`, `font-display`, `line-height: 0.98`, `letter-spacing: -0.025em`
- Page hero title: `clamp(56px, 10vw, 140px)`, `font-display`, `line-height: 0.95`
- Mono labels: `11px`, `letter-spacing: 0.12em`, `text-transform: uppercase`
- Body reading text: `19px`, `line-height: 1.7`, `font-body`
- Wordmark: `font-display`, `32px`, `letter-spacing: -0.03em`

**Rules:**
- `font-mono` for ALL navigation, metadata, labels, stat numbers' sub-labels, buttons
- `font-display` for headings, story titles, author names in cards, wordmark
- `font-body` for body copy, descriptions, bios, excerpts
- No sans-serif — all text is either serif display, serif body, or monospace

## Layout Patterns

### Masthead (sticky top bar)
- Sticky, `backdrop-filter: blur(8px)`, semi-transparent paper bg
- Wordmark: `K` + italic `ay` + `d` + accent dot (•) + mono sub-label "Digital Somali Literary Archive"
- Nav links: `font-mono`, 11px, `letter-spacing: 0.12em`, uppercase, `text-ink-2` default, `text-ink` + `border-b border-accent` on active
- No heavy dropdown menus

### Homepage (editorial, not algorithmic)
**Variation A (editorial grid):**
- Hero: two-column grid — left: huge display title (`An archive of Somali short fiction.`), right: lede text + stats
- Stats: mono label + display italic number
- Hero border-bottom: `1px solid ink` (not rule — full contrast)
- Below hero: inline search bar (full-width, editorial style)
- Tag filter row below search
- Section: Authors grid (3-col), then Stories list (editorial rows)

### Story Cards → now "Story Rows" (editorial list)
Each row is a 4-column grid: `52px (number) | 1fr (title+excerpt+tags) | 180px (author) | 90px (read time)`
- Number: mono, `ink-3`, `№ 01` format
- Title: `font-display`, 26px, letter-spacing -0.01em + italic Somali title below in `ink-3`, 17px
- Excerpt: body text, `ink-2`, 15px, 62ch max
- Tags inline: small rounded pills below excerpt
- Author column: italic body font, `ink-2` + mono year below in `ink-3`
- Read time: mono, `ink-3`, right-aligned
- Row hover: `bg-paper-2`
- Row separator: `1px solid rule-soft`, no separator on first row
- On mobile (< 900px): collapse to 2 columns (number + title only)

### Author Cards
- Horizontal layout: rectangular portrait (84×108px) + meta column
- Portrait: `bg-paper-3` + 135° diagonal stripe pattern + centered italic initials in `ink-2`
- Name: `font-display`, 22px
- Somali name: italic, `ink-3`, 14px (if different from English name)
- Birth–death years + era: mono, `ink-3`, 10px
- Story count: mono, `accent-ink`, 10px
- Card hover: `bg-paper-2`
- Author grid: 3 columns desktop, 2 tablet, 1 mobile

### Story Reader Page (most important page)
- `max-width: 720px`, centered, no sidebar — EVER
- Kicker: mono links (author · date · read time), `ink-3`, `accent-ink` for author link
- Title: `font-display`, `clamp(44px, 6vw, 76px)`, `line-height: 0.98`, `letter-spacing: -0.025em`
- Somali title: italic display, `ink-3`, 28px
- Byline: full-width rule top + bottom; author name in italic display 20px; right side mono (language · tags)
- Drop cap: `font-display`, ~84px, float left, `color: accent-ink`, `line-height: 0.8`
- Body paragraphs: 19px, `font-body`, `line-height: 1.7`, `color: ink`, `text-wrap: pretty`
- Pull quote: italic display, 32px, with rule top + bottom separators
- End ornament: `❦ · End · ❦`, centered, mono, `ink-3`, letter-spacing 0.3em
- No ads, no social rails, no sidebar

### Footer (archival)
- Border-top: `1px solid ink`
- Mono font, 11px, uppercase, `ink-3`
- Two columns: wordmark + copyright | Archive links + About links
- Very minimal — signals this is a library, not a product

## Components

### Tag chips
- Rounded-full pill, `font-mono`, 10px, uppercase, letter-spacing 0.12em
- Default: `bg-transparent`, `border: 1px solid rule`, `text-ink-2`
- Hover: `border-ink-2`, `text-ink`
- Active: `bg-ink`, `text-paper`, `border-ink`
- Language tags: `border-accent`, `text-accent-ink`

### Buttons (`.btn` style)
- No border-radius (sharp corners) — editorial feel
- Filled: `bg-ink text-paper border-ink`
- Ghost: `bg-transparent text-ink border-ink`, hover → `bg-ink text-paper`
- Accent filled: `bg-accent-ink text-paper border-accent-ink`
- `font-mono`, 11px, uppercase, letter-spacing 0.14em

### Section headers
- `font-display` heading + mono meta on right
- `border-bottom: 1px solid ink` (full contrast, not rule)

### Admin Nav (new design)
- Left sidebar, 240px wide, `bg-paper-2`, `border-right: 1px solid rule`
- Nav links: `font-display`, 18px, `text-ink-2`, hover `bg-paper-3`, active: `bg-paper-3 + border-left: 2px solid accent`
- Brand at top: wordmark + mono "Admin Console" label
- User footer: avatar circle (`bg-accent-wash border-accent`) + name + role
- Sticky, full height

### Admin Tables
- `border-collapse: collapse`, no border-radius
- `th`: mono, 10px, uppercase, `ink-3`, `border-bottom: 1px solid ink`
- `td`: 14px, `border-bottom: 1px solid rule-soft`
- Row hover: `bg-paper-2`

## Spacing Rhythm
- Use `--s-*` variables or equivalent Tailwind: gap-4, gap-6, gap-8
- Container: `max-width: 1240px`, `padding: 0 32px` (24px mobile)
- Reader column: `max-w-[720px]`
- Page padding: px-4 mobile, px-6 tablet, px-8 desktop

## Paper Grain
Apply a subtle SVG noise texture to the body via `body::before`:
```css
body::before {
  content: "";
  position: fixed; inset: 0;
  pointer-events: none; z-index: 100;
  opacity: 0.35; mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml;...feTurbulence fractalNoise...");
}
```

## Don'ts
- No gradients on backgrounds or cards
- No animations beyond subtle transitions (150–200ms)
- No circular author avatars on cards (use rectangular portrait)
- No center-aligned body text
- No sidebar in the story reader
- No heavy box shadows (max `shadow-md` on hover only)
- No rounded buttons (sharp corners for `.btn`, rounded-full only for tag pills)
- No blue, purple, or cool colors anywhere
- No pure white backgrounds (always warm paper tones)
- No sans-serif fonts (all UI text is mono, all content text is serif)
