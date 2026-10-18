import { Link } from 'react-router'

export function NotFoundPage({ message = 'There’s nothing at this address.' }: { message?: string }) {
  return (
    <div data-theme="now" className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center gap-4 px-4 py-20 font-now">
      <p className="font-now-mono text-[11px] uppercase tracking-[0.2em] text-muted">Not found</p>
      <h1 className="text-4xl font-extrabold tracking-tight">{message}</h1>
      <div className="flex gap-2">
        <Link to="/generate" className="btn btn-neutral">Make your own report</Link>
        <Link to="/sample" className="btn btn-ghost">See a sample</Link>
      </div>
    </div>
  )
}
