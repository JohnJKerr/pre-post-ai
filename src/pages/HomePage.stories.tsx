import { delay, http, HttpResponse } from 'msw'
import preview from '../../.storybook/preview'
import { HomePage } from './HomePage'

const meta = preview.meta({
  title: 'Pages/Home',
  component: HomePage,
})

export const Default = meta.story({})

/** Arriving from an invite's "Is this you?" link. */
export const FromInvite = meta.story({ parameters: { route: '/?handle=octocat' } })

/** Submit a handle to see the skeleton while POST /api/reports runs. */
export const Generating = meta.story({
  beforeEach({ msw }) {
    msw.use(http.post('/api/reports', () => delay('infinite')))
  },
})

export const GenerationFails = meta.story({
  beforeEach({ msw }) {
    msw.use(http.post('/api/reports', () => HttpResponse.json({ message: 'GitHub is rate-limiting us. Try again in a minute.' }, { status: 503 })))
  },
})
