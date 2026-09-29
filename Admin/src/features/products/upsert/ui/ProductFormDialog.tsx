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
  'h-[56px] w-full rounded-[10px] border-0 bg-[#F4F4F9] px-4 text-[18px] font-light text-[#2B3043] outline-none transition-shadow placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-[#92D871]/50'

const labelClass = 'text-[22px] font-normal leading-[100%] text-[#2B3043]'

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
        className="flex max-h-[calc(100vh-4rem)] w-[calc(100%-2rem)] max-w-[665px] flex-col gap-0 overflow-y-auto rounded-[10px] bg-white p-[50px] pb-[43px] ring-0 shadow-xl sm:max-w-[665px]"
      >
        <DialogTitle className="sr-only">
          {isEditMode ? 'Məhsulu düzəlt' : 'Məhsul yarat'}
        </DialogTitle>

        <DialogClose className="absolute top-6 right-6 text-[#1A1D28] transition-opacity hover:opacity-60">
          <XIcon className="size-4" />
          <span className="sr-only">Bağla</span>
        </DialogClose>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-2.5">
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

          <div className="flex flex-col gap-2.5">
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

          <div className="flex flex-col gap-2.5">
            <label htmlFor="product-description" className={labelClass}>
              Açıqlama
            </label>
            <textarea
              id="product-description"
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className={`${fieldClass} h-auto min-h-[120px] resize-none py-3`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2.5">
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

            <div className="flex flex-col gap-2.5">
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

          <div className="flex flex-col gap-2.5">
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 h-[60px] w-full rounded-[10px] bg-[#92D871] text-center text-[22px] font-bold leading-[100%] text-white transition-opacity hover:opacity-90 disabled:opacity-60"
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
