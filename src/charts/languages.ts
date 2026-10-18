// Colour follows the language, not its rank: each language owns a colour pair (faded for
// pre-AI, vivid for post-AI). Slot order is fixed by this list, so a language sits in the
// same place in both halves. Languages without a slot fold into Other.
import type { Era } from '../api/contract'
import type { LanguageShare } from '../api/contract'

export const LANGUAGE_COLORS: Record<string, Record<Era, string>> = {
  'C#': { pre: '#8a2f1f', post: '#d6338a' },
  TypeScript: { pre: '#1d5f96', post: '#1f6fe5' },
  Shell: { pre: '#c08a2b', post: '#e8a317' },
  JavaScript: { pre: '#5f7a12', post: '#8fae12' },
  Python: { pre: '#3d6b45', post: '#2f9e44' },
  Go: { pre: '#4f6f8a', post: '#7c4dff' },
  Rust: { pre: '#9a5b2e', post: '#e8590c' },
  Swift: { pre: '#a8443a', post: '#f03e3e' },
  Java: { pre: '#7a4a1f', post: '#b35c00' },
  Kotlin: { pre: '#6a4c93', post: '#9c36b5' },
  Ruby: { pre: '#8b1e3f', post: '#c2255c' },
  PHP: { pre: '#5b5f8a', post: '#4c6ef5' },
  'C++': { pre: '#4a6a62', post: '#0ca678' },
  C: { pre: '#5f5a52', post: '#495057' },
}

export const OTHER_COLOR: Record<Era, string> = { pre: '#b5aa96', post: '#b4b9c6' }

const ORDER = Object.keys(LANGUAGE_COLORS)
export const MAX_SLOTS = 4

export const languageColor = (era: Era, language: string) => LANGUAGE_COLORS[language]?.[era] ?? OTHER_COLOR[era]

export interface LanguageMix {
  slots: (LanguageShare & { color: string })[]
  other: { share: number; color: string; parts: LanguageShare[] }
}

/** Top used languages that own a colour, in fixed slot order, plus Other. */
export function languageMix(era: Era, shares: LanguageShare[], used: string[]): LanguageMix {
  const slotted = shares
    .filter((l) => LANGUAGE_COLORS[l.language] && used.includes(l.language))
    .slice(0, MAX_SLOTS)
    .sort((a, b) => ORDER.indexOf(a.language) - ORDER.indexOf(b.language))
  const names = new Set(slotted.map((l) => l.language))
  const rest = shares.filter((l) => !names.has(l.language))
  return {
    slots: slotted.map((l) => ({ ...l, color: LANGUAGE_COLORS[l.language][era] })),
    other: { share: rest.reduce((a, l) => a + l.share, 0), color: OTHER_COLOR[era], parts: rest },
  }
}
