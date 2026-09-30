import type { OrderStatus } from './types'

export interface OrderStatusMeta {
  label: string
  color: string
}

export const ORDER_STATUS_META: Record<OrderStatus, OrderStatusMeta> = {
  PENDING: { label: 'Gözləyir', color: '#E8A33D' },
  CONFIRMED: { label: 'Təsdiqləndi', color: '#3E7BFA' },
  PREPARING: { label: 'Hazırlanır', color: '#8B5CF6' },
  READY: { label: 'Hazır', color: '#0EA5A5' },
  DELIVERED: { label: 'Çatdırıldı', color: '#4CAF50' },
  CANCELLED: { label: 'Ləğv edildi', color: '#EF4444' },
}
