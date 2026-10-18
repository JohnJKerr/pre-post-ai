// Builds the Report the API returns from a user's stored activity. Everything the page and
// share cards show is decided here; the front end only formats it.
import type { Report, ScorePart, WindowSummary } from '../src/api/contract'
import { summarize } from './metrics'
import { LADDER, PART_MAX, ratio, scoreShift } from './score'
import type { ProfileData } from './types'

const outOfHours = (s: WindowSummary) => s.punch?.combined ?? null

export function buildReport(profile: ProfileData): Report {
  const pre = summarize(profile, 'pre')
  const post = summarize(profile, 'post')
  const s = scoreShift({ ...pre, outOfHours: outOfHours(pre) }, { ...post, outOfHours: outOfHours(post) })
  const both = [pre, post]
  const max = (xs: number[]) => Math.max(1, ...xs)
  const parts = Object.fromEntries(
    (Object.keys(PART_MAX) as ScorePart[]).map((k) => [k, { points: s.parts[k], max: PART_MAX[k] }]),
  ) as Report['score']['parts']

  return {
    handle: profile.handle,
    isSample: profile.isSample,
    generatedAt: profile.generatedAt,
    cutoff: profile.cutoff,
    weeks: post.weeks,
    pre,
    post,
    shift: {
      linesX: s.linesX,
      projectsX: s.projectsX,
      commitsX: ratio(post.commits, pre.commits),
      outOfHoursX: pre.punch && post.punch ? ratio(post.punch.combined, pre.punch.combined) : null,
      newLanguages: s.newLanguages,
      hoursShift: s.hoursShift,
    },
    score: { total: s.score, parts, rung: s.rung, verdict: s.verdict, tag: s.tag, ladder: LADDER.map((r) => ({ ...r })) },
    scales: {
      weekMax: max(both.flatMap((x) => x.weekly.map((w) => w.a))),
      projectMax: max(both.flatMap((x) => x.projects.map((p) => p.lines))),
      cellMax: max(both.flatMap((x) => (x.punch?.cells ?? []).map((c) => c.commits))),
      // headroom above the tallest hour
      hourMax: Math.max(0.01, ...both.flatMap((x) => (x.punch ? x.punch.hourShares.map((h) => h.share) : []))) * 1.08,
    },
  }
}
