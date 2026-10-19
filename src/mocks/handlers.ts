// Mock reports API. Runs the reference calculations in /server against seeded sample
// activity in place of GitHub, and keeps each user's activity in this browser's localStorage.
// The contract is in src/api/contract.ts. Sign-in is mocked by the form itself (see ./signIn.ts).
import { delay, http, HttpResponse } from 'msw'
import { API_URL } from '../api/config'
import type { Generation } from '../api/contract'
import { loadGeneration, saveGeneration } from './signIn'
import { PRESET_CUTOFFS } from '../../server/cutoffs'
import { sampleProfile } from '../../server/fixture'
import { buildReport } from '../../server/report'
import { generateSample, seedFrom } from '../../server/sample'
import type { ProfileData } from '../../server/types'
import { isoDate, windowsFor } from '../../server/windows'

const KEY = 'prepost:activity:'
const memory = new Map<string, ProfileData>()
const keyOf = (handle: string) => handle.toLowerCase()

function load(handle: string): ProfileData | undefined {
  try {
    const raw = localStorage.getItem(KEY + keyOf(handle))
    if (raw) return JSON.parse(raw)
  } catch {
    // storage blocked: fall back to memory
  }
  return memory.get(keyOf(handle))
}

function save(profile: ProfileData) {
  memory.set(keyOf(profile.handle), profile)
  try {
    localStorage.setItem(KEY + keyOf(profile.handle), JSON.stringify(profile))
  } catch {
    // storage blocked or full: memory only
  }
}

const error = (status: number, message: string) => HttpResponse.json({ message }, { status })
const generation = (status: Generation['status'], fields: Partial<Generation> = {}) =>
  HttpResponse.json<Generation>({ status, handle: null, message: null, ...fields })

// how long a mock generation stays pending, standing in for GitHub computing stats/* (202s)
const GENERATING_MS = 2500
// handles that play out the other endings
const EMPTY_HANDLE = 'nothing-yet'
const FAILING_HANDLE = 'broken'

export const handlers = [
  http.get(`${API_URL}/sample-report`, async () => {
    await delay(250)
    return HttpResponse.json(buildReport(sampleProfile()))
  }),

  http.get(`${API_URL}/generations/:id`, ({ params }) => {
    const id = String(params.id)
    const job = loadGeneration(id)
    if (!job) return error(404, 'We couldn’t find that report request. Sign in to generate your report.')
    if (job.done) return generation('ready', { handle: job.handle })
    if (Date.now() - job.startedAt < GENERATING_MS) return generation('pending')

    const handle = job.handle.toLowerCase()
    if (handle === EMPTY_HANDLE) return generation('empty')
    if (handle === FAILING_HANDLE) return generation('failed', { message: 'GitHub is still crunching your repository stats. Sign in again in a minute to retry.' })

    const cutoff = PRESET_CUTOFFS.find((c) => c.date === job.cutoff) ?? { label: 'Custom', date: job.cutoff }
    const windows = windowsFor(cutoff.date, new Date())
    save({
      handle: job.handle,
      isSample: false,
      generatedAt: new Date().toISOString(),
      cutoff,
      ...generateSample({ seed: seedFrom(`${handle}:${cutoff.date}`), cutoffWeekStart: isoDate(windows.cutoffWeekStart), postStart: isoDate(windows.post.start), weeks: windows.weeks }),
    })
    saveGeneration(id, { ...job, done: true })
    return generation('ready', { handle: job.handle })
  }),

  http.get(`${API_URL}/reports/:handle`, async ({ params }) => {
    await delay(250)
    const profile = load(String(params.handle))
    // built on read, so rule changes reach saved reports
    return profile ? HttpResponse.json(buildReport(profile)) : error(404, `${params.handle} hasn’t generated a report yet.`)
  }),
]
