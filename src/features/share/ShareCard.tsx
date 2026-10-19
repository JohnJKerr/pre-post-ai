// Social cards in the quiet tint look: warm pre-AI half, cool post-AI half, the multiplier
// on the seam. Totals, multipliers, the verdict and both punch cards only. Never repo
// names, because private repos are counted.
import { Chart } from '@tanstack/charts/react'
import { forwardRef, useMemo } from 'react'
import { punchCardChart, weeklyLines } from '../../charts/definitions'
import { dayShort, hour12, num, pct, range, times } from '../../lib/format'
import type { WindowSummary } from '../../api/contract'
import type { Report } from '../../api/contract'
import type { Era } from '../../api/contract'
import { CARD_SIZE, type CardSize } from './cardSize'

interface ShareCardProps {
  report: Report
  size: CardSize
  showHandle: boolean
  link: string
}

const tint = {
  pre: { bg: 'bg-pre-tint', ink: 'text-pre-ink', muted: 'text-pre-muted' },
  post: { bg: 'bg-post-tint', ink: 'text-post-ink', muted: 'text-post-muted' },
} as const

function facts(s: WindowSummary) {
  const busy = s.punch ? ` · busiest ${dayShort(s.punch.busiest.day)} ${hour12(s.punch.busiest.hour)}` : ''
  return { line1: `${s.projectCount} projects${busy}`, line2: s.punch ? `${pct(s.punch.combined)} on evenings & weekends` : 'No punch-card data' }
}

function CardPunch({ report, era, width, height }: { report: Report; era: Era; width: number; height: number }) {
  const punch = report[era].punch
  const def = useMemo(() => (punch ? punchCardChart(era, punch.cells, report.scales.cellMax, false) : null), [era, punch, report.scales.cellMax])
  if (!def) return <div style={{ width, height }} />
  return <Chart definition={def} width={width} height={height} tabIndex={-1} ariaLabel={`Punch card, ${era}-AI`} />
}

function CardWeeks({ report, era, width, height }: { report: Report; era: Era; width: number; height: number }) {
  const s = report[era]
  const def = useMemo(() => weeklyLines(era, s.weekly, report.scales.weekMax), [era, s.weekly, report.scales.weekMax])
  return <Chart definition={def} width={width} height={height} tabIndex={-1} ariaLabel={`Lines added per week, ${era}-AI`} />
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(function ShareCard({ report, size, showHandle, link }, ref) {
  const { width, height } = CARD_SIZE[size]
  const square = size === 'square'
  const half = width / 2
  const chartW = half - 120
  const { pre, post, shift } = report
  const preFacts = facts(pre)
  const postFacts = facts(post)
  const big = square ? 'text-[88px]' : 'text-[76px]'
  const fact = square ? 'text-[22px]' : 'text-[19px]'

  return (
    <div ref={ref} className="relative grid overflow-hidden bg-base-100 font-now text-base-content" style={{ width, height, gridTemplateColumns: `${half}px ${half}px` }}>
      {/* pre-AI */}
      <section className={`flex flex-col justify-between ${tint.pre.bg} py-12 pr-14 pl-16`}>
        <div className="flex flex-col gap-2" style={{ height: square ? 250 : 150 }}>
          <p className={`text-[32px] font-bold tracking-tight ${tint.pre.ink}`}>Pre-AI</p>
          <p className={`font-now-mono text-[15px] uppercase tracking-[0.16em] ${tint.pre.muted}`}>{range(report.pre.range)}</p>
        </div>
        <div className="flex flex-col gap-3">
          <p className="flex items-baseline gap-3">
            <span className={`${big} font-bold leading-[0.9] tracking-tight tabular-nums ${tint.pre.ink}`}>{num(pre.added)}</span>
            <span className={`text-[20px] ${tint.pre.muted}`}>lines</span>
          </p>
          <p className={`${fact} leading-normal`}>{preFacts.line1}<br />{preFacts.line2}</p>
        </div>
        {square && <CardWeeks report={report} era="pre" width={chartW} height={120} />}
        <div className="flex flex-col gap-3">
          <CardPunch report={report} era="pre" width={chartW} height={128} />
          <p className={`text-[17px] font-semibold ${showHandle ? '' : 'invisible'}`}>@{report.handle}</p>
        </div>
      </section>

      {/* post-AI */}
      <section className={`flex flex-col justify-between ${tint.post.bg} py-12 pr-12 pl-18`}>
        <div className="flex flex-col gap-2" style={{ height: square ? 250 : 150 }}>
          <p className={`flex items-baseline gap-4 font-now-mono text-[14px] uppercase tracking-[0.16em] ${tint.post.muted}`}>
            <span className={`font-now text-[22px] font-bold normal-case tracking-tight ${tint.post.ink}`}>Post-AI</span>
            {range(report.post.range)}
          </p>
          <p className={`${square ? 'text-[40px]' : 'text-[34px]'} font-extrabold leading-[1.05] tracking-[-0.02em]`}>“{report.score.verdict}”</p>
          {report.score.tag && <p className={`text-[17px] font-medium ${tint.post.ink}`}>…{report.score.tag}</p>}
        </div>
        <div className="flex flex-col gap-3">
          <p className="flex items-baseline gap-3">
            <span className={`${big} font-bold leading-[0.9] tracking-tight tabular-nums ${tint.post.ink}`}>{num(post.added)}</span>
            <span className={`text-[20px] ${tint.post.muted}`}>lines</span>
          </p>
          <p className={`${fact} leading-normal`}>{postFacts.line1}<br />{postFacts.line2}</p>
        </div>
        {square && <CardWeeks report={report} era="post" width={chartW} height={120} />}
        <div className="flex flex-col gap-3">
          <CardPunch report={report} era="post" width={chartW} height={128} />
          <p className={`flex justify-between font-now-mono text-[15px] ${tint.post.muted}`}>
            <span>Shift · score <span className="font-semibold text-base-content">{report.score.total}/100</span></span>
            <span className={tint.post.ink}>{link.replace(/^https?:\/\//, '')}</span>
          </p>
        </div>
      </section>

      {/* the seam */}
      <p
        className="absolute flex -translate-x-1/2 flex-col items-center rounded-full bg-bar px-6 py-3 font-now-mono leading-tight text-white"
        style={{ left: half, top: square ? 360 : 262 }}
      >
        <span className="text-[30px] font-bold">{times(shift.linesX)}</span>
        <span className="text-[12px] uppercase tracking-[0.12em] text-white/70">the code</span>
      </p>
    </div>
  )
})
