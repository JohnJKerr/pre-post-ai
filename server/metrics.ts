// Pure per-window derivations from metadata-only responses.
import type { DateRange, LanguageShare, Punch, WindowSummary } from '../src/api/contract'
import type { Era, ProfileData, PunchCell, RepoActivity, Week } from './types'

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

export function lineTotals(weeks: Week[]) {
  const added = sum(weeks.map((w) => w.a))
  const deleted = sum(weeks.map((w) => w.d))
  const commits = sum(weeks.map((w) => w.c))
  return { added, deleted, commits, perCommit: commits > 0 ? Math.round(added / commits) : 0 }
}

export function hourShares(cells: PunchCell[]) {
  const total = sum(cells.map((c) => c.commits))
  return Array.from({ length: 24 }, (_, hour) => ({
    hour,
    share: total > 0 ? sum(cells.filter((c) => c.hour === hour).map((c) => c.commits)) / total : 0,
  }))
}

/** Smallest run of consecutive hours, wrapping past midnight, holding at least 80% of commits. */
export function codingWindow(cells: PunchCell[], target = 0.8) {
  const shares = hourShares(cells).map((h) => h.share)
  for (let length = 1; length <= 24; length++) {
    for (let start = 0; start < 24; start++) {
      let s = 0
      for (let k = 0; k < length; k++) s += shares[(start + k) % 24]
      // tolerate float error on the 80% boundary
      if (s >= target - 1e-9) return { start, length, end: (start + length) % 24 }
    }
  }
  return { start: 0, length: 24, end: 0 }
}

/** Evenings = Mon–Fri 18:00–05:59. Weekends = Sat and Sun. */
export function outOfHours(cells: PunchCell[]) {
  const total = sum(cells.map((c) => c.commits))
  const weekend = sum(cells.filter((c) => c.day === 0 || c.day === 6).map((c) => c.commits))
  const evening = sum(cells.filter((c) => c.day >= 1 && c.day <= 5 && (c.hour >= 18 || c.hour < 6)).map((c) => c.commits))
  return { evening: evening / total, weekend: weekend / total, combined: (evening + weekend) / total }
}

export function busiestCell(cells: PunchCell[]) {
  return cells.reduce((best, c) => (c.commits > best.commits ? c : best), cells[0])
}

export function projects(repos: RepoActivity[], era: Era, added: number) {
  return repos
    .filter((r) => r.share[era] > 0)
    .map((r) => ({ name: r.isPrivate ? null : r.name, lines: Math.round(r.share[era] * added) }))
    .sort((a, b) => b.lines - a.lines)
}

const MARKUP = new Set(['CSS', 'HTML', 'SCSS', 'Markdown', 'MDX', 'Dockerfile'])
export const USED_THRESHOLD = 0.02

/** Byte shares per repo, weighted by the repo's share of the author's lines in the window. */
export function languageShares(repos: RepoActivity[], era: Era): LanguageShare[] {
  const totals: Record<string, number> = {}
  for (const r of repos) {
    if (r.share[era] === 0) continue
    for (const [lang, part] of Object.entries(r.languages)) {
      if (MARKUP.has(lang)) continue
      totals[lang] = (totals[lang] ?? 0) + part * r.share[era]
    }
  }
  const all = sum(Object.values(totals))
  if (all === 0) return []
  return Object.entries(totals)
    .map(([language, v]) => ({ language, share: v / all }))
    .sort((a, b) => b.share - a.share)
}

const DAY = 86_400_000
const iso = (t: number) => new Date(t).toISOString().slice(0, 10)

/** First Sunday to last Saturday of the stored weeks, so a saved report never moves with today's date. */
export function span(weeks: Week[]): DateRange {
  if (weeks.length === 0) return { start: '', end: '' }
  return { start: weeks[0].w, end: iso(Date.parse(weeks[weeks.length - 1].w + 'T00:00:00Z') + 6 * DAY) }
}

function punchSummary(cells: PunchCell[]): Punch | null {
  if (sum(cells.map((c) => c.commits)) === 0) return null
  const shares = hourShares(cells)
  return {
    cells,
    busiest: busiestCell(cells),
    window: codingWindow(cells),
    hourShares: shares,
    hoursTouched: shares.filter((h) => h.share > 0).length,
    ...outOfHours(cells),
  }
}

export function summarize(data: ProfileData, era: Era): WindowSummary {
  const weekly = data.weekly[era]
  const totals = lineTotals(weekly)
  const list = projects(data.repos, era, totals.added)
  const languages = languageShares(data.repos, era)
  const eligibleRepos = data.repos.filter((r) => r.punchCard === era).length
  const punch = eligibleRepos > 0 ? punchSummary(data.punchCard[era]) : null
  return {
    era,
    range: span(weekly),
    weeks: weekly.length,
    weekly,
    ...totals,
    projects: list,
    projectCount: list.length,
    started: data.repos.filter((r) => r.startedIn === era).length,
    activeDays: data.activeDays[era],
    activeDaysPerWeek: weekly.length > 0 ? +(data.activeDays[era] / weekly.length).toFixed(1) : 0,
    languages,
    usedLanguages: languages.filter((l) => l.share >= USED_THRESHOLD).map((l) => l.language),
    coverage: { eligible: eligibleRepos, total: list.length, share: punch ? data.punchShare[era] : 0 },
    punch,
  }
}
