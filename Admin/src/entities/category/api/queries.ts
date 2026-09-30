import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createCategory, listCategories, removeCategory, updateCategory } from './category'
import type { Category, CategoryInput } from '../model/types'

export const categoryKeys = {
  list: ['categories'] as const,
}

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list,
    queryFn: async () => (await listCategories()).data,
    staleTime: 5 * 60_000,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CategoryInput) => createCategory(input),
    onSuccess: (response) => {
      const created = response.data
      if (created?.id == null) {
        queryClient.invalidateQueries({ queryKey: categoryKeys.list })
        return
      }
      queryClient.setQueryData<Category[]>(categoryKeys.list, (list) => (list ? [...list, created] : list))
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: CategoryInput }) => updateCategory(id, input),
    onSuccess: (_response, { id, input }) => {
      queryClient.setQueryData<Category[]>(categoryKeys.list, (list) =>
        list?.map((item) => (item.id === id ? { ...item, ...input } : item)),
      )
    },
  })
}

export function useRemoveCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => removeCategory(id),
    onSuccess: (_response, id) => {
      queryClient.setQueryData<Category[]>(categoryKeys.list, (list) => list?.filter((item) => item.id !== id))
    },
  })
}
