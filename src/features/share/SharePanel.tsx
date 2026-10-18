import type { Report } from '../../api/contract'
import { CARD_SIZE, type CardSize } from './cardSize'
import { ShareCard } from './ShareCard'
import { shareLinks } from './links'

export interface ShareSettings {
  size: CardSize
  showHandle: boolean
  text: string
}

const PREVIEW_WIDTH = 320

interface SharePanelProps {
  report: Report
  link: string
  settings: ShareSettings
  onChange: (s: ShareSettings) => void
}

export function SharePanel({ report, link, settings, onChange }: SharePanelProps) {
  const { width, height } = CARD_SIZE[settings.size]
  const scale = PREVIEW_WIDTH / width
  return (
    <div className="flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-4 p-5">
      <p className="text-base font-bold">Share your before &amp; after</p>
      <div className="overflow-hidden rounded-[10px] border border-base-300" style={{ width: PREVIEW_WIDTH, maxWidth: '100%', height: height * scale }} aria-hidden="true">
        <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: '0 0' }}>
          <ShareCard report={report} size={settings.size} showHandle={settings.showHandle} link={link} />
        </div>
      </div>
      <div className="join w-full" role="group" aria-label="Card size">
        {(Object.keys(CARD_SIZE) as CardSize[]).map((size) => (
          <button
            key={size}
            type="button"
            className={`btn btn-sm join-item flex-1 ${settings.size === size ? 'btn-neutral' : ''}`}
            aria-pressed={settings.size === size}
            onClick={() => onChange({ ...settings, size })}
          >
            {CARD_SIZE[size].label}
          </button>
        ))}
      </div>
      <fieldset className="fieldset p-0">
        <label htmlFor="share-text" className="fieldset-legend pt-0 text-xs text-muted">Your post</label>
        <textarea
          id="share-text"
          className="textarea h-28 w-full text-sm leading-relaxed"
          value={settings.text}
          onChange={(e) => onChange({ ...settings, text: e.target.value })}
        />
        <p className="label text-xs">Your report link is added when you post.</p>
      </fieldset>
      <label htmlFor="show-handle" className="flex cursor-pointer items-center gap-3 text-sm">
        <input id="show-handle" type="checkbox" className="toggle toggle-sm" checked={settings.showHandle} onChange={(e) => onChange({ ...settings, showHandle: e.target.checked })} />
        Show @{report.handle} on the card
      </label>
      <div className="grid grid-cols-3 gap-2">
        {shareLinks(settings.text, link).map((l) => (
          <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-neutral">{l.name}</a>
        ))}
      </div>
      <p className="text-xs text-muted">Totals, verdict and punch cards only. Project names stay off the card.</p>
    </div>
  )
}
