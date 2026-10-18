import { useMemo } from 'react'
import { ReportView } from '../features/report/ReportView'
import { scenarioReport, type ScenarioArgs } from './scenarios'

/** The full report page body for one scenario, without fetching. */
export function ScenarioReport(args: ScenarioArgs) {
  const report = useMemo(() => scenarioReport(args), [args])
  // remount on any change so the share text is rebuilt from the new report
  return <ReportView key={JSON.stringify(args)} report={report} link="https://prepost.dev/r/story" />
}
