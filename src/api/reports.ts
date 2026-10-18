// Client for the reports API (contract in ./contract.ts). Until the API exists, MSW serves
// these endpoints (see src/mocks).
import type { ApiErrorBody, GenerateReportRequest, Report } from './contract'

/** The back end seeds a public demo report under this handle. */
export const SAMPLE_HANDLE = 'sam-builds'

export class ApiError extends Error {
  readonly status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    credentials: 'same-origin',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!res.ok) {
    const body: ApiErrorBody | null = await res.json().catch(() => null)
    throw new ApiError(res.status, body?.message ?? res.statusText)
  }
  return res.json()
}

export const reportsApi = {
  /** Generates and saves the signed-in user's report. */
  generate: (body: GenerateReportRequest) => request<Report>('/reports', { method: 'POST', body: JSON.stringify(body) }),
  byHandle: (handle: string) => request<Report>(`/reports/${encodeURIComponent(handle)}`),
}

export const isStatus = (error: unknown, status: number) => error instanceof ApiError && error.status === status
