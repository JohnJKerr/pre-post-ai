import { describe, expect, it } from 'vitest'
import { scoreShift, type ScoreSide } from './score'
import { languageShares } from './metrics'
import type { RepoActivity } from './types'

const GivenAWindowSummary = (overrides: Partial<ScoreSide> = {}): ScoreSide => ({
  added: 10_000,
  commits: 500,
  projectCount: 4,
  languages: [{ language: 'TypeScript', share: 1 }],
  activeDays: 100,
  outOfHours: 0.2,
  ...overrides,
})

describe('WhenScoringTheShift', () => {
  it('Sample_developer_scores_69_and_is_a_machine', () => {
    const pre = GivenAWindowSummary({
      added: 40_459,
      commits: 638,
      projectCount: 5,
      languages: [{ language: 'TypeScript', share: 0.7 }],
      activeDays: 161,
      outOfHours: 0.122,
    })
    const post = GivenAWindowSummary({
      added: 226_832,
      commits: 1_604,
      projectCount: 12,
      languages: [
        { language: 'TypeScript', share: 0.4 },
        { language: 'Python', share: 0.2 },
        { language: 'Go', share: 0.15 },
        { language: 'Rust', share: 0.13 },
        { language: 'Swift', share: 0.12 },
      ],
      activeDays: 277,
      outOfHours: 0.546,
    })
    const shift = scoreShift(pre, post)
    expect(shift.parts).toEqual({ output: 20, projects: 9, languages: 20, time: 20 })
    expect(shift.score).toBe(69)
    expect(shift.verdict).toBe("I'm a machine (literally)")
  })

  it('No_growth_scores_0_and_lands_on_artisan', () => {
    const side = GivenAWindowSummary()
    const shift = scoreShift(side, side)
    expect(shift.score).toBe(0)
    expect(shift.verdict).toBe("I'm an artisan")
  })

  it('Each_part_caps_at_its_maximum', () => {
    const pre = GivenAWindowSummary({ added: 1, commits: 1, projectCount: 1, languages: [], activeDays: 1 })
    const post = GivenAWindowSummary({
      added: 1_000_000,
      commits: 1_000_000,
      projectCount: 100,
      languages: ['A', 'B', 'C', 'D', 'E', 'F'].map((language) => ({ language, share: 1 / 6 })),
      activeDays: 100,
    })
    const shift = scoreShift(pre, post)
    expect(shift.parts).toEqual({ output: 40, projects: 15, languages: 20, time: 25 })
    expect(shift.score).toBe(100)
    expect(shift.verdict).toBe('I started the robot uprising')
  })

  it('Out_of_hours_change_is_reported_but_does_not_affect_score', () => {
    const shift = scoreShift(GivenAWindowSummary({ outOfHours: 0.3 }), GivenAWindowSummary({ outOfHours: 0.2 }))
    expect(shift.hoursShift).toBeCloseTo(-10)
    expect(shift.score).toBe(0)
  })

  it('No_pre_AI_activity_leaves_multipliers_undefined_and_scores_them_0', () => {
    const shift = scoreShift(
      GivenAWindowSummary({ added: 0, commits: 0, projectCount: 0, languages: [], activeDays: 0 }),
      GivenAWindowSummary({ languages: [] }),
    )
    expect(shift.linesX).toBeNull()
    expect(shift.commitsX).toBeNull()
    expect(shift.projectsX).toBeNull()
    expect(shift.activeDaysX).toBeNull()
    expect(shift.parts).toEqual({ output: 0, projects: 0, languages: 0, time: 0 })
  })
})

describe('WhenFindingNewLanguages', () => {
  it('A_language_under_1_percent_before_and_over_5_percent_after_counts_as_new', () => {
    const repos: RepoActivity[] = [
      { name: 'main', languages: { TypeScript: 0.99, Go: 0.01 }, share: { pre: 1, post: 0.5 }, punchCard: null, startedIn: null },
      { name: 'svc', languages: { Go: 1 }, share: { pre: 0, post: 0.5 }, punchCard: null, startedIn: 'post' },
    ]
    const shift = scoreShift(
      GivenAWindowSummary({ languages: languageShares(repos, 'pre') }),
      GivenAWindowSummary({ languages: languageShares(repos, 'post') }),
    )
    expect(shift.newLanguages).toEqual(['Go'])
    expect(shift.parts.languages).toBe(5)
  })
})
