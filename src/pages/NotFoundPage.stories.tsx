import preview from '../../.storybook/preview'
import { NotFoundPage } from './NotFoundPage'

const meta = preview.meta({
  title: 'Pages/Not found',
  component: NotFoundPage,
  parameters: { route: '/nowhere' },
})

/** Any address the router doesn't know. */
export const Default = meta.story({})
