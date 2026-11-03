import preview from '../../../.storybook/preview'
import { SiteFooter } from './SiteFooter'

const meta = preview.meta({
  title: 'Brand/Site footer',
  component: SiteFooter,
  decorators: [(Story) => <div data-theme="now" className="font-now"><Story /></div>],
})

/** The last row of every page. */
export const Default = meta.story({})
