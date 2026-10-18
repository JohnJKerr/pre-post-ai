import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router'

const icon = { 'aria-hidden': true, width: 18, height: 18, viewBox: '0 0 18 18', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

interface ReportHeaderProps {
  handle: string
  isSample: boolean
  sharePanel: ReactNode
  onDownload: () => void
  downloading?: boolean
  onCopyLink: () => Promise<void>
  onSignOut?: () => void
}

export function ReportHeader({ handle, isSample, sharePanel, onDownload, downloading, onCopyLink, onSignOut }: ReportHeaderProps) {
  const shareRef = useRef<HTMLDetailsElement>(null)
  const [toast, setToast] = useState<string | null>(null)

  // close the share panel on an outside click or Escape
  useEffect(() => {
    const close = (e: Event) => {
      const el = shareRef.current
      if (!el?.open) return
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !el.contains(e.target as Node)) el.open = false
    }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', close)
    }
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(t)
  }, [toast])

  const copy = () => onCopyLink().then(() => setToast('Link copied'), () => setToast('Couldn’t copy the link'))

  return (
    <header className="navbar sticky top-0 z-50 min-h-0 gap-3 border-b border-base-300 bg-base-100/95 px-4 py-2 backdrop-blur sm:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Link to="/" className="whitespace-nowrap text-base font-extrabold tracking-tight sm:text-lg">
          Pre<span className="text-muted">/</span>Post
        </Link>
        <span aria-hidden="true" className="hidden h-5 w-px bg-base-300 sm:block" />
        <div className="flex min-w-0 items-center gap-2">
          <div className="avatar avatar-placeholder">
            <div className="w-7 rounded-full bg-neutral text-neutral-content">
              <span className="text-[11px] font-semibold">{initials(handle)}</span>
            </div>
          </div>
          <span className="truncate text-sm font-medium">@{handle}</span>
        </div>
        {isSample && <span className="badge badge-ghost badge-sm hidden sm:inline-flex">Sample data</span>}
      </div>
      <nav aria-label="Share this report" className="flex items-center gap-1">
        <details ref={shareRef} className="dropdown dropdown-end">
          <summary className="btn btn-square btn-ghost btn-sm" aria-label="Share to X, LinkedIn or Bluesky">
            <svg {...icon}><path d="M9 11.5V2.5M5.75 5.5L9 2.25l3.25 3.25M6 8.25H4.5a1.25 1.25 0 00-1.25 1.25v5.25c0 .69.56 1.25 1.25 1.25h9c.69 0 1.25-.56 1.25-1.25V9.5c0-.69-.56-1.25-1.25-1.25H12" /></svg>
          </summary>
          <div className="dropdown-content z-50 mt-2 overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-xl">{sharePanel}</div>
        </details>
        <div className="tooltip tooltip-bottom" data-tip="Download card">
          <button type="button" className="btn btn-square btn-ghost btn-sm" aria-label="Download share card" onClick={onDownload} disabled={downloading}>
            <svg {...icon}><path d="M9 2.5v9M5.75 8.25L9 11.5l3.25-3.25M3 13.5v1.25c0 .69.56 1.25 1.25 1.25h9.5c.69 0 1.25-.56 1.25-1.25V13.5" /></svg>
          </button>
        </div>
        <div className="tooltip tooltip-bottom" data-tip="Copy link">
          <button type="button" className="btn btn-square btn-ghost btn-sm" aria-label="Copy link to this report" onClick={copy}>
            <svg {...icon}><path d="M7.5 10.5l3-3M8 5l1.3-1.3a2.9 2.9 0 014.1 4.1L12 9.2M10 13l-1.3 1.3a2.9 2.9 0 01-4.1-4.1L6 8.8" /></svg>
          </button>
        </div>
        {onSignOut && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={onSignOut}>Sign out</button>
        )}
      </nav>
      {toast && (
        <div className="toast toast-end toast-top top-14 z-50" role="status">
          <div className="alert alert-neutral py-2 text-sm">{toast}</div>
        </div>
      )}
    </header>
  )
}

const initials = (handle: string) =>
  handle
    .split(/[-_]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('') || handle.slice(0, 2).toUpperCase()
