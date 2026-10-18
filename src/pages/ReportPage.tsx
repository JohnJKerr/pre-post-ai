import { Link, useParams } from 'react-router'
import { isStatus } from '../api/reports'
import { mockSessionHandle } from '../api/session'
import { useGenerateReport, useReport } from '../api/useReports'
import { Invite } from '../features/invite/Invite'
import { ReportSkeleton } from '../features/report/ReportSkeleton'
import { ReportView } from '../features/report/ReportView'
import { reportUrl } from '../features/share/links'

/** A saved report, or an invite to send them if they haven't made one. Yours gets a cut-off picker. */
export function ReportPage() {
  const { handle = '' } = useParams()
  const { data: report, error, isPending, refetch } = useReport(handle)
  const generate = useGenerateReport()
  const isOwner = mockSessionHandle()?.toLowerCase() === handle.toLowerCase()

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
    />
  )
}

function LoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div data-theme="now" className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-20 font-now">
      <div role="alert" className="alert alert-error">Couldn’t load this report. {message}</div>
      <div className="flex gap-2">
        <button type="button" className="btn btn-neutral" onClick={onRetry}>Try again</button>
        <Link to="/" className="btn btn-ghost">Home</Link>
      </div>
    </div>
  )
}
