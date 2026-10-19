// Shift score: how much the way you code moved after the cut-off. 0–100, metadata only.
import type { LanguageShare } from '../src/api/contract'

export const LADDER = [
  { min: 0, verdict: "I'm an artisan" },
  { min: 15, verdict: "I've hired an apprentice" },
  { min: 30, verdict: "I've grown robot arms" },
  { min: 45, verdict: "I'm a cyborg" },
  { min: 65, verdict: "I'm a machine (literally)" },
  { min: 85, verdict: 'I started the robot uprising' },
] as const

export const PART_MAX = { output: 40, projects: 15, languages: 20, time: 25 } as const

/** The slice of a window summary the score reads. */
export interface ScoreSide {
  added: number
  commits: number
  projectCount: number
  languages: LanguageShare[]
  activeDays: number
  /** share of commits on evenings and weekends; null without punch-card data */
  outOfHours: number | null
}

export interface ShiftScore {
  /** null when there is nothing before the cut-off to compare against */
  linesX: number | null
  projectsX: number | null
  commitsX: number | null
  activeDaysX: number | null
  newLanguages: string[]
  /** percentage points; null when either side lacks punch-card data */
  hoursShift: number | null
  parts: { output: number; projects: number; languages: number; time: number }
  score: number
  rung: number
  verdict: string
}

const clamp = (lo: number, hi: number, v: number) => Math.max(lo, Math.min(hi, v))
export const ratio = (post: number, pre: number) => (pre > 0 ? post / pre : null)

export function scoreShift(pre: ScoreSide, post: ScoreSide): ShiftScore {
  const linesX = ratio(post.added, pre.added)
  const projectsX = ratio(post.projectCount, pre.projectCount)
  const commitsX = ratio(post.commits, pre.commits)
  const activeDaysX = ratio(post.activeDays, pre.activeDays)
  const before = new Map(pre.languages.map(({ language, share }) => [language, share]))
  const newLanguages = post.languages.filter(({ language, share }) => share >= 0.05 && (before.get(language) ?? 0) <= 0.01).map(({ language }) => language)
  // rounded to 1e-6 pp so float noise does not show in the report
  const hoursShift =
    pre.outOfHours == null || post.outOfHours == null ? null : Math.round((post.outOfHours - pre.outOfHours) * 1e8) / 1e6

  // each part is rounded first, so the workings on the report add up exactly.
  // An undefined multiplier (no pre-AI activity) scores 0 rather than a free maximum.
  const commits = commitsX == null ? 0 : Math.round(clamp(0, 28, 28 * Math.log10(commitsX)))
  const lines = linesX == null ? 0 : Math.round(clamp(0, 12, 12 * Math.log10(linesX)))
  const output = commits + lines
  const projects = projectsX == null ? 0 : Math.round(clamp(0, 15, 15 * (Math.log2(projectsX) / 2)))
  const languages = Math.min(20, 5 * newLanguages.length)
  const time = activeDaysX == null ? 0 : Math.round(clamp(0, 25, 25 * Math.log2(activeDaysX)))
  const score = output + projects + languages + time
  const rung = rungFor(score)

  return { linesX, projectsX, commitsX, activeDaysX, newLanguages, hoursShift, parts: { output, projects, languages, time }, score, rung, verdict: LADDER[rung].verdict }
}

export const rungFor = (score: number) => LADDER.reduce((at, r, i) => (score >= r.min ? i : at), 0)
