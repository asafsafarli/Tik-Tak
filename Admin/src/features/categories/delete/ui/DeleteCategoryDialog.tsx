import { useState } from 'react'
import { AlertDialog as AlertDialogPrimitive } from 'radix-ui'
import type { Category } from '@/entities/category'
import { useRemoveCategory } from '@/entities/category'
import { ApiError } from '@/shared/api/client'
import { useToast } from '@/shared/ui/toast'
import deleteIllustration from '@/shared/assets/delete.webp'

interface DeleteCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category | null
}

export function DeleteCategoryDialog({ open, onOpenChange, category }: DeleteCategoryDialogProps) {
  const removeCategory = useRemoveCategory()
  const toast = useToast()
  const [error, setError] = useState<string | null>(null)

  async function handleConfirm() {
    if (!category) return
    setError(null)
    try {
      await removeCategory.mutateAsync(category.id)
      toast({ title: 'Kateqoriya silindi', description: `“${category.name}”` })
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
            {category?.name
              ? `"${category.name}" kateqoriyası həmişəlik silinəcək.`
              : 'Bu əməliyyat geri qaytarıla bilməz.'}
          </AlertDialogPrimitive.Description>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <div className="mt-6 grid w-full grid-cols-2 gap-3">
            <AlertDialogPrimitive.Action
              onClick={(event) => {
                event.preventDefault()
                handleConfirm()
              }}
              disabled={removeCategory.isPending}
              className="h-11 rounded-[10px] text-[15px] font-semibold leading-[100%] text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: '#92D871' }}
            >
              {removeCategory.isPending ? 'Silinir...' : 'Təsdiqlə'}
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
