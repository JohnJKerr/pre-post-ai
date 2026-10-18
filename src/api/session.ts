// Stand-in sign-in until the GitHub App exists: a cookie naming the handle, which the mock
// API reads as the signed-in user. The real API sets its own session cookie after the
// GitHub App's OAuth flow, so this file goes away.
export const SESSION_COOKIE = 'prepost_session'

export function mockSignIn(handle: string) {
  document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(handle)}; path=/; SameSite=Lax`
}

/** The signed-in handle, so a report page knows it's yours. The real API will need to expose this. */
export function mockSessionHandle(): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${SESSION_COOKIE}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

const HANDLE = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i
export const isHandle = (text: string) => HANDLE.test(text)
