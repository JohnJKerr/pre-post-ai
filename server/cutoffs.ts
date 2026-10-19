import type { Cutoff } from './types'
export const DEFAULT_CUTOFF: Cutoff = { label: 'Claude Opus 4.5', date: '2025-11-24' }

// Major frontier model releases, newest first. One label per date: the date names the cut-off.
export const PRESET_CUTOFFS: Cutoff[] = [
  { label: 'GPT-5.5', date: '2026-04-23' },
  { label: 'Claude Opus 4.7', date: '2026-04-16' },
  { label: 'GPT-5.4', date: '2026-03-05' },
  { label: 'Gemini 3.1 Pro', date: '2026-02-19' },
  { label: 'Claude Opus 4.6', date: '2026-02-05' },
  { label: 'GPT-5.2', date: '2025-12-11' },
  DEFAULT_CUTOFF,
  { label: 'Gemini 3 Pro', date: '2025-11-18' },
  { label: 'Claude Sonnet 4.5', date: '2025-09-29' },
  { label: 'GPT-5', date: '2025-08-07' },
  { label: 'Claude 4', date: '2025-05-22' },
  { label: 'Gemini 2.5 Pro', date: '2025-03-25' },
  { label: 'Claude 3.7 Sonnet', date: '2025-02-24' },
  { label: 'DeepSeek R1', date: '2025-01-20' },
  { label: 'OpenAI o1', date: '2024-09-12' },
  { label: 'Claude 3.5 Sonnet', date: '2024-06-20' },
  { label: 'GPT-4o', date: '2024-05-13' },
  { label: 'Claude 3', date: '2024-03-04' },
  { label: 'Gemini 1.0', date: '2023-12-06' },
  { label: 'Claude 2', date: '2023-07-11' },
  { label: 'GPT-4', date: '2023-03-14' },
  { label: 'ChatGPT launch', date: '2022-11-30' },
]

export const sameCutoff = (a: Cutoff, b: Cutoff) => a.date === b.date
