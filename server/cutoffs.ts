import type { Cutoff } from './types'
export const DEFAULT_CUTOFF: Cutoff = { label: 'Claude Opus 4.5', date: '2025-11-24' }

export const PRESET_CUTOFFS: Cutoff[] = [DEFAULT_CUTOFF, { label: 'ChatGPT launch', date: '2022-11-30' }]

export const sameCutoff = (a: Cutoff, b: Cutoff) => a.date === b.date
