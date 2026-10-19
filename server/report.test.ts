import { describe, expect, it } from 'vitest'
import { buildReport } from './report'
import { sampleProfile } from './fixture'

// Expected values for the sample fixture, from the handoff brief.
describe('WhenDerivingTheSampleReport', () => {
  const { pre, post, shift, score } = buildReport(sampleProfile())

  it('Totals_lines_and_commits_per_window', () => {
    expect([pre.added, pre.deleted, pre.commits]).toEqual([40_459, 12_665, 638])
    expect([post.added, post.deleted, post.commits]).toEqual([226_832, 74_833, 1_604])
  })

  it('Counts_projects_and_started_projects', () => {
    expect([pre.projectCount, pre.started]).toEqual([5, 2])
    expect([post.projectCount, post.started]).toEqual([12, 10])
  })

  it('Finds_the_busiest_hour', () => {
    expect(pre.punch!.busiest).toMatchObject({ day: 2, hour: 10 })
    expect(post.punch!.busiest).toMatchObject({ day: 2, hour: 21 })
  })

  it('Finds_the_coding_window', () => {
    expect(pre.punch!.window).toEqual({ start: 9, length: 8, end: 17 })
    expect(post.punch!.window).toEqual({ start: 8, length: 14, end: 22 })
  })

  it('Counts_hours_of_the_day_used', () => {
    expect(pre.punch!.hoursTouched).toBe(15)
    expect(post.punch!.hoursTouched).toBe(21)
  })

  it('Counts_active_days', () => {
    expect([pre.activeDays, pre.activeDaysPerWeek]).toEqual([161, 3.4])
    expect([post.activeDays, post.activeDaysPerWeek]).toEqual([277, 5.9])
  })

  it('Splits_evenings_and_weekends', () => {
    const r = (x: number) => +(x * 100).toFixed(1)
    expect([r(pre.punch!.evening), r(pre.punch!.weekend), r(pre.punch!.combined)]).toEqual([7.1, 5.1, 12.2])
    expect([r(post.punch!.evening), r(post.punch!.weekend), r(post.punch!.combined)]).toEqual([30.6, 24.0, 54.6])
  })

  it('Reports_punch_card_coverage', () => {
    expect(pre.coverage).toEqual({ eligible: 3, total: 5, share: 0.46 })
    expect(post.coverage).toEqual({ eligible: 10, total: 12, share: 0.84 })
  })

  it('Spans_whole_weeks_either_side_of_the_cutoff', () => {
    expect(pre.range).toEqual({ start: '2024-12-29', end: '2025-11-22' })
    expect(post.range).toEqual({ start: '2025-11-23', end: '2026-10-17' })
  })

  it('Counts_used_and_new_languages', () => {
    expect(pre.usedLanguages).toHaveLength(5)
    expect(post.usedLanguages).toHaveLength(8)
    expect(shift.newLanguages.sort()).toEqual(['Go', 'Python', 'Rust', 'Swift'])
  })

  it('Scores_69_and_is_a_machine', () => {
    const points = Object.fromEntries(Object.entries(score.parts).map(([k, p]) => [k, p.points]))
    expect(points).toEqual({ output: 20, projects: 9, languages: 20, time: 20 })
    expect(score.total).toBe(69)
    expect(score.verdict).toBe("I'm a machine (literally)")
  })
})

describe('WhenAWindowHasNoEligibleRepos', () => {
  it('Hides_the_punch_card_and_keeps_active_days_in_the_score', () => {
    const profile = sampleProfile()
    profile.repos = profile.repos.map((r) => ({ ...r, punchCard: r.punchCard === 'pre' ? null : r.punchCard }))
    const { pre, score } = buildReport(profile)
    expect(pre.punch).toBeNull()
    expect(pre.coverage).toEqual({ eligible: 0, total: 5, share: 0 })
    expect(score.parts.time.points).toBe(20)
  })
})
