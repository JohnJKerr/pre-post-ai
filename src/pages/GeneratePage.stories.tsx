// /generate, where sign-in returns: POST /reports, then on to /r/:handle.
import { delay, http, HttpResponse } from 'msw'
import preview from '../../.storybook/preview'
import { API_URL } from '../api/config'
import { GeneratePage } from './GeneratePage'

const meta = preview.meta({
  title: 'Pages/Generate',
  component: GeneratePage,
  parameters: { route: '/generate', path: '/generate' },
})

/** While the API gathers stats from GitHub. */
export const Generating = meta.story({
  beforeEach({ msw }) {
    msw.use(http.post(`${API_URL}/reports`, () => delay('infinite')))
  },
})

/** 503: GitHub is still computing stats. Try again usually works, since GitHub caches them. */
export const StillComputing = meta.story({
  beforeEach({ msw }) {
    msw.use(http.post(`${API_URL}/reports`, () => HttpResponse.json({ message: 'GitHub is still crunching your repository stats. Try again in a minute.' }, { status: 503 })))
  },
})

/** 401 sends you back home to sign in. */
export const SignedOut = meta.story({
  beforeEach({ msw }) {
    msw.use(http.post(`${API_URL}/reports`, () => HttpResponse.json({ message: 'Sign in with GitHub to generate your report.' }, { status: 401 })))
  },
})
