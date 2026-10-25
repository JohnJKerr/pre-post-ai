import preview from '../../.storybook/preview'
import { SamplePage } from './SamplePage'

const meta = preview.meta({
  title: 'Pages/Sample',
  component: SamplePage,
  parameters: { route: '/sample', path: '/sample' },
})

/** GET /sample-report from Storybook's stand-in API: the handoff fixture. */
export const Default = meta.story({})
