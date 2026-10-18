// Tailwind needs literal class names, so each era's classes are spelled out here.
import type { Era } from '../../api/contract'

export const eraText = {
  pre: { ink: 'text-pre-ink', muted: 'text-pre-muted' },
  post: { ink: 'text-post-ink', muted: 'text-post-muted' },
} as const

export const eraLabel: Record<Era, string> = { pre: 'Pre-AI', post: 'Post-AI' }
