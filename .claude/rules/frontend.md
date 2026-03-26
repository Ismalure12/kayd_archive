---
paths:
  - frontend/**
---

# Frontend Rules

## Next.js Conventions
- Use App Router exclusively — no pages/ directory
- Server Components by default — only add "use client" when you need hooks or browser APIs
- Fetch data in Server Components, not useEffect
- All public URLs use [slug] not [id]
- Use loading.tsx for skeleton states, error.tsx for error boundaries
- Use generateMetadata() on every page for SEO
- Use next/image for all images, never raw img tags
- Use next/font/google for fonts, never CDN links
- Use Link component for internal navigation, never anchor tags

## Component Organization
- `components/ui/` — reusable primitives: buttons, inputs, modals, cards
- `components/reader/` — public-facing: story cards, author cards, story reader, search
- `components/admin/` — admin panel: forms, tables, rich text editor
- One component per file, file name matches component name
- Keep components small and focused — split when a file gets long

## Story Reader
- Story content is HTML from the database — render it directly on the page
- Use a dedicated prose styling wrapper (Tailwind Typography plugin or custom styles)
- Reading page should feel like a blog post — clean, readable, generous line height
- No special library needed — just render the HTML safely inside a styled container

## Rich Text Editor (Admin)
- Use Tiptap (or similar) for the story writing experience in the admin panel
- Support: headings, bold, italic, blockquotes, ordered/unordered lists, links
- No need for image embedding inside stories for now — text only
- Save the editor output as an HTML string to the API
- Load existing content back into the editor when editing a story

## API Client
- Centralized fetch wrapper in lib/api.js
- All API calls go through this wrapper — no scattered fetch calls
- Handle errors consistently — parse the `{ success, error }` shape
- Admin API calls include the auth token from storage

## Styling
- TailwindCSS for everything — no CSS modules or styled-components
- Mobile-first responsive design
- Dark mode support via Tailwind dark: prefix
- Max content width: max-w-4xl for reading pages, max-w-7xl for browse pages
- No pure black backgrounds or text — use warm near-black tones

## State Management
- No state management library — this app is simple enough without one
- Server Components fetch data and pass props down
- useState/useReducer for forms and interactive UI
- Custom useDebounce hook for search input (300ms delay)

## Performance
- Lazy load below-the-fold content
- Prefetch adjacent pages on paginated lists
- Author photos: serve appropriately sized images

## Accessibility
- All images have descriptive alt text
- Form inputs have associated labels
- All interactive elements are keyboard accessible
- Color contrast meets WCAG AA (4.5:1 minimum)