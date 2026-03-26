---
paths:
  - "**/*.test.js"
  - "**/*.spec.js"
  - "**/tests/**"
  - "**/__tests__/**"
---

# Test Rules

## Philosophy
Kayd is a content-serving archive, not a complex stateful app. Don't over-test. Focus on the paths that would break the user experience if they failed.

## Priorities (in order)
1. API endpoints return the right data in the right shape
2. Public endpoints never leak unpublished stories or admin data
3. Admin routes reject unauthenticated requests
4. Story content renders correctly as HTML on the reading page
5. Prisma queries filter correctly (published vs drafts, slug lookups)
6. Search returns relevant results
7. Key frontend components render without crashing

## Backend Testing
- Use Jest and Supertest for API tests
- Test against a separate test database, not the dev one
- Seed test data in beforeAll, clean up in afterAll
- Every endpoint needs at minimum: happy path, 404, and validation error tests
- Every admin endpoint needs: 401 without token, 401 with bad token tests
- Test story content sanitization: dangerous HTML tags get stripped on save

## Frontend Testing
- Use Jest with React Testing Library
- Test that components render with valid props
- Test that links point to correct slug-based URLs
- Test form validation shows errors for required fields
- Test loading and empty states

## What NOT to Test
- Don't test Prisma's query builder internals
- Don't test Next.js routing internals
- Don't test TailwindCSS class names
- Don't test exact pixel layouts
- Don't test third-party library behavior
- If the test is more mock than test, rethink it

## Test Data
- Use realistic Somali names and titles in fixtures
- Keep sample HTML story content as a test fixture string
- Common test tags: Jacayl (love), Dagaal (war), Qurbajoog (diaspora)

## Rules
- All tests must pass before merge to main
- No test should depend on external services or network calls
- Tests should run fast — under 30 seconds for the full suite