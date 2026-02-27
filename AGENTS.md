# AGENTS.md

## Cursor Cloud specific instructions

### Overview

CivicAI is a full-stack Next.js 16 Permit Processing & Document Management System. It uses PostgreSQL (via Docker) as its database, Prisma as the ORM, and JWT-based auth with httpOnly cookies.

### Services

| Service | Command | Port | Notes |
|---------|---------|------|-------|
| PostgreSQL | `sudo docker compose -f docker/docker-compose.yml up -d` | 5432 | Must start Docker daemon first: `sudo dockerd &>/tmp/dockerd.log &` |
| Next.js dev server | `npm run dev` | 3000 | Hot-reloads on file changes |

### Key gotchas

- **Docker daemon must be started manually** in Cloud Agent VMs: `sudo dockerd &>/tmp/dockerd.log &` — wait ~3 seconds before running Docker commands.
- **`.env` file is not committed.** If missing, generate one using `./scaffold.sh` or create manually. Required vars: `DATABASE_URL`, `JWT_SECRET`. See `README.md` for the full list.
- **After `prisma migrate dev`, re-run `npm run db:seed`** — the migration process may clear seeded data. Always verify seed data exists before testing login flows.
- **Jest is not listed in `package.json`** but is required for tests. It must be installed as a devDependency (`npm install --save-dev jest @types/jest @testing-library/jest-dom ts-jest`). Run tests via `npx jest`.
- **ESLint has pre-existing errors** (8 errors, 12 warnings) in the codebase. These are not caused by environment issues.
- **The frontend pages use hardcoded demo data** for display; the real database-backed functionality is in the API routes (`/api/auth/login`, `/api/auth/logout`, `/api/health`, `/api/documents/upload`).

### Standard commands

See `README.md` for the full list. Key ones:

- **Lint:** `npm run lint`
- **Test:** `npx jest`
- **Dev server:** `npm run dev`
- **DB setup:** `npm run db:generate && npm run db:migrate && npm run db:seed`

### Seeded test accounts

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | admin123 | ADMIN |
| coord@example.com | coord123 | COORDINATOR |
| billing@example.com | billing123 | BILLING |
