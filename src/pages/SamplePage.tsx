import { useSampleReport } from '../api/useReports'
import { ReportSkeleton } from '../features/report/ReportSkeleton'
import { ReportView } from '../features/report/ReportView'
import { LoadError } from './LoadError'

/** The public demo report. */
export function SamplePage() {
  const { data: report, error, isPending, refetch } = useSampleReport()
  if (isPending) return <ReportSkeleton />
  if (error) return <LoadError message={error.message} onRetry={() => refetch()} />
  return <ReportView report={report} link={`${window.location.origin}/sample`} />
}
