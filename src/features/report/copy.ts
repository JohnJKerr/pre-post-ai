// Sentences built from a report, shared by the summary and the share panel.
import { num, pct } from '../../lib/format'
import type { Report } from '../../api/contract'

const x = (n: number) => `${n.toFixed(1)}×`

/** "5.6× the code, 2.4× the projects, and 55% of your commits now land on evenings and weekends, up from 12%." */
export function summarySentence({ pre, post, shift }: Report) {
  const list = [
    shift.linesX == null ? `${num(post.added)} lines of code, with nothing before the cut-off to compare` : `${x(shift.linesX)} the code`,
    shift.projectsX == null ? `${post.projectCount} projects` : `${x(shift.projectsX)} the projects`,
  ]
  if (pre.punch && post.punch) {
    const dir = post.punch.combined >= pre.punch.combined ? 'up' : 'down'
    list.push(`${pct(post.punch.combined)} of your commits now land on evenings and weekends, ${dir} from ${pct(pre.punch.combined)}`)
  }
  return joinList(list) + '.'
}

/** Default text for the share panel's post. The link is added by each intent. */
export function shareText({ pre, post, shift, score }: Report) {
  const list = [
    shift.linesX == null ? `${num(post.added)} lines of code` : `${x(shift.linesX)} the code`,
    shift.projectsX == null ? `${post.projectCount} projects` : `${post.projectCount} projects instead of ${pre.projectCount}`,
  ]
  if (pre.punch && post.punch) list.push(`${pct(post.punch.combined)} of my commits now land on evenings and weekends`)
  return `Pre vs post AI: ${joinList(list)}. Verdict: ${score.verdict}.`
}

function joinList(items: string[]) {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`
}
