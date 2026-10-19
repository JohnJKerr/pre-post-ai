import { describe, expect, it } from 'vitest'
import { buildReport } from './report'
import { sampleProfile } from './fixture'

// Expected values for the sample fixture: the handoff's seeded data over 26-week windows.
describe('WhenDerivingTheSampleReport', () => {
  const { pre, post, shift, score } = buildReport(sampleProfile())

  it('Totals_lines_and_commits_per_window', () => {
    expect([pre.added, pre.deleted, pre.commits]).toEqual([38_306, 12_125, 639])
    expect([post.added, post.deleted, post.commits]).toEqual([232_608, 72_522, 1_617])
  })

  it('Counts_projects_and_started_projects', () => {
    expect([pre.projectCount, pre.started]).toEqual([5, 2])
    expect([post.projectCount, post.started]).toEqual([12, 10])
  })

  it('Finds_the_busiest_hour', () => {
    expect(pre.punch!.busiest).toMatchObject({ day: 1, hour: 11 })
    expect(post.punch!.busiest).toMatchObject({ day: 4, hour: 20 })
  })

  it('Finds_the_coding_window', () => {
    expect(pre.punch!.window).toEqual({ start: 9, length: 8, end: 17 })
    expect(post.punch!.window).toEqual({ start: 9, length: 14, end: 23 })
  })

  it('Counts_hours_of_the_day_used', () => {
    expect(pre.punch!.hoursTouched).toBe(14)
    expect(post.punch!.hoursTouched).toBe(21)
  })

  it('Counts_active_days', () => {
    expect([pre.activeDays, pre.activeDaysPerWeek]).toEqual([99, 3.8])
    expect([post.activeDays, post.activeDaysPerWeek]).toEqual([155, 6])
  })

  it('Splits_evenings_and_weekends', () => {
    const r = (x: number) => +(x * 100).toFixed(1)
    expect([r(pre.punch!.evening), r(pre.punch!.weekend), r(pre.punch!.combined)]).toEqual([6.8, 5.8, 12.6])
    expect([r(post.punch!.evening), r(post.punch!.weekend), r(post.punch!.combined)]).toEqual([30.5, 24.7, 55.2])
  })

  it('Reports_punch_card_coverage', () => {
    expect(pre.coverage).toEqual({ eligible: 3, total: 5, share: 0.46 })
    expect(post.coverage).toEqual({ eligible: 10, total: 12, share: 0.84 })
  })

  it('Spans_the_26_weeks_before_the_cutoff_and_the_latest_26', () => {
    expect(pre.range).toEqual({ start: '2025-05-25', end: '2025-11-22' })
    expect(post.range).toEqual({ start: '2026-04-19', end: '2026-10-17' })
  })

  it('Counts_used_and_new_languages', () => {
    expect(pre.usedLanguages).toHaveLength(5)
    expect(post.usedLanguages).toHaveLength(8)
    expect(shift.newLanguages.sort()).toEqual(['Go', 'Python', 'Rust', 'Swift'])
  })

  it('Scores_65_and_is_a_machine', () => {
    const points = Object.fromEntries(Object.entries(score.parts).map(([k, p]) => [k, p.points]))
    expect(points).toEqual({ output: 20, projects: 9, languages: 20, time: 16 })
    expect(score.total).toBe(65)
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
    expect(score.parts.time.points).toBe(16)
  })
})
