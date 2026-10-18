import { useMemo, useState } from 'react'
import preview from '../../../.storybook/preview'
import { PRESETS, scenarioReport, type ScenarioArgs } from '../../stories/scenarios'
import { shareText } from '../report/copy'
import { SharePanel, type ShareSettings } from './SharePanel'

/** The open share menu, with live state. */
function LivePanel({ scenario }: { scenario: keyof typeof PRESETS }) {
  const report = useMemo(() => scenarioReport(PRESETS[scenario] as Partial<ScenarioArgs>), [scenario])
  const [settings, setSettings] = useState<ShareSettings>({ size: 'wide', showHandle: true, text: shareText(report) })
  return (
    <div className="m-6 w-fit rounded-box border border-base-300 bg-base-100 shadow-xl">
      <SharePanel key={scenario} report={report} link="https://prepost.dev/r/x7k2m9" settings={settings} onChange={setSettings} />
    </div>
  )
}

const meta = preview.meta({
  title: 'Share/Panel',
  component: LivePanel,
  args: { scenario: 'sample' as keyof typeof PRESETS },
  argTypes: { scenario: { control: 'select', options: Object.keys(PRESETS) } },
})

export const Open = meta.story({})
export const NoPreActivity = meta.story({ args: { scenario: 'noPreActivity' } })
