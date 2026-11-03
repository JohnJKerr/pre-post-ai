import { Link } from 'react-router'
import { SiteFooter } from '../features/brand/SiteFooter'

export function LoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div data-theme="now" className="flex min-h-dvh flex-col bg-base-100 font-now text-base-content">
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-4 px-4 py-20">
        <div role="alert" className="alert alert-error">Couldn’t load this report. {message}</div>
        <div className="flex gap-2">
          <button type="button" className="btn btn-neutral" onClick={onRetry}>Try again</button>
          <Link to="/" className="btn btn-ghost">Home</Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
