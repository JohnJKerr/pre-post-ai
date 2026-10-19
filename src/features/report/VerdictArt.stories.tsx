import preview from '../../../.storybook/preview'
import { VerdictArt } from './VerdictArt'

const meta = preview.meta({
  title: 'Report/Verdict art',
  component: VerdictArt,
})

export const Artisan = meta.story({ args: { rung: 0 } })
export const Apprentice = meta.story({ args: { rung: 1 } })
export const RobotArms = meta.story({ args: { rung: 2 } })
export const Cyborg = meta.story({ args: { rung: 3 } })
export const Machine = meta.story({ args: { rung: 4 } })
export const Uprising = meta.story({ args: { rung: 5 } })
