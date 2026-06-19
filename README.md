# NomNom

A monorepo that runs two apps together with a single command:

| App | Path | Stack | Default URL |
|-----|------|-------|-------------|
| **Backend** (restaurant marketplace) | [`examples/restaurant-marketplace`](examples/restaurant-marketplace) | Medusa v2 | API: http://localhost:9000 · Admin: http://localhost:9000/app |
| **Frontend** (FoFood storefront) | [`examples/fofood-store-main`](examples/fofood-store-main) | Next.js 13 | http://localhost:3000 |

The root [`package.json`](package.json) uses [`concurrently`](https://www.npmjs.com/package/concurrently) to start and stop both apps as one process group.

## Prerequisites

- Node.js `>= 20`
- A PostgreSQL database (the backend `DATABASE_URL` is configured in
  [`examples/restaurant-marketplace/.env`](examples/restaurant-marketplace/.env))

## Setup

Install everything (root tooling + frontend + backend):

```bash
npm run install:all
```

> The frontend installs with **npm**; the backend keeps its existing **yarn** (Berry) setup.

First time only — set up and seed the backend database:

```bash
npm run db:setup
npm run seed
```

## Run everything (one command)

```bash
npm run dev
```

This starts:

- **backend** → Medusa dev server on http://localhost:9000 (admin at `/app`)
- **frontend** → Next.js dev server on http://localhost:3000

Stopping the command (`Ctrl+C`) stops both apps. If either app crashes, the other is shut down too (`--kill-others-on-fail`).

## Other commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start backend + frontend in dev mode |
| `npm run build` | Build backend then frontend |
| `npm run start` | Start both in production mode (after `build`) |
| `npm run dev:backend` / `npm run dev:frontend` | Start a single app |
| `npm run db:setup` / `npm run db:migrate` | Provision / migrate the Medusa database |
| `npm run seed` | Seed demo data into the backend |

## Notes

- The backend's `STORE_CORS` already allows `http://localhost:3000` so the storefront can call the Medusa Store API.
- Each app keeps its own config and dependencies; the root only orchestrates them via `npm --prefix`, so it works regardless of which package manager installed each app.
