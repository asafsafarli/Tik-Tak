import { useEffect, useMemo, useState, type ComponentProps } from 'react'
import { Popover } from 'radix-ui'
import { ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import type { Product } from '@/entities/product'
import { PRODUCT_MEASURE_LABEL, useProducts } from '@/entities/product'
import { ProductFormDialog } from '@/features/products/upsert'
import { DeleteProductDialog } from '@/features/products/delete'
import { useSearch } from '@/shared/lib/search-context'
import { formatDate } from '@/shared/lib/format-date'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  ACTION_LABEL,
  COL,
} from '@/shared/ui/table'
import { StatsLoader } from '@/shared/ui/stats-loader'

const PAGE_SIZE = 5
const MANAT = '₼'

type FilterColumn = 'name' | 'description' | 'category' | 'type'

const FILTER_COLUMNS: { key: FilterColumn; label: string }[] = [
  { key: 'name', label: 'Ad' },
  { key: 'description', label: 'Açıqlama' },
  { key: 'category', label: 'Kateqoriya' },
  { key: 'type', label: 'Növ' },
]

function columnText(product: Product, key: FilterColumn): string {
  switch (key) {
    case 'name':
      return product.title
    case 'description':
      return product.description
    case 'category':
      return product.category?.name ?? ''
    case 'type':
      return PRODUCT_MEASURE_LABEL[product.type]
  }
}

export function ProductsList() {
  const { data, isLoading, isError } = useProducts({ limit: 1000 })
  const { debouncedSearch } = useSearch()

  const [formProduct, setFormProduct] = useState<Product | undefined>(undefined)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)
  const [columnFilters, setColumnFilters] = useState<Partial<Record<FilterColumn, string>>>({})
  const [page, setPage] = useState(1)

  const products = useMemo(() => data?.data ?? [], [data])

  const filtered = useMemo(() => {
    const search = debouncedSearch.trim().toLowerCase()
    return products.filter((product) => {
      if (search && !product.title.toLowerCase().includes(search)) return false
      for (const column of FILTER_COLUMNS) {
        const value = columnFilters[column.key]?.trim().toLowerCase()
        if (value && !columnText(product, column.key).toLowerCase().includes(value)) return false
      }
      return true
    })
  }, [products, debouncedSearch, columnFilters])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount))
  }, [pageCount])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, columnFilters])

  const startIndex = (page - 1) * PAGE_SIZE
  const pageItems = filtered.slice(startIndex, startIndex + PAGE_SIZE)
  const fillerRows = pageCount > 1 ? PAGE_SIZE - pageItems.length : 0

  function openCreateDialog() {
    setFormProduct(undefined)
    setIsFormOpen(true)
  }

  function openEditDialog(product: Product) {
    setFormProduct(product)
    setIsFormOpen(true)
  }

  const rangeLabel =
    filtered.length === 0
      ? '0 nəticə'
      : `${startIndex + 1}-${Math.min(startIndex + PAGE_SIZE, filtered.length)} / ${filtered.length} nəticə`

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EDEEF2] pb-4">
        <h1 className="text-[20px] leading-[100%] font-semibold text-[#2B3043] sm:text-[22px]">Məhsullar</h1>
        <Button
          onClick={openCreateDialog}
          className="h-9 gap-1.5 rounded-[8px] px-3.5 text-[14px] font-semibold text-white hover:opacity-90"
          style={{ backgroundColor: '#92D871' }}
        >
          <Plus className="size-4" />
          Yeni Məhsul
        </Button>
      </div>

      {isLoading && <StatsLoader />}
      {isError && <p className="text-sm text-red-600">Məhsullar yüklənə bilmədi.</p>}

      {!isLoading && !isError && (
        <>
          <Table>
            <TableHeader>
              <TableRow className="border-none bg-[#F7F7FA] hover:bg-[#F7F7FA]">
                <TableHead className={cn("rounded-l-lg px-3 py-3 text-[13px] leading-[100%] font-normal text-neutral-500", COL.sm)}>
                  Sıra
                </TableHead>
                <TableHead className="px-3 py-3 text-[13px] leading-[100%] font-normal text-neutral-500">
                  Şəkil
                </TableHead>
                <TableHead className="px-3 py-3 text-[13px] leading-[100%] font-normal text-neutral-500">
                  <HeadWithSearch
                    label="Ad"
                    value={columnFilters.name ?? ''}
                    onChange={(next) => setColumnFilters((prev) => ({ ...prev, name: next }))}
                  />
                </TableHead>
                <TableHead className={cn("px-3 py-3 text-[13px] leading-[100%] font-normal text-neutral-500", COL.xl)}>
                  <HeadWithSearch
                    label="Açıqlama"
                    value={columnFilters.description ?? ''}
                    onChange={(next) =>
                      setColumnFilters((prev) => ({ ...prev, description: next }))
                    }
                  />
                </TableHead>
                <TableHead className="px-3 py-3 text-[13px] leading-[100%] font-normal text-neutral-500">
                  Qiymət
                </TableHead>
                <TableHead className={cn("px-3 py-3 text-[13px] leading-[100%] font-normal text-neutral-500", COL.lg)}>
                  <HeadWithSearch
                    label="Kateqoriya"
                    value={columnFilters.category ?? ''}
                    onChange={(next) => setColumnFilters((prev) => ({ ...prev, category: next }))}
                  />
                </TableHead>
                <TableHead className={cn("px-3 py-3 text-[13px] leading-[100%] font-normal text-neutral-500", COL.md)}>
                  <HeadWithSearch
                    label="Növ"
                    value={columnFilters.type ?? ''}
                    onChange={(next) => setColumnFilters((prev) => ({ ...prev, type: next }))}
                  />
                </TableHead>
                <TableHead className={cn("px-3 py-3 text-[13px] leading-[100%] font-normal text-neutral-500", COL.xl)}>
                  Tarix
                </TableHead>
                <TableHead className="rounded-r-lg px-3 py-3 text-[13px] leading-[100%] font-normal text-neutral-500">
                  <span className={ACTION_LABEL}>Əməliyyat</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow className="border-transparent hover:bg-transparent">
                  <TableCell colSpan={9} className="px-3 py-10 text-center text-sm text-neutral-500">
                    Heç bir məhsul tapılmadı.
                  </TableCell>
                </TableRow>
              )}

              {pageItems.map((product, index) => (
                <TableRow key={product.id} className="border-neutral-100">
                  <TableCell className={cn("px-3 py-2.5 text-[14px] leading-[100%] font-light text-[#2B3043]", COL.sm)}>
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell className="px-3 py-2">
                    {product.img_url ? (
                      <img
                        src={product.img_url}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="size-9 rounded-[8px] object-cover"
                      />
                    ) : (
                      <div className="size-9 rounded-[8px] bg-neutral-100" aria-hidden />
                    )}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate px-3 py-2.5 text-[14px] leading-[100%] font-medium text-[#2B3043]">
                    {product.title}
                  </TableCell>
                  <TableCell className={cn("w-[200px] px-3 py-2.5 text-[14px] leading-[1.4] font-light whitespace-normal text-[#2B3043]", COL.xl)}>
                    <span className="line-clamp-2">{product.description}</span>
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-[14px] leading-[100%] font-semibold whitespace-nowrap text-[#2B3043]">
                    {Number(product.price).toFixed(2)} {MANAT}
                  </TableCell>
                  <TableCell className={cn("max-w-[140px] px-3 py-2.5 text-[14px] leading-[1.4] font-light whitespace-normal text-[#2B3043]", COL.lg)}>
                    {product.category?.name}
                  </TableCell>
                  <TableCell className={cn("px-3 py-2", COL.md)}>
                    <span className="inline-flex rounded-[6px] bg-[#F1ECFB] px-2.5 py-1 text-[13px] font-medium whitespace-nowrap text-[#8B5CF6]">
                      {PRODUCT_MEASURE_LABEL[product.type]}
                    </span>
                  </TableCell>
                  <TableCell className={cn("px-3 py-2.5 text-[14px] leading-[100%] font-light whitespace-nowrap text-[#2B3043]", COL.xl)}>
                    {formatDate(product.created_at)}
                  </TableCell>
                  <TableCell className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <button
                        aria-label="Düzəlt"
                        type="button"
                        onClick={() => openEditDialog(product)}
                        className="inline-flex items-center gap-1.5 text-[14px] leading-[100%] font-light text-[#2B3043] hover:text-neutral-900"
                      >
                        <Pencil className="size-4 text-[#9AA0AC]" />
                        <span className={ACTION_LABEL}>Düzəlt</span>
                      </button>
                      <button
                        aria-label="Sil"
                        type="button"
                        onClick={() => setDeleteProduct(product)}
                        className="inline-flex items-center gap-1.5 text-[14px] leading-[100%] font-light text-[#EF4444] hover:opacity-80"
                      >
                        <Trash2 className="size-4" />
                        <span className={ACTION_LABEL}>Sil</span>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {Array.from({ length: fillerRows }).map((_, index) => (
                <TableRow
                  key={`filler-${index}`}
                  className="border-transparent hover:bg-transparent"
                >
                  <TableCell colSpan={9} aria-hidden className="h-[53px] p-0">
                    &nbsp;
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-end gap-4 pt-1 text-sm text-neutral-500">
            <span className="hidden whitespace-nowrap sm:inline">{rangeLabel}</span>
            <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
          </div>
        </>
      )}

      <ProductFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} product={formProduct} />
      <DeleteProductDialog
        open={deleteProduct !== null}
        onOpenChange={(open) => !open && setDeleteProduct(null)}
        product={deleteProduct}
      />
    </div>
  )
}

interface HeadWithSearchProps {
  label: string
  value: string
  onChange: (value: string) => void
}

function HeadWithSearch({ label, value, onChange }: HeadWithSearchProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span>{label}</span>
      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="rounded p-0.5 hover:bg-neutral-200/60"
            aria-label={`${label} üzrə axtar`}
          >
            <Search
              className={cn('size-3.5', value.trim() ? 'text-[#6FCF54]' : 'text-[#C3C7D1]')}
            />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={6}
            className="z-50 w-[220px] rounded-[10px] border border-[#EEF0F4] bg-white p-3 shadow-lg"
          >
            <input
              autoFocus
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder="Axtar..."
              className="h-9 w-full rounded-lg bg-[#F4F4F9] px-3 text-sm text-[#2B3043] outline-none"
            />
            {value.trim() ? (
              <button
                type="button"
                onClick={() => onChange('')}
                className="mt-2 text-xs text-neutral-500 hover:text-neutral-800"
              >
                Təmizlə
              </button>
            ) : null}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )
}

interface PaginationProps {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  const pages = getPageRange(page, pageCount)

  return (
    <nav className="flex items-center gap-1" aria-label="Səhifələmə">
      <PaginationButton
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Əvvəlki səhifə"
      >
        <ChevronLeft className="size-4" />
      </PaginationButton>

      {pages.map((item, index) =>
        item === 'ellipsis' ? (
          <span key={`gap-${index}`} className="px-1 text-sm text-neutral-400">
            …
          </span>
        ) : (
          <PaginationButton
            key={item}
            active={item === page}
            onClick={() => onPageChange(item)}
            aria-current={item === page ? 'page' : undefined}
          >
            {item}
          </PaginationButton>
        ),
      )}

      <PaginationButton
        disabled={page === pageCount}
        onClick={() => onPageChange(page + 1)}
        aria-label="Növbəti səhifə"
      >
        <ChevronRight className="size-4" />
      </PaginationButton>
    </nav>
  )
}

function PaginationButton({
  active = false,
  className,
  ...props
}: ComponentProps<'button'> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        'flex h-7 min-w-7 items-center justify-center rounded-lg px-1.5 text-[13px] sm:h-8 sm:min-w-8 sm:px-2 sm:text-sm font-light transition-colors disabled:cursor-not-allowed disabled:opacity-40',
        active ? 'font-normal text-white' : 'text-[#2B3043] hover:bg-neutral-100',
        className,
      )}
      style={active ? { backgroundColor: '#92D871' } : undefined}
      {...props}
    />
  )
}

function getPageRange(page: number, pageCount: number): (number | 'ellipsis')[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1)
  }

  const range: (number | 'ellipsis')[] = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(pageCount - 1, page + 1)

  if (start > 2) range.push('ellipsis')
  for (let current = start; current <= end; current += 1) range.push(current)
  if (end < pageCount - 1) range.push('ellipsis')

  range.push(pageCount)
  return range
}
