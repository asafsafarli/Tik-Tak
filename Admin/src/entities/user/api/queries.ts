import { useQuery } from '@tanstack/react-query'
import { listUsers } from './user'

export const userKeys = {
  list: ['users'] as const,
}

export function useUsers() {
  return useQuery({
    queryKey: userKeys.list,
    queryFn: async () => (await listUsers()).data,
    staleTime: 5 * 60_000,
  })
}
