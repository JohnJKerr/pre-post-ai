import { Link } from 'react-router'
import { date, times } from '../../lib/format'
import type { Report } from '../../api/contract'
import { summarySentence } from './copy'
import { VerdictArt } from './VerdictArt'
import { windowsLine } from './windows'

function ScoreCard({ report }: { report: Report }) {
  const { shift, score } = report
  const { parts } = score
  const rows = [
    [`Output · ${times(shift.commitsX, '(no pre-AI data)')} commits, ${times(shift.linesX, '(no pre-AI data)')} lines`, parts.output],
    [`Projects ${times(shift.projectsX, '(no pre-AI data)')}`, parts.projects],
    [`New languages: ${shift.newLanguages.length}`, parts.languages],
    [`Active days ${times(shift.activeDaysX, '(no pre-AI data)')}`, parts.time],
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

/** Changing the cut-off means signing in again, which regenerates the signed-in user's own report. */
function CutoffNote({ report: { cutoff, isSample } }: { report: Report }) {
  return (
    <div className="flex flex-col gap-1 sm:items-end sm:text-right">
      <p className="text-sm font-medium text-muted">Cut-off</p>
      <p className="text-sm font-semibold sm:text-base">{cutoff.label} · {date(cutoff.date)}</p>
      {isSample
        ? <Link to="/generate" className="link text-sm text-muted">Make your own report</Link>
        : <Link to={`/generate?${new URLSearchParams({ cutoff: cutoff.date })}`} className="link text-sm text-muted">Yours? Try another cut-off</Link>}
    </div>
  )
}

export function Summary({ report }: { report: Report }) {
  const { score } = report
  return (
    <section aria-labelledby="verdict" className="bg-base-100">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-4 py-10 sm:gap-14 sm:px-8 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <p className="text-sm text-muted sm:text-base">{windowsLine(report)}, from your GitHub metadata.</p>
          <CutoffNote report={report} />
        </div>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-14">
          <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
            <h1 id="verdict" className="text-[2.6rem] font-extrabold leading-[0.95] tracking-[-0.03em] sm:text-7xl" style={{ textWrap: 'balance' }}>
              {score.verdict}
            </h1>
            <VerdictArt rung={score.rung} className="h-52 w-52 self-center sm:h-64 sm:w-64 lg:self-start" />
            <p className="max-w-[52ch] text-base text-muted sm:text-lg">{summarySentence(report)}</p>
          </div>
          <ScoreCard report={report} />
        </div>
        <Ladder score={score} />
      </div>
    </section>
  )
}
