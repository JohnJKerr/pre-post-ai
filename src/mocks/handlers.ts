// Mock reports API. Runs the reference calculations in /server against seeded sample
// activity in place of GitHub, and keeps each user's activity in this browser's localStorage.
// The contract is in src/api/contract.ts. Sign-in is a cookie naming the handle (see src/api/session.ts).
import { delay, http, HttpResponse } from 'msw'
import type { GenerateReportRequest } from '../api/contract'
import { SESSION_COOKIE } from '../api/session'
import { DEFAULT_CUTOFF, PRESET_CUTOFFS } from '../../server/cutoffs'
import { sampleProfile } from '../../server/fixture'
import { buildReport } from '../../server/report'
import { generateSample, SAMPLE_HANDLE, seedFrom } from '../../server/sample'
import type { ProfileData } from '../../server/types'
import { isoDate, windowsFor } from '../../server/windows'

const KEY = 'prepost:activity:'
const memory = new Map<string, ProfileData>()
const keyOf = (handle: string) => handle.toLowerCase()

function load(handle: string): ProfileData | undefined {
  if (keyOf(handle) === SAMPLE_HANDLE) return sampleProfile()
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
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/

export const handlers = [
  http.post('/api/reports', async ({ request, cookies }) => {
    const handle = cookies[SESSION_COOKIE]
    if (!handle) return error(401, 'Connect GitHub to make your report')

    const body = (await request.json().catch(() => ({}))) as GenerateReportRequest
    const param = body.cutoff ?? null
    if (param && (!ISO_DAY.test(param) || Number.isNaN(Date.parse(param)))) return error(422, 'The cut-off must be a date, YYYY-MM-DD')
    const cutoff = param ? (PRESET_CUTOFFS.find((c) => c.date === param) ?? { label: 'Custom', date: param }) : DEFAULT_CUTOFF
    const windows = windowsFor(cutoff.date, new Date())
    if (windows.weeks < 1) return error(422, 'No complete weeks since that cut-off yet')

    // stands in for the slow run while GitHub computes stats/* (202s)
    await delay(1400)

    const profile: ProfileData = {
      handle,
      isSample: false,
      generatedAt: new Date().toISOString(),
      cutoff,
      ...generateSample({ seed: seedFrom(`${keyOf(handle)}:${cutoff.date}`), cutoffWeekStart: isoDate(windows.cutoffWeekStart), weeks: windows.weeks }),
    }
    save(profile)
    return HttpResponse.json(buildReport(profile), { status: 201, headers: { Location: `/api/reports/${encodeURIComponent(handle)}` } })
  }),

  http.get('/api/reports/:handle', async ({ params }) => {
    await delay(250)
    const profile = load(String(params.handle))
    // built on read, so rule changes reach saved reports
    return profile ? HttpResponse.json(buildReport(profile)) : error(404, 'No report for this handle yet')
  }),
]
