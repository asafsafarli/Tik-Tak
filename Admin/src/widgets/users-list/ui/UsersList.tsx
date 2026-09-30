import { useEffect, useMemo, useState, type ComponentProps } from 'react'
import { Popover } from 'radix-ui'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Eye,
  LayoutGrid,
  ListFilter,
  Phone,
} from 'lucide-react'
import type { AdminUser } from '@/entities/user'
import { useUsers } from '@/entities/user'
import { UserDetailDialog } from '@/features/users/detail'
import { useSearch } from '@/shared/lib/search-context'
import { cn } from '@/shared/lib/utils'
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

type TextColumn = 'fullName' | 'phone' | 'address'
type SortKey = 'fullName' | 'phone'
type SortDir = 'asc' | 'desc'

function textValue(user: AdminUser, column: TextColumn): string {
  switch (column) {
    case 'fullName':
      return user.full_name
    case 'phone':
      return user.phone
    case 'address':
      return user.address ?? ''
  }
}

export function UsersList() {
  const { data: users, isLoading, isError } = useUsers()
  const { debouncedSearch } = useSearch()

  const [textFilters, setTextFilters] = useState<Partial<Record<TextColumn, string>>>({})
  const filters = useDebouncedValue(textFilters)
  const [roleFilter, setRoleFilter] = useState<Set<string>>(new Set())
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir } | null>(null)
  const [page, setPage] = useState(1)
  const [detailUser, setDetailUser] = useState<AdminUser | null>(null)

  const rows = useMemo(() => users ?? [], [users])
  const roles = useMemo(
    () => [...new Set(rows.map((user) => user.role))].sort((a, b) => a.localeCompare(b)),
    [rows],
  )

  const filtered = useMemo(() => {
    const search = debouncedSearch.trim().toLowerCase()
    return rows.filter((user) => {
      if (search && !user.full_name.toLowerCase().includes(search)) return false
      if (roleFilter.size > 0 && !roleFilter.has(user.role)) return false
      for (const column of ['fullName', 'phone', 'address'] as TextColumn[]) {
        const value = filters[column]?.trim().toLowerCase()
        if (value && !textValue(user, column).toLowerCase().includes(value)) return false
      }
      return true
    })
  }, [rows, debouncedSearch, roleFilter, filters])

  const sorted = useMemo(() => {
    if (!sort) return filtered
    const factor = sort.dir === 'asc' ? 1 : -1
    const { key } = sort
    return [...filtered].sort((a, b) => {
      const left = key === 'fullName' ? a.full_name : a.phone
      const right = key === 'fullName' ? b.full_name : b.phone
      return left.localeCompare(right, 'az') * factor
    })
  }, [filtered, sort])

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount))
  }, [pageCount])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, roleFilter, filters])

  const startIndex = (page - 1) * PAGE_SIZE
  const pageItems = sorted.slice(startIndex, startIndex + PAGE_SIZE)
  const fillerRows = pageCount > 1 ? PAGE_SIZE - pageItems.length : 0

  function toggleSort(key: SortKey) {
    setSort((current) => {
      if (!current || current.key !== key) return { key, dir: 'asc' }
      if (current.dir === 'asc') return { key, dir: 'desc' }
      return null
    })
  }

  function toggleRole(role: string) {
    setRoleFilter((current) => {
      const next = new Set(current)
      if (next.has(role)) next.delete(role)
      else next.add(role)
      return next
    })
  }

  const rangeLabel =
    sorted.length === 0
      ? '0 nəticə'
      : `${startIndex + 1}-${Math.min(startIndex + PAGE_SIZE, sorted.length)} / ${sorted.length} nəticə`

  return (
    <div className="flex flex-col gap-4">
      <div className="border-b border-[#EDEEF2] pb-4">
        <h1 className="text-[20px] leading-[100%] font-semibold text-[#2B3043] sm:text-[22px]">İstifadəçilər</h1>
      </div>

      {isLoading && <StatsLoader />}
      {isError && <p className="text-sm text-red-600">İstifadəçilər yüklənə bilmədi.</p>}

      {!isLoading && !isError && (
        <>
          <Table>
            <TableHeader>
              <TableRow className="border-none bg-[#F7F7FA] hover:bg-[#F7F7FA]">
                <TableHead className={cn("rounded-l-lg px-3 py-3 text-[13px] leading-[100%] font-normal text-neutral-500", COL.sm)}>
                  Sıra
                </TableHead>
                <TableHead className="px-3 py-3 text-[13px] leading-[100%] font-normal text-neutral-500">
                  Avatar
                </TableHead>
                <TableHead className="px-3 py-3 text-[13px] leading-[100%] font-normal text-neutral-500">
                  <div className="flex items-center gap-1.5">
                    <span>Ad Soyad</span>
                    <SortIcon active={sort?.key === 'fullName'} onClick={() => toggleSort('fullName')} />
                    <TextFilter
                      value={textFilters.fullName ?? ''}
                      onChange={(next) => setTextFilters((prev) => ({ ...prev, fullName: next }))}
                    />
                  </div>
                </TableHead>
                <TableHead className={cn("px-3 py-3 text-[13px] leading-[100%] font-normal text-neutral-500", COL.md)}>
                  <div className="flex items-center gap-1.5">
                    <span>Telefon</span>
                    <SortIcon active={sort?.key === 'phone'} onClick={() => toggleSort('phone')} />
                    <TextFilter
                      value={textFilters.phone ?? ''}
                      onChange={(next) => setTextFilters((prev) => ({ ...prev, phone: next }))}
                    />
                  </div>
                </TableHead>
                <TableHead className={cn("px-3 py-3 text-[13px] leading-[100%] font-normal text-neutral-500", COL.lg)}>
                  <div className="flex items-center gap-1.5">
                    <span>Ünvan</span>
                    <TextFilter
                      value={textFilters.address ?? ''}
                      onChange={(next) => setTextFilters((prev) => ({ ...prev, address: next }))}
                    />
                  </div>
                </TableHead>
                <TableHead className={cn("px-3 py-3 text-[13px] leading-[100%] font-normal text-neutral-500", COL.sm)}>
                  <div className="flex items-center gap-1.5">
                    <span>Rol</span>
                    <Popover.Root>
                      <Popover.Trigger asChild>
                        <button
                          type="button"
                          className="rounded p-0.5 hover:bg-neutral-200/60"
                          aria-label="Rol filtri"
                        >
                          <ListFilter
                            className={cn(
                              'size-3.5',
                              roleFilter.size > 0 ? 'text-[#6FCF54]' : 'text-[#C3C7D1]',
                            )}
                          />
                        </button>
                      </Popover.Trigger>
                      <Popover.Portal>
                        <Popover.Content
                          align="start"
                          sideOffset={6}
                          className="z-50 flex w-[200px] flex-col gap-0.5 rounded-[10px] border border-[#EEF0F4] bg-white p-2 shadow-lg"
                        >
                          {roles.length === 0 && (
                            <span className="px-2 py-1.5 text-sm text-neutral-400">Rol yoxdur</span>
                          )}
                          {roles.map((role) => {
                            const checked = roleFilter.has(role)
                            return (
                              <button
                                key={role}
                                type="button"
                                onClick={() => toggleRole(role)}
                                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-[#F4F4F9]"
                              >
                                <span
                                  className={cn(
                                    'flex size-4 items-center justify-center rounded border',
                                    checked
                                      ? 'border-[#6FCF54] bg-[#6FCF54] text-white'
                                      : 'border-neutral-300',
                                  )}
                                >
                                  {checked ? <Check className="size-3" /> : null}
                                </span>
                                <span className="text-[#2B3043]">{role}</span>
                              </button>
                            )
                          })}
                          {roleFilter.size > 0 ? (
                            <button
                              type="button"
                              onClick={() => setRoleFilter(new Set())}
                              className="mt-1 px-2 py-1 text-left text-xs text-neutral-500 hover:text-neutral-800"
                            >
                              Hamısını göstər
                            </button>
                          ) : null}
                        </Popover.Content>
                      </Popover.Portal>
                    </Popover.Root>
                  </div>
                </TableHead>
                <TableHead className="rounded-r-lg px-3 py-3 text-[13px] leading-[100%] font-normal text-neutral-500">
                  <span className={ACTION_LABEL}>Əməliyyat</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.length === 0 && (
                <TableRow className="border-transparent hover:bg-transparent">
                  <TableCell colSpan={7} className="px-3 py-10 text-center text-sm text-neutral-500">
                    Heç bir istifadəçi tapılmadı.
                  </TableCell>
                </TableRow>
              )}

              {pageItems.map((user, index) => (
                <TableRow key={user.id} className="border-neutral-100">
                  <TableCell className={cn("px-3 py-2.5 text-[14px] leading-[100%] font-light text-[#2B3043]", COL.sm)}>
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell className="px-3 py-2">
                    <Avatar name={user.full_name} src={user.img_url} />
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate px-3 py-2.5 text-[14px] leading-[100%] font-light text-[#2B3043]">
                    {user.full_name}
                  </TableCell>
                  <TableCell className={cn("px-3 py-2.5 text-[14px] leading-[100%] font-light whitespace-nowrap text-[#2B3043]", COL.md)}>
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="size-3.5 text-[#9AA0AC]" />
                      {user.phone}
                    </span>
                  </TableCell>
                  <TableCell className={cn("max-w-[200px] truncate px-3 py-2.5 text-[14px] leading-[100%] font-light text-[#2B3043]", COL.lg)}>
                    {user.address?.trim() ? (
                      user.address
                    ) : (
                      <span className="text-neutral-400">Qeyd olunmayıb</span>
                    )}
                  </TableCell>
                  <TableCell className={cn("px-3 py-2", COL.sm)}>
                    <span className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#6FCF54] px-2.5 py-1 text-[13px] font-medium whitespace-nowrap text-[#5AB85A]">
                      <LayoutGrid className="size-3.5" />
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-2">
                    <button
                        aria-label="Göstər"
                      type="button"
                      onClick={() => setDetailUser(user)}
                      className="inline-flex items-center gap-1.5 text-[14px] leading-[100%] font-light text-[#2B3043] hover:text-neutral-900"
                    >
                      <Eye className="size-4 text-[#9AA0AC]" />
                      <span className={ACTION_LABEL}>Göstər</span>
                    </button>
                  </TableCell>
                </TableRow>
              ))}

              {Array.from({ length: fillerRows }).map((_, index) => (
                <TableRow
                  key={`filler-${index}`}
                  className="border-transparent hover:bg-transparent"
                >
                  <TableCell colSpan={7} aria-hidden className="h-[53px] p-0">
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

      <UserDetailDialog
        open={detailUser !== null}
        onOpenChange={(open) => !open && setDetailUser(null)}
        user={detailUser}
      />
    </div>
  )
}

function Avatar({ name, src }: { name: string; src: string | null }) {
  if (src) {
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        width={36}
        height={36}
        className="size-9 rounded-full object-cover"
      />
    )
  }
  const initial = name.trim().charAt(0).toUpperCase() || '?'
  return (
    <span className="flex size-9 items-center justify-center rounded-full bg-[#4CAF50] text-[14px] font-semibold text-white">
      {initial}
    </span>
  )
}

function SortIcon({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded p-0.5 hover:bg-neutral-200/60"
      aria-label="Sırala"
    >
      <ChevronsUpDown className={cn('size-3.5', active ? 'text-[#2B3043]' : 'text-[#C3C7D1]')} />
    </button>
  )
}

function TextFilter({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="rounded p-0.5 hover:bg-neutral-200/60"
          aria-label="Filtr"
        >
          <ListFilter className={cn('size-3.5', value.trim() ? 'text-[#6FCF54]' : 'text-[#C3C7D1]')} />
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

  const wanted = new Set<number>([1, pageCount, page - 1, page, page + 1])
  if (page <= 3) for (let i = 1; i <= 5; i += 1) wanted.add(i)
  if (page >= pageCount - 2) for (let i = pageCount - 4; i <= pageCount; i += 1) wanted.add(i)

  const visible = [...wanted].filter((value) => value >= 1 && value <= pageCount).sort((a, b) => a - b)

  const result: (number | 'ellipsis')[] = []
  let previous = 0
  for (const value of visible) {
    if (previous && value - previous > 1) result.push('ellipsis')
    result.push(value)
    previous = value
  }
  return result
}
