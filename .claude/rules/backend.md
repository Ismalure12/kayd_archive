---
paths:
  - backend/**
  - prisma/**
---

# Backend Rules

## Architecture
- Routers define routes and call controllers. No business logic in routers.
- Controllers handle request/response. They call services and return JSON.
- Services contain all Prisma queries and business logic. No req/res objects here.
- Middlewares handle auth, validation, and error catching.
- Utils hold pure helper functions like slug generation and date formatting.

## API Conventions
- All responses use `{ success: true, data }` or `{ success: false, error: "message" }`
- List endpoints return `{ success, data, total, page, totalPages }`
- Pagination via `?page=1&limit=20` query params
- Public routes at `/api/*` — no auth needed
- Admin routes at `/api/admin/*` — always behind auth middleware
- Never return raw Prisma objects — pick only the fields the client needs
- Never expose password hashes or internal IDs in responses
- Story content is HTML — always sanitize on input to prevent XSS

## Prisma
- Schema is the single source of truth for the database
- After any schema change, run `prisma migrate dev` with a descriptive name
- Always run `prisma generate` after migrations before writing queries
- Never use `db push` — always use proper migrations
- Always paginate list queries — never return unbounded results
- Public queries must always filter `isPublished: true`
- Use transactions for multi-table writes

## Story Content
- Story body is rich text written in admin via a text editor (like Tiptap)
- Stored as HTML string in the `content` field on the stories table
- Sanitize HTML on save to strip dangerous tags and attributes (use a library like sanitize-html)
- Serve content as-is to the frontend — the reader page renders it directly
- Keep content in the database, not in files — no file system storage needed for stories
- Estimate reading time from word count and store it on the story record

## Auth
- Admin login returns a JWT with 24h expiration
- Auth middleware extracts token from `Authorization: Bearer` header
- Attach `req.admin` with id and role after verification
- Never log tokens or return them in error messages

## Error Handling
- Throw custom errors with status codes from services
- Centralized error handler middleware catches everything
- Always return the standard `{ success: false, error }` shape
- Log errors server-side but never expose stack traces to the client

## Validation
- Validate request bodies before they reach controllers
- Slug format: lowercase alphanumeric with hyphens only
- Required fields must be checked — don't rely on Prisma to catch missing data