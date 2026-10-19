# Shift

Compares a developer's GitHub activity before and after AI coding went mainstream: a one-page report, a 0–100 shift score with a verdict, and share cards. Metadata only — see the handoff brief for the hard rules.

Stack: Vite, React 19, Tailwind v4 + daisyUI 5, TanStack Charts 1.1, TanStack Query, React Router, MSW, Storybook 10, Vitest.

## Run

```sh
npm install
npm run dev          # app on :5173, reports API mocked by MSW
npm run storybook    # stories on :6006
npm test             # back-end reference logic (metric rules, score, windows) and the cut-off check
npm run build
```

`VITE_API_MOCK=false VITE_API_URL=https://localhost:7194/api npm run dev` runs against the local .NET API.

## Layout

```
server/            reference back end: windows, metrics, score, report builder, sample data + tests.
                   The mock API and Storybook run it; the real API ports it. The app never imports it (lint rule).
src/api/           contract.ts (the API types), fetch client, TanStack Query hooks
src/charts/        TanStack Charts definitions and language colours
src/features/      Shift logo, report sections, share panel and cards, invite, cut-off and sign-in form: render what the API returns
src/pages/         routed pages: /, /generate, /generating, /r/:handle, /sample
src/lib/           display formatting
src/mocks/         MSW handlers and mock sign-in standing in for the API
src/stories/       scenario builder for Storybook
```

## API

The back end ([pre-post-ai-api](../pre-post-ai-api)) does every calculation and returns a finished `Report`; the front end only formats and draws it. Types and endpoints are in `src/api/contract.ts`. Paths are relative to `VITE_API_URL`:

| | |
|---|---|
| `GET /auth/sign-in?cutoff=YYYY-MM-DD` | Full-page navigation to GitHub (GitHub App user authorisation). The API starts the report and lands the browser on `/generating?id=…`; a bad cut-off comes back as `/generate?error=invalid-cutoff` or `cutoff-too-recent`; a failed sign-in comes back to `/`; without the app installed, GitHub's install page |
| `GET /generations/:id` | `200 { status: pending \| ready \| empty \| failed, handle, message }` · `404`. Polled every 2 s |
| `GET /reports/:handle` | Saved report. `200 Report` · `404` (the page offers an invite link) |
| `GET /sample-report` | The public demo report |

There's no session and no cookie: every fetch is a plain GET, the only kind the API's CORS policy allows. Changing the cut-off means signing in again, which regenerates the signed-in user's report.

Pages: `/` and `/generate` pick a cut-off and sign in · `/generating?id=` polls, then moves on to the report · `/r/:handle` · `/sample`.

Against the real API, set `VITE_API_MOCK=false` and `VITE_API_URL` (see `.env.example`; production is `https://shift-api.developkerr.com/api`). Point it at the API's own origin, not a proxy: GitHub's callback is built from the host sign-in arrives on.

With the mock (the default), the form asks for a handle and records the generation itself (`src/mocks/signIn.ts`); `GET /generations/:id` stays pending for 2.5 s, then saves seeded activity in this browser's `localStorage`. The handles `nothing-yet` and `broken` play out the empty and failed endings.

## Storybook

`Report/Full report → Playground` has controls for window length, post-AI growth, project count, hours pattern, punch-card eligibility and no pre-AI activity. Named presets cover each verdict and edge case. `Pages/*` stories run the routed pages against the mock API with per-story handler overrides (generating and its endings, 404 invite, 5xx, a cut-off the API rejected).
