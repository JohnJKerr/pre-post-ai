import type { ReactNode } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router'
import { authApi } from '../api/reports'
import { useGeneration } from '../api/useReports'
import { lastCutoff } from '../features/generate/cutoffs'
import { Logo } from '../features/brand/Logo'

/** /generating?id=…, where sign-in lands: polls the generation, then shows the report. */
export function GeneratingPage() {
  const [params] = useSearchParams()
  const id = params.get('id')
  return id ? <Generating id={id} /> : <Navigate to="/" replace />
}

function Generating({ id }: { id: string }) {
  const { data, error } = useGeneration(id)

  if (error) return <Ending title="We couldn’t find that report" message={error.message} action={<SignInAgain />} />
  if (!data || data.status === 'pending') return <Making />
  if (data.status === 'ready' && data.handle) return <Navigate to={`/r/${data.handle}`} replace />
  if (data.status === 'empty')
    return (
      <Ending
        title="Nothing to compare yet"
        message="You have no commits in either window around that cut-off, so there’s no report. Try an earlier cut-off."
        action={<Link to="/generate" className="btn btn-neutral">Pick another cut-off</Link>}
      />
    )
  return <Ending title="Your report didn’t finish" message={data.message ?? 'Something went wrong generating your report.'} action={<SignInAgain />} />
}

/** Generation has no progress to report, so an indeterminate bar rather than a skeleton of a report that may never come. */
function Making() {
  return (
    <Frame>
      <div aria-busy="true" aria-live="polite" className="flex flex-col gap-5">
        <h1 className="text-4xl font-extrabold tracking-tight">Making your report</h1>
        <progress className="progress w-full text-post-mark" aria-label="Generating your report" />
        <p className="text-base text-muted sm:text-lg">Big accounts can take a few minutes. You can leave this page open.</p>
      </div>
    </Frame>
  )
}

function Ending({ title, message, action }: { title: string; message: string; action: ReactNode }) {
  return (
    <Frame>
      <h1 className="text-4xl font-extrabold tracking-tight">{title}</h1>
      <p role="alert" className="text-base text-muted sm:text-lg">{message}</p>
      <div className="flex flex-wrap gap-2">
        {action}
        <Link to="/" className="btn btn-ghost">Home</Link>
      </div>
    </Frame>
  )
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <div data-theme="now" className="flex min-h-dvh flex-col bg-base-100 font-now text-base-content">
      <header className="flex items-center border-b border-base-300 px-4 py-3 sm:px-8">
        <Link to="/" className="py-1"><Logo /></Link>
      </header>
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-5 px-4 py-16">{children}</main>
    </div>
  )
}

/** Straight back through GitHub with the cut-off they chose; it's quick once the app is authorised. */
function SignInAgain() {
  return <a href={authApi.signInUrl(lastCutoff())} className="btn btn-neutral">Sign in again</a>
}
