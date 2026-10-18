// Display formatting shared by the report and the share cards.

const int = new Intl.NumberFormat('en-GB')
export const num = (n: number) => int.format(n)

export const pct = (share: number) => `${Math.round(share * 100)}%`
export const pct1 = (share: number) => (share * 100).toFixed(1)

/** "×5.6", or a fallback when there was nothing before the cut-off */
export const times = (x: number | null, fallback = 'new') => (x == null ? fallback : `×${x.toFixed(1)}`)

export const signed = (n: number) => (n > 0 ? `+${n}` : `${n}`)

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_LONG = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays']
export const dayShort = (d: number) => DAY_SHORT[d]
export const dayLong = (d: number) => DAY_LONG[d]

/** 0 → 12am, 13 → 1pm */
export const hour12 = (h: number) => `${h % 12 === 0 ? 12 : h % 12}${h < 12 ? 'am' : 'pm'}`
export const hh = (h: number) => `${String(h).padStart(2, '0')}:00`

const dateFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
const monthFmt = new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' })
export const date = (d: Date | string) => dateFmt.format(typeof d === 'string' ? new Date(d + 'T00:00:00Z') : d)
export const month = (d: Date | string) => monthFmt.format(typeof d === 'string' ? new Date(d + 'T00:00:00Z') : d)
export const range = (r: { start: Date | string; end: Date | string }) => `${date(r.start)} – ${date(r.end)}`

/** "About 1 in 8 commits" / "More than half your commits (55%)" */
export function shareInWords(share: number) {
  if (share >= 0.5) return `More than half your commits (${pct(share)})`
  if (share <= 0) return 'None of your commits'
  return `About 1 in ${Math.round(1 / share)} commits`
}
