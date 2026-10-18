import preview from '../../../.storybook/preview'
import { ReportSkeleton } from './ReportSkeleton'

const meta = preview.meta({
  title: 'Report/Skeleton',
  component: ReportSkeleton,
})

export const Default = meta.story({})
export const CustomMessage = meta.story({ args: { message: 'Waiting for GitHub to compute stats for 12 repos…' } })
