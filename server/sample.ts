// Seeded sample dataset, shaped like the GitHub responses the app can read with
// "Metadata: read". With the defaults it reproduces the handoff fixture exactly, so it is
// both the test fixture and what the mock API serves.
import type { Era, PunchCell, RepoActivity, Week } from './types'

export const SAMPLE_SEED = 20251124
export const SAMPLE_HANDLE = 'sam-builds'

const DAY = 86_400_000

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Relative likelihood of a commit by weekday (0 = Sunday) and hour of day.
const dayWeight: Record<Era, number[]> = {
  pre: [0.12, 1, 1, 1, 0.95, 0.85, 0.2],
  post: [0.75, 1, 1, 1, 1, 0.9, 0.85],
}
const hourWeight: Record<Era, number[]> = {
  pre: [0.01, 0, 0, 0, 0, 0, 0, 0.04, 0.25, 0.8, 1, 1, 0.45, 0.8, 1, 0.95, 0.85, 0.55, 0.16, 0.12, 0.14, 0.12, 0.06, 0.03],
  post: [0.38, 0.18, 0.04, 0, 0, 0.02, 0.12, 0.42, 0.62, 0.72, 0.8, 0.82, 0.5, 0.72, 0.78, 0.76, 0.7, 0.6, 0.5, 0.78, 0.92, 0.98, 0.9, 0.66],
}

export const SAMPLE_REPOS: RepoActivity[] = [
  { name: 'invoice-api', languages: { 'C#': 0.9, SQL: 0.07, Shell: 0.03 }, share: { pre: 0.46, post: 0.14 }, punchCard: null, startedIn: null },
  { name: 'client-portal', languages: { TypeScript: 0.82, CSS: 0.12, HTML: 0.06 }, share: { pre: 0.26, post: 0 }, punchCard: 'pre', startedIn: 'pre' },
  { name: 'ledger-sync', languages: { 'C#': 0.95, SQL: 0.05 }, share: { pre: 0.14, post: 0 }, punchCard: 'pre', startedIn: 'pre' },
  { name: 'ops-scripts', languages: { Shell: 0.9, Python: 0.1 }, share: { pre: 0.08, post: 0.02 }, punchCard: null, startedIn: null },
  { name: 'blog', languages: { JavaScript: 0.7, CSS: 0.2, HTML: 0.1 }, share: { pre: 0.06, post: 0 }, punchCard: 'pre', startedIn: null },
  { name: 'agent-runner', languages: { TypeScript: 0.92, CSS: 0.05, Shell: 0.03 }, share: { pre: 0, post: 0.19 }, punchCard: 'post', startedIn: 'post' },
  { name: 'snip-cast', languages: { Python: 0.95, Shell: 0.05 }, share: { pre: 0, post: 0.13 }, punchCard: 'post', startedIn: 'post' },
  { name: 'queue-lens', languages: { Go: 0.97, Shell: 0.03 }, share: { pre: 0, post: 0.1 }, punchCard: 'post', startedIn: 'post' },
  { name: 'status-board', languages: { TypeScript: 0.85, CSS: 0.1, HTML: 0.05 }, share: { pre: 0, post: 0.09 }, punchCard: 'post', startedIn: 'post' },
  { name: 'env-loader', languages: { 'C#': 1 }, share: { pre: 0, post: 0.08 }, punchCard: 'post', startedIn: 'post' },
  { name: 'thumb-rs', languages: { Rust: 1 }, share: { pre: 0, post: 0.07 }, punchCard: 'post', startedIn: 'post' },
  { name: 'pace-coach', languages: { Swift: 1 }, share: { pre: 0, post: 0.06 }, punchCard: 'post', startedIn: 'post' },
  { name: 'league-hall', languages: { TypeScript: 0.8, CSS: 0.15, HTML: 0.05 }, share: { pre: 0, post: 0.05 }, punchCard: 'post', startedIn: 'post' },
  { name: 'chat-ops', languages: { Python: 1 }, share: { pre: 0, post: 0.035 }, punchCard: 'post', startedIn: 'post' },
  { name: 'sql-reports', languages: { SQL: 0.8, Python: 0.2 }, share: { pre: 0, post: 0.035 }, punchCard: 'post', startedIn: 'post' },
]

const COMMITS = { pre: 641, post: 1608 }
const LINES_PER_COMMIT = { pre: 64, post: 142 }
const DELETE_RATIO = { pre: 0.31, post: 0.33 }
const PUNCH_SHARE = { pre: 0.46, post: 0.84 }

export interface SampleOptions {
  seed?: number
  /** Sunday that starts the cut-off week, ISO date */
  cutoffWeekStart?: string
  weeks?: number
}

export interface SampleActivity {
  repos: RepoActivity[]
  weekly: Record<Era, Week[]>
  punchCard: Record<Era, PunchCell[]>
  activeDays: Record<Era, number>
  punchShare: Record<Era, number>
}

export function generateSample({ seed = SAMPLE_SEED, cutoffWeekStart = '2025-11-23', weeks = 47 }: SampleOptions = {}): SampleActivity {
  const rand = mulberry32(seed)
  const jitter = (spread: number) => 1 + (rand() * 2 - 1) * spread
  const cutoffMs = Date.parse(cutoffWeekStart + 'T00:00:00Z')
  const startOf = (era: Era) => (era === 'pre' ? cutoffMs - weeks * 7 * DAY : cutoffMs)

  // daily commit counts from the weekday weights and a weekly rhythm (holidays, the post-release ramp)
  function dailyCommits(era: Era, total: number) {
    const raw: number[] = []
    for (let i = 0; i < weeks * 7; i++) {
      const week = Math.floor(i / 7)
      const dow = i % 7 // windows start on a Sunday
      let weekFactor = era === 'pre' ? 1 : 0.55 + 0.75 * (week / Math.max(1, weeks - 1))
      if (era === 'pre' && (week === 0 || week === 33 || week === 34)) weekFactor = 0.1
      if (era === 'post' && week === 4) weekFactor = 0.35
      const active = rand() < (era === 'pre' ? 0.62 : 0.86) * dayWeight[era][dow] + 0.05
      raw.push(active ? weekFactor * dayWeight[era][dow] * jitter(0.6) : 0)
    }
    const sum = raw.reduce((a, b) => a + b, 0)
    return raw.map((v) => Math.round((v / sum) * total))
  }

  function weeksFor(era: Era) {
    const daily = dailyCommits(era, COMMITS[era])
    const result: Week[] = []
    for (let k = 0; k < weeks; k++) {
      const c = daily.slice(k * 7, k * 7 + 7).reduce((a, b) => a + b, 0)
      const a = Math.round(c * LINES_PER_COMMIT[era] * jitter(0.45))
      result.push({
        w: new Date(startOf(era) + k * 7 * DAY).toISOString().slice(0, 10),
        a,
        d: Math.round(a * DELETE_RATIO[era] * jitter(0.3)),
        c,
      })
    }
    return { weeks: result, activeDays: daily.filter((n) => n > 0).length }
  }

  function punchCardFor(era: Era, total: number) {
    const raw: number[] = []
    for (let d = 0; d < 7; d++)
      for (let h = 0; h < 24; h++) {
        const w = dayWeight[era][d] * hourWeight[era][h]
        raw.push(w > 0 ? w * jitter(0.35) : 0)
      }
    const sum = raw.reduce((a, b) => a + b, 0)
    const cells: PunchCell[] = []
    let i = 0
    for (let d = 0; d < 7; d++)
      for (let h = 0; h < 24; h++) cells.push({ day: d, hour: h, commits: Math.round((raw[i++] / sum) * total) })
    return cells
  }

  // call order matters: it fixes the random sequence the handoff values were taken from
  const pre = weeksFor('pre')
  const post = weeksFor('post')
  return {
    repos: SAMPLE_REPOS,
    weekly: { pre: pre.weeks, post: post.weeks },
    activeDays: { pre: pre.activeDays, post: post.activeDays },
    punchShare: PUNCH_SHARE,
    punchCard: {
      pre: punchCardFor('pre', Math.round(COMMITS.pre * PUNCH_SHARE.pre)),
      post: punchCardFor('post', Math.round(COMMITS.post * PUNCH_SHARE.post)),
    },
  }
}

/** Stable seed from a string, so the same handle and cut-off always produce the same mock data. */
export function seedFrom(text: string) {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619)
  return h >>> 0
}
