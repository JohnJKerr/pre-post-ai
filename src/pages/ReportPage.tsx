import { useParams } from 'react-router'
import { isStatus } from '../api/reports'
import { useReport } from '../api/useReports'
import { Invite } from '../features/invite/Invite'
import { ReportSkeleton } from '../features/report/ReportSkeleton'
import { ReportView } from '../features/report/ReportView'
import { reportUrl } from '../features/share/links'
import { LoadError } from './LoadError'

/** A saved report, or an invite to send them if they haven't made one. */
export function ReportPage() {
  const { handle = '' } = useParams()
  const { data: report, error, isPending, refetch } = useReport(handle)

  if (isPending) return <ReportSkeleton />
  if (isStatus(error, 404)) return <Invite handle={handle} link={reportUrl(handle)} />
  if (error) return <LoadError message={error.message} onRetry={() => refetch()} />
  return <ReportView key={report.generatedAt} report={report} link={reportUrl(report.handle)} />
}
