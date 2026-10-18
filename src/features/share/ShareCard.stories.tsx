import { useMemo } from 'react'
import preview from '../../../.storybook/preview'
import { PRESETS, scenarioReport, type ScenarioArgs } from '../../stories/scenarios'
import { type CardSize } from './cardSize'
import { ShareCard } from './ShareCard'

type CardArgs = { size: CardSize; showHandle: boolean; scenario: keyof typeof PRESETS }

function ScenarioCard({ size, showHandle, scenario }: CardArgs) {
  const report = useMemo(() => scenarioReport(PRESETS[scenario] as Partial<ScenarioArgs>), [scenario])
  return (
    <div className="p-6">
      <ShareCard report={report} size={size} showHandle={showHandle} link="https://prepost.dev/r/x7k2m9" />
    </div>
  )
}

const meta = preview.meta({
  title: 'Share/Card',
  component: ScenarioCard,
  args: { size: 'wide', showHandle: true, scenario: 'sample' } satisfies CardArgs as CardArgs,
  argTypes: {
    size: { control: 'inline-radio', options: ['wide', 'square'] },
    scenario: { control: 'select', options: Object.keys(PRESETS) },
  },
})

export const Wide = meta.story({})
export const Square = meta.story({ args: { size: 'square' } })
export const WithoutHandle = meta.story({ args: { showHandle: false } })
export const NoPreActivity = meta.story({ args: { scenario: 'noPreActivity' } })
export const NoPunchCardRepos = meta.story({ args: { scenario: 'noPunchCardRepos' } })
export const EveningsBack = meta.story({ args: { scenario: 'eveningsBack', size: 'square' } })
