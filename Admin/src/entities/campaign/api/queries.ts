import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createCampaign, listCampaigns, removeCampaign, updateCampaign } from './campaign'
import type { Campaign, CampaignInput } from '../model/types'

export const campaignKeys = {
  list: ['campaigns'] as const,
}

export function useCampaigns() {
  return useQuery({
    queryKey: campaignKeys.list,
    queryFn: async () => (await listCampaigns()).data,
    staleTime: 5 * 60_000,
  })
}

export function useCreateCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CampaignInput) => createCampaign(input),
    onSuccess: (response) => {
      const created = response.data
      if (created?.id == null) {
        queryClient.invalidateQueries({ queryKey: campaignKeys.list })
        return
      }
      queryClient.setQueryData<Campaign[]>(campaignKeys.list, (list) => (list ? [...list, created] : list))
    },
  })
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: CampaignInput }) => updateCampaign(id, input),
    onSuccess: (_response, { id, input }) => {
      queryClient.setQueryData<Campaign[]>(campaignKeys.list, (list) =>
        list?.map((item) => (item.id === id ? { ...item, ...input } : item)),
      )
    },
  })
}

export function useRemoveCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => removeCampaign(id),
    onSuccess: (_response, id) => {
      queryClient.setQueryData<Campaign[]>(campaignKeys.list, (list) => list?.filter((item) => item.id !== id))
    },
  })
}
