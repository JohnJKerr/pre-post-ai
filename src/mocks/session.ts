// Mock sign-in: a cookie naming the handle, which the mock API reads as the signed-in user.
// The real API signs users in through GitHub and keeps its own HttpOnly session cookie.
export const SESSION_COOKIE = 'prepost_session'

export function mockSignIn(handle: string) {
  document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(handle)}; path=/; SameSite=Lax`
}

export function mockSignOut() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`
}

const HANDLE = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i
export const isHandle = (text: string) => HANDLE.test(text)
