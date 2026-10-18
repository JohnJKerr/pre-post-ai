// The reports API contract. The back end does every calculation (windows, metrics, score,
// shared chart scales) and returns a finished Report; the front end only formats and draws it.
//
// Paths are relative to the API base (VITE_API_URL, e.g. https://shift-api.developkerr.com/api).
//
//   POST /reports         GenerateReportRequest  generate and save the signed-in user's report
//                         201 Report (Location) · 401 signed out · 422 bad cut-off · 503 GitHub still computing stats
//   GET  /reports/:handle                        200 Report · 404 not generated yet
//   GET  /sample-report                          200 Report, the public demo (isSample: true)
//   GET  /session                                200 Session · 401 signed out
//   GET  /auth/sign-in?returnUrl=/path           full-page redirect to GitHub, then back to returnUrl on the front end
//   POST /auth/sign-out                          204
//
// Errors are { message: string }. Dates are ISO strings: YYYY-MM-DD for days, full ISO for
// timestamps. Shares are fractions 0–1 unless noted.

export type Era = 'pre' | 'post'
export const ERAS: readonly Era[] = ['pre', 'post']

export interface Cutoff {
  label: string
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

export type ScorePart = 'output' | 'projects' | 'languages' | 'hours'

export interface Shift {
  /** post ÷ pre lines added; null when there was nothing before the cut-off */
  linesX: number | null
  projectsX: number | null
  commitsX: number | null
  /** post ÷ pre out-of-hours share; null without punch data on both sides */
  outOfHoursX: number | null
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
  /** "and it runs nights and weekends"; null when hours can't be compared */
  tag: string | null
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
  /** complete weeks either side of the cut-off */
  weeks: number
  pre: WindowSummary
  post: WindowSummary
  shift: Shift
  score: Score
  /** one maximum per chart pair, so both halves share a scale */
  scales: { weekMax: number; projectMax: number; cellMax: number; hourMax: number }
}

export interface GenerateReportRequest {
  /** YYYY-MM-DD; omitted = the default cut-off. The API names it. */
  cutoff?: string
}

export interface Session {
  handle: string
}

export interface ApiErrorBody {
  message: string
}
