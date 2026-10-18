// Client for the API (contract in ./contract.ts). With mocking on, MSW serves these
// endpoints (see src/mocks).
import { API_URL } from './config'
import type { ApiErrorBody, GenerateReportRequest, Report, Session } from './contract'

export class ApiError extends Error {
  readonly status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    // the API is on another subdomain in production; its session cookie must still go
    credentials: 'include',
    // Content-Type only with a body: cross-origin, it makes the browser preflight the request
    headers: { Accept: 'application/json', ...(init?.body ? { 'Content-Type': 'application/json' } : {}), ...init?.headers },
  })
  if (!res.ok) {
    const body: ApiErrorBody | null = await res.json().catch(() => null)
    throw new ApiError(res.status, body?.message ?? res.statusText)
  }
  return res.status === 204 ? (undefined as T) : res.json()
}

export const reportsApi = {
  /** Generates and saves the signed-in user's report. */
  generate: (body: GenerateReportRequest) => request<Report>('/reports', { method: 'POST', body: JSON.stringify(body) }),
  byHandle: (handle: string) => request<Report>(`/reports/${encodeURIComponent(handle)}`),
  sample: () => request<Report>('/sample-report'),
}

export const authApi = {
  /** The signed-in user, or null when signed out. */
  session: () => request<Session>('/session').catch((e) => (isStatus(e, 401) ? null : Promise.reject(e))),
  signOut: () => request<void>('/auth/sign-out', { method: 'POST' }),
  /** A full-page navigation: GitHub authorises the app, then the API sends the user to returnPath. */
  signInUrl: (returnPath: string) => `${API_URL}/auth/sign-in?${new URLSearchParams({ returnUrl: returnPath })}`,
}

export const isStatus = (error: unknown, status: number) => error instanceof ApiError && error.status === status
