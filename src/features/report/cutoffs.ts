// Cut-offs offered in the selector. Only the date goes to the API, which names it.
import type { Cutoff } from '../../api/contract'

export const PRESET_CUTOFFS: Cutoff[] = [
  { label: 'Claude Opus 4.5', date: '2025-11-24' },
  { label: 'ChatGPT launch', date: '2022-11-30' },
]
