import { useEffect, useRef } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { isStatus } from '../api/reports'
import { useGenerateReport } from '../api/useReports'
import { ReportSkeleton } from '../features/report/ReportSkeleton'

/** Where sign-in returns to: generates the signed-in user's report, then shows it. */
export function GeneratePage() {
  const navigate = useNavigate()
  const generate = useGenerateReport()
  const started = useRef(false)

  const run = () =>
    generate.mutate({}, { onSuccess: (report) => navigate(`/r/${report.handle}`, { replace: true }) })

  useEffect(() => {
    // once, even under StrictMode's double effects: each POST regenerates the report
    if (started.current) return
    started.current = true
    run()
  })

  if (isStatus(generate.error, 401)) return <Navigate to="/" replace />
  if (generate.error)
    return (
      <div data-theme="now" className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-20 font-now">
        <div role="alert" className="alert alert-error">Couldn’t make your report. {generate.error.message}</div>
        <div className="flex gap-2">
          <button type="button" className="btn btn-neutral" onClick={run}>Try again</button>
          <Link to="/" className="btn btn-ghost">Home</Link>
        </div>
      </div>
    )
  return <ReportSkeleton />
}
