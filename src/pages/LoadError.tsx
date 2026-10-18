import { Link } from 'react-router'

export function LoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
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
