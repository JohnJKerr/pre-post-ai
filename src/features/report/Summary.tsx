import { useState } from 'react'
import { PRESET_CUTOFFS } from './cutoffs'
import { date, signed, times } from '../../lib/format'
import type { Report } from '../../api/contract'
import type { Cutoff } from '../../api/contract'
import { summarySentence } from './copy'

const CUSTOM = 'custom'

export function CutoffSelect({ value, onChange, error }: { value: Cutoff; onChange: (c: Cutoff) => void; error?: string }) {
  const isPreset = PRESET_CUTOFFS.some((c) => c.date === value.date)
  const [picking, setPicking] = useState(!isPreset)
  const [custom, setCustom] = useState(isPreset ? '' : value.date)
  const [today] = useState(() => new Date().toISOString().slice(0, 10))

  return (
    <div className="flex w-full flex-col gap-1 sm:w-auto">
      <label htmlFor="cutoff" className="font-now-mono text-[11px] uppercase tracking-[0.2em] text-muted">Cut-off</label>
      <select
        id="cutoff"
        className="select w-full sm:w-80"
       
        value={picking ? CUSTOM : value.date}
        onChange={(e) => {
          if (e.target.value === CUSTOM) return setPicking(true)
          setPicking(false)
          onChange(PRESET_CUTOFFS.find((c) => c.date === e.target.value)!)
        }}
      >
        {PRESET_CUTOFFS.map((c) => (
          <option key={c.date} value={c.date}>{c.label} · {date(c.date)}</option>
        ))}
        <option value={CUSTOM}>{isPreset ? 'Pick a date…' : `Custom · ${date(value.date)}`}</option>
      </select>
      {picking && (
        <form
          className="join w-full sm:w-80"
          onSubmit={(e) => {
            e.preventDefault()
            if (custom) onChange({ label: 'Custom', date: custom })
          }}
        >
          <label htmlFor="cutoff-date" className="sr-only">Cut-off date</label>
          <input id="cutoff-date" type="date" className="input join-item w-full" max={today} value={custom} onChange={(e) => setCustom(e.target.value)} required />
          <button type="submit" className="btn btn-neutral join-item" disabled={!custom || custom === value.date}>Apply</button>
        </form>
      )}
      {error && <p role="alert" className="text-sm text-error sm:w-80">{error}</p>}
    </div>
  )
}

function ScoreCard({ report }: { report: Report }) {
  const { shift, score } = report
  const { parts } = score
  const hours = shift.hoursShift == null ? 'Out of hours: no data' : `Out of hours ${signed(Math.round(shift.hoursShift))} pts`
  const rows = [
    [`Lines ${times(shift.linesX, '(no pre-AI data)')}`, parts.output],
    [`Projects ${times(shift.projectsX, '(no pre-AI data)')}`, parts.projects],
    [`New languages: ${shift.newLanguages.length}`, parts.languages],
    [hours, parts.hours],
  ] as const
  return (
    <div className="flex flex-col gap-5 rounded-box border border-base-300 bg-base-200 p-5 sm:p-6">
      <div className="flex items-center gap-5">
        <div
          className="radial-progress shrink-0 text-2xl font-extrabold text-base-content [--size:6rem] [--thickness:8px] sm:text-3xl sm:[--size:7.5rem]"
          style={{ '--value': score.total } as React.CSSProperties}
          role="progressbar"
          aria-valuenow={score.total}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Shift score"
        >
          {score.total}
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-lg font-bold">Shift score</p>
          <p className="text-sm text-muted">Out of 100. Same formula for everyone, so scores compare.</p>
        </div>
      </div>
      <dl className="flex flex-col gap-2 font-now-mono text-[13px] tabular-nums sm:text-sm">
        {rows.map(([label, { points, max }]) => (
          <div key={label} className="flex justify-between gap-3 border-b border-base-300 pb-2">
            <dt>{label}</dt>
            <dd className="font-semibold">{points} / {max}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-3 pt-1 font-bold"><dt>Total</dt><dd>{score.total} / 100</dd></div>
      </dl>
    </div>
  )
}

function Ladder({ score: { total: score, rung, ladder } }: { score: Report['score'] }) {
  return (
    <ol aria-label="Shift score ladder" className="steps steps-vertical w-full text-sm lg:steps-horizontal">
      {ladder.map((r, i) => {
        const max = (ladder[i + 1]?.min ?? 101) - 1
        const span = `${r.min}–${max}`
        if (i < rung)
          return (
            <li key={r.min} className="step step-neutral" data-content="✓">
              <span className="flex flex-col items-start gap-0.5 text-left lg:items-center lg:text-center">
                <span className="font-semibold">{r.verdict}</span>
                <span className="font-now-mono text-xs text-muted">{span}</span>
              </span>
            </li>
          )
        if (i === rung)
          return (
            <li key={r.min} className="step step-neutral" data-content={score} aria-current="step">
              <span className="flex flex-col items-start gap-1 text-left lg:items-center lg:text-center">
                <span className="font-extrabold">{r.verdict}</span>
                <span className="badge badge-neutral badge-sm">You · {span}</span>
              </span>
            </li>
          )
        return (
          <li key={r.min} className="step" data-content={i + 1}>
            <span className="flex flex-col items-start gap-0.5 text-left text-muted lg:items-center lg:text-center">
              <span className="font-semibold">{r.verdict}</span>
              <span className="font-now-mono text-xs">{span}{i === rung + 1 && ` · ${r.min - score} to go`}</span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export function Summary({ report, onCutoffChange, cutoffError }: { report: Report; onCutoffChange?: (c: Cutoff) => void; cutoffError?: string }) {
  const { score, weeks, cutoff } = report
  return (
    <section aria-labelledby="verdict" className="bg-base-100">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-4 py-10 sm:gap-14 sm:px-8 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="font-now-mono text-[11px] uppercase tracking-[0.2em] text-muted">Before &amp; after AI</p>
            <p className="text-sm text-muted sm:text-base">{weeks} weeks either side of the cut-off, from your GitHub metadata.</p>
          </div>
          {onCutoffChange && <CutoffSelect key={cutoff.date} value={cutoff} onChange={onCutoffChange} error={cutoffError} />}
        </div>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-14">
          <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
            <p className="font-now-mono text-[11px] uppercase tracking-[0.2em] text-muted">Verdict</p>
            <h1 id="verdict" className="text-[2.6rem] font-extrabold leading-[0.95] tracking-[-0.03em] sm:text-7xl" style={{ textWrap: 'balance' }}>
              {score.verdict}
            </h1>
            {score.tag && <p className="text-lg font-medium sm:text-2xl">…{score.tag}.</p>}
            <p className="max-w-[52ch] text-base text-muted sm:text-lg">{summarySentence(report)}</p>
          </div>
          <ScoreCard report={report} />
        </div>
        <Ladder score={score} />
      </div>
    </section>
  )
}
