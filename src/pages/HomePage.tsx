import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { SAMPLE_HANDLE } from '../api/reports'
import { isHandle, mockSignIn } from '../api/session'
import { useGenerateReport } from '../api/useReports'
import { ReportSkeleton } from '../features/report/ReportSkeleton'

export function HomePage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [handle, setHandle] = useState(() => params.get('handle') ?? '')
  const [invalid, setInvalid] = useState(false)
  const generate = useGenerateReport()

  if (generate.isPending) return <ReportSkeleton />

  return (
    <div data-theme="now" className="flex min-h-dvh flex-col bg-base-100 font-now text-base-content">
      <header className="flex items-center border-b border-base-300 px-4 py-3 sm:px-8">
        <p className="text-base font-extrabold tracking-tight sm:text-lg">Pre<span className="text-muted">/</span>Post</p>
      </header>
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col justify-center gap-10 px-4 py-16 sm:px-8">
        <div className="flex max-w-3xl flex-col gap-5">
          <p className="font-now-mono text-[11px] uppercase tracking-[0.2em] text-muted">Before &amp; after AI</p>
          <h1 className="text-[2.6rem] font-extrabold leading-[0.95] tracking-[-0.03em] sm:text-7xl" style={{ textWrap: 'balance' }}>
            Did AI change the way you code?
          </h1>
          <p className="max-w-[52ch] text-base text-muted sm:text-lg">
            Compare your GitHub activity in the weeks before and after AI coding went mainstream. Get a shift score, a verdict and a card to share.
          </p>
        </div>
        <form
          className="flex max-w-xl flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            const h = handle.trim().replace(/^@/, '')
            if (!isHandle(h)) return setInvalid(true)
            mockSignIn(h)
            generate.mutate({}, { onSuccess: (r) => navigate(`/r/${r.handle}`) })
          }}
        >
          {/* Stand-in for "Connect GitHub" until the GitHub App and API exist. */}
          <label htmlFor="handle" className="font-now-mono text-[11px] uppercase tracking-[0.2em] text-muted">GitHub handle</label>
          <div className="join w-full">
            <label className="input join-item w-full">
              <span className="text-muted">@</span>
              <input id="handle" required autoComplete="username" spellCheck={false} placeholder="your-handle" value={handle} onChange={(e) => (setHandle(e.target.value), setInvalid(false))} />
            </label>
            <button type="submit" className="btn btn-neutral join-item">Make my report</button>
          </div>
          {invalid && <p role="alert" className="text-sm text-error">That is not a valid GitHub handle</p>}
          {generate.error && <p role="alert" className="text-sm text-error">{generate.error.message}</p>}
          <p className="text-sm text-muted">
            Mock data for now. The real app connects a GitHub App that only asks for repository metadata, read-only. <Link to={`/r/${SAMPLE_HANDLE}`} className="link">See a sample report</Link>
          </p>
        </form>
      </main>
    </div>
  )
}
