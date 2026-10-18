// Window bounds. stats/contributors buckets by Sunday-start weeks, so both windows are
// whole weeks: post runs from the cut-off week to the last complete week, pre is the
// same number of weeks immediately before it.

const DAY = 86_400_000
const WEEK = 7 * DAY

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
  const weeks = Math.max(0, Math.round((weekStart(today).getTime() - cutoffWeekStart.getTime()) / WEEK))
  const c = cutoffWeekStart.getTime()
  return {
    cutoffWeekStart,
    weeks,
    pre: { start: new Date(c - weeks * WEEK), end: new Date(c - DAY) },
    post: { start: new Date(c), end: new Date(c + weeks * WEEK - DAY) },
  }
}

export const isoDate = (d: Date) => d.toISOString().slice(0, 10)
