import preview from '../../../.storybook/preview'
import { ScenarioReport } from '../../stories/ScenarioReport'
import { PRESETS, SAMPLE_ARGS } from '../../stories/scenarios'

const meta = preview.meta({
  title: 'Report/Full report',
  component: ScenarioReport,
  args: SAMPLE_ARGS,
  argTypes: {
    seed: { control: { type: 'number' }, description: 'Random seed. 20251124 with 47 weeks since the cut-off is the sample fixture.' },
    weeks: { control: { type: 'range', min: 1, max: 200, step: 1 }, description: 'Complete weeks since the cut-off. Each window takes at most 26 of them.' },
    postGrowth: { control: { type: 'range', min: 0, max: 4, step: 0.05 }, description: 'Multiplies post-AI lines' },
    postProjects: { control: { type: 'range', min: 1, max: 12, step: 1 }, description: 'Keep the top N post-AI projects' },
    hours: { control: 'inline-radio', options: ['nights and weekends', 'evenings back', 'unchanged'] },
    preActivity: { description: 'Off = nothing before the cut-off, so multipliers are undefined' },
    privateRepos: { description: 'On = every other repo is private, so it shows unnamed' },
    prePunchCard: { description: 'Off = no punch-card eligible repos before the cut-off' },
    postPunchCard: { description: 'Off = no punch-card eligible repos after the cut-off' },
  },
})

/** Every control live. Start here to try configurations. */
export const Playground = meta.story({})

/** The sample over 26-week windows: 65, "I'm a machine (literally)". */
export const Sample = meta.story({ args: PRESETS.sample })

export const RobotArms = meta.story({ args: PRESETS.robotArms })

export const Cyborg = meta.story({ args: PRESETS.cyborg })

/** Out-of-hours share drops 10+ points in the comparison. */
export const EveningsBack = meta.story({ args: PRESETS.eveningsBack })

/** Edge case: no pre-AI activity, so multipliers are undefined and score 0. */
export const NoPreActivity = meta.story({ args: PRESETS.noPreActivity })

/** Edge case: no punch-card eligible repos on either side; those sections explain why. */
export const NoPunchCardRepos = meta.story({ args: PRESETS.noPunchCardRepos })

/** Private repos come back without names, since the report link is public. */
export const PrivateRepos = meta.story({ args: PRESETS.privateRepos })

/** Only the pre-AI side lacks eligible repos. Hours drop out of the score. */
export const NoPrePunchCard = meta.story({ args: PRESETS.noPrePunchCard })

/** Edge case: only 6 complete weeks since the cut-off, so both windows shrink to 6 and meet at it. */
export const ShortWindow = meta.story({ args: PRESETS.shortWindow })

/** An early cut-off: 26 weeks before it against the latest 26, with years between them. */
export const LongWindow = meta.story({ args: PRESETS.longWindow })

export const Phone = meta.story({
  args: PRESETS.sample,
  globals: { viewport: { value: 'mobile2', isRotated: false } },
})
