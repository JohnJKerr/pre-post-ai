// Shift score: how much the way you code moved after the cut-off. 0–100, metadata only.

export const LADDER = [
  { min: 0, verdict: "I'm still hand-crafting" },
  { min: 15, verdict: "I'm still prompting" },
  { min: 30, verdict: "I've got a pair programmer" },
  { min: 45, verdict: 'I run a one-person dev shop' },
  { min: 65, verdict: 'I built a software factory' },
  { min: 85, verdict: 'I run a lights-out factory' },
] as const

export const PART_MAX = { output: 45, projects: 15, languages: 10, hours: 30 } as const

/** The slice of a window summary the score reads. */
export interface ScoreSide {
  added: number
  projectCount: number
  usedLanguages: string[]
  /** share of commits on evenings and weekends; null without punch-card data */
  outOfHours: number | null
}

export interface ShiftScore {
  /** null when there is nothing before the cut-off to compare against */
  linesX: number | null
  projectsX: number | null
  newLanguages: string[]
  /** percentage points; null when either side lacks punch-card data */
  hoursShift: number | null
  parts: { output: number; projects: number; languages: number; hours: number }
  score: number
  rung: number
  verdict: string
  /** null when the hours can't be compared */
  tag: string | null
}

const clamp = (lo: number, hi: number, v: number) => Math.max(lo, Math.min(hi, v))
export const ratio = (post: number, pre: number) => (pre > 0 ? post / pre : null)

export function scoreShift(pre: ScoreSide, post: ScoreSide): ShiftScore {
  const linesX = ratio(post.added, pre.added)
  const projectsX = ratio(post.projectCount, pre.projectCount)
  const before = new Set(pre.usedLanguages)
  const newLanguages = post.usedLanguages.filter((l) => !before.has(l))
  // rounded to 1e-6 pp so float noise can't push a shift across the ±10 / +15 thresholds
  const hoursShift =
    pre.outOfHours == null || post.outOfHours == null ? null : Math.round((post.outOfHours - pre.outOfHours) * 1e8) / 1e6

  // each part is rounded first, so the workings on the report add up exactly.
  // An undefined multiplier (no pre-AI activity) scores 0 rather than a free maximum.
  const output = linesX == null ? 0 : Math.round(clamp(0, 45, 45 * Math.log10(linesX)))
  const projects = projectsX == null ? 0 : Math.round(clamp(0, 15, 15 * (Math.log2(projectsX) / 2)))
  const languages = Math.min(10, 2.5 * newLanguages.length)
  const hours = hoursShift == null ? 0 : Math.round(clamp(0, 30, Math.abs(hoursShift) * 0.6))
  const score = output + projects + languages + hours
  const rung = rungFor(score)

  let tag: string | null = null
  if (hoursShift != null) {
    tag =
      hoursShift >= 15 && post.outOfHours! >= 0.4
        ? 'and it runs nights and weekends'
        : hoursShift <= -10
          ? 'and I got my evenings back'
          : 'and I still clock off on time'
  }

  return { linesX, projectsX, newLanguages, hoursShift, parts: { output, projects, languages, hours }, score, rung, verdict: LADDER[rung].verdict, tag }
}

export const rungFor = (score: number) => LADDER.reduce((at, r, i) => (score >= r.min ? i : at), 0)
