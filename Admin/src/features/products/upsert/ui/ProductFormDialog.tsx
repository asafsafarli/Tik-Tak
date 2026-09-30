import { useEffect, useState, type FormEvent } from 'react'
import { XIcon } from 'lucide-react'
import { useCategories } from '@/entities/category'
import type { Product, ProductMeasure } from '@/entities/product'
import { PRODUCT_MEASURE_LABEL, PRODUCT_MEASURES, useCreateProduct, useUpdateProduct } from '@/entities/product'
import { ApiError } from '@/shared/api/client'
import { useToast } from '@/shared/ui/toast'
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/shared/ui/dialog'

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product
}

const fieldClass =
  'h-10 w-full rounded-[8px] border-0 bg-[#F4F4F9] px-3 text-[14px] font-normal text-[#2B3043] outline-none transition-shadow placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-[#92D871]/50'

const labelClass = 'text-[13px] font-medium leading-[100%] text-[#2B3043]'

export function ProductFormDialog({ open, onOpenChange, product }: ProductFormDialogProps) {
  const isEditMode = product !== undefined
  const toast = useToast()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const { data: categories } = useCategories()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [type, setType] = useState<ProductMeasure>('kg')
  const [categoryId, setCategoryId] = useState('')
  const [imgUrl, setImgUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setTitle(product?.title ?? '')
      setDescription(product?.description ?? '')
      setPrice(product?.price ?? '')
      setType(product?.type ?? 'kg')
      setCategoryId(product ? String(product.category.id) : '')
      setImgUrl(product?.img_url ?? '')
      setError(null)
    }
  }, [open, product])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (!categoryId) {
      setError('Kateqoriya seçin')
      return
    }

    const input = {
      title,
      description,
      price: price.trim(),
      type,
      category_id: Number(categoryId),
      img_url: imgUrl || undefined,
    }

    try {
      if (isEditMode) {
        await updateProduct.mutateAsync({ id: product.id, input })
        toast({ title: 'Məhsul yeniləndi', description: `“${input.title}”` })
      } else {
        await createProduct.mutateAsync(input)
        toast({ title: 'Məhsul yaradıldı', description: `“${input.title}”` })
      }
      onOpenChange(false)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Əməliyyat uğursuz oldu'
      setError(message)
      toast({ title: 'Yadda saxlanmadı', description: message, variant: 'error' })
    }
  }

  const isSubmitting = createProduct.isPending || updateProduct.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        className="flex max-h-[calc(100vh-4rem)] w-[calc(100%-2rem)] max-w-[480px] flex-col gap-0 overflow-y-auto rounded-[14px] bg-white p-6 ring-0 shadow-xl sm:max-w-[480px]"
      >
        <DialogTitle className="pr-8 text-[18px] leading-[120%] font-semibold text-[#2B3043]">
          {isEditMode ? 'Məhsulu düzəlt' : 'Məhsul yarat'}
        </DialogTitle>

        <DialogClose className="absolute top-5 right-5 rounded p-0.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-[#1A1D28]">
          <XIcon className="size-4" />
          <span className="sr-only">Bağla</span>
        </DialogClose>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="product-img" className={labelClass}>
              Şəkil ünvanı
            </label>
            <input
              id="product-img"
              value={imgUrl}
              onChange={(event) => setImgUrl(event.target.value)}
              placeholder="url"
              className={fieldClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="product-title" className={labelClass}>
              Ad
            </label>
            <input
              id="product-title"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className={fieldClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="product-description" className={labelClass}>
              Açıqlama
            </label>
            <textarea
              id="product-description"
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className={`${fieldClass} h-auto min-h-[96px] resize-none py-2.5`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="product-price" className={labelClass}>
                Qiymət
              </label>
              <input
                id="product-price"
                required
                inputMode="decimal"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="0.00"
                className={fieldClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="product-type" className={labelClass}>
                Növ
              </label>
              <select
                id="product-type"
                value={type}
                onChange={(event) => setType(event.target.value as ProductMeasure)}
                className={fieldClass}
              >
                {PRODUCT_MEASURES.map((measure) => (
                  <option key={measure} value={measure}>
                    {PRODUCT_MEASURE_LABEL[measure]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="product-category" className={labelClass}>
              Kateqoriya
            </label>
            <select
              id="product-category"
              required
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className={fieldClass}
            >
              <option value="" disabled>
                Seçin
              </option>
              {(categories ?? []).map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
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
