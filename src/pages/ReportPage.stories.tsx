// Someone's saved report at /r/:handle, against the mock API with per-story overrides.
import { delay, http, HttpResponse } from 'msw'
import preview from '../../.storybook/preview'
import { API_URL } from '../api/config'
import { scenarioReport } from '../stories/scenarios'
import { ReportPage } from './ReportPage'

const meta = preview.meta({
  title: 'Pages/Report',
  component: ReportPage,
  parameters: { route: '/r/steady-dev', path: '/r/:handle' },
})

const serve = (args: Parameters<typeof scenarioReport>[0]) =>
  http.get(`${API_URL}/reports/:handle`, () => HttpResponse.json(scenarioReport({ isSample: false, ...args })))
const signedInAs = (handle: string) => http.get(`${API_URL}/session`, () => HttpResponse.json({ handle }))

/** Someone else's report: no cut-off picker, no sign-out. */
export const Loaded = meta.story({
  beforeEach({ msw }) {
    msw.use(serve({ handle: 'steady-dev' }))
  },
})

/** Your own report: the cut-off picker and sign-out appear. Changing the cut-off POSTs /reports. */
export const Yours = meta.story({
  parameters: { route: '/r/you' },
  beforeEach({ msw }) {
    msw.use(serve({ handle: 'you' }), signedInAs('you'))
  },
})

/** Changing the cut-off fails, e.g. a date with no complete weeks yet. */
export const CutoffChangeFails = meta.story({
  parameters: { route: '/r/you' },
  beforeEach({ msw }) {
    msw.use(
      serve({ handle: 'you' }),
      signedInAs('you'),
      http.post(`${API_URL}/reports`, () => HttpResponse.json({ message: 'Pick a cut-off at least one full week ago, so there’s a week to compare.' }, { status: 422 })),
    )
  },
})

/** Private repos arrive without names. */
export const WithPrivateRepos = meta.story({
  parameters: { route: '/r/work-dev' },
  beforeEach({ msw }) {
    msw.use(serve({ handle: 'work-dev', privateRepos: true }))
  },
})

export const Loading = meta.story({
  beforeEach({ msw }) {
    msw.use(http.get(`${API_URL}/reports/:handle`, () => delay('infinite')))
  },
})

/** 404: nobody has generated a report for this handle, so offer an invite to send them. */
export const NotGeneratedYet = meta.story({ parameters: { route: '/r/octocat' } })

export const ServerError = meta.story({
  beforeEach({ msw }) {
    msw.use(http.get(`${API_URL}/reports/:handle`, () => HttpResponse.json({ message: 'Upstream GitHub error' }, { status: 502 })))
  },
})
