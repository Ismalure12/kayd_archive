# Kayd — Digital Somali Literary Archive

A web app that collects and preserves Somali short stories scattered across the internet. Readers browse and read for free with no login. Admins write and manage stories using a rich text editor, organize them by author, tag, and collection.

## Tech Stack

- Frontend: Next.js (App Router), TailwindCSS
- Backend: Express.js, Node.js (plain JS, not TypeScript)
- Database: PostgreSQL with Prisma ORM
- Rich text editor: Tiptap (or similar) for writing stories in admin
- Auth: JWT + bcrypt for admin only — no reader accounts

## Project Structure

- `backend/src/controllers/` — route handler logic
- `backend/src/routers/` — Express route definitions
- `backend/src/services/` — Prisma queries and business logic
- `backend/src/middlewares/` — auth, validation, error handling
- `backend/src/utils/` — helpers, slug generation, validation
- `backend/src/server.js` — Express app entry point
- `backend/prisma/` — schema and migrations
- `frontend/` — Next.js app
- `tasks/todo.md` — current task plan with checkboxes
- `tasks/lessons.md` — accumulated corrections

## Commands

- `cd backend && npm run dev` — start Express dev server
- `cd frontend && npm run dev` — start Next.js dev server
- `npx prisma migrate dev` — create and apply migration
- `npx prisma generate` — regenerate client after schema change
- `npx prisma studio` — visual database browser
- `cd backend && npm test` — run tests

## Key Rules

- All public URLs use slugs, never UUIDs
- Stories have `is_published` flag — public endpoints never return unpublished ones
- Story content is rich text (HTML) stored directly in the database
- Admin writes stories using a rich text editor — content saved as HTML string
- API responses always follow `{ success, data, error }` shape
- List endpoints support `?page=1&limit=20` pagination
- Never expose admin routes without JWT middleware
- Never commit .env files
- Prisma schema changes always need a migration, never use db push
- Slugs must be unique and URL-safe

---

## Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately — don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes — don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests — then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.