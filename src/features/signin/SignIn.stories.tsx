import preview from '../../../.storybook/preview'
import { ConnectGitHub } from './ConnectGitHub'
import { MockSignIn } from './MockSignIn'

const meta = preview.meta({
  title: 'Sign in',
  component: ConnectGitHub,
  decorators: [(Story) => <div className="max-w-xl p-8 font-now"><Story /></div>],
})

/** With the real API: a link to the API's GitHub sign-in. */
export const Connect = meta.story({})

/** With the mock API: type a handle instead. */
export const Mock = meta.story({ render: () => <MockSignIn /> })
