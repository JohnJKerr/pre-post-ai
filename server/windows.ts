// Window bounds. stats/contributors buckets by Sunday-start weeks, so both windows are
// whole weeks. Pre is the weeks just before the cut-off week and post the latest complete
// weeks, at most 26 of each, so an old cut-off doesn't stretch either window over years.
// A cut-off under 26 weeks ago shrinks both to the weeks since it, and post starts at it.

const DAY = 86_400_000
const WEEK = 7 * DAY
export const MAX_WEEKS = 26

export interface DateRange {
  start: Date
  end: Date
}

export interface Windows {
  cutoffWeekStart: Date
  weeks: number
  pre: DateRange
  post: DateRange
}

const utcDay = (iso: string) => new Date(iso.slice(0, 10) + 'T00:00:00Z')

/** The Sunday that starts the week containing `date` (UTC). */
export function weekStart(date: Date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  return new Date(d.getTime() - d.getUTCDay() * DAY)
}

export function windowsFor(cutoffDate: string, today: Date): Windows {
  const cutoffWeekStart = weekStart(utcDay(cutoffDate))
  const sinceCutoff = Math.round((weekStart(today).getTime() - cutoffWeekStart.getTime()) / WEEK)
  const weeks = Math.max(0, Math.min(MAX_WEEKS, sinceCutoff))
  const c = cutoffWeekStart.getTime()
  const now = weekStart(today).getTime()
  return {
    cutoffWeekStart,
    weeks,
    pre: { start: new Date(c - weeks * WEEK), end: new Date(c - DAY) },
    post: { start: new Date(now - weeks * WEEK), end: new Date(now - DAY) },
  }
}

export const isoDate = (d: Date) => d.toISOString().slice(0, 10)
