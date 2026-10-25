# Shift (front end)

Read `README.md` first: it covers running the app, the layout, the API contract and Storybook's stand-in API.

## Rules

- **Metadata only.** Shift reads GitHub repository metadata, never code. Any new data must come from metadata endpoints.
- **The front end renders; the API computes.** Components format and draw the `Report` from `src/api/contract.ts`. A change to windows, metrics or the score goes in `server/` (the reference back end, with its tests) and must be ported to the .NET API in `../pre-post-ai-api`; say so when you hand back.
- **Every UI state gets a story.** New sections, endings or edge cases get a Storybook story, built from `src/stories/scenarios.ts` where a report is involved.
- **Loading shows skeletons**, matching the layout they stand in for. The exception is generating a report (`GeneratingPage`), which shows an indeterminate progress bar: it can take minutes and may end without a report.

## Brand

The product is **Shift**. Show the name with `Logo` (`src/features/brand/Logo.tsx`), which draws in `currentColor`. Brand cobalt `#2f4bff` is the post-AI mark (`--color-post-mark` in `src/index.css`); the neutral frame is the daisyUI `now` theme.

## Checking your work

- `npx tsc -b`, `npm test`, `npx oxlint src server`.
- Lint `src server` explicitly: `storybook-static/` is committed build output and bare `npm run lint` fails on it.

## Commits

Subject as `Area: Summary`, e.g. `Auth: New sign in flow`.
