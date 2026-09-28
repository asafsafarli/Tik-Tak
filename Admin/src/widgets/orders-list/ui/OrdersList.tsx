import { useEffect, useMemo, useState, type ComponentProps } from 'react'
import { Popover } from 'radix-ui'
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  CircleCheck,
  CircleDollarSign,
  CircleX,
  Clock,
  Eye,
  ListFilter,
  ShoppingCart,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import type { Order, OrderStatus } from '@/entities/order'
import {
  ORDER_STATUSES,
  ORDER_STATUS_META,
  computeOrderStats,
  useOrders,
} from '@/entities/order'
import { OrderDetailDialog } from '@/features/orders/detail'
import { useSearch } from '@/shared/lib/search-context'
import { formatDayMonth } from '@/shared/lib/format-date'
import { cn } from '@/shared/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'

const MANAT = '₼'
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50]

type TextColumn = 'orderNumber' | 'createdAt' | 'address' | 'itemCount' | 'subtotal'
type SortKey = TextColumn | 'status'
type SortDir = 'asc' | 'desc'

const TEXT_COLUMNS: { key: TextColumn; label: string }[] = [
  { key: 'orderNumber', label: 'No' },
  { key: 'createdAt', label: 'Tarix' },
  { key: 'address', label: 'Çatdırılma ünvanı' },
  { key: 'itemCount', label: 'Məhsul sayı' },
  { key: 'subtotal', label: 'Subtotal/Çatdırılma' },
]

interface OrderRow {
  order: Order
  itemCount: number
  subtotal: number
  deliveryFee: number
}

export function OrdersList() {
  const { data: orders, isLoading, isError } = useOrders()
  const { debouncedSearch } = useSearch()

  const [statusFilter, setStatusFilter] = useState<Set<OrderStatus>>(new Set())
  const [columnFilters, setColumnFilters] = useState<Partial<Record<TextColumn, string>>>({})
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir } | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])
  const [detailOrder, setDetailOrder] = useState<Order | null>(null)

  const stats = useMemo(() => computeOrderStats(orders ?? []), [orders])

  const rows = useMemo<OrderRow[]>(
    () =>
      (orders ?? []).map((order) => {
        const deliveryFee = Number(order.deliveryFee)
        return {
          order,
          deliveryFee,
          itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
          subtotal: Number(order.total) - deliveryFee,
        }
      }),
    [orders],
  )

  const filtered = useMemo(() => {
    const search = debouncedSearch.trim().toLowerCase()
    return rows.filter((row) => {
      if (search) {
        const haystack =
          `${row.order.orderNumber} ${row.order.address} ${row.order.user.full_name}`.toLowerCase()
        if (!haystack.includes(search)) return false
      }
      if (statusFilter.size > 0 && !statusFilter.has(row.order.status)) return false
      for (const column of TEXT_COLUMNS) {
        const value = columnFilters[column.key]?.trim().toLowerCase()
        if (value && !cellText(row, column.key).toLowerCase().includes(value)) return false
      }
      return true
    })
  }, [rows, debouncedSearch, statusFilter, columnFilters])

  const sorted = useMemo(() => {
    if (!sort) return filtered
    const factor = sort.dir === 'asc' ? 1 : -1
    const { key } = sort
    return [...filtered].sort((a, b) => {
      let result = 0
      switch (key) {
        case 'createdAt':
          result =
            new Date(a.order.createdAt).getTime() - new Date(b.order.createdAt).getTime()
          break
        case 'itemCount':
          result = a.itemCount - b.itemCount
          break
        case 'subtotal':
          result = a.subtotal - b.subtotal
          break
        case 'orderNumber':
          result = a.order.orderNumber.localeCompare(b.order.orderNumber, 'az')
          break
        case 'address':
          result = a.order.address.localeCompare(b.order.address, 'az')
          break
        case 'status':
          result =
            ORDER_STATUSES.indexOf(a.order.status) - ORDER_STATUSES.indexOf(b.order.status)
          break
      }
      return result * factor
    })
  }, [filtered, sort])

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize))

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount))
  }, [pageCount])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, statusFilter, columnFilters, pageSize])

  const startIndex = (page - 1) * pageSize
  const pageItems = sorted.slice(startIndex, startIndex + pageSize)
  const fillerRows = pageCount > 1 ? pageSize - pageItems.length : 0

  function toggleSort(key: SortKey) {
    setSort((current) => {
      if (!current || current.key !== key) return { key, dir: 'asc' }
      if (current.dir === 'asc') return { key, dir: 'desc' }
      return null
    })
  }

  function toggleStatusFilter(status: OrderStatus) {
    setStatusFilter((current) => {
      const next = new Set(current)
      if (next.has(status)) next.delete(status)
      else next.add(status)
      return next
    })
  }

  const rangeLabel =
    sorted.length === 0
      ? '0 nəticə'
      : `${startIndex + 1}-${Math.min(startIndex + pageSize, sorted.length)} / ${sorted.length} nəticə`

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-[#EDEEF2] pb-5">
        <h1 className="text-[28px] leading-[100%] font-semibold text-[#2B3043]">Sifarişlər</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 2xl:grid-cols-6">
        <StatCard label="Ümumi sifarişlər" icon={ShoppingCart} color="#3E7BFA" value={stats.total} />
        <StatCard
          label="Ümumi satış"
          icon={CircleDollarSign}
          color="#4CAF50"
          value={stats.totalRevenue.toFixed(2)}
          trend
        />
        <StatCard label="Gözləyən" icon={Clock} color="#E8A33D" value={stats.pending} />
        <StatCard label="Hazırlanır" icon={Clock} color="#8B5CF6" value={stats.preparing} />
        <StatCard label="Çatdırılan" icon={CircleCheck} color="#4CAF50" value={stats.delivered} />
        <StatCard label="Ləğv edilən" icon={CircleX} color="#EF4444" value={stats.cancelled} />
      </div>

      {isLoading && <p className="text-sm text-neutral-500">Yüklənir...</p>}
      {isError && <p className="text-sm text-red-600">Sifarişlər yüklənə bilmədi.</p>}

      {!isLoading && !isError && (
        <>
          <Table>
            <TableHeader>
              <TableRow className="border-none bg-[#F7F7FA] hover:bg-[#F7F7FA]">
                {TEXT_COLUMNS.map((column, index) => (
                  <TableHead
                    key={column.key}
                    className={cn(
                      'px-4 py-4 text-[14px] leading-[100%] font-normal text-neutral-500',
                      index === 0 && 'rounded-l-lg',
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{column.label}</span>
                      <SortIcon active={sort?.key === column.key} onClick={() => toggleSort(column.key)} />
                      <Popover.Root>
                        <Popover.Trigger asChild>
                          <button
                            type="button"
                            className="rounded p-0.5 hover:bg-neutral-200/60"
                            aria-label="Filtr"
                          >
                            <ListFilter
                              className={cn(
                                'size-3.5',
                                columnFilters[column.key]?.trim()
                                  ? 'text-[#6FCF54]'
                                  : 'text-[#C3C7D1]',
                              )}
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
                              value={columnFilters[column.key] ?? ''}
                              onChange={(event) =>
                                setColumnFilters((prev) => ({
                                  ...prev,
                                  [column.key]: event.target.value,
                                }))
                              }
                              placeholder="Axtar..."
                              className="h-9 w-full rounded-lg bg-[#F4F4F9] px-3 text-sm text-[#2B3043] outline-none"
                            />
                            {columnFilters[column.key]?.trim() ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setColumnFilters((prev) => ({ ...prev, [column.key]: '' }))
                                }
                                className="mt-2 text-xs text-neutral-500 hover:text-neutral-800"
                              >
                                Təmizlə
                              </button>
                            ) : null}
                          </Popover.Content>
                        </Popover.Portal>
                      </Popover.Root>
                    </div>
                  </TableHead>
                ))}

                <TableHead className="px-4 py-4 text-[14px] leading-[100%] font-normal text-neutral-500">
                  <div className="flex items-center gap-1.5">
                    <span>Status</span>
                    <SortIcon active={sort?.key === 'status'} onClick={() => toggleSort('status')} />
                    <Popover.Root>
                      <Popover.Trigger asChild>
                        <button
                          type="button"
                          className="rounded p-0.5 hover:bg-neutral-200/60"
                          aria-label="Status filtri"
                        >
                          <ListFilter
                            className={cn(
                              'size-3.5',
                              statusFilter.size > 0 ? 'text-[#6FCF54]' : 'text-[#C3C7D1]',
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
                          {ORDER_STATUSES.map((status) => {
                            const checked = statusFilter.has(status)
                            return (
                              <button
                                key={status}
                                type="button"
                                onClick={() => toggleStatusFilter(status)}
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
                                <span style={{ color: ORDER_STATUS_META[status].color }}>
                                  {ORDER_STATUS_META[status].label}
                                </span>
                              </button>
                            )
                          })}
                          {statusFilter.size > 0 ? (
                            <button
                              type="button"
                              onClick={() => setStatusFilter(new Set())}
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

                <TableHead className="rounded-r-lg px-4 py-4 text-[14px] leading-[100%] font-normal text-neutral-500">
                  Əməliyyat
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sorted.length === 0 && (
                <TableRow className="border-transparent hover:bg-transparent">
                  <TableCell colSpan={7} className="px-4 py-10 text-center text-sm text-neutral-500">
                    Heç bir sifariş tapılmadı.
                  </TableCell>
                </TableRow>
              )}

              {pageItems.map((row) => (
                <TableRow key={row.order.id} className="border-neutral-100">
                  <TableCell
                    className="whitespace-nowrap px-4 py-5 text-[15px] leading-[100%] font-light text-[#2B3043]"
                  >
                    {row.order.orderNumber}
                  </TableCell>
                  <TableCell className="px-4 py-5 text-[15px] leading-[100%] font-light text-[#2B3043]">
                    {formatDayMonth(row.order.createdAt)}
                  </TableCell>
                  <TableCell
                    className="max-w-[220px] truncate px-4 py-5 text-[15px] leading-[100%] font-light text-[#2B3043]"
                    title={row.order.address}
                  >
                    {row.order.address}
                  </TableCell>
                  <TableCell className="px-4 py-5 text-[15px] leading-[100%] font-light text-[#2B3043]">
                    {row.itemCount}
                  </TableCell>
                  <TableCell className="px-4 py-5 text-[15px] leading-[100%] font-light whitespace-nowrap text-[#2B3043]">
                    {row.subtotal.toFixed(2)} {MANAT}{' '}
                    {row.deliveryFee === 0 ? (
                      <span className="text-[#4CAF50]">• Pulsuz</span>
                    ) : (
                      <span className="text-neutral-400">
                        • {row.deliveryFee.toFixed(2)} {MANAT}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-5">
                    <StatusBadge status={row.order.status} />
                  </TableCell>
                  <TableCell className="px-4 py-5">
                    <button
                      type="button"
                      onClick={() => setDetailOrder(row.order)}
                      className="inline-flex items-center gap-1.5 text-[15px] leading-[100%] font-light text-[#2B3043] hover:text-neutral-900"
                    >
                      <Eye className="size-4 text-[#9AA0AC]" />
                      Göstər
                    </button>
                  </TableCell>
                </TableRow>
              ))}

              {Array.from({ length: fillerRows }).map((_, index) => (
                <TableRow
                  key={`filler-${index}`}
                  className="border-transparent hover:bg-transparent"
                >
                  <TableCell colSpan={7} aria-hidden className="px-4 py-5 text-[15px] leading-[100%]">
                    &nbsp;
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-3 pt-1 text-sm text-neutral-500">
            <span>{rangeLabel}</span>

            {pageCount > 1 && (
              <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
            )}

            <div className="relative">
              <select
                value={pageSize}
                onChange={(event) => setPageSize(Number(event.target.value))}
                aria-label="Səhifə ölçüsü"
                className="h-8 appearance-none rounded-lg border border-[#E6E8EE] bg-white pr-8 pl-3 text-sm text-[#2B3043] outline-none"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size} / page
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-neutral-400" />
            </div>
          </div>
        </>
      )}

      <OrderDetailDialog
        open={detailOrder !== null}
        onOpenChange={(open) => !open && setDetailOrder(null)}
        order={detailOrder}
      />
    </div>
  )
}

function cellText(row: OrderRow, key: TextColumn): string {
  switch (key) {
    case 'orderNumber':
      return row.order.orderNumber
    case 'createdAt':
      return formatDayMonth(row.order.createdAt)
    case 'address':
      return row.order.address
    case 'itemCount':
      return String(row.itemCount)
    case 'subtotal':
      return row.subtotal.toFixed(2)
  }
}

interface StatCardProps {
  label: string
  icon: LucideIcon
  color: string
  value: number | string
  trend?: boolean
}

function StatCard({ label, icon: Icon, color, value, trend = false }: StatCardProps) {
  return (
    <div className="rounded-[10px] border border-[#EEF0F4] bg-white px-5 py-4">
      <p className="text-[13px] leading-[100%] font-normal text-[#9AA0AC]">{label}</p>
      <div className="mt-3 flex items-center gap-2">
        <Icon className="size-5 shrink-0" style={{ color }} />
        <span className="text-[22px] leading-[100%] font-semibold text-[#2B3043]">{value}</span>
        {trend ? <TrendingUp className="size-3.5 text-[#4CAF50]" /> : null}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = ORDER_STATUS_META[status]
  return (
    <span
      className="inline-flex h-[30px] items-center rounded-[8px] border px-3 text-[13px] leading-[100%] font-medium whitespace-nowrap"
      style={{ color: meta.color, borderColor: `${meta.color}66`, backgroundColor: `${meta.color}14` }}
    >
      {meta.label}
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
          <span key={`gap-${index}`} className="px-1 text-neutral-400">
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
        'flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-light transition-colors disabled:cursor-not-allowed disabled:opacity-40',
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
