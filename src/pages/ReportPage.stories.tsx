// Someone's saved report at /r/:handle, against Storybook's stand-in API with per-story overrides.
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

/** Anyone's report looks the same: there's no session, so no owner controls. */
export const Loaded = meta.story({
  beforeEach({ msw }) {
    msw.use(serve({ handle: 'steady-dev' }))
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
