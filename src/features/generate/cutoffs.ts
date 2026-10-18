// Cut-offs offered in the selector. Only the date goes to the API, which names it.
import type { Cutoff, SignInError } from '../../api/contract'

export const PRESET_CUTOFFS: Cutoff[] = [
  { label: 'Claude Opus 4.5', date: '2025-11-24' },
  { label: 'ChatGPT launch', date: '2022-11-30' },
]
export const DEFAULT_CUTOFF = PRESET_CUTOFFS[0]!

export const SIGN_IN_ERRORS: Record<SignInError, string> = {
  'invalid-cutoff': 'That isn’t a valid date. Use YYYY-MM-DD.',
  'cutoff-too-recent': 'Pick a cut-off at least one full week ago, so there’s a week to compare.',
}

export const isSignInError = (code: string | null): code is SignInError => !!code && code in SIGN_IN_ERRORS

const DAY = 86_400_000
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/
/** The Sunday starting the week that holds `date`, in UTC days since the epoch: how the API buckets weeks. */
const weekStart = (date: Date) => Math.floor(date.getTime() / DAY) - date.getUTCDay()

/** The API's own checks, so a bad cut-off doesn't cost a round trip. */
export function checkCutoff(date: string, today = new Date()): SignInError | null {
  const d = new Date(`${date}T00:00:00Z`)
  if (!ISO_DAY.test(date) || Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== date) return 'invalid-cutoff'
  // the post window needs at least one complete week: the cut-off week must have ended
  return weekStart(d) < weekStart(today) ? null : 'cutoff-too-recent'
}

// The API sends people to /generating with only an id, so "Sign in again" there reuses
// the cut-off they last chose in this tab.
const LAST = 'prepost:cutoff'
export function rememberCutoff(date: string) {
  try {
    sessionStorage.setItem(LAST, date)
  } catch {
    // storage blocked: "Sign in again" falls back to the default
  }
}
export function lastCutoff() {
  try {
    return sessionStorage.getItem(LAST) ?? undefined
  } catch {
    return undefined
  }
}
