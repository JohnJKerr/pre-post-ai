# Shift

Compares a developer's GitHub activity before and after AI coding went mainstream: a one-page report, a 0–100 shift score with a verdict, and share cards. Metadata only — see the handoff brief for the hard rules.

Stack: Vite, React 19, Tailwind v4 + daisyUI 5, TanStack Charts 1.1, TanStack Query, React Router, Storybook 10 with MSW, Vitest.

## Run

```sh
npm install
npm run dev          # app on :5173, against the API in VITE_API_URL
npm run storybook    # stories on :6006
npm test             # back-end reference logic (metric rules, score, windows) and the cut-off check
npm run build
```

The app always calls the real API. `VITE_API_URL=https://localhost:7194/api npm run dev` runs against the local .NET API.

## Layout

```
server/            reference back end: windows, metrics, score, report builder, sample data + tests.
                   Storybook runs it; the real API ports it. The app never imports it (lint rule).
src/api/           contract.ts (the API types), fetch client, TanStack Query hooks
src/charts/        TanStack Charts definitions and language colours
src/features/      Shift logo, report sections, share panel and cards, invite, cut-off and sign-in form: render what the API returns
src/pages/         routed pages: /, /generate, /generating, /r/:handle, /sample
src/lib/           display formatting
src/stories/       scenario builder and the MSW handlers standing in for the API in Storybook
```

## API

The back end ([pre-post-ai-api](../pre-post-ai-api)) does every calculation and returns a finished `Report`; the front end only formats and draws it. Types and endpoints are in `src/api/contract.ts`. Paths are relative to `VITE_API_URL`:

| | |
|---|---|
| `GET /auth/sign-in?cutoff=YYYY-MM-DD` | Full-page navigation to GitHub (GitHub App user authorisation). The API starts the report and lands the browser on `/generating?id=…`; a bad cut-off comes back as `/generate?error=invalid-cutoff` or `cutoff-too-recent`; a failed sign-in comes back to `/`; without the app installed, GitHub's install page |
| `GET /generations/:id` | `200 { status: pending \| ready \| empty \| failed, handle, message }` · `404`. Polled every 2 s |
| `GET /reports/:handle` | Saved report. `200 Report` · `404` (the page offers an invite link) |
| `GET /sample-report` | The public demo report |

The API works from the cut-off date alone and returns it as `cutoff: { date }`; the front end names the preset releases (`src/features/generate/cutoffs.ts`) and shows any other date as just a date.

There's no session and no cookie: every fetch is a plain GET, the only kind the API's CORS policy allows. Changing the cut-off means signing in again, which regenerates the signed-in user's report.

Pages: `/` and `/generate` pick a cut-off and sign in · `/generating?id=` polls, then moves on to the report · `/r/:handle` · `/sample`.

Set `VITE_API_URL` (see `.env.example`; production is `https://shift-api.developkerr.com/api`). Point it at the API's own origin, not a proxy: GitHub's callback is built from the host sign-in arrives on.

## Storybook

`Report/Full report → Playground` has controls for window length, post-AI growth, project count, hours pattern, punch-card eligibility and no pre-AI activity. Named presets show several verdicts and edge cases; `Report/Verdict art` has a story for each of the six images. `Pages/*` stories run the routed pages against MSW handlers (`src/stories/handlers.ts`, worker in `.storybook/public`) with per-story overrides (generating and its endings, 404 invite, 5xx, a cut-off the API rejected).
