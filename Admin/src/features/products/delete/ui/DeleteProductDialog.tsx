import { useState } from 'react'
import { AlertDialog as AlertDialogPrimitive } from 'radix-ui'
import type { Product } from '@/entities/product'
import { useRemoveProduct } from '@/entities/product'
import { ApiError } from '@/shared/api/client'
import { useToast } from '@/shared/ui/toast'
import deleteIllustration from '@/shared/assets/delete.webp'

interface DeleteProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
}

export function DeleteProductDialog({ open, onOpenChange, product }: DeleteProductDialogProps) {
  const removeProduct = useRemoveProduct()
  const toast = useToast()
  const [error, setError] = useState<string | null>(null)

  async function handleConfirm() {
    if (!product) return
    setError(null)
    try {
      await removeProduct.mutateAsync(product.id)
      toast({ title: 'Məhsul silindi', description: `“${product.title}”` })
      onOpenChange(false)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Silinmə uğursuz oldu'
      setError(message)
      toast({ title: 'Silinmədi', description: message, variant: 'error' })
    }
  }

  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/30 duration-100 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <AlertDialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-[420px] -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-[16px] bg-white px-6 pt-6 pb-6 text-center shadow-xl outline-none duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
          <img
            src={deleteIllustration}
            alt=""
            aria-hidden
            className="size-[120px] object-contain"
          />

          <AlertDialogPrimitive.Title className="mt-3 text-[18px] leading-[130%] font-semibold text-[#2B3043]">
            Məlumatı silməyə əminsinizmi?
          </AlertDialogPrimitive.Title>

          <AlertDialogPrimitive.Description className="mt-1.5 text-[13px] text-neutral-500">
            {product?.title
              ? `"${product.title}" məhsulu həmişəlik silinəcək.`
              : 'Bu əməliyyat geri qaytarıla bilməz.'}
          </AlertDialogPrimitive.Description>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <div className="mt-6 grid w-full grid-cols-2 gap-3">
            <AlertDialogPrimitive.Action
              onClick={(event) => {
                event.preventDefault()
                handleConfirm()
              }}
              disabled={removeProduct.isPending}
              className="h-11 rounded-[10px] text-[15px] font-semibold leading-[100%] text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: '#92D871' }}
            >
              {removeProduct.isPending ? 'Silinir...' : 'Təsdiqlə'}
            </AlertDialogPrimitive.Action>
            <AlertDialogPrimitive.Cancel className="h-11 rounded-[10px] border border-[#E6E8EE] bg-white text-[15px] font-semibold leading-[100%] text-neutral-500 transition-colors hover:bg-neutral-50">
              İndi yox
            </AlertDialogPrimitive.Cancel>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  )
}
