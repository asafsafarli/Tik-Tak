import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { PaginatedEnvelope } from '@/shared/api/types'
import { createProduct, listProducts, removeProduct, updateProduct } from './product'
import type { Product, ProductCategory, ProductInput, ProductListParams } from '../model/types'

export const productKeys = {
  all: ['products'] as const,
  list: (params: ProductListParams = {}) => ['products', params] as const,
}

export function useProducts(params: ProductListParams = {}) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => listProducts(params),
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ProductInput) => createProduct(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: ProductInput }) => updateProduct(id, input),
    onSuccess: (_response, { id, input }) => {
      const categories = queryClient.getQueryData<ProductCategory[]>(['categories'])
      const { category_id, ...fields } = input

      queryClient.setQueriesData<PaginatedEnvelope<Product>>({ queryKey: productKeys.all }, (page) =>
        page
          ? {
              ...page,
              data: page.data.map((product) =>
                product.id === id
                  ? {
                      ...product,
                      ...fields,
                      img_url: fields.img_url ?? null,
                      category:
                        categories?.find((category) => category.id === category_id) ??
                        (product.category.id === category_id
                          ? product.category
                          : { ...product.category, id: category_id }),
                    }
                  : product,
              ),
            }
          : page,
      )
    },
  })
}

export function useRemoveProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => removeProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  })
}
