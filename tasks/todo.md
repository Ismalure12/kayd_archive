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

## Phase 4: Ready to Run (pending DB setup)
- [ ] Update `.env` with real PostgreSQL `DATABASE_URL`
- [ ] Run `npm run db:migrate -- --name init`
- [ ] Run `npm run db:generate`
- [ ] Run `npm run seed`
- [ ] Run `npm run dev` and verify `GET /health`

## Phase 5: Frontend (Next.js) — Not Started
- [ ] Scaffold Next.js app in `/frontend`
- [ ] Reader pages: home, author list, author detail, story list, story reader
- [ ] Admin panel: login, dashboard, author CRUD, story editor (Tiptap), collections

---

## Notes
- Backend runs on port 5000 by default
- All public routes under `/api/*` — no auth
- All admin routes under `/api/admin/*` — JWT required
- Seed admin: `admin@kayd.so` / `admin123`
