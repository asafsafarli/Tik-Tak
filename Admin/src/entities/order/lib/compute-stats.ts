import { ORDER_STATUSES, type Order, type OrderStatus } from '../model/types'

export interface OrderStats {
  total: number
  totalRevenue: number
  byStatus: Record<OrderStatus, number>
  pending: number
  preparing: number
  delivered: number
  cancelled: number
}

export function computeOrderStats(orders: Order[]): OrderStats {
  const byStatus = ORDER_STATUSES.reduce(
    (acc, status) => {
      acc[status] = 0
      return acc
    },
    {} as Record<OrderStatus, number>,
  )

  // Satış = yalnız çatdırılmış sifarişlər (backend-in `/orders/admin/stats`
  // TOTAL_REVENUE-u ilə eyni). Gözləyən/ləğv edilən sifarişlər satış deyil.
  let totalRevenue = 0
  for (const order of orders) {
    byStatus[order.status] += 1
    if (order.status === 'DELIVERED') totalRevenue += Number(order.total)
  }

  return {
    total: orders.length,
    totalRevenue,
    byStatus,
    pending: byStatus.PENDING,
    preparing: byStatus.PREPARING,
    delivered: byStatus.DELIVERED,
    cancelled: byStatus.CANCELLED,
  }
}
