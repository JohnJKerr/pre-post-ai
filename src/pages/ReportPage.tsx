import { useNavigate, useParams } from 'react-router'
import { isStatus } from '../api/reports'
import { useGenerateReport, useReport, useSession, useSignOut } from '../api/useReports'
import { Invite } from '../features/invite/Invite'
import { ReportSkeleton } from '../features/report/ReportSkeleton'
import { ReportView } from '../features/report/ReportView'
import { reportUrl } from '../features/share/links'
import { LoadError } from './LoadError'

/** A saved report, or an invite to send them if they haven't made one. Yours gets a cut-off picker. */
export function ReportPage() {
  const { handle = '' } = useParams()
  const navigate = useNavigate()
  const { data: report, error, isPending, refetch } = useReport(handle)
  const { data: session } = useSession()
  const generate = useGenerateReport()
  const signOut = useSignOut()
  const isOwner = session?.handle.toLowerCase() === handle.toLowerCase()

  if (isPending || generate.isPending) return <ReportSkeleton />
  if (isStatus(error, 404)) return <Invite handle={handle} link={reportUrl(handle)} />
  if (error) return <LoadError message={error.message} onRetry={() => refetch()} />
  return (
    <ReportView
      key={report.generatedAt}
      report={report}
      link={reportUrl(report.handle)}
      onCutoffChange={isOwner ? (c) => generate.mutate({ cutoff: c.date }) : undefined}
      cutoffError={generate.error?.message}
      onSignOut={isOwner ? () => signOut.mutate(undefined, { onSuccess: () => navigate('/') }) : undefined}
    />
  )
}
