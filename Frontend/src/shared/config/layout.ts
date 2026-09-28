// Kateqoriya detalı və məhsul detalı səhifələrinin üç sütunlu tərtibatı
// (kateqoriya menyusu | məzmun | səbət). Üç sütun yalnız xl-dən yan-yana
// düzülür, Figma ölçüləri (338/375px) isə 2xl-də — dar ekranlarda orta
// sütuna yer qalsın. lg-də səbət aşağı keçir (`CART_COLUMN`).
export const STOREFRONT_COLUMNS =
  "grid grid-cols-1 items-start gap-5 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_320px] 2xl:grid-cols-[338px_minmax(0,1fr)_375px]";

export const CART_COLUMN = "lg:col-span-2 xl:col-span-1";
