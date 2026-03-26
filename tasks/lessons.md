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

## Always Read `tasks/lessons.md` and `tasks/todo.md` at Session Start
Per CLAUDE.md workflow: read both files before doing any work. Write the plan to `todo.md` first. Log every correction to `lessons.md` immediately after it happens — not at the end.
