import preview from '../../.storybook/preview'
import { HomePage } from './HomePage'

const meta = preview.meta({
  title: 'Pages/Home',
  component: HomePage,
})

/** Storybook runs against the mock API, so this asks for a handle. See Generate form → Connect for the real button. */
export const Default = meta.story({})

/** "Try another cut-off" from a report. */
export const WithCutoff = meta.story({ parameters: { route: '/generate?cutoff=2022-11-30' } })

/** The API sent the user back: the cut-off week hasn't ended yet. */
export const CutoffTooRecent = meta.story({ parameters: { route: '/generate?error=cutoff-too-recent' } })
