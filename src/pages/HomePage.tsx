import { Link, useSearchParams } from 'react-router'
import { GenerateForm } from '../features/generate/GenerateForm'
import { isSignInError } from '../features/generate/cutoffs'
import { Logo } from '../features/brand/Logo'

/** / and /generate: pick a cut-off and sign in. The API sends a bad cut-off back to /generate?error=…. */
export function HomePage() {
  const [params] = useSearchParams()
  const error = params.get('error')

  return (
    <div data-theme="now" className="flex min-h-dvh flex-col bg-base-100 font-now text-base-content">
      <header className="flex items-center border-b border-base-300 px-4 py-3 sm:px-8">
        <Link to="/" className="py-1"><Logo /></Link>
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
        <div className="flex max-w-xl flex-col gap-4">
          <GenerateForm key={params.toString()} initialCutoff={params.get('cutoff') ?? undefined} error={isSignInError(error) ? error : null} />
          <p className="text-sm text-muted"><Link to="/sample" className="link">See a sample report</Link></p>
        </div>
      </main>
    </div>
  )
}
