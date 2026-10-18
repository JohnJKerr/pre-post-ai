import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { API_MOCK } from '../../api/config'
import type { SignInError } from '../../api/contract'
import { authApi } from '../../api/reports'
import { isHandle, mockSignIn } from '../../mocks/signIn'
import { CutoffSelect } from './CutoffSelect'
import { checkCutoff, DEFAULT_CUTOFF, rememberCutoff, SIGN_IN_ERRORS } from './cutoffs'

interface GenerateFormProps {
  initialCutoff?: string
  /** the API sent the user back with this */
  error?: SignInError | null
  /** the mock API can't sign in through GitHub, so it asks for a handle instead */
  mock?: boolean
}

/** Pick a cut-off, then sign in with GitHub. Signing in makes the report. */
export function GenerateForm({ initialCutoff = DEFAULT_CUTOFF.date, error = null, mock = API_MOCK }: GenerateFormProps) {
  const navigate = useNavigate()
  const [cutoff, setCutoff] = useState(initialCutoff)
  const [handle, setHandle] = useState('')
  const [problem, setProblem] = useState<string | null>(error && SIGN_IN_ERRORS[error])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const bad = checkCutoff(cutoff)
    if (bad) return setProblem(SIGN_IN_ERRORS[bad])
    rememberCutoff(cutoff)
    if (!mock) return window.location.assign(authApi.signInUrl(cutoff))

    const h = handle.trim().replace(/^@/, '')
    if (!isHandle(h)) return setProblem('That isn’t a valid GitHub handle.')
    navigate(`/generating?${new URLSearchParams({ id: mockSignIn(h, cutoff) })}`)
  }

  return (
    <form noValidate className="flex flex-col gap-4" onSubmit={submit}>
      <CutoffSelect value={cutoff} onChange={(d) => (setCutoff(d), setProblem(null))} />
      {mock && (
        <div className="flex w-full flex-col gap-2 sm:w-80">
          <label htmlFor="handle" className="font-now-mono text-[11px] uppercase tracking-[0.2em] text-muted">GitHub handle (mock sign-in)</label>
          <label className="input w-full">
            <span className="text-muted">@</span>
            <input id="handle" autoComplete="username" spellCheck={false} placeholder="your-handle" value={handle} onChange={(e) => (setHandle(e.target.value), setProblem(null))} />
          </label>
        </div>
      )}
      {problem && <p role="alert" className="text-sm text-error sm:w-80">{problem}</p>}
      <button type="submit" className="btn btn-neutral w-full sm:w-fit">
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.72 1.22 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.65-.89-3.65-3.96 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.08-1.87 3.76-3.66 3.96.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 8 0Z" />
        </svg>
        {mock ? 'Make my report' : 'Connect GitHub and make my report'}
      </button>
      <p className="max-w-[52ch] text-sm text-muted">
        {mock
          ? 'Mock API: any handle gets seeded sample activity. Try nothing-yet or broken for the empty and failed states.'
          : 'Read-only access to repository metadata. No code. You choose which repos count, and you can uninstall the app afterwards: your report stays.'}
      </p>
    </form>
  )
}
