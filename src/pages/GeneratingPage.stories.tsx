// /generating?id=…, where sign-in lands: polls GET /generations/:id.
import { delay, http, HttpResponse } from 'msw'
import preview from '../../.storybook/preview'
import { API_URL } from '../api/config'
import type { Generation } from '../api/contract'
import { GeneratingPage } from './GeneratingPage'

const meta = preview.meta({
  title: 'Pages/Generating',
  component: GeneratingPage,
  parameters: { route: '/generating?id=0123456789abcdef0123456789abcdef', path: '/generating' },
})

const respond = (generation: Partial<Generation>) =>
  http.get(`${API_URL}/generations/:id`, () => HttpResponse.json<Generation>({ status: 'pending', handle: null, message: null, ...generation }))

/** Still generating: an indeterminate bar while it polls every 2 s. */
export const Pending = meta.story({
  beforeEach({ msw }) {
    msw.use(respond({ status: 'pending' }))
  },
})

/** The first poll hasn't answered yet. */
export const FirstPoll = meta.story({
  beforeEach({ msw }) {
    msw.use(http.get(`${API_URL}/generations/:id`, () => delay('infinite')))
  },
})

/** Ready: moves on to /r/:handle (outside the story). */
export const Ready = meta.story({
  beforeEach({ msw }) {
    msw.use(respond({ status: 'ready', handle: 'octocat' }))
  },
})

/** No commits in either window, so nothing was saved. */
export const Empty = meta.story({
  beforeEach({ msw }) {
    msw.use(respond({ status: 'empty' }))
  },
})

/** Failed: the API's message, and a way back through sign-in. */
export const Failed = meta.story({
  beforeEach({ msw }) {
    msw.use(respond({ status: 'failed', message: 'GitHub is still crunching your repository stats. Sign in again in a minute to retry.' }))
  },
})

/** 404: an id the API doesn't know, e.g. an old link. */
export const UnknownId = meta.story({
  beforeEach({ msw }) {
    msw.use(http.get(`${API_URL}/generations/:id`, () => HttpResponse.json({ message: 'We couldn’t find that report request. Sign in to generate your report.' }, { status: 404 })))
  },
})
