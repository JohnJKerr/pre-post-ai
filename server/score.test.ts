import { describe, expect, it } from 'vitest'
import { scoreShift, type ScoreSide } from './score'
import { languageShares, USED_THRESHOLD } from './metrics'
import type { RepoActivity } from './types'

const GivenAWindowSummary = (overrides: Partial<ScoreSide> = {}): ScoreSide => ({
  added: 10_000,
  projectCount: 4,
  usedLanguages: ['TypeScript'],
  outOfHours: 0.2,
  ...overrides,
})

describe('WhenScoringTheShift', () => {
  it('Sample_developer_scores_78_and_built_a_software_factory', () => {
    const pre = GivenAWindowSummary({ added: 40_459, projectCount: 5, usedLanguages: ['C#', 'TypeScript', 'Shell', 'JavaScript', 'SQL'], outOfHours: 0.122 })
    const post = GivenAWindowSummary({
      added: 226_832,
      projectCount: 12,
      usedLanguages: ['TypeScript', 'C#', 'Python', 'Go', 'Rust', 'Swift', 'SQL', 'Shell'],
      outOfHours: 0.546,
    })
    const shift = scoreShift(pre, post)
    expect(shift.parts).toEqual({ output: 34, projects: 9, languages: 10, hours: 25 })
    expect(shift.score).toBe(78)
    expect(shift.verdict).toBe('I built a software factory')
    expect(shift.tag).toBe('and it runs nights and weekends')
  })

  it('No_growth_scores_0_and_lands_on_still_hand_crafting', () => {
    const side = GivenAWindowSummary()
    const shift = scoreShift(side, side)
    expect(shift.score).toBe(0)
    expect(shift.verdict).toBe("I'm still hand-crafting")
    expect(shift.tag).toBe('and I still clock off on time')
  })

  it('Each_part_caps_at_its_maximum', () => {
    const pre = GivenAWindowSummary({ added: 1, projectCount: 1, usedLanguages: [], outOfHours: 0 })
    const post = GivenAWindowSummary({ added: 1_000_000, projectCount: 100, usedLanguages: ['A', 'B', 'C', 'D', 'E', 'F'], outOfHours: 1 })
    const shift = scoreShift(pre, post)
    expect(shift.parts).toEqual({ output: 45, projects: 15, languages: 10, hours: 30 })
    expect(shift.score).toBe(100)
    expect(shift.verdict).toBe('I run a lights-out factory')
  })

  it('An_out_of_hours_drop_of_10_points_gives_I_got_my_evenings_back', () => {
    const shift = scoreShift(GivenAWindowSummary({ outOfHours: 0.3 }), GivenAWindowSummary({ outOfHours: 0.2 }))
    expect(shift.hoursShift).toBeCloseTo(-10)
    expect(shift.parts.hours).toBe(6)
    expect(shift.tag).toBe('and I got my evenings back')
  })

  it('A_rise_without_reaching_40_percent_still_clocks_off_on_time', () => {
    const shift = scoreShift(GivenAWindowSummary({ outOfHours: 0.1 }), GivenAWindowSummary({ outOfHours: 0.35 }))
    expect(shift.tag).toBe('and I still clock off on time')
  })

  it('No_pre_AI_activity_leaves_multipliers_undefined_and_scores_them_0', () => {
    const shift = scoreShift(GivenAWindowSummary({ added: 0, projectCount: 0, usedLanguages: [] }), GivenAWindowSummary())
    expect(shift.linesX).toBeNull()
    expect(shift.projectsX).toBeNull()
    expect(shift.parts.output).toBe(0)
    expect(shift.parts.projects).toBe(0)
  })
})

describe('WhenFindingNewLanguages', () => {
  it('A_language_under_2_percent_before_and_over_2_percent_after_counts_as_new', () => {
    const repos: RepoActivity[] = [
      { name: 'main', languages: { TypeScript: 0.99, Go: 0.01 }, share: { pre: 1, post: 0.5 }, punchCard: null, startedIn: null },
      { name: 'svc', languages: { Go: 1 }, share: { pre: 0, post: 0.5 }, punchCard: null, startedIn: 'post' },
    ]
    const used = (era: 'pre' | 'post') => languageShares(repos, era).filter((l) => l.share >= USED_THRESHOLD).map((l) => l.language)
    expect(used('pre')).toEqual(['TypeScript'])
    const shift = scoreShift(GivenAWindowSummary({ usedLanguages: used('pre') }), GivenAWindowSummary({ usedLanguages: used('post') }))
    expect(shift.newLanguages).toEqual(['Go'])
    expect(shift.parts.languages).toBe(2.5)
  })
})
