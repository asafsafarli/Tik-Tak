import { useEffect, useState, type FormEvent } from 'react'
import { XIcon } from 'lucide-react'
import type { Category } from '@/entities/category'
import { useCreateCategory, useUpdateCategory } from '@/entities/category'
import { ApiError } from '@/shared/api/client'
import { useToast } from '@/shared/ui/toast'
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/shared/ui/dialog'

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category
}

const fieldClass =
  'h-10 w-full rounded-[8px] border-0 bg-[#F4F4F9] px-3 text-[14px] font-normal text-[#2B3043] outline-none transition-shadow placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-[#92D871]/50'

const labelClass = 'text-[13px] font-medium leading-[100%] text-[#2B3043]'

export function CategoryFormDialog({ open, onOpenChange, category }: CategoryFormDialogProps) {
  const isEditMode = category !== undefined
  const toast = useToast()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imgUrl, setImgUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setName(category?.name ?? '')
      setDescription(category?.description ?? '')
      setImgUrl(category?.img_url ?? '')
      setError(null)
    }
  }, [open, category])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    const input = { name, description, img_url: imgUrl || undefined }

    try {
      if (isEditMode) {
        await updateCategory.mutateAsync({ id: category.id, input })
        toast({ title: 'Kateqoriya yeniləndi', description: `“${input.name}”` })
      } else {
        await createCategory.mutateAsync(input)
        toast({ title: 'Kateqoriya yaradıldı', description: `“${input.name}”` })
      }
      onOpenChange(false)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Əməliyyat uğursuz oldu'
      setError(message)
      toast({ title: 'Yadda saxlanmadı', description: message, variant: 'error' })
    }
  }

  const isSubmitting = createCategory.isPending || updateCategory.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        className="flex max-h-[calc(100vh-4rem)] w-[calc(100%-2rem)] max-w-[480px] flex-col gap-0 overflow-y-auto rounded-[14px] bg-white p-6 ring-0 shadow-xl sm:max-w-[480px]"
      >
        <DialogTitle className="pr-8 text-[18px] leading-[120%] font-semibold text-[#2B3043]">
          {isEditMode ? 'Kateqoriyanı düzəlt' : 'Kateqoriya yarat'}
        </DialogTitle>

        <DialogClose className="absolute top-5 right-5 rounded p-0.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-[#1A1D28]">
          <XIcon className="size-4" />
          <span className="sr-only">Bağla</span>
        </DialogClose>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="category-img" className={labelClass}>
              Şəkil ünvanı
            </label>
            <input
              id="category-img"
              value={imgUrl}
              onChange={(event) => setImgUrl(event.target.value)}
              placeholder="url"
              className={fieldClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="category-name" className={labelClass}>
              Ad
            </label>
            <input
              id="category-name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={fieldClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="category-description" className={labelClass}>
              Açıqlama
            </label>
            <textarea
              id="category-description"
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className={`${fieldClass} h-auto min-h-[96px] resize-none py-2.5`}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="mt-2 grid grid-cols-2 gap-3">

            <DialogClose

              type="button"

              className="h-10 rounded-[8px] border border-[#E6E8EE] bg-white text-[14px] font-semibold text-neutral-500 transition-colors hover:bg-neutral-50"

            >

              Ləğv et

            </DialogClose>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded-[8px] bg-[#92D871] text-center text-[14px] font-semibold leading-[100%] text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {isSubmitting
                ? 'Yadda saxlanılır...'
                : isEditMode
                  ? 'Yadda saxla'
                  : 'Yarat'}
            </button>

          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
