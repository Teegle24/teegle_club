# Teegle Club

Frontend-only POS analytics dashboard for golf course operators. The UI never queries a database — every figure comes from `VITE_API_BASE_URL` + `/api/v1`.

## Setup

```bash
cp .env.example .env
```

## Demo mode (no API)

To click around the dashboard with fixture data:

```bash
cp .env.example .env
# .env.example already sets VITE_USE_MOCK=true
npm run dev
```

`VITE_USE_MOCK=true` skips Clerk and serves `/api/v1` responses from local fixtures in `src/api/mock`. The property switcher still changes figures between Pine Ridge, Mill Creek, and the rollup view.

## Live API

Set `VITE_USE_MOCK=false` (or remove it) and:

- `VITE_API_BASE_URL` — REST API origin, no trailing slash
- `VITE_CLERK_PUBLISHABLE_KEY` — Clerk publishable key

```bash
npm install
npm run dev
```

## Access model

Clerk authenticates the user. Course data is scoped by **property membership** from `GET /api/v1/me/access`, not by job title. Owner / GM / investor / board are display labels only.

## API (placeholder shapes)

See `src/types/index.ts`. All calls go through `src/api/client.ts`.
