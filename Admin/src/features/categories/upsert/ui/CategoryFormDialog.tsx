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
  'h-[56px] w-full rounded-[10px] border-0 bg-[#F4F4F9] px-4 text-[18px] font-light text-[#2B3043] outline-none transition-shadow placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-[#92D871]/50'

const labelClass = 'text-[22px] font-normal leading-[100%] text-[#2B3043]'

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
        className="flex w-[calc(100%-2rem)] max-w-[665px] flex-col gap-0 rounded-[10px] bg-white p-[50px] pb-[43px] ring-0 shadow-xl sm:max-w-[665px] lg:min-h-[640px]"
      >
        <DialogTitle className="sr-only">
          {isEditMode ? 'Kateqoriyanı düzəlt' : 'Kateqoriya yarat'}
        </DialogTitle>

        <DialogClose className="absolute top-6 right-6 text-[#1A1D28] transition-opacity hover:opacity-60">
          <XIcon className="size-4" />
          <span className="sr-only">Bağla</span>
        </DialogClose>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-2.5">
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

          <div className="flex flex-col gap-2.5">
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

          <div className="flex flex-col gap-2.5">
            <label htmlFor="category-description" className={labelClass}>
              Açıqlama
            </label>
            <textarea
              id="category-description"
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className={`${fieldClass} h-auto min-h-[170px] resize-none py-3`}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-auto h-[60px] w-full rounded-[10px] bg-[#92D871] text-center text-[22px] font-bold leading-[100%] text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isSubmitting
              ? 'Yadda saxlanılır...'
              : isEditMode
                ? 'Məlumatları yenilə'
                : 'Məlumatları yarat'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
