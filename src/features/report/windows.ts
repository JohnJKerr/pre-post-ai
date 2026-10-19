import type { Report } from '../../api/contract'

/** The API's cap on each window. A cut-off under this many weeks ago shrinks both to the weeks since it. */
export const MAX_WINDOW_WEEKS = 26

/** Post starts the day pre ends, so they meet at the cut-off; otherwise a gap sits between them. */
export function windowsMeet({ pre, post }: Report) {
  const dayAfterPre = new Date(Date.parse(`${pre.range.end}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10)
  return post.range.start === dayAfterPre
}

/** One line on what the two windows cover. */
export function windowsLine(report: Report) {
  const { weeks } = report
  return windowsMeet(report) ? `${weeks} weeks either side of the cut-off` : `The ${weeks} weeks before the cut-off and your latest ${weeks}`
}
