// Builds profile variants for Storybook from the seeded sample, so each story can dial in
// one configuration: growth, project count, hours pattern, punch-card eligibility, and so on.
// Storybook runs the reference back-end calculations in /server to make each Report.
import { buildReport } from '../../server/report'
import { generateSample, SAMPLE_CUTOFF, SAMPLE_HANDLE, SAMPLE_SEED } from '../../server/sample'
import type { Era, ProfileData, PunchCell, RepoActivity, Week } from '../../server/types'
import { isoDate, windowsFor } from '../../server/windows'

export type HoursPattern = 'nights and weekends' | 'evenings back' | 'unchanged'

export interface ScenarioArgs {
  handle: string
  isSample: boolean
  /** seed for the generated activity; the default reproduces the handoff fixture */
  seed: number
  /** complete weeks since the cut-off; each window is at most 26 of them */
  weeks: number
  /** multiplies post-AI lines added and deleted */
  postGrowth: number
  /** keep the top N post-AI projects (1–12) */
  postProjects: number
  hours: HoursPattern
  /** false = no activity at all before the cut-off */
  preActivity: boolean
  /** private repos are listed without their names */
  privateRepos: boolean
  prePunchCard: boolean
  postPunchCard: boolean
}

export const SAMPLE_ARGS: ScenarioArgs = {
  handle: SAMPLE_HANDLE,
  isSample: true,
  seed: SAMPLE_SEED,
  weeks: 47,
  postGrowth: 1,
  postProjects: 12,
  hours: 'nights and weekends',
  preActivity: true,
  privateRepos: false,
  prePunchCard: true,
  postPunchCard: true,
}

const GENERATED_AT = '2026-10-18T00:00:00Z'
const WEEK = 7 * 86_400_000
/** Sunday 18 Oct 2026, the week the scenarios are generated in */
const GENERATED_WEEK = Date.parse(GENERATED_AT)

const scaleWeeks = (weeks: Week[], k: number) => weeks.map((w) => ({ ...w, a: Math.round(w.a * k), d: Math.round(w.d * k) }))
const zeroWeeks = (weeks: Week[]) => weeks.map((w) => ({ ...w, a: 0, d: 0, c: 0 }))

/** Re-scale one punch card to another's commit total, keeping its shape. */
function reshape(shape: PunchCell[], like: PunchCell[]) {
  const from = shape.reduce((a, c) => a + c.commits, 0)
  const to = like.reduce((a, c) => a + c.commits, 0)
  return shape.map((c) => ({ ...c, commits: from ? Math.round((c.commits / from) * to) : 0 }))
}

function keepTopPostProjects(repos: RepoActivity[], n: number): RepoActivity[] {
  const keep = new Set(
    [...repos]
      .filter((r) => r.share.post > 0)
      .sort((a, b) => b.share.post - a.share.post)
      .slice(0, n)
      .map((r) => r.name),
  )
  const total = repos.filter((r) => keep.has(r.name)).reduce((a, r) => a + r.share.post, 0)
  return repos.map((r) => (keep.has(r.name) ? { ...r, share: { ...r.share, post: r.share.post / total } } : { ...r, share: { ...r.share, post: 0 }, startedIn: r.startedIn === 'post' ? null : r.startedIn, punchCard: r.punchCard === 'post' ? null : r.punchCard }))
}

export function buildScenario(args: Partial<ScenarioArgs> = {}): ProfileData {
  const a = { ...SAMPLE_ARGS, ...args }
  // the windows the API would set; 47 weeks since the default cut-off with the sample seed is the fixture
  const weeksSince = Math.max(1, a.weeks)
  const cutoff = { date: weeksSince === 47 ? SAMPLE_CUTOFF : isoDate(new Date(GENERATED_WEEK - weeksSince * WEEK)) }
  const w = windowsFor(cutoff.date, new Date(GENERATED_AT))
  const s = generateSample({ seed: a.seed, weeks: w.weeks, cutoffWeekStart: isoDate(w.cutoffWeekStart), postStart: isoDate(w.post.start) })

  let repos = keepTopPostProjects(s.repos, Math.max(1, Math.min(12, a.postProjects)))
  let weekly = { pre: s.weekly.pre, post: scaleWeeks(s.weekly.post, a.postGrowth) }
  let punchCard = { ...s.punchCard }
  let activeDays = { ...s.activeDays }

  if (a.hours === 'evenings back') punchCard = { pre: reshape(s.punchCard.post, s.punchCard.pre), post: reshape(s.punchCard.pre, s.punchCard.post) }
  if (a.hours === 'unchanged') punchCard = { ...punchCard, post: reshape(s.punchCard.pre, s.punchCard.post) }

  const drop = (era: Era) => (r: RepoActivity) => (r.punchCard === era ? { ...r, punchCard: null } : r)
  if (!a.prePunchCard) repos = repos.map(drop('pre'))
  if (!a.postPunchCard) repos = repos.map(drop('post'))

  if (!a.preActivity) {
    repos = repos.map((r) => ({ ...r, share: { ...r.share, pre: 0 }, startedIn: r.startedIn === 'pre' ? null : r.startedIn, punchCard: r.punchCard === 'pre' ? null : r.punchCard }))
    weekly = { ...weekly, pre: zeroWeeks(weekly.pre) }
    activeDays = { ...activeDays, pre: 0 }
  }

  // every other repo private, so a report shows a mix
  if (a.privateRepos) repos = repos.map((r, i) => ({ ...r, isPrivate: i % 2 === 1 }))

  return {
    handle: a.handle,
    isSample: a.isSample,
    generatedAt: GENERATED_AT,
    cutoff,
    repos,
    weekly,
    punchCard,
    activeDays,
    punchShare: s.punchShare,
  }
}

export const scenarioReport = (args: Partial<ScenarioArgs> = {}) => buildReport(buildScenario(args))

/** Named configurations worth eyeballing. */
export const PRESETS = {
  sample: {},
  robotArms: { handle: 'steady-dev', isSample: false, postGrowth: 0.2, postProjects: 5, hours: 'unchanged' },
  cyborg: { handle: 'pair-dev', isSample: false, postGrowth: 0.45, postProjects: 7, hours: 'unchanged' },
  eveningsBack: { handle: 'calm-dev', isSample: false, hours: 'evenings back' },
  noPreActivity: { handle: 'new-dev', isSample: false, preActivity: false },
  noPunchCardRepos: { handle: 'team-dev', isSample: false, prePunchCard: false, postPunchCard: false },
  privateRepos: { handle: 'work-dev', isSample: false, privateRepos: true },
  noPrePunchCard: { handle: 'shared-dev', isSample: false, prePunchCard: false },
  shortWindow: { handle: 'early-dev', isSample: false, seed: 7, weeks: 6 },
  longWindow: { handle: 'veteran-dev', isSample: false, seed: 42, weeks: 150 },
} satisfies Record<string, Partial<ScenarioArgs>>
