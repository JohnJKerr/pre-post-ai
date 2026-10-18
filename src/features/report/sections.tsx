// The six comparison sections, in page order. Each renders its bar plus a pre and post cell.
import { Chart } from '@tanstack/charts/react'
import { useMemo } from 'react'
import { hourCurve, languageBar, projectBars, punchCardChart, weeklyLines } from '../../charts/definitions'
import { dayLong, hh, hour12, month, num, pct, pct1, shareInWords, signed, times } from '../../lib/format'
import { languageMix } from '../../charts/languages'
import type { WindowSummary } from '../../api/contract'
import type { Report } from '../../api/contract'
import { ERAS, type Era } from '../../api/contract'
import { useIsSm } from '../../hooks/useMediaQuery'
import { EmptyNote, EraCell, Headline, HourTicks, MetricBar, StatRow } from './era'
import { eraLabel, eraText } from './eraStyles'

type SectionProps = { report: Report }
const side = (report: Report, era: Era) => report[era]

// ── Lines of code ─────────────────────────────────────────────

function LinesCell({ report, era }: SectionProps & { era: Era }) {
  const s = side(report, era)
  const isSm = useIsSm()
  const definition = useMemo(() => weeklyLines(era, s.weekly, report.scales.weekMax), [era, s.weekly, report.scales.weekMax])
  const peak = s.weekly.reduce((best, w) => (w.a > best.a ? w : best), s.weekly[0])
  return (
    <EraCell era={era} label={`Lines of code, ${eraLabel[era]}`}>
      <Headline era={era} value={num(s.added)} caption="lines added" />
      <StatRow
        era={era}
        stats={[
          { title: 'Deleted', value: num(s.deleted) },
          { title: 'Commits', value: num(s.commits) },
          { title: 'Lines per commit', value: num(s.perCommit) },
        ]}
      />
      <figure className="flex flex-col gap-1.5">
        <Chart definition={definition} height={isSm ? 150 : 96} ariaLabel={`Lines added per week, ${eraLabel[era]}${peak ? `. Busiest week ${num(peak.a)} lines` : ''}`} />
        <figcaption className={`flex justify-between gap-2 text-[10px] sm:text-xs ${eraText[era].muted}`}>
          <span>{s.weekly[0] && month(s.weekly[0].w)}</span>
          <span className="hidden sm:inline">{era === 'pre' ? 'One bar a week · same scale both sides' : peak && `Peak ${num(peak.a)} a week`}</span>
          <span>{s.weekly.at(-1) && month(s.weekly.at(-1)!.w)}</span>
        </figcaption>
      </figure>
    </EraCell>
  )
}

export function LinesSection({ report }: SectionProps) {
  return (
    <>
      <MetricBar title="Lines of code" change={times(report.shift.linesX)} unit="lines" />
      {ERAS.map((era) => <LinesCell key={era} report={report} era={era} />)}
    </>
  )
}

// ── Projects ──────────────────────────────────────────────────

const SLOTS = 6
const PRIVATE = 'Private repo'
const projectName = (p: { name: string | null }) => p.name ?? PRIVATE

function ProjectsCell({ report, era }: SectionProps & { era: Era }) {
  const s = side(report, era)
  const top = useMemo(() => s.projects.slice(0, SLOTS).map((p) => ({ label: projectName(p), lines: p.lines })), [s.projects])
  const more = s.projects.slice(SLOTS).map(projectName)
  const definition = useMemo(() => projectBars(era, top, report.scales.projectMax, SLOTS), [era, top, report.scales.projectMax])
  const empty = Array.from({ length: SLOTS - top.length })
  return (
    <EraCell era={era} label={`Projects, ${eraLabel[era]}`}>
      <Headline era={era} value={s.projectCount} caption={`projects · ${s.started} started this window`} />
      {s.projectCount === 0 ? (
        <EmptyNote era={era}>No commits in any repo in this window.</EmptyNote>
      ) : (
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-x-3 text-[11px] tabular-nums sm:grid-cols-[8.5rem_minmax(0,1fr)_4.5rem] sm:text-sm">
          <ul className="flex flex-col">
            {top.map((p, i) => (
              <li key={i} className="flex h-[26px] items-center"><span className={`truncate ${p.label === PRIVATE ? eraText[era].muted : ''}`}>{p.label}</span></li>
            ))}
            {empty.map((_, i) => (
              <li key={i} className={`flex h-[26px] items-center ${eraText[era].muted}`}>—</li>
            ))}
          </ul>
          <Chart definition={definition} height={SLOTS * 26} ariaLabel={`Lines added per project, ${eraLabel[era]}`} />
          <ul className={`hidden flex-col text-right sm:flex ${eraText[era].muted}`}>
            {top.map((p, i) => (
              <li key={i} className="flex h-[26px] items-center justify-end">{num(p.lines)}</li>
            ))}
          </ul>
        </div>
      )}
      <p className={`text-[11px] sm:text-sm ${eraText[era].muted}`}>
        {more.length > 0 ? `+${more.length} more: ${more.join(', ')}.` : 'Lines added per project · same scale both sides.'}
      </p>
    </EraCell>
  )
}

export function ProjectsSection({ report }: SectionProps) {
  return (
    <>
      <MetricBar title="Projects" change={times(report.shift.projectsX)} unit="projects" />
      {ERAS.map((era) => <ProjectsCell key={era} report={report} era={era} />)}
    </>
  )
}

// ── Punch card ────────────────────────────────────────────────

const DAYS = [
  ['M', 'Mon'], ['T', 'Tue'], ['W', 'Wed'], ['T', 'Thu'], ['F', 'Fri'], ['S', 'Sat'], ['S', 'Sun'],
] as const

function noPunchReason(s: WindowSummary, era: Era) {
  const where = era === 'pre' ? 'before' : 'after'
  return s.projectCount === 0
    ? 'No commits in this window.'
    : `None of your ${s.projectCount} projects in this window qualifies: a project counts only if you wrote 90%+ of its commits and it sits wholly ${where} the cut-off. GitHub's punch card counts every author for all time, so shared repos would mislead.`
}

function PunchCell({ report, era }: SectionProps & { era: Era }) {
  const s = side(report, era)
  const definition = useMemo(() => (s.punch ? punchCardChart(era, s.punch.cells, report.scales.cellMax) : null), [era, s.punch, report.scales.cellMax])
  if (!s.punch || !definition) {
    return (
      <EraCell era={era} label={`Punch card, ${eraLabel[era]}`}>
        <EmptyNote era={era}>{noPunchReason(s, era)}</EmptyNote>
      </EraCell>
    )
  }
  const { busiest } = s.punch
  const scope = era === 'pre' ? 'sit wholly before the cut-off' : 'started after the cut-off'
  return (
    <EraCell era={era} label={`Punch card, ${eraLabel[era]}`}>
      <p className="flex flex-col gap-1">
        <span className={`text-[11px] sm:text-sm ${eraText[era].muted}`}>Busiest hour</span>
        <span className={`text-xl font-bold leading-tight tracking-tight sm:text-4xl ${eraText[era].ink}`}>
          {dayLong(busiest.day)}, {hour12(busiest.hour)}
        </span>
      </p>
      <figure className="grid grid-cols-[1rem_minmax(0,1fr)] gap-x-1 gap-y-1 sm:grid-cols-[2.5rem_minmax(0,1fr)] sm:gap-x-2">
        <ul aria-hidden="true" className={`flex flex-col justify-around text-[9px] leading-none sm:text-xs ${eraText[era].muted}`}>
          {DAYS.map(([short, long]) => (
            <li key={long}><span className="sm:hidden">{short}</span><span className="hidden sm:inline">{long}</span></li>
          ))}
        </ul>
        <Chart definition={definition} aspectRatio={480 / 140} ariaLabel={`Punch card of commits by weekday and hour, ${eraLabel[era]}. Busiest: ${dayLong(busiest.day)} at ${hour12(busiest.hour)}.`} />
        <div className="col-start-2"><HourTicks era={era} /></div>
      </figure>
      <p className={`text-[11px] sm:text-sm ${eraText[era].muted}`}>
        {era === 'pre' && 'Dot size = commits in that hour. '}Built from the {s.coverage.eligible} of {s.coverage.total} projects that {scope}: {pct(s.coverage.share)} of your commits.
      </p>
    </EraCell>
  )
}

export function PunchCardSection({ report }: SectionProps) {
  return (
    <>
      <MetricBar title="Punch card" change={times(report.shift.commitsX)} unit="commits" />
      {ERAS.map((era) => <PunchCell key={era} report={report} era={era} />)}
    </>
  )
}

// ── Hours active ──────────────────────────────────────────────

function HoursCell({ report, era }: SectionProps & { era: Era }) {
  const s = side(report, era)
  const definition = useMemo(
    () => (s.punch ? hourCurve(era, s.punch.hourShares, report.scales.hourMax, s.punch.window) : null),
    [era, s.punch, report.scales.hourMax],
  )
  const days = (
    <StatRow
      era={era}
      stats={[
        ...(s.punch ? [{ title: 'Hours of the day used', value: `${s.punch.hoursTouched} of 24` }] : []),
        { title: 'Active days', value: num(s.activeDays), desc: `${s.activeDaysPerWeek} a week` },
      ]}
    />
  )
  if (!s.punch || !definition) {
    return (
      <EraCell era={era} label={`Hours active, ${eraLabel[era]}`}>
        <EmptyNote era={era}>Hours come from the punch card, which has no qualifying projects in this window.</EmptyNote>
        {days}
      </EraCell>
    )
  }
  const w = s.punch.window
  return (
    <EraCell era={era} label={`Hours active, ${eraLabel[era]}`}>
      <Headline
        era={era}
        value={`${w.length} hrs`}
        caption={w.length === 24 ? 'it takes the whole day to hold 80% of your commits' : `${hh(w.start)}–${hh(w.end)} holds 80% of your commits`}
      />
      <figure className="flex flex-col gap-1">
        <Chart definition={definition} aspectRatio={480 / 120} ariaLabel={`Share of commits by hour of day, ${eraLabel[era]}, with the ${hh(w.start)} to ${hh(w.end)} coding window shaded`} />
        <HourTicks era={era} />
        <figcaption className={`flex items-center gap-2 text-[10px] sm:text-xs ${eraText[era].muted}`}>
          <span aria-hidden="true" className={`inline-block h-3 w-4 shrink-0 border ${era === 'pre' ? 'border-pre-mark/40 bg-pre-mark/10' : 'border-post-mark/40 bg-post-mark/10'}`} />
          Shaded: the hours holding 80% of commits
        </figcaption>
      </figure>
      {days}
    </EraCell>
  )
}

export function HoursSection({ report }: SectionProps) {
  const { pre, post } = report
  const change = pre.punch && post.punch ? `${signed(post.punch.window.length - pre.punch.window.length)} hrs` : '—'
  return (
    <>
      <MetricBar title="Hours active" change={change} unit="a day" />
      {ERAS.map((era) => <HoursCell key={era} report={report} era={era} />)}
    </>
  )
}

// ── Evenings & weekends ───────────────────────────────────────

function Dial({ era, value, title, sub }: { era: Era; value: number; title: string; sub: string }) {
  const v = Math.round(value * 100)
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`radial-progress text-sm font-bold [--size:4.25rem] [--thickness:5px] sm:text-xl sm:[--size:6.5rem] ${eraText[era].ink}`}
        style={{ '--value': v } as React.CSSProperties}
        role="progressbar"
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Commits on ${title.toLowerCase()}`}
      >
        {v}%
      </div>
      <span className="text-center text-[11px] font-medium sm:text-sm">
        {title}
        <br />
        <span className={`font-normal ${eraText[era].muted}`}>{sub}</span>
      </span>
    </div>
  )
}

function OutOfHoursCell({ report, era }: SectionProps & { era: Era }) {
  const p = side(report, era).punch
  return (
    <EraCell era={era} label={`Evenings and weekends, ${eraLabel[era]}`}>
      {p ? (
        <>
          <div className="flex flex-wrap gap-4 sm:gap-8">
            <Dial era={era} value={p.evening} title="Evenings" sub="Mon–Fri, 6pm–6am" />
            <Dial era={era} value={p.weekend} title="Weekends" sub="Sat & Sun" />
          </div>
          <p className="text-[13px] sm:text-lg" style={{ textWrap: 'balance' }}>
            {shareInWords(p.combined)} {era === 'pre' ? 'landed' : 'now land'} outside office hours.
          </p>
        </>
      ) : (
        <EmptyNote era={era}>No qualifying punch-card projects in this window, so evenings and weekends can't be measured.</EmptyNote>
      )}
    </EraCell>
  )
}

export function OutOfHoursSection({ report }: SectionProps) {
  return (
    <>
      <MetricBar title="Evenings & weekends" change={times(report.shift.outOfHoursX, '—')} unit="out of hours" />
      {ERAS.map((era) => <OutOfHoursCell key={era} report={report} era={era} />)}
    </>
  )
}

// ── Languages ─────────────────────────────────────────────────

function LanguagesCell({ report, era }: SectionProps & { era: Era }) {
  const s = side(report, era)
  const mix = useMemo(() => languageMix(era, s.languages, s.usedLanguages), [era, s.languages, s.usedLanguages])
  const parts = useMemo(
    () => [...mix.slots, ...(mix.other.share > 0 ? [{ language: 'Other', share: mix.other.share, color: mix.other.color }] : [])],
    [mix],
  )
  const definition = useMemo(() => languageBar(era, parts), [era, parts])
  const fresh = era === 'post' ? report.shift.newLanguages : []
  return (
    <EraCell era={era} label={`Languages, ${eraLabel[era]}`} className="pt-6 pb-12 sm:pt-8 sm:pb-16">
      <Headline era={era} value={s.usedLanguages.length} caption="languages with 2%+ of your lines" />
      {parts.length === 0 ? (
        <EmptyNote era={era}>No programming languages in this window's projects.</EmptyNote>
      ) : (
        <>
          <Chart definition={definition} height={28} ariaLabel={`Language share, ${eraLabel[era]}: ${parts.map((p) => `${p.language} ${pct1(p.share)}%`).join(', ')}`} />
          <ul className="grid grid-cols-1 gap-x-6 gap-y-1.5 text-[11px] tabular-nums sm:grid-cols-2 sm:text-sm">
            {mix.slots.map((l) => (
              <li key={l.language} className="flex items-center gap-2">
                <span aria-hidden="true" className="inline-block size-3 shrink-0 rounded-sm" style={{ background: l.color }} />
                {l.language}
                <span className="ml-auto">{pct1(l.share)}%</span>
              </li>
            ))}
            {mix.other.share > 0 && (
              <li className="flex items-center gap-2 sm:col-span-2">
                <span aria-hidden="true" className="inline-block size-3 shrink-0 rounded-sm" style={{ background: mix.other.color }} />
                <span className="min-w-0">
                  Other <span className={eraText[era].muted}>({mix.other.parts.map((p) => `${p.language} ${pct1(p.share)}`).join(', ')})</span>
                </span>
                <span className="ml-auto">{pct1(mix.other.share)}%</span>
              </li>
            )}
          </ul>
        </>
      )}
      {fresh.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-[11px] sm:text-sm ${eraText[era].muted}`}>New since the cut-off</span>
          {fresh.map((l) => (
            <span key={l} className={`badge badge-outline badge-sm ${eraText[era].ink}`}>{l}</span>
          ))}
        </div>
      )}
    </EraCell>
  )
}

export function LanguagesSection({ report }: SectionProps) {
  return (
    <>
      <MetricBar title="Languages" change={signed(report.shift.newLanguages.length)} unit="new" />
      {ERAS.map((era) => <LanguagesCell key={era} report={report} era={era} />)}
    </>
  )
}
