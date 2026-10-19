// The reports API contract. The back end does every calculation (windows, metrics, score,
// shared chart scales) and returns a finished Report; the front end only formats and draws it.
//
// Paths are relative to the API base (VITE_API_URL, e.g. https://shift-api.developkerr.com/api).
// There is no session: every call is a plain GET without credentials.
//
//   GET /auth/sign-in?cutoff=YYYY-MM-DD   full-page navigation (not a fetch) to GitHub. Lands back on
//                                         /generating?id=…  generating
//                                         /generate?error=… SignInError, a bad cut-off (GitHub not visited)
//                                         /                 sign-in failed or cancelled
//                                         GitHub's install page, when the app isn't installed
//   GET /generations/:id                  200 Generation · 404 unknown id. Poll every 2 s while pending.
//   GET /reports/:handle                  200 Report · 404 not generated yet. Handle is case-insensitive.
//   GET /sample-report                    200 Report, the public demo (isSample: true)
//
// Errors are { message: string }, written to be shown as they are. Dates are ISO strings:
// YYYY-MM-DD for days, full ISO for timestamps. Shares are fractions 0–1 unless noted.

export type Era = 'pre' | 'post'
export const ERAS: readonly Era[] = ['pre', 'post']

/** The API works from the date alone; the front end names the release it marks. */
export interface Cutoff {
  /** YYYY-MM-DD */
  date: string
}

/** One week of the author's activity. */
export interface Week {
  /** week start (Sunday), YYYY-MM-DD */
  w: string
  /** lines added */
  a: number
  /** lines deleted */
  d: number
  /** commits */
  c: number
}

/** One punch-card cell. day 0 = Sunday, hour 0–23 in each commit's own timezone. */
export interface PunchCell {
  day: number
  hour: number
  commits: number
}

export interface DateRange {
  /** YYYY-MM-DD, inclusive */
  start: string
  /** YYYY-MM-DD, inclusive */
  end: string
}

export interface LanguageShare {
  language: string
  share: number
}

export interface Punch {
  /** all 168 cells, or only the non-zero ones */
  cells: PunchCell[]
  busiest: PunchCell
  /** smallest run of hours (wrapping midnight) holding 80% of commits; end = (start + length) % 24 */
  window: { start: number; length: number; end: number }
  /** 24 entries, hour 0–23 */
  hourShares: { hour: number; share: number }[]
  hoursTouched: number
  /** Mon–Fri 18:00–05:59 */
  evening: number
  /** Sat and Sun */
  weekend: number
  combined: number
}

/** One side of the comparison. */
export interface WindowSummary {
  era: Era
  range: DateRange
  weeks: number
  weekly: Week[]
  added: number
  deleted: number
  commits: number
  perCommit: number
  /** sorted by lines, descending; name is null for a private repo */
  projects: { name: string | null; lines: number }[]
  projectCount: number
  /** repos created in this window */
  started: number
  activeDays: number
  activeDaysPerWeek: number
  /** markup excluded, sorted by share, descending */
  languages: LanguageShare[]
  /** languages with 2%+ share */
  usedLanguages: string[]
  /** punch-card eligible repos, and their share of the author's commits */
  coverage: { eligible: number; total: number; share: number }
  /** null when no repo in this window is punch-card eligible */
  punch: Punch | null
}

export type ScorePart = 'output' | 'projects' | 'languages' | 'time'

export interface Shift {
  /** post ÷ pre lines added; null when there was nothing before the cut-off */
  linesX: number | null
  projectsX: number | null
  commitsX: number | null
  /** post ÷ pre out-of-hours share; null without punch data on both sides */
  outOfHoursX: number | null
  /** post ÷ pre active days; null without pre-AI activity */
  activeDaysX: number | null
  newLanguages: string[]
  /** out-of-hours change in percentage points; null without punch data on both sides */
  hoursShift: number | null
}

export interface Score {
  /** 0–100, the sum of the parts */
  total: number
  parts: Record<ScorePart, { points: number; max: number }>
  /** index into ladder */
  rung: number
  verdict: string
  /** every rung, lowest first, so the page can draw the ladder */
  ladder: { min: number; verdict: string }[]
}

export interface Report {
  handle: string
  /** the public demo report */
  isSample: boolean
  /** ISO timestamp */
  generatedAt: string
  cutoff: Cutoff
  /** complete weeks in each window, at most 26: pre ends the day before the cut-off week, post is the
   *  latest complete weeks, so a gap sits between them unless the cut-off is under 26 weeks ago */
  weeks: number
  pre: WindowSummary
  post: WindowSummary
  shift: Shift
  score: Score
  /** one maximum per chart pair, so both halves share a scale */
  scales: { weekMax: number; projectMax: number; cellMax: number; hourMax: number }
}

/** Why sign-in sent the user back to /generate?error=…; codes, so a link can't put text on the page. */
export type SignInError = 'invalid-cutoff' | 'cutoff-too-recent'

export type GenerationStatus = 'pending' | 'ready' | 'empty' | 'failed'

/** A report being generated after sign-in. Pending for at most 30 minutes, then failed. */
export interface Generation {
  status: GenerationStatus
  /** only when ready: the report is at /reports/:handle */
  handle: string | null
  /** only when failed */
  message: string | null
}

export interface ApiErrorBody {
  message: string
}
