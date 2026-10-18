import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { GenerateReportRequest } from './contract'
import { reportsApi } from './reports'

export const reportKeys = {
  byHandle: (handle: string) => ['reports', handle.toLowerCase()] as const,
}

export const useReport = (handle: string) =>
  useQuery({
    queryKey: reportKeys.byHandle(handle),
    queryFn: () => reportsApi.byHandle(handle),
    staleTime: 5 * 60_000,
  })

/** Generates the signed-in user's report; their public link shows it straight away. */
export function useGenerateReport() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (body: GenerateReportRequest) => reportsApi.generate(body),
    onSuccess: (report) => client.setQueryData(reportKeys.byHandle(report.handle), report),
  })
}
