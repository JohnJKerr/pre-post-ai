import { describe, expect, it } from 'vitest'
import { checkCutoff } from './cutoffs'

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
