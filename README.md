# NomNom

A monorepo that runs two apps together with a single command:

| App | Path | Stack | Default URL |
|-----|------|-------|-------------|
| **Backend** (restaurant marketplace) | [`examples/restaurant-marketplace`](examples/restaurant-marketplace) | Medusa v2 | API: http://localhost:9000 · Admin: http://localhost:9000/app |
| **Frontend** (FoFood storefront) | [`examples/fofood-store-main`](examples/fofood-store-main) | Next.js 13 | http://localhost:3000 |

The root [`package.json`](package.json) uses [`concurrently`](https://www.npmjs.com/package/concurrently) to start and stop both apps as one process group.

## Prerequisites

- **Node.js 20** (use `nvm use` — the repo ships an [`.nvmrc`](.nvmrc)).
  Node 22+/24 are **not** supported by Medusa 2.14 here and the backend will
  fail to boot.
- **npm** (both apps use npm — do not use yarn for the backend; see [Why npm](#why-npm-and-node-20)).
- A PostgreSQL database (the backend `DATABASE_URL` is configured in
  [`examples/restaurant-marketplace/.env`](examples/restaurant-marketplace/.env))

## Setup

```bash
nvm use            # selects Node 20 from .nvmrc
npm run install:all
```

`install:all` installs the root tooling, the frontend, and the backend — all with npm.

First time only — run migrations and seed the backend database. (The
`DATABASE_URL` already points to an existing Postgres DB, so use `db:migrate`,
not the interactive `db:setup` which tries to create a new database.)

```bash
npm run db:migrate
npm run seed
```

Create an admin user so you can log into the dashboard at `/app`:

```bash
npm --prefix examples/restaurant-marketplace exec medusa user -- -e you@example.com -p your-password
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
| `npm run db:migrate` | Run Medusa database migrations + sync module links |
| `npm run seed` | Seed demo data into the backend |

## Notes

- The backend's `STORE_CORS` already allows `http://localhost:3000` so the storefront can call the Medusa Store API.
- Each app keeps its own config and dependencies; the root only orchestrates them via `npm --prefix`.

## Why npm and Node 20

This combo is required because of two issues found while wiring the monorepo:

1. **Node 20, not 22/24.** On Node 24 the Medusa backend crashes at boot with
   `Cannot read properties of undefined (reading 'collection')`. Medusa 2.14 / MikroORM 6.6
   target Node 20.
2. **npm for the backend, not yarn.** The original yarn (Berry) install produced **two physical
   copies** of `@medusajs/utils` (one nested under `@medusajs/framework`). Medusa's data models
   registered their ORM metadata in one copy while the repository factory ran in the other, so the
   metadata lookup missed and the server failed to start. A clean `npm install` hoists a single
   `@medusajs/utils`, which fixes it. The yarn lockfile/config were removed to prevent regressing
   to the broken layout.
