// Layout pieces shared by every comparison section.
import type { ReactNode } from 'react'
import type { Era } from '../../api/contract'
import { eraText } from './eraStyles'

const side = {
  pre: { cell: 'pl-4 pr-3', inner: 'ml-auto' },
  post: { cell: 'pl-3 pr-4', inner: 'mr-auto' },
} as const

/** One half of a comparison row; the two halves meet at the seam. */
export function EraCell({ era, label, className = 'pt-6 pb-10 sm:pt-8 sm:pb-12', children }: { era: Era; label?: string; className?: string; children: ReactNode }) {
  return (
    <div role={label ? 'group' : undefined} aria-label={label} className={`min-w-0 ${side[era].cell} sm:px-10 lg:px-14 ${className}`}>
      <div className={`${side[era].inner} flex w-full max-w-[600px] flex-col gap-4`}>{children}</div>
    </div>
  )
}

/** Solid bar opening each metric: name on the left, the change on the right. */
export function MetricBar({ title, change, unit }: { title: string; change: string; unit: string }) {
  return (
    <div className="col-span-2 grid grid-cols-2 bg-bar text-white">
      <div className="min-w-0 py-2.5 pl-4 pr-3 sm:px-10 sm:py-3 lg:px-14">
        <h3 className="ml-auto w-full max-w-[600px] text-sm font-semibold text-white sm:text-base">{title}</h3>
      </div>
      <div className="min-w-0 py-2.5 pl-3 pr-4 sm:px-10 sm:py-3 lg:px-14">
        <p className="mr-auto w-full max-w-[600px] text-right text-sm text-white/70 sm:text-base">
          <span className="font-semibold text-white">{change}</span> {unit}
        </p>
      </div>
    </div>
  )
}

/** The big number that leads a cell. */
export function Headline({ era, value, caption }: { era: Era; value: ReactNode; caption: ReactNode }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-3">
      <span className={`text-[2rem] font-bold leading-none tracking-tight tabular-nums sm:text-6xl ${eraText[era].ink}`}>{value}</span>
      <span className={`text-[12px] sm:text-base ${eraText[era].muted}`}>{caption}</span>
    </p>
  )
}

export function StatRow({ era, stats }: { era: Era; stats: { title: string; value: ReactNode; desc?: string }[] }) {
  return (
    <div className="stats stats-vertical w-full border border-black/10 bg-white/50 sm:stats-horizontal">
      {stats.map((s) => (
        <div key={s.title} className="stat px-3 py-2 sm:px-4">
          <div className={`stat-title text-[11px] sm:text-xs ${eraText[era].muted}`}>{s.title}</div>
          <div className="stat-value text-lg tabular-nums sm:text-2xl">{s.value}</div>
          {s.desc && <div className={`stat-desc ${eraText[era].muted}`}>{s.desc}</div>}
        </div>
      ))}
    </div>
  )
}

/** Shown in place of a chart when a window has nothing to draw. */
export function EmptyNote({ era, children }: { era: Era; children: ReactNode }) {
  return <p className={`rounded-box border border-dashed border-black/15 bg-white/40 p-4 text-[12px] sm:text-sm ${eraText[era].muted}`}>{children}</p>
}

export function HourTicks({ era }: { era: Era }) {
  return (
    <div aria-hidden="true" className={`grid grid-cols-24 text-[9px] sm:text-xs ${eraText[era].muted}`}>
      <span className="col-start-1 justify-self-center">00</span>
      <span className="col-start-7 justify-self-center">06</span>
      <span className="col-start-13 justify-self-center">12</span>
      <span className="col-start-19 justify-self-center">18</span>
    </div>
  )
}
