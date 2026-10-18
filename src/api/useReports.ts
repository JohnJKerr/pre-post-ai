import { useQuery, useQueryClient } from '@tanstack/react-query'
import { generationsApi, reportsApi } from './reports'

export const reportKeys = {
  byHandle: (handle: string) => ['reports', handle.toLowerCase()] as const,
  sample: ['reports', 'sample'] as const,
}
export const generationKey = (id: string) => ['generations', id] as const

export const useReport = (handle: string) =>
  useQuery({
    queryKey: reportKeys.byHandle(handle),
    queryFn: () => reportsApi.byHandle(handle),
    staleTime: 5 * 60_000,
  })

export const useSampleReport = () =>
  useQuery({ queryKey: reportKeys.sample, queryFn: reportsApi.sample, staleTime: Infinity })

/** Polls a generation every 2 s until it settles. */
export function useGeneration(id: string) {
  const client = useQueryClient()
  return useQuery({
    queryKey: generationKey(id),
    queryFn: async () => {
      const generation = await generationsApi.byId(id)
      // the new report replaces any older one this browser has cached
      if (generation.status === 'ready' && generation.handle) client.removeQueries({ queryKey: reportKeys.byHandle(generation.handle) })
      return generation
    },
    refetchInterval: (query) => (query.state.data?.status === 'pending' ? 2000 : false),
    refetchIntervalInBackground: true,
  })
}
