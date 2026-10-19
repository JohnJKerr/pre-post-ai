import { describe, expect, it } from 'vitest'
import { checkCutoff, cutoffName, DEFAULT_CUTOFF, PRESET_CUTOFFS } from './cutoffs'

// Sunday 18 Oct 2026: the week of 11–17 Oct is the last complete one
const today = new Date('2026-10-18T09:00:00Z')

describe('WhenCheckingACutoff', () => {
  it('A_cutoff_in_the_last_complete_week_is_fine', () => {
    expect(checkCutoff('2026-10-11', today)).toBeNull()
    expect(checkCutoff('2026-10-17', today)).toBeNull()
    expect(checkCutoff('2025-11-24', today)).toBeNull()
  })

  it('A_cutoff_in_the_current_week_or_later_is_too_recent', () => {
    expect(checkCutoff('2026-10-18', today)).toBe('cutoff-too-recent')
    expect(checkCutoff('2026-12-01', today)).toBe('cutoff-too-recent')
  })

  it('Anything_but_a_real_YYYY_MM_DD_date_is_invalid', () => {
    for (const bad of ['', '2026-02-30', '2026-13-01', '24/11/2025', '2025-11-24T00:00:00Z'])
      expect(checkCutoff(bad, today)).toBe('invalid-cutoff')
  })
})

describe('WhenNamingACutoff', () => {
  it('A_preset_date_is_named_after_its_release', () => {
    expect(cutoffName('2025-11-24')).toBe('Claude Opus 4.5')
    expect(cutoffName('2022-11-30')).toBe('ChatGPT launch')
  })

  it('Any_other_date_has_no_name', () => {
    expect(cutoffName('2026-07-01')).toBeNull()
  })

  it('Each_preset_date_has_one_name_and_the_default_is_offered', () => {
    expect(new Set(PRESET_CUTOFFS.map((c) => c.date)).size).toBe(PRESET_CUTOFFS.length)
    expect(PRESET_CUTOFFS).toContainEqual(DEFAULT_CUTOFF)
  })
})
