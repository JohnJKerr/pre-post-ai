import { describe, expect, it } from 'vitest'
import { isoDate, windowsFor } from './windows'

describe('WhenSettingWindowBounds', () => {
  it('Default_cut_off_gives_47_weeks_either_side', () => {
    const w = windowsFor('2025-11-24', new Date('2026-10-18T09:00:00Z'))
    expect(w.weeks).toBe(47)
    expect(isoDate(w.cutoffWeekStart)).toBe('2025-11-23')
    expect([isoDate(w.pre.start), isoDate(w.pre.end)]).toEqual(['2024-12-29', '2025-11-22'])
    expect([isoDate(w.post.start), isoDate(w.post.end)]).toEqual(['2025-11-23', '2026-10-17'])
  })

  it('A_partial_current_week_is_left_out', () => {
    expect(windowsFor('2025-11-24', new Date('2026-10-21T09:00:00Z')).weeks).toBe(47)
    expect(windowsFor('2025-11-24', new Date('2026-10-25T00:00:00Z')).weeks).toBe(48)
  })

  it('A_cut_off_in_the_current_week_has_no_complete_weeks', () => {
    expect(windowsFor('2026-10-19', new Date('2026-10-20T00:00:00Z')).weeks).toBe(0)
  })
})
