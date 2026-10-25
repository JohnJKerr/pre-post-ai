// Storybook's stand-in for the API, so page stories render without one; stories override a
// handler for their state. Runs the reference calculations in /server. The contract is in
// src/api/contract.ts.
import { delay, http, HttpResponse } from 'msw'
import { API_URL } from '../api/config'
import type { Generation } from '../api/contract'
import { sampleProfile } from '../../server/fixture'
import { buildReport } from '../../server/report'

export const handlers = [
  http.get(`${API_URL}/sample-report`, async () => {
    await delay(250)
    return HttpResponse.json(buildReport(sampleProfile()))
  }),

  http.get(`${API_URL}/generations/:id`, () => HttpResponse.json<Generation>({ status: 'pending', handle: null, message: null })),

  http.get(`${API_URL}/reports/:handle`, async ({ params }) => {
    await delay(250)
    return HttpResponse.json({ message: `${params.handle} hasn’t generated a report yet.` }, { status: 404 })
  }),
]
