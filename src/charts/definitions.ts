// TanStack Charts definitions for the report. One grammar, two colour treatments: same
// marks and shared domains, so the halves compare honestly.
import { areaY, barX, barY, defineChart, dot, lineY, rect } from '@tanstack/charts'
import { decorative } from '@tanstack/charts/mark/decorative'
import { scaleBand } from '@tanstack/charts/scales/band'
import { scaleLinear } from '@tanstack/charts/scales/linear'
import { tooltip } from '@tanstack/charts/tooltip'
import { date, dayShort, hh, num, pct1 } from '../lib/format'
import type { Era, PunchCell, Week } from '../api/contract'

export const ink: Record<Era, string> = { pre: '#8a7154', post: '#2f4bff' }
export const surface: Record<Era, string> = { pre: '#f6f2ea', post: '#eff3ff' }

const noAxis = { axis: false as const }

/** Lines added per week; y shared across both eras. */
export function weeklyLines(era: Era, weeks: Week[], yMax: number) {
  return defineChart({
    marks: [barY(weeks, { x: 'w', y: 'a', fill: ink[era], radius: 1.5 })],
    scales: {
      x: { scale: () => scaleBand<string>().padding(0.3), ...noAxis },
      y: { scale: scaleLinear().domain([0, yMax]), ...noAxis },
    },
    margin: 0,
    tooltip: { use: tooltip, format: (p) => `Week of ${date(p.datum.w)}\n${num(p.datum.a)} lines added · ${num(p.datum.c)} commits` },
  })
}

/** Lines added per project; x shared across both eras, fixed slot count so rows line up. */
/** One bar per slot, top to bottom; names can repeat (private repos), so slots key by index. */
export function projectBars(era: Era, projects: { label: string; lines: number }[], xMax: number, slots = 6) {
  const rows = projects.map((p, i) => ({ ...p, slot: String(i) }))
  const domain = Array.from({ length: Math.max(slots, rows.length) }, (_, i) => String(i))
  return defineChart({
    marks: [barX(rows, { x: 'lines', y: 'slot', fill: ink[era], radius: 2 })],
    scales: {
      x: { scale: scaleLinear().domain([0, xMax]), ...noAxis },
      y: { scale: scaleBand<string>().domain(domain).paddingInner(0.38).paddingOuter(0.19), ...noAxis },
    },
    margin: 0,
    tooltip: { use: tooltip, format: (p) => `${p.datum.label}: ${num(p.datum.lines)} lines` },
  })
}

const DAYS_MON_FIRST = [1, 2, 3, 4, 5, 6, 0]

/** Commits by weekday × hour; radius shared across both eras and sized to the cells. */
export function punchCardChart(era: Era, cells: PunchCell[], maxCell: number, interactive = true) {
  const rows = cells.map((c) => ({ ...c, h: String(c.hour), d: String(DAYS_MON_FIRST.indexOf(c.day)) }))
  const lit = rows.filter((r) => r.commits > 0)
  const interaction = interactive
    ? { tooltip: { use: tooltip, format: (p: { datum: PunchCell }) => `${dayShort(p.datum.day)} ${hh(p.datum.hour)}: ${num(p.datum.commits)} commits` } }
    : { keyboard: false as const }
  return defineChart({
    ...interaction,
    chart: ({ width, height }) => {
      // the biggest dot nearly fills its cell, so dots never overlap at phone widths
      const maxR = Math.min(width / 24, height / 7) * 0.46
      const rScale = (v: number) => (v <= 0 ? 0 : maxR * (0.18 + 0.82 * Math.sqrt(v / maxCell)))
      return {
        marks: [
          // every hour slot, faintly, so empty hours still read as hours
          decorative(dot(rows, { x: 'h', y: 'd', r: Math.max(0.8, maxR * 0.16), fill: ink[era], fillOpacity: 0.25, key: (r) => `g${r.d}-${r.h}` })),
          dot(lit, { x: 'h', y: 'd', r: 'commits', rScale, fill: ink[era], key: (r) => `p${r.d}-${r.h}` }),
        ],
        scales: {
          x: { scale: scaleBand<string>().domain(Array.from({ length: 24 }, (_, i) => String(i))).padding(0), ...noAxis },
          y: { scale: scaleBand<string>().domain(['0', '1', '2', '3', '4', '5', '6']).padding(0), ...noAxis },
        },
        margin: 0,
      }
    },
  })
}

/** Share of commits by hour of day, with the 80% coding window shaded. */
export function hourCurve(era: Era, shares: { hour: number; share: number }[], yMax: number, window: { start: number; length: number }) {
  const rows = shares.map((h) => ({ x: h.hour + 0.5, hour: h.hour, share: h.share }))
  // a window that wraps past midnight is drawn as two bands
  const end = window.start + window.length
  const band =
    end <= 24
      ? [{ x1: window.start, x2: end, y1: 0, y2: yMax }]
      : [
          { x1: window.start, x2: 24, y1: 0, y2: yMax },
          { x1: 0, x2: end - 24, y1: 0, y2: yMax },
        ]
  return defineChart({
    marks: [
      decorative(rect(band, { x1: 'x1', x2: 'x2', y1: 'y1', y2: 'y2', fill: ink[era], fillOpacity: 0.1 })),
      decorative(areaY(rows, { x: 'x', y: 'share', fill: ink[era], fillOpacity: 0.16 })),
      lineY(rows, { x: 'x', y: 'share', stroke: ink[era], strokeWidth: 2 }),
    ],
    scales: {
      x: { scale: scaleLinear().domain([0, 24]), ...noAxis },
      y: { scale: scaleLinear().domain([0, yMax]), ...noAxis },
    },
    margin: 0,
    focus: 'nearest-x',
    tooltip: { use: tooltip, format: (p) => `${hh(p.datum.hour)}–${hh((p.datum.hour + 1) % 24)}: ${pct1(p.datum.share)}% of commits` },
  })
}

/** Language mix as one 100% stacked bar; colour follows the language, not its rank. */
export function languageBar(era: Era, parts: { language: string; share: number; color: string }[]) {
  const rows = parts.map((p) => ({ ...p, row: 'mix' }))
  return defineChart({
    marks: [barX(rows, { x: 'share', y: 'row', z: 'language', fill: (r) => r.color, stroke: surface[era], strokeWidth: 2 })],
    scales: {
      x: { scale: scaleLinear().domain([0, 1]), ...noAxis },
      y: { scale: () => scaleBand<string>().padding(0), ...noAxis },
    },
    margin: 0,
    tooltip: { use: tooltip, format: (p) => `${p.datum.language}: ${pct1(p.datum.share)}%` },
  })
}
