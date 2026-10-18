import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { GenerateReportRequest } from './contract'
import { authApi, reportsApi } from './reports'

export const reportKeys = {
  byHandle: (handle: string) => ['reports', handle.toLowerCase()] as const,
  sample: ['reports', 'sample'] as const,
}
export const sessionKey = ['session'] as const

export const useReport = (handle: string) =>
  useQuery({
    queryKey: reportKeys.byHandle(handle),
    queryFn: () => reportsApi.byHandle(handle),
    staleTime: 5 * 60_000,
  })

export const useSampleReport = () =>
  useQuery({ queryKey: reportKeys.sample, queryFn: reportsApi.sample, staleTime: Infinity })

/** Generates the signed-in user's report; their public link shows it straight away. */
export function useGenerateReport() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (body: GenerateReportRequest) => reportsApi.generate(body),
    onSuccess: (report) => client.setQueryData(reportKeys.byHandle(report.handle), report),
  })
}

/** Who is signed in: their handle, or null. */
export const useSession = () =>
  useQuery({ queryKey: sessionKey, queryFn: authApi.session, staleTime: 5 * 60_000 })

export function useSignOut() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: authApi.signOut,
    onSuccess: () => client.setQueryData(sessionKey, null),
  })
}
