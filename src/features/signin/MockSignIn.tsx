import { useState } from 'react'
import { useNavigate } from 'react-router'
import { isHandle, mockSignIn } from '../../mocks/session'

/** Mock-mode stand-in for Connect GitHub: type any handle to be signed in as it. */
export function MockSignIn({ initialHandle = '' }: { initialHandle?: string }) {
  const navigate = useNavigate()
  const [handle, setHandle] = useState(initialHandle)
  const [invalid, setInvalid] = useState(false)

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        const h = handle.trim().replace(/^@/, '')
        if (!isHandle(h)) return setInvalid(true)
        mockSignIn(h)
        navigate('/generate')
      }}
    >
      <label htmlFor="handle" className="font-now-mono text-[11px] uppercase tracking-[0.2em] text-muted">GitHub handle (mock sign-in)</label>
      <div className="join w-full">
        <label className="input join-item w-full">
          <span className="text-muted">@</span>
          <input id="handle" required autoComplete="username" spellCheck={false} placeholder="your-handle" value={handle} onChange={(e) => (setHandle(e.target.value), setInvalid(false))} />
        </label>
        <button type="submit" className="btn btn-neutral join-item">Make my report</button>
      </div>
      {invalid && <p role="alert" className="text-sm text-error">That is not a valid GitHub handle</p>}
      <p className="text-sm text-muted">Mock API: any handle gets seeded sample activity.</p>
    </form>
  )
}
