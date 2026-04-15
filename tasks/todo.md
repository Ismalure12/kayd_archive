# Kayd Backend — Build Plan

## Phase 1: Project Setup ✅
- [x] Initialize Node.js project in `/backend`
- [x] Install Express, Prisma, dotenv, cors, nodemon
- [x] Set up folder structure: routers, controllers, services, middlewares, utils
- [x] Configure Prisma 7 with `prisma.config.ts` and `@prisma/adapter-pg`
- [x] Set up `.env` with `DATABASE_URL` and `JWT_SECRET`

## Phase 2: Database Schema ✅
- [x] Define all 7 models: Admin, Author, Story, Tag, StoryTag, Collection, CollectionStory
- [x] Define enums: AdminRole, Language
- [x] Schema uses PostgreSQL provider with `@db.Text` for long fields

## Phase 3: Core Backend ✅
- [x] Utils: AppError, slug, response helpers, pagination, sanitize-html
- [x] Middlewares: errorHandler (standard shape), auth (JWT Bearer)
- [x] Services: auth, authors, stories, tags, collections, search, dashboard
- [x] Controllers: auth, authors, stories, tags, collections, search, dashboard
- [x] Routers (public): authors, stories, tags, collections, search
- [x] Routers (admin): auth, authors, stories, tags, collections, dashboard
- [x] `server.js` wires all routes — auth applied at admin mount point
- [x] Seed script with admin, 2 authors, 4 tags, 3 Somali stories, 1 collection

## Phase 3b: Backend Gaps (to fix before frontend)
- [ ] Add request body validation on required fields in controllers (backend rules: validate before controllers)
- [ ] Audit admin endpoints — ensure they don't return raw Prisma objects with sensitive fields

## Phase 4: Ready to Run ✅
- [x] Update `.env` with real PostgreSQL `DATABASE_URL` (Xata)
- [x] Run migration
- [x] Run seed — admin@kayd.so / admin123, 2 authors, 4 tags, 3 stories, 1 collection
- [x] `GET /health` confirmed working

## Phase 4b: API Tests ✅
- [x] Install Jest + Supertest
- [x] Split app.js from server.js for testability
- [x] 6 test files, 45 tests — all passing
  - health, public endpoints, auth, admin authors, admin stories (+ XSS), admin dashboard/tags/collections
- [x] Test data self-cleans via `test-` slug prefix + afterAll cleanup

## Phase 5: Frontend (Next.js) — Complete ✅
- [x] Scaffold Next.js 16 app in `/frontend` (TypeScript, Tailwind v4, App Router)
- [x] Install Tiptap, @tailwindcss/typography
- [x] Design tokens in CSS @theme (Tailwind v4 pattern)
- [x] Lora + DM Sans fonts via next/font/google
- [x] `lib/api.ts` — centralized fetch wrapper for public + admin APIs
- [x] `hooks/useDebounce.ts`
- [x] UI components: Button, Input/Textarea/Select, Pagination
- [x] Reader components: StoryCard, AuthorCard, TagPill, SearchBar, SiteHeader, SiteFooter
- [x] Admin components: AdminNav, AuthGuard, TiptapEditor, AuthorForm, StoryForm, CollectionForm
- [x] Public pages: /, /stories, /stories/[slug], /authors, /authors/[slug], /collections, /collections/[slug], /search
- [x] Admin pages: /admin/login, /admin/dashboard, /admin/authors, /admin/stories, /admin/tags, /admin/collections (+ new/edit)
- [x] Design: editorial hero, drop cap, 680px reader measure, archival footer, small-caps author attribution
- [x] Build passes: 22 routes, zero TypeScript errors

---

## Notes
- Backend runs on port 5000 by default
- All public routes under `/api/*` — no auth
- All admin routes under `/api/admin/*` — JWT required
- Seed admin: `admin@kayd.so` / `admin123`
