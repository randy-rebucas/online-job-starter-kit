## Online Job Starter Kit — Next.js + MongoDB + Auth

Converted from a static vanilla-JS site into a Next.js (App Router) app with MongoDB-backed
content and per-user progress, and Auth.js credentials-based authentication.

### Setup

1. Set `MONGODB_URI` and `NEXTAUTH_SECRET` in `.env.local` (a working default for local Docker Mongo is already there).
2. Start MongoDB (e.g. `docker run -d --name ojsk-mongo -p 27017:27017 -v ojsk-mongo-data:/data/db mongo:7`).
3. Seed reference content + a demo user: `node scripts/seed.cjs` (demo login: `demo@ojsk.dev` / `demo1234`).
4. `npm run dev` and visit http://localhost:3000 — you'll be redirected to `/login` until you sign in or register.

### Structure

- `app/(dashboard)/*` — the authenticated views (Home, Guide, Roadmap, Challenge, Prompts, Builder, Job Boards, Interview, Tools, Salary, Trackers), protected by `proxy.js`.
- `app/login`, `app/register` — public auth pages.
- `models/` — Mongoose models: `User`, `UserProgress` (per-user checklist/tracker/habit state), `Content` (seeded reference data).
- `lib/content.js` — server-side reference-data fetchers.
- `app/api/state/route.js` — GET/PATCH the signed-in user's progress.
- `scripts/seed.cjs` + `scripts/seed-data.cjs` — one-time content + demo-user seeding (source data ported from the original `data.js`).
- `legacy-static/` — the original static HTML/CSS/JS app, kept for reference only.
