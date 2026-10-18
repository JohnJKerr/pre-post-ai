// Client for the API (contract in ./contract.ts). With mocking on, MSW serves these
// endpoints (see src/mocks).
import { API_URL } from './config'
import type { ApiErrorBody, Generation, Report } from './contract'

export class ApiError extends Error {
  readonly status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

// plain GETs, no credentials: the only kind the API's CORS policy allows
async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { headers: { Accept: 'application/json' } })
  if (!res.ok) {
    const body: ApiErrorBody | null = await res.json().catch(() => null)
    throw new ApiError(res.status, body?.message ?? res.statusText)
  }
  return res.json()
}

export const reportsApi = {
  byHandle: (handle: string) => get<Report>(`/reports/${encodeURIComponent(handle)}`),
  sample: () => get<Report>('/sample-report'),
}

export const generationsApi = {
  byId: (id: string) => get<Generation>(`/generations/${encodeURIComponent(id)}`),
}

export const authApi = {
  /** A full-page navigation: GitHub authorises the app, then the API starts the report and sends the user to /generating. */
  signInUrl: (cutoff?: string) => `${API_URL}/auth/sign-in${cutoff ? `?${new URLSearchParams({ cutoff })}` : ''}`,
}

export const isStatus = (error: unknown, status: number) => error instanceof ApiError && error.status === status
