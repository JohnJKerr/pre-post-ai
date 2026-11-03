import { Link } from 'react-router'
import { SiteFooter } from '../features/brand/SiteFooter'

export function NotFoundPage({ message = 'There’s nothing at this address.' }: { message?: string }) {
  return (
    <div data-theme="now" className="flex min-h-dvh flex-col bg-base-100 font-now text-base-content">
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-4 px-4 py-20">
        <h1 className="text-4xl font-extrabold tracking-tight">{message}</h1>
        <div className="flex gap-2">
          <Link to="/generate" className="btn btn-neutral">Make your own report</Link>
          <Link to="/sample" className="btn btn-ghost">See a sample</Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
