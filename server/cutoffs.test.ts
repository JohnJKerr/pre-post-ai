import { describe, expect, it } from 'vitest'
import { PRESET_CUTOFFS as OFFERED } from '../src/features/generate/cutoffs'
import { DEFAULT_CUTOFF, PRESET_CUTOFFS } from './cutoffs'

describe('WhenNamingPresetCutoffs', () => {
  it('The_app_offers_the_cut_offs_the_API_names', () => {
    expect(OFFERED).toEqual(PRESET_CUTOFFS)
  })

  it('Each_date_has_one_label_and_the_default_is_named', () => {
    expect(new Set(PRESET_CUTOFFS.map((c) => c.date)).size).toBe(PRESET_CUTOFFS.length)
    expect(PRESET_CUTOFFS).toContainEqual(DEFAULT_CUTOFF)
  })
})
