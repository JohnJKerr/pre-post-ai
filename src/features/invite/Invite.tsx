import { useState } from 'react'
import { Link } from 'react-router'
import { shareLinks } from '../share/links'
import { Logo } from '../brand/Logo'

interface InviteProps {
  handle: string
  /** the report's own address: it starts working once they generate their report */
  link: string
}

/** Shown when nobody has generated a report for a handle yet: a link to send them. */
export function Invite({ handle, link }: InviteProps) {
  const [copied, setCopied] = useState<boolean | null>(null)
  const message = `Did AI change the way you code? Make your Shift report and see:`
  const copy = () => navigator.clipboard.writeText(`${message} ${link}`).then(() => setCopied(true), () => setCopied(false))

  return (
    <div data-theme="now" className="flex min-h-dvh flex-col bg-base-100 font-now text-base-content">
      <header className="flex items-center border-b border-base-300 px-4 py-3 sm:px-8">
        <Link to="/" className="py-1"><Logo /></Link>
      </header>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-8 px-4 py-16">
        <div className="flex flex-col gap-4">
          <p className="font-now-mono text-[11px] uppercase tracking-[0.2em] text-muted">No report yet</p>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight break-words sm:text-5xl">@{handle} hasn’t made their report yet</h1>
          <p className="text-base text-muted sm:text-lg">
            Send them this link. Once they connect GitHub and make their report, it shows up at the same address.
          </p>
        </div>
        <div className="flex flex-col gap-3 rounded-box border border-base-300 bg-base-200 p-4 sm:p-5">
          <label htmlFor="invite" className="font-now-mono text-[11px] uppercase tracking-[0.2em] text-muted">Invite</label>
          <textarea id="invite" readOnly rows={3} className="textarea w-full resize-none" value={`${message} ${link}`} onFocus={(e) => e.currentTarget.select()} />
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className="btn btn-neutral btn-sm" onClick={copy}>{copied ? 'Copied' : 'Copy invite'}</button>
            {shareLinks(message, link).map((s) => (
              <a key={s.name} href={s.href} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">{s.name}</a>
            ))}
            {copied === false && <span role="alert" className="text-sm text-error">Couldn’t copy. Select the text instead.</span>}
          </div>
        </div>
        <p className="text-sm text-muted">
          Is this you? <Link to="/generate" className="link">Make your report</Link>
        </p>
      </main>
    </div>
  )
}
