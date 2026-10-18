import preview from '../../.storybook/preview'
import { HomePage } from './HomePage'

const meta = preview.meta({
  title: 'Pages/Home',
  component: HomePage,
})

/** Storybook runs against the mock API, so this shows the mock sign-in. See Sign in → Connect for the real button. */
export const Default = meta.story({})

/** Arriving from an invite's "Is this you?" link. */
export const FromInvite = meta.story({ parameters: { route: '/?handle=octocat' } })
