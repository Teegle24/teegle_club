# Teegle Club

Frontend-only POS analytics dashboard for golf course operators. The UI never queries a database — every figure comes from `VITE_API_BASE_URL` + `/api/v1`.

## Setup

```bash
cp .env.example .env
```

Set:

- `VITE_API_BASE_URL` — REST API origin, no trailing slash (example: `https://api.teegle.club`)
- `VITE_CLERK_PUBLISHABLE_KEY` — Clerk publishable key

```bash
npm install
npm run dev
```

## Access model

Clerk authenticates the user. Course data is scoped by **property membership** from `GET /api/v1/me/access`, not by job title. Owner / GM / investor / board are display labels only.

## API (placeholder shapes)

See `src/types/index.ts`. All calls go through `src/api/client.ts`.
