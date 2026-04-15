# Lessons Learned

## Prisma 7 — Config File Must Be `.ts`, Not `.js` or `.mjs`
Prisma 7 CLI has built-in TypeScript parsing for its config file. It rejects `.js` and `.mjs` files with "Failed to parse syntax". Always use `prisma.config.ts` even in a plain JS project — Prisma CLI handles the TypeScript internally, no extra tools needed.

## Prisma 7 — `prisma/config` Requires `prisma` Installed Locally
`import { defineConfig } from 'prisma/config'` fails if `prisma` is only run via `npx`. Install it as a dev dependency: `npm install -D prisma`.

## Prisma 7 — Driver Adapters Take a Config Object, Not a Pre-Created Client
`PrismaPg`, `PrismaLibSql`, etc. take a **config object** (`{ connectionString }` or `{ url }`), not a pre-created client instance. Passing a client instance causes a silent `URL 'undefined'` error at query time — not at construction time — making it hard to trace.

Example:
```js
// WRONG
const client = createClient({ url: process.env.DATABASE_URL });
new PrismaLibSql(client); // url becomes undefined at query time

// RIGHT
new PrismaLibSql({ url: process.env.DATABASE_URL });
```

## SQLite + Prisma 7 Is Overkill for Local Dev
Switching to SQLite with Prisma 7 requires `@prisma/adapter-libsql`, a `.ts` config, and has subtle URL format issues. For a project that will use PostgreSQL in production, just use PostgreSQL locally too (via Docker or a local install). Don't switch databases mid-project to save setup time.

## Hover States Must Never Produce White Text on Light Background
Single accent palette: terracotta (#C4633E) only — teal is removed. Hover rules:
- Text/links on hover → `hover:text-text` (dark #2C2420), never `hover:text-white` without a dark bg
- Buttons on hover → `hover:bg-transparent hover:border-terracotta hover:text-terracotta` (outline style)
- Tag pills inactive → `bg-terracotta-light text-terracotta border border-terracotta/30` + on hover `hover:bg-transparent hover:border-terracotta`
- Never add `hover:text-white` unless the hover background is dark (e.g. terracotta, dark-bg)

## Always Read These Files at Session Start (in this order)
1. `tasks/lessons.md` — past mistakes to not repeat
2. `tasks/todo.md` — current plan and progress
3. `CLAUDE.md` — project overview and workflow rules
4. `.claude/rules/backend.md` — API conventions, Prisma rules, auth, error handling
5. `.claude/rules/design.md` — colors, typography, layout patterns
6. `.claude/rules/frontend.md` — Next.js conventions, component structure, API client
7. `.claude/rules/test.md` — test priorities, Jest + Supertest, what not to test

Never start work without reading all of these first. The rules files contain critical constraints (response shapes, auth patterns, design tokens) that affect every file touched.
