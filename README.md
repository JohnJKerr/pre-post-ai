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

`VITE_API_MOCK=false npm run dev` turns the mock off once the real API exists.

## Layout

```
server/            reference back end: windows, metrics, score, report builder, sample data + tests.
                   The mock API and Storybook run it; the real API ports it. The app never imports it (lint rule).
src/api/           contract.ts (the API types), fetch client, TanStack Query hooks, mock sign-in
src/charts/        TanStack Charts definitions and language colours
src/features/      report sections, share panel and cards, invite: render the Report as given
src/pages/         routed pages: / and /r/:handle
src/lib/           display formatting
src/mocks/         MSW handlers standing in for the reports API
src/stories/       scenario builder for Storybook
```

## Reports API (mocked)

The back end does every calculation and returns a finished `Report` (`src/api/contract.ts`). The front end only formats and draws it.

| | |
|---|---|
| `POST /api/reports` `{ cutoff?: "YYYY-MM-DD" }` | Generate and save the signed-in user's report. `201 Report` + `Location` · `401` · `422 { message }` |
| `GET /api/reports/:handle` | Saved report. `200 Report` · `404 { message }` (the page then offers an invite link) |

The mock signs you in with a cookie naming the handle (`src/api/session.ts`), generates seeded activity, and keeps it in this browser's `localStorage`, building the report on read. `/r/sam-builds` is the seeded sample (the handoff fixture).

## Storybook

`Report/Full report → Playground` has controls for window length, post-AI growth, project count, hours pattern, punch-card eligibility and no pre-AI activity. Named presets cover each verdict and edge case. `Pages/*` stories run the routed pages against the mock API with per-story handler overrides (generating, your own report, 404 invite, 5xx, rejected cut-off).
