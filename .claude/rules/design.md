---
paths:
  - frontend/app/**
  - frontend/components/**
  - frontend/tailwind.config.*
---

# Design Rules

## Brand Feel
Kayd is a cultural preservation project, not a tech startup. The design should feel warm, grounded, literary, and respectful. Think library or bookshop — not SaaS dashboard.

## Colors
- Background: warm off-white (#F5F0E8), not pure white
- Cards: cream (#FAF7F2)
- Primary accent: terracotta (#C4633E) — for CTAs and active states
- Secondary accent: deep teal (#1A6B5C) — for links and tags
- Primary text: warm dark (#2C2420), not pure black
- Secondary text: stone (#6B5E54)
- Muted/borders: ash (#A69B91)
- Dark mode: warm near-black (#1C1917) background, not pure #000

Never use pure black. Never use blue as a primary color. Keep the palette warm.

## Typography
- Serif font (like Lora) for story titles, author names, and headings — the literary stuff
- Sans font (like DM Sans) for UI, navigation, buttons, forms — the functional stuff
- Never use serif for buttons or form labels
- Never use sans for story titles
- Minimum body text size: 16px
- Reading pages: 18px with relaxed line height

## Layout Patterns
- Homepage: hero with search → featured collection → recent stories grid → author spotlight
- Author page: photo + bio → list of their stories
- Story page: title + author + tags → story text (centered, max-w-4xl, prose styling) → more by this author
- Admin: left sidebar nav → content area with tables and forms

## Components
- Story cards: cover image (or placeholder), serif title, author name, tag pills
- Author cards: circular photo (or initials on terracotta), serif name, story count
- Tag pills: small, rounded-full, teal tint background
- Buttons: rounded-lg, not rounded-full (pills look like tags)
- Cards: subtle borders, no heavy shadows — max shadow-sm

## Spacing
- Consistent scale: use gap-4, gap-6, gap-8 — avoid odd values like gap-5 or gap-7
- Card grids: 1 column mobile, 2 at sm, 3 at lg
- Page padding: px-4 on mobile, px-6 tablet, px-8 desktop
- Generous whitespace between sections

## Don'ts
- No gradients on backgrounds or cards
- No bouncing or spinning animations — keep motion subtle
- No stock photography — only real author photos or generated placeholders
- No center-aligned body text — left-align always
- No decorative borders or ornamental dividers
- Don't over-design the admin panel — keep it clean and functional