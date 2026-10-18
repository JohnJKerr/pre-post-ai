# Pre/Post

Compares a developer's GitHub activity before and after AI coding went mainstream: a one-page report, a 0–100 shift score with a verdict, and share cards. Metadata only — see the handoff brief for the hard rules.

Stack: Vite, React 19, Tailwind v4 + daisyUI 5, TanStack Charts 1.1, TanStack Query, React Router, MSW, Storybook 10, Vitest.

## Run

```sh
npm install
npm run dev          # app on :5173, reports API mocked by MSW
npm run storybook    # stories on :6006
npm test             # back-end reference logic (metric rules, score, windows)
npm run build
```

`VITE_API_MOCK=false VITE_API_URL=http://localhost:5101/api npm run dev` runs against the local .NET API.

## Layout

```
server/            reference back end: windows, metrics, score, report builder, sample data + tests.
                   The mock API and Storybook run it; the real API ports it. The app never imports it (lint rule).
src/api/           contract.ts (the API types), fetch client, TanStack Query hooks
src/charts/        TanStack Charts definitions and language colours
src/features/      report sections, share panel and cards, invite, sign-in: render what the API returns
src/pages/         routed pages: /, /generate, /r/:handle, /sample
src/lib/           display formatting
src/mocks/         MSW handlers and mock sign-in standing in for the API
src/stories/       scenario builder for Storybook
```

## API

The back end ([pre-post-ai-api](../pre-post-ai-api)) does every calculation and returns a finished `Report`; the front end only formats and draws it. Types and endpoints are in `src/api/contract.ts`. Paths are relative to `VITE_API_URL`:

| | |
|---|---|
| `GET /auth/sign-in?returnUrl=/generate` | Full-page redirect to GitHub (GitHub App user authorisation), then back to the front end |
| `POST /auth/sign-out` | `204` |
| `GET /session` | `200 { handle }` · `401` |
| `POST /reports` `{ cutoff?: "YYYY-MM-DD" }` | Generate and save the signed-in user's report. `201 Report` · `401` · `422` · `503` (GitHub still computing stats) |
| `GET /reports/:handle` | Saved report. `200 Report` · `404` (the page offers an invite link) |
| `GET /sample-report` | The public demo report |

Pages: `/` sign in · `/generate` (sign-in returns here; it POSTs and moves on) · `/r/:handle` · `/sample`.

Against the real API, set `VITE_API_MOCK=false` and `VITE_API_URL` (see `.env.example`; production is `https://shift-api.developkerr.com/api`). Requests send cookies cross-origin, so the API must allow the front end's origin with credentials.

With the mock (the default), sign-in is a handle input that sets a cookie the mock reads (`src/mocks/session.ts`); activity is seeded and kept in this browser's `localStorage`.

## Storybook

`Report/Full report → Playground` has controls for window length, post-AI growth, project count, hours pattern, punch-card eligibility and no pre-AI activity. Named presets cover each verdict and edge case. `Pages/*` stories run the routed pages against the mock API with per-story handler overrides (generating, your own report, 404 invite, 5xx, rejected cut-off).
