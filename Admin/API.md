# TikTak Admin API

Mənbə: paylaşılan Postman kolleksiyası (`Tiktak | E-commerce Api's | Stage 3-4 Final`), yalnız **Admin** qovluğu.

## Base URL

```
https://api.sarkhanrahimli.dev/api/tiktak
```

Kod daxilində `Admin/src/shared/config/env.ts` və `VITE_API_BASE_URL` mühit dəyişəni ilə idarə olunur (bax `.env.example`).

## Auth

Login xaric bütün sorğular `Authorization: Bearer <access_token>` header-i tələb edir.

```
Content-Type: application/json
Authorization: Bearer <access_token>
```

Token-lər `localStorage`-da saxlanılır (`shared/lib/token-storage.ts`). **Refresh axını qoşuludur**: `apiFetch` `401` alanda bir dəfə `POST /auth/refresh` (`{ refresh_token }`) çağırır, uğurlu olsa hər iki token yenilənir və orijinal sorğu təkrarlanır; uğursuz olsa sessiya təmizlənir və `/login`-ə yönləndirilir (`shared/api/refresh-token.ts`). Eyni anda gələn 401-lər üçün refresh yalnız bir dəfə gedir.

---

## Auth

### `POST /auth/admin/login`

Auth tələb etmir.

**Body**
```json
{ "phone": "+994105554422", "password": "Admin1234" }
```

**Cavab (200)**
```json
{
  "message": "Ok",
  "data": {
    "tokens": { "access_token": "...", "refresh_token": "..." },
    "profile": {
      "id": 2,
      "full_name": "Tiktak Admin",
      "phone": "+994105554422",
      "address": null,
      "img_url": null,
      "role": "ADMIN",
      "created_at": "2025-06-12T05:44:27.813Z"
    }
  },
  "result": true
}
```

Səhv olarsa: `{ "statusCode": 401, "message": "Password is wrong!", "result": false }`

---

## Profile

### `GET /admin/profile`

Login sonrası sessiyanı doğrulamaq üçün istifadə olunur (səhifə yenilənəndə tokenlə profil çəkilir).

**Cavab (200)** — login-dəki `profile` obyektinin eynisi.

---

## Users

### `GET /admin/users`

**Cavab (200)**
```json
{
  "message": "Ok",
  "data": [
    {
      "id": 3,
      "full_name": "John Doe",
      "phone": "+994516667766",
      "address": null,
      "img_url": null,
      "role": "COMMERCE",
      "created_at": "2025-06-12T05:47:24.588Z"
    }
  ],
  "result": true
}
```

> Qeyd: nümunə cavabda `password` (hash) sahəsi də var idi — frontend-də istifadə edilmir/render olunmamalıdır.

---

## Categories

CRUD (Products bölməsi üçün `category_id` seçimində istifadə olunur).

| Əməliyyat | Endpoint |
|---|---|
| Siyahı | `GET /admin/categories` |
| Yarat | `POST /admin/category` |
| Redaktə | `PUT /admin/categories/:id` |
| Sil | `DELETE /admin/categories/:id` |

**Create/Update body**
```json
{ "name": "Category-1", "description": "Lorem", "img_url": "" }
```
`img_url` optional-dır.

**Model**
```ts
interface Category {
  id: number
  name: string
  img_url: string | null
  description: string | null
  created_at: string
}
```

---

## Products

| Əməliyyat | Endpoint |
|---|---|
| Siyahı | `GET /admin/products?limit=&page=&search=` |
| Yarat | `POST /admin/product` |
| Redaktə | `PUT /admin/products/:id` |
| Sil | `DELETE /admin/products/:id` |

**Create/Update body**
```json
{
  "title": "Producty-3 Icki",
  "description": "Lorem ipsum",
  "price": "8.90",
  "type": "litre",
  "img_url": "",
  "category_id": 1
}
```

`type` — `ProductMeasure` enum: `kg | gr | litre | ml | meter | cm | mm | piece | packet | box`.

**List cavabı** `pagination` obyekti ilə gəlir:
```json
{
  "message": "Ok",
  "data": [ /* Product[] */ ],
  "pagination": { "next": null, "prev": null, "current": 1, "total": 2, "totalPages": 1 },
  "result": true
}
```

---

## Campaigns

Category ilə eyni CRUD forması.

| Əməliyyat | Endpoint |
|---|---|
| Siyahı | `GET /admin/campaigns` |
| Yarat | `POST /admin/campaign` |
| Redaktə | `PUT /admin/campaigns/:id` |
| Sil | `DELETE /admin/campaigns/:id` |

**Create/Update body**
```json
{ "title": "Campaign-1", "description": "Lorem", "img_url": "" }
```

---

## Orders

| Əməliyyat | Endpoint |
|---|---|
| Siyahı | `GET /orders/admin` |
| Statistika | `GET /orders/admin/stats` |
| Status dəyiş | `PUT /orders/admin/:id/status` |

**Status body**
```json
{ "status": "PREPARING" }
```
`OrderStatus` enum: `PENDING | CONFIRMED | PREPARING | READY | DELIVERED | CANCELLED`.

**Order modeli** (`list` cavabındakı hər element):
```ts
interface Order {
  id: number
  orderNumber: string
  total: string
  deliveryFee: string
  paymentMethod: 'CARD' | 'CASH'
  status: OrderStatus
  note: string | null
  address: string
  phone: string
  createdAt: string
  updatedAt: string
  user: { id: number; full_name: string; img_url: string | null }
  items: Array<{ id: number; quantity: number; total_price: string; product: Product }>
}
```

### Statistika — `GET /orders/admin/stats`

Postman kolleksiyasında bu sorğunun **görünən URL-i səhvən `/orders/admin`-dir**, amma
yadda saxlanmış cavabın `originalRequest.url`-i `/orders/admin/stats`-dır. Cavab:

```json
{ "TOTAL": 1, "DELIVERED": 0, "PENDING": 0, "PREPARING": 1, "TOTAL_REVENUE": 0 }
```

`CONFIRMED`, `READY`, `CANCELLED` sayları **yoxdur**.

**Qərar — client tərəfdə hesablayırıq** (`entities/order/lib/compute-stats.ts` →
`computeOrderStats(orders)`):

- Sifarişlər səhifəsi onsuz da cədvəl, sıralama, filtr və səhifələmə üçün **tam siyahını**
  (`GET /orders/admin`, server-side paginasiya yoxdur) yükləyir — statistika həmin
  siyahıdan pulsuz çıxır.
- 6-cı kart "Ləğv edilən" (`CANCELLED`) stats endpoint-ində yoxdur; client hesablama
  6 kartın hamısını verir.
- Yəni stats endpoint-i çağırmaq **əlavə sorğu, az məlumat** deməkdir.
- **"Ümumi satış" yalnız `DELIVERED` sifarişlərin `total`-larının cəmidir** — backend-in
  `TOTAL_REVENUE`-u ilə eyni tərif (canlı yoxlanıldı 2026-10-01: hər ikisi 19614.26).
  Əvvəl bütün sifarişlər (ləğv edilənlər daxil) toplanırdı və rəqəm ~23 dəfə şişirdi.

Gələcəkdə sifariş sayı çox böyüyüb server-side paginasiyaya keçilsə, `GET /orders/admin/stats`
(+ `CANCELLED` üçün fallback) istifadə etmək məntiqli olar.

---

## Upload

### `POST /upload`

`multipart/form-data`, sahə adı: `file`.

**Cavab (201)**
```json
{ "message": "File uploaded successfully", "data": { "url": "https://..." }, "result": true }
```

Qayıdan `url` — Product/Category/Campaign formalarında `img_url` sahəsinə yazılır.

---

## Kod tərəfində qarşılıq

| API resurs | FSD entity | Fayl |
|---|---|---|
| Auth/Profile | `entities/session` | `src/entities/session` |
| Users | `entities/user` | `src/entities/user` |
| Categories | `entities/category` | `src/entities/category` |
| Products | `entities/product` | `src/entities/product` |
| Campaigns | `entities/campaign` | `src/entities/campaign` |
| Orders | `entities/order` | `src/entities/order` |
| Upload | — | `src/shared/api/upload.ts` |

Hər entity-nin `api/` qovluğunda iki fayl olur: xam `fetch` funksiyaları (`*.ts`) və React Query hook-ları (`queries.ts`) — keşləmə, təkrar sorğuların qarşısını almaq və mutation-dan sonra avtomatik yeniləmə üçün.

---

## Admin panel səhifələri

Beş siyahı səhifəsinin hamısı eyni model üzərində qurulub: səhifə başlığı (`28px` + alt
xətt), `shared/ui/table` cədvəli, **client-side** filtr + səhifələmə, sətir hündürlüyü sabit
qalsın deyə boş "filler" sətirlər, həmişə görünən nəticə sayı + naviqasiya. Sidebar sırası:
**Sifarişlər** birinci; `/` → `/orders` yönləndirir. Topbar axtarışı hər səhifədə əsas
ad/başlıq sahəsinə baxır.

| Səhifə | Route | Widget | Başlıq ikonları | Səhifə ölçüsü | CRUD |
|---|---|---|---|---|---|
| Sifarişlər | `/orders` | `widgets/orders-list` | sıralama ↕ + funnel ▽ | seçici (5/10/20/50) | status dəyişmə |
| Kampaniyalar | `/campaigns` | `widgets/campaigns-list` | axtarış 🔍 | 7 | yarat / düzəlt / sil |
| Kateqoriyalar | `/categories` | `widgets/categories-list` | axtarış 🔍 | 5 | yarat / düzəlt / sil |
| Məhsullar | `/products` | `widgets/products-list` | axtarış 🔍 | 5 | yarat / düzəlt / sil |
| İstifadəçilər | `/users` | `widgets/users-list` | sıralama ↕ + funnel ▽ | 5 | yoxdur (yalnız `GET`) |

### Sifarişlər
- 6 statistika kartı — `computeOrderStats`: Ümumi sifarişlər, Ümumi satış, Gözləyən
  (`PENDING`), Hazırlanır (`PREPARING`), Çatdırılan (`DELIVERED`), Ləğv edilən (`CANCELLED`).
- Sütunlar: No, Tarix (`dd-mm`), Çatdırılma ünvanı, Məhsul sayı (`quantity` cəmi),
  Subtotal/Çatdırılma (`total − deliveryFee`, pulsuzsa "Pulsuz"), Status badge, Əməliyyat.
- Status etiketləri/rəngləri: `entities/order/model/status.ts` → `ORDER_STATUS_META`.
- "Göstər" → `features/orders/detail/OrderDetailDialog`: başlıqda avatar + status seçici +
  ümumi məbləğ; boz fonda ağ kartlar (Sifariş Məlumatları, Məhsullar). Status dəyişmə
  `PUT /orders/admin/:id/status`.

### Kampaniyalar / Kateqoriyalar / Məhsullar
- Sütunlar: Sıra, Şəkil (thumbnail), Ad, Açıqlama (2 sətir); Məhsullar-da əlavə: Qiymət,
  Kateqoriya, Növ (bənövşəyi badge); sonra Tarix, Düzəlt / Sil.
- Sütun üzrə axtarış popover-i: Ad + Açıqlama (Məhsullar-da həm də Kateqoriya, Növ).
- Yaratma/düzəltmə `features/<resurs>/upsert`, silmə təsdiqi `features/<resurs>/delete`.
- Növ etiketləri: `entities/product/model/measure.ts` → `PRODUCT_MEASURE_LABEL`.
- Məhsul siyahısı `GET /admin/products?limit=1000` çəkir və hər şeyi client-side edir
  (API-nin server-side paginasiya/axtarışı hələ istifadə olunmur).

### İstifadəçilər
- Sütunlar: Sıra, Avatar (baş hərf / `img_url`), Ad Soyad, Telefon, Ünvan (boşdursa
  "Qeyd olunmayıb"), Rol (yaşıl konturlu badge), Əməliyyat.
- Sıralama: Ad Soyad, Telefon. Filtr: Ad Soyad / Telefon / Ünvan mətn, Rol çoxseçimli
  (rollar datadan avtomatik yığılır).
- "Göstər" → `features/users/detail/UserDetailDialog` — yalnız oxu.
