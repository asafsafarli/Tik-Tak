import { useEffect, useMemo, useState, type ComponentProps } from 'react'
import { Popover } from 'radix-ui'
import { ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import type { Category } from '@/entities/category'
import { useCategories } from '@/entities/category'
import { CategoryFormDialog } from '@/features/categories/upsert'
import { DeleteCategoryDialog } from '@/features/categories/delete'
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
import { useDebouncedValue } from '@/shared/lib/use-debounced-value'

const PAGE_SIZE = 5

type FilterColumn = 'name' | 'description'

export function CategoriesList() {
  const { data: categories, isLoading, isError } = useCategories()
  const { debouncedSearch } = useSearch()

  const [formCategory, setFormCategory] = useState<Category | undefined>(undefined)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null)
  const [columnFilters, setColumnFilters] = useState<Partial<Record<FilterColumn, string>>>({})
  const filters = useDebouncedValue(columnFilters)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const search = debouncedSearch.trim().toLowerCase()
    const nameFilter = filters.name?.trim().toLowerCase()
    const descriptionFilter = filters.description?.trim().toLowerCase()

    return (categories ?? []).filter((category) => {
      if (search && !category.name.toLowerCase().includes(search)) return false
      if (nameFilter && !category.name.toLowerCase().includes(nameFilter)) return false
      if (
        descriptionFilter &&
        !(category.description ?? '').toLowerCase().includes(descriptionFilter)
      ) {
        return false
      }
      return true
    })
  }, [categories, debouncedSearch, filters])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount))
  }, [pageCount])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, filters])

  const startIndex = (page - 1) * PAGE_SIZE
  const pageItems = filtered.slice(startIndex, startIndex + PAGE_SIZE)
  const fillerRows = pageCount > 1 ? PAGE_SIZE - pageItems.length : 0

  function openCreateDialog() {
    setFormCategory(undefined)
    setIsFormOpen(true)
  }

  function openEditDialog(category: Category) {
    setFormCategory(category)
    setIsFormOpen(true)
  }

  const rangeLabel =
    filtered.length === 0
      ? '0 nəticə'
      : `${startIndex + 1}-${Math.min(startIndex + PAGE_SIZE, filtered.length)} / ${filtered.length} nəticə`

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EDEEF2] pb-4">
        <h1 className="text-[20px] leading-[100%] font-semibold text-[#2B3043] sm:text-[22px]">Kateqoriyalar</h1>
        <Button
          onClick={openCreateDialog}
          className="h-9 gap-1.5 rounded-[8px] px-3.5 text-[14px] font-semibold text-white hover:opacity-90"
          style={{ backgroundColor: '#92D871' }}
        >
          <Plus className="size-4" />
          Yeni Kateqoriya
        </Button>
      </div>

      {isLoading && <StatsLoader />}
      {isError && <p className="text-sm text-red-600">Kateqoriyalar yüklənə bilmədi.</p>}

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
                  <div className="flex items-center gap-1.5">
                    <span>Ad</span>
                    <ColumnSearch
                      column="name"
                      value={columnFilters.name ?? ''}
                      onChange={(next) => setColumnFilters((prev) => ({ ...prev, name: next }))}
                    />
                  </div>
                </TableHead>
                <TableHead className={cn("px-3 py-3 text-[13px] leading-[100%] font-normal text-neutral-500", COL.lg)}>
                  <div className="flex items-center gap-1.5">
                    <span>Açıqlama</span>
                    <ColumnSearch
                      column="description"
                      value={columnFilters.description ?? ''}
                      onChange={(next) =>
                        setColumnFilters((prev) => ({ ...prev, description: next }))
                      }
                    />
                  </div>
                </TableHead>
                <TableHead className={cn("px-3 py-3 text-[13px] leading-[100%] font-normal text-neutral-500", COL.md)}>
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
                  <TableCell colSpan={6} className="px-3 py-10 text-center text-sm text-neutral-500">
                    Heç bir kateqoriya tapılmadı.
                  </TableCell>
                </TableRow>
              )}

              {pageItems.map((category, index) => (
                <TableRow key={category.id} className="border-neutral-100">
                  <TableCell className={cn("px-3 py-2.5 text-[14px] leading-[100%] font-light text-[#2B3043]", COL.sm)}>
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell className="px-3 py-2">
                    {category.img_url ? (
                      <img
                        src={category.img_url}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        width={36}
                        height={36}
                        className="size-9 rounded-[8px] object-cover"
                      />
                    ) : (
                      <div className="size-9 rounded-[8px] bg-neutral-100" aria-hidden />
                    )}
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate px-3 py-2.5 text-[14px] leading-[100%] font-medium text-[#2B3043]">
                    {category.name}
                  </TableCell>
                  <TableCell className={cn("w-[320px] px-3 py-2.5 text-[14px] leading-[1.45] font-light whitespace-normal text-[#2B3043]", COL.lg)}>
                    <span className="line-clamp-2">{category.description}</span>
                  </TableCell>
                  <TableCell className={cn("px-3 py-2.5 text-[14px] leading-[100%] font-light whitespace-nowrap text-[#2B3043]", COL.md)}>
                    {formatDate(category.created_at)}
                  </TableCell>
                  <TableCell className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <button
                        aria-label="Düzəlt"
                        type="button"
                        onClick={() => openEditDialog(category)}
                        className="inline-flex items-center gap-1.5 text-[14px] leading-[100%] font-light text-[#2B3043] hover:text-neutral-900"
                      >
                        <Pencil className="size-4 text-[#9AA0AC]" />
                        <span className={ACTION_LABEL}>Düzəlt</span>
                      </button>
                      <button
                        aria-label="Sil"
                        type="button"
                        onClick={() => setDeleteCategory(category)}
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
                  <TableCell colSpan={6} aria-hidden className="h-[53px] p-0">
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

      <CategoryFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} category={formCategory} />
      <DeleteCategoryDialog
        open={deleteCategory !== null}
        onOpenChange={(open) => !open && setDeleteCategory(null)}
        category={deleteCategory}
      />
    </div>
  )
}

interface ColumnSearchProps {
  column: FilterColumn
  value: string
  onChange: (value: string) => void
}

function ColumnSearch({ column, value, onChange }: ColumnSearchProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="rounded p-0.5 hover:bg-neutral-200/60"
          aria-label={column === 'name' ? 'Adda axtar' : 'Açıqlamada axtar'}
        >
          <Search className={cn('size-3.5', value.trim() ? 'text-[#6FCF54]' : 'text-[#C3C7D1]')} />
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
