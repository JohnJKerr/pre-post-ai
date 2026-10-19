import { describe, expect, it } from 'vitest'
import type { Report } from '../../api/contract'
import { windowsLine } from './windows'

const report = (pre: [string, string], post: [string, string], weeks: number) =>
  ({ weeks, pre: { range: { start: pre[0], end: pre[1] } }, post: { range: { start: post[0], end: post[1] } } }) as Report

describe('WhenDescribingTheWindows', () => {
  it('Windows_that_meet_at_the_cut_off_are_either_side_of_it', () => {
    expect(windowsLine(report(['2026-03-08', '2026-06-27'], ['2026-06-28', '2026-10-17'], 16))).toBe('16 weeks either side of the cut-off')
  })

  it('Windows_with_a_gap_are_the_weeks_before_the_cut_off_and_the_latest', () => {
    expect(windowsLine(report(['2025-05-25', '2025-11-22'], ['2026-04-19', '2026-10-17'], 26))).toBe('The 26 weeks before the cut-off and your latest 26')
  })
})
