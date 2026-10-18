import preview from '../../../.storybook/preview'
import { Invite } from './Invite'

const meta = preview.meta({
  title: 'Invite',
  component: Invite,
  args: { handle: 'octocat', link: 'https://prepost.dev/r/octocat' },
})

export const Default = meta.story({})

export const LongHandle = meta.story({ args: { handle: 'a-very-long-github-handle-of-39-chars', link: 'https://prepost.dev/r/a-very-long-github-handle-of-39-chars' } })
