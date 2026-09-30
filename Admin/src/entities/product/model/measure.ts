import type { ProductMeasure } from './types'

export const PRODUCT_MEASURE_LABEL: Record<ProductMeasure, string> = {
  kg: 'Kiloqram',
  gr: 'Qram',
  litre: 'Litr',
  ml: 'Millilitr',
  meter: 'Metr',
  cm: 'Santimetr',
  mm: 'Millimetr',
  piece: 'Ədəd',
  packet: 'Paket',
  box: 'Qutu',
}

export const PRODUCT_MEASURE_SHORT: Record<ProductMeasure, string> = {
  kg: 'kq',
  gr: 'qr',
  litre: 'l',
  ml: 'ml',
  meter: 'm',
  cm: 'sm',
  mm: 'mm',
  piece: 'əd',
  packet: 'paket',
  box: 'qutu',
}
