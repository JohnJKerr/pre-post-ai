import { describe, expect, it } from 'vitest'
import { isoDate, windowsFor } from './windows'

const today = new Date('2026-10-18T09:00:00Z')
const bounds = (r: { start: Date; end: Date }) => [isoDate(r.start), isoDate(r.end)]

describe('WhenSettingWindowBounds', () => {
  it('Default_cut_off_gives_26_weeks_before_it_and_the_latest_26', () => {
    const w = windowsFor('2025-11-24', today)
    expect(w.weeks).toBe(26)
    expect(isoDate(w.cutoffWeekStart)).toBe('2025-11-23')
    expect(bounds(w.pre)).toEqual(['2025-05-25', '2025-11-22'])
    expect(bounds(w.post)).toEqual(['2026-04-19', '2026-10-17'])
  })

  it('A_cut_off_under_26_weeks_ago_shrinks_both_to_the_weeks_since_it', () => {
    const w = windowsFor('2026-07-01', today)
    expect(w.weeks).toBe(16)
    expect(bounds(w.pre)).toEqual(['2026-03-08', '2026-06-27'])
    expect(bounds(w.post)).toEqual(['2026-06-28', '2026-10-17'])
  })

  it('A_partial_current_week_is_left_out', () => {
    expect(windowsFor('2026-07-01', new Date('2026-10-21T09:00:00Z')).weeks).toBe(16)
    expect(windowsFor('2026-07-01', new Date('2026-10-25T00:00:00Z')).weeks).toBe(17)
  })

  it('A_cut_off_in_the_current_week_has_no_complete_weeks', () => {
    expect(windowsFor('2026-10-19', new Date('2026-10-20T00:00:00Z')).weeks).toBe(0)
  })
})
