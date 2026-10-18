import { range } from '../../lib/format'
import type { Report } from '../../api/contract'
import { EraCell } from './era'
import { eraLabel, eraText } from './eraStyles'
import { HoursSection, LanguagesSection, LinesSection, OutOfHoursSection, ProjectsSection, PunchCardSection } from './sections'

/** Warm tint (pre-AI) on the left, cool tint (post-AI) on the right, at every width. */
export function Comparison({ report }: { report: Report }) {
  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1/2 bg-pre-tint" />
      <div aria-hidden="true" className="absolute inset-y-0 right-0 w-1/2 bg-post-tint" />
      <main className="relative grid grid-cols-2">
        {(['pre', 'post'] as const).map((era) => (
          <EraCell key={era} era={era} className="pt-8 pb-6 sm:pt-12 sm:pb-8">
            <div className="flex flex-col gap-1">
              <h2 className={`text-xl font-bold tracking-tight sm:text-3xl ${eraText[era].ink}`}>{eraLabel[era]}</h2>
              <p className={`text-[12px] sm:text-sm ${eraText[era].muted}`}>{range(report[era].range)} · {report.weeks} weeks</p>
            </div>
          </EraCell>
        ))}
        <LinesSection report={report} />
        <ProjectsSection report={report} />
        <PunchCardSection report={report} />
        <HoursSection report={report} />
        <OutOfHoursSection report={report} />
        <LanguagesSection report={report} />
      </main>
    </div>
  )
}
