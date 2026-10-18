// The handoff's sample profile: the test fixture and the mock API's sample report.
import { DEFAULT_CUTOFF } from './cutoffs'
import { generateSample, SAMPLE_HANDLE } from './sample'
import type { ProfileData } from './types'

export function sampleProfile(overrides: Partial<ProfileData> = {}): ProfileData {
  return {
    handle: SAMPLE_HANDLE,
    isSample: true,
    generatedAt: '2026-10-18T00:00:00Z',
    cutoff: DEFAULT_CUTOFF,
    ...generateSample(),
    ...overrides,
  }
}
