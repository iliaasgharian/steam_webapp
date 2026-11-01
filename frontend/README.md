# Playbase — Next.js frontend

This project ports the supplied Playbase UI/UX prototype into a Next.js 14 application. The tested prototype's page markup, styles, data and client-side interactions are preserved and served from `public/playbase`; Next.js owns the app shell and runtime.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. For production: `npm run build` then `npm start`.

## Structure

- `app/`: Next.js App Router shell and entry page.
- `public/playbase/css/`: original UI/UX stylesheet cascade.
- `public/playbase/js/`: prototype data, router, utilities and page interactions, loaded in dependency order.
- `public/playbase/images/`: game artwork.
- `public/playbase/data/`: supplied Steam data JSON.

The existing API/backend integration can be connected in a later pass; this frontend currently retains the prototype's sample/demo data behavior.
