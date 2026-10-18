// Someone's saved report at /r/:handle, against the mock API with per-story overrides.
import { delay, http, HttpResponse } from 'msw'
import preview from '../../.storybook/preview'
import { SAMPLE_HANDLE } from '../api/reports'
import { mockSignIn, SESSION_COOKIE } from '../api/session'
import { scenarioReport } from '../stories/scenarios'
import { ReportPage } from './ReportPage'

const meta = preview.meta({
  title: 'Pages/Report',
  component: ReportPage,
  parameters: { route: `/r/${SAMPLE_HANDLE}`, path: '/r/:handle' },
})

/** The seeded sample, served by the app's mock handlers. */
export const Loaded = meta.story({})

const yours = http.get('/api/reports/:handle', () => HttpResponse.json(scenarioReport({ handle: 'you', isSample: false })))
function signInAsYou() {
  mockSignIn('you')
  return () => void (document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`)
}

/** Your own report: the cut-off picker appears, and changing it POSTs /api/reports. */
export const Yours = meta.story({
  parameters: { route: '/r/you' },
  beforeEach({ msw }) {
    msw.use(yours)
    return signInAsYou()
  },
})

/** Changing the cut-off fails, e.g. a date with no complete weeks yet. */
export const CutoffChangeFails = meta.story({
  parameters: { route: '/r/you' },
  beforeEach({ msw }) {
    msw.use(yours, http.post('/api/reports', () => HttpResponse.json({ message: 'No complete weeks since that cut-off yet' }, { status: 422 })))
    return signInAsYou()
  },
})

/** Private repos arrive without names. */
export const WithPrivateRepos = meta.story({
  parameters: { route: '/r/work-dev' },
  beforeEach({ msw }) {
    msw.use(http.get('/api/reports/:handle', () => HttpResponse.json(scenarioReport({ handle: 'work-dev', isSample: false, privateRepos: true }))))
  },
})

export const Loading = meta.story({
  beforeEach({ msw }) {
    msw.use(http.get('/api/reports/:handle', () => delay('infinite')))
  },
})

/** 404: nobody has generated a report for this handle, so offer an invite to send them. */
export const NotGeneratedYet = meta.story({ parameters: { route: '/r/octocat' } })

export const ServerError = meta.story({
  beforeEach({ msw }) {
    msw.use(http.get('/api/reports/:handle', () => HttpResponse.json({ message: 'Upstream GitHub error' }, { status: 502 })))
  },
})
