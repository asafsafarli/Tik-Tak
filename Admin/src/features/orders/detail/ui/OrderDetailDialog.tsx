import { useEffect, useState } from 'react'
import { ChevronDown, XIcon } from 'lucide-react'
import type { Order, OrderStatus } from '@/entities/order'
import { ORDER_STATUSES, ORDER_STATUS_META, useUpdateOrderStatus } from '@/entities/order'
import { PRODUCT_MEASURE_SHORT, type ProductMeasure } from '@/entities/product'
import { ApiError } from '@/shared/api/client'
import { useToast } from '@/shared/ui/toast'
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/shared/ui/dialog'

const MANAT = '₼'

const PAYMENT_LABEL: Record<Order['paymentMethod'], string> = {
  CARD: 'Kart',
  CASH: 'Nağd',
}

interface OrderDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
}

export function OrderDetailDialog({ open, onOpenChange, order }: OrderDetailDialogProps) {
  const updateStatus = useUpdateOrderStatus()
  const toast = useToast()
  const [status, setStatus] = useState<OrderStatus>('PENDING')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && order) {
      setStatus(order.status)
      setError(null)
    }
  }, [open, order])

  if (!order) return null

  const currentOrder = order
  const deliveryFee = Number(order.deliveryFee)
  const deliveryLabel = deliveryFee === 0 ? 'Pulsuz' : `${deliveryFee.toFixed(2)} ${MANAT}`

  async function handleStatusChange(next: OrderStatus) {
    setStatus(next)
    if (next === currentOrder.status) return
    setError(null)
    try {
      await updateStatus.mutateAsync({ id: currentOrder.id, status: next })
      toast({
        title: 'Status yeniləndi',
        description: `${currentOrder.orderNumber}: ${ORDER_STATUS_META[currentOrder.status].label} → ${ORDER_STATUS_META[next].label}`,
      })
    } catch (err) {
      setStatus(currentOrder.status)
      const message = err instanceof ApiError ? err.message : 'Status yenilənmədi'
      setError(message)
      toast({ title: 'Status yenilənmədi', description: message, variant: 'error' })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        className="flex max-h-[calc(100vh-4rem)] w-[calc(100%-2rem)] max-w-[720px] flex-col gap-0 overflow-hidden rounded-[16px] bg-white p-0 shadow-xl sm:max-w-[720px]"
      >
        <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-3 border-b border-[#EDEEF2] px-4 py-4 sm:px-6">
          <Avatar name={order.user.full_name} src={order.user.img_url} />

          <DialogTitle className="whitespace-nowrap text-[16px] leading-[100%] font-semibold text-[#2B3043] sm:text-[19px]">
            {order.orderNumber}
          </DialogTitle>

          <div className="order-last flex flex-col gap-1 sm:order-none sm:ml-auto">
            <span className="text-[12px] leading-[100%] text-neutral-400">Status</span>
            <div className="relative">
              <select
                value={status}
                onChange={(event) => handleStatusChange(event.target.value as OrderStatus)}
                disabled={updateStatus.isPending}
                aria-label="Status"
                className="h-9 w-[150px] appearance-none rounded-[8px] border border-[#E6E8EE] bg-white pr-8 pl-3 text-sm text-[#2B3043] outline-none disabled:opacity-60"
              >
                {ORDER_STATUSES.map((value) => (
                  <option key={value} value={value}>
                    {ORDER_STATUS_META[value].label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-neutral-400" />
            </div>
          </div>

          <div className="order-last flex flex-col gap-1 sm:order-none">
            <span className="text-[12px] leading-[100%] text-neutral-400">Ümumi məbləğ</span>
            <span className="text-[17px] leading-[100%] font-bold text-[#EF4444]">
              {Number(order.total).toFixed(2)} {MANAT}
            </span>
          </div>

          <DialogClose className="ml-auto self-center text-[#1A1D28] transition-opacity hover:opacity-60 sm:ml-0 sm:self-start">
            <XIcon className="size-4" />
            <span className="sr-only">Bağla</span>
          </DialogClose>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto bg-[#F6F7F9] p-5">
          <section className="rounded-[12px] bg-white p-5">
            <p className="text-[15px] font-semibold text-[#2B3043]">Sifariş Məlumatları</p>
            <hr className="my-3 border-[#EDEEF2]" />
            <dl className="flex flex-col gap-2.5 text-sm">
              <InfoRow label="Tarix" value={order.createdAt.slice(0, 10)} />
              <InfoRow label="Çatdırılma Ünvanı" value={order.address} />
              <InfoRow label="Telefon" value={order.phone} />
              <InfoRow label="Ödəmə Metodu" value={PAYMENT_LABEL[order.paymentMethod]} />
            </dl>
          </section>

          <section className="rounded-[12px] bg-white p-5">
            <p className="text-[15px] font-semibold text-[#2B3043]">
              Məhsullar ({order.items.length})
            </p>
            <hr className="my-3 border-[#EDEEF2]" />

            <ul className="flex flex-col">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 border-b border-[#F1F2F5] py-3 last:border-b-0"
                >
                  {item.product.img_url ? (
                    <img
                      src={item.product.img_url}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      width={44}
                      height={44}
                      className="size-11 shrink-0 rounded-[8px] object-cover"
                    />
                  ) : (
                    <div className="size-11 shrink-0 rounded-[8px] bg-neutral-100" aria-hidden />
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#2B3043]">
                      {item.product.title}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-neutral-400">
                      {[item.product.category?.name, `${item.quantity} ${measureShort(item.product.type)}`]
                        .filter(Boolean)
                        .join(' • ')}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-[#4CAF50]">
                      {Number(item.total_price).toFixed(2)} {MANAT}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-400">
                      {Number(item.product.price).toFixed(2)} {MANAT}/{measureShort(item.product.type)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-1 border-t border-[#EDEEF2] pt-3 text-sm text-neutral-500">
              Çatdırılma: {deliveryLabel}
            </div>
          </section>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Avatar({ name, src }: { name: string; src: string | null }) {
  if (src) {
    return <img src={src} alt="" width={44} height={44} decoding="async" className="size-11 shrink-0 rounded-full object-cover" />
  }
  const initial = name.trim().charAt(0).toUpperCase() || '?'
  return (
    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#4CAF50] text-[17px] font-semibold text-white">
      {initial}
    </span>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="shrink-0 text-neutral-400">{label} :</dt>
      <dd className="text-[#2B3043]">{value}</dd>
    </div>
  )
}

function measureShort(type: string) {
  return PRODUCT_MEASURE_SHORT[type as ProductMeasure] ?? type
}
