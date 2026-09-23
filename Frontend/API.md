# TikTak Frontend (Client) API

Mənbə: paylaşılan Postman kolleksiyası (`Tiktak | E-commerce Api's | Stage 3-4 Final`), yalnız **Client** qovluğu. Admin tərəfin ekvivalenti: `Admin/API.md`.

## Base URL

```
https://api.sarkhanrahimli.dev/api/tiktak
```

Kod daxilində `Frontend/src/shared/config/env.ts` və `NEXT_PUBLIC_API_BASE_URL` mühit dəyişəni ilə idarə olunur.

## Auth

`GET /campaigns` xaric **bütün Client endpoint-ləri token tələb edir** — `/products`, `/categories` daxil olmaqla (Admin-dən fərqli olaraq burada "açıq" endpoint demək olar ki, yoxdur).

```
Content-Type: application/json
Authorization: Bearer <access_token>
```

Token-lər `localStorage`-da saxlanılır (`shared/lib/token-storage.ts`, açarlar `tiktak_access_token` / `tiktak_refresh_token`; SSR-qorunmalı, server-də `null`). `shared/api/client.ts` → `apiFetch`:

- `auth: true` verilsə token-i header-ə əlavə edir; `401` alanda bir dəfə `POST /auth/refresh` çağırır (in-flight dedupe + fail latch, `shared/api/refresh-token.ts`), uğurlu olsa sorğunu təkrarlayır.
- Refresh də uğursuz olsa **default olaraq** sessiyanı təmizləyib `/login`-ə hard-redirect edir.
- `redirectOnAuthFail: false` verilsə bu redirect olmur — 401 sadəcə `ApiError` kimi atılır. Qonağa da açıq olan səhifələr (məs. `/category`) üçün istifadə olunur ki, token olmayan istifadəçi login-ə məcburən atılmasın; çağıran tərəf `ApiError`-u tutub ehtiyat (fallback) məzmun göstərir.
- `revalidate` seçimi yalnız server tərəfdə (Server Component) mənalıdır — Next-in `fetch`-inə `{ next: { revalidate } }` kimi ötürülür. Client Component-dən çağırılan endpoint-lərdə (token `localStorage`-da olduğu üçün onsuz da client-dən gedir) faydasızdır, ötürülməsin.

Bütün cavablar eyni zərfə sarılıb: `{ message, data, result }`. `apiFetch` yalnız `data`-nı qaytarır, uğursuzluqda `ApiError` atır.

---

## Qoşulma vəziyyəti

| Resurs | Endpoint(lər) | Vəziyyət | Fayl |
|---|---|---|---|
| Campaigns | `GET /campaigns` | ✅ Qoşulub | `entities/campaign` |
| Categories | `GET /categories` | ✅ Qoşulub (auth + fallback siyahı) | `entities/category` |
| Auth | `POST /auth/login`, `/auth/signup`, `/auth/refresh` | ✅ Qoşulub | `entities/session` |
| Profile (oxu) | `GET /profile` | ✅ Qoşulub (yalnız sessiya doğrulaması üçün) | `entities/session` |
| Profile (redaktə) | `PUT /profile` | ✅ Qoşulub (`/profile` səhifəsi — ad, ünvan, şifrə) | `entities/session`, `features/profile/edit-form` |
| Products | `GET /products` (auth + fallback siyahı, `category_id` ilə), `GET /products/:id` | ✅ Qoşulub | `entities/product`, `views/product-detail` |
| Favorites | `POST /products/:id/favorite`, `GET /products/favorites` | ✅ Qoşulub | `entities/favorite`, `views/favorites` |
| Basket | `GET /basket`, `POST /basket/:id/add`, `POST /basket/:id/remove`, `DELETE /basket/:id/remove-all`, `DELETE /basket/clear` | ✅ Qoşulub (yalnız girişli istifadəçi — qonaq "Səbətə əlavə et" klikləyəndə /login-ə yönləndirilir) | `entities/basket` |
| Orders | `POST /orders/checkout`, `GET /orders/user`, `GET /orders/user/:id` | ⏳ Qoşulmayıb | — |
| Upload | `POST /upload` | ⏳ Qəsdən qoşulmayıb — `img_url` sahələri (olsaydı, profil şəkli kimi) sadə URL input olaraq qalacaq, fayl seçici yoxdur (Admin panelindəki qərarla eyni) | — |

Yeni bir hissə qoşulanda bu cədvəldəki sətri **✅ Qoşulub**-a çevir və fayl sütununu doldur.

---

## Auth

### `POST /auth/login`

Auth tələb etmir.

**Body**
```json
{ "phone": "+994516667766", "password": "12345" }
```

**Cavab (200)**
```json
{
  "message": "Ok",
  "data": {
    "tokens": { "access_token": "...", "refresh_token": "..." },
    "profile": {
      "id": 3,
      "full_name": "John Doe",
      "phone": "+994516667766",
      "address": null,
      "img_url": null,
      "role": "COMMERCE",
      "created_at": "2025-06-12T05:47:24.588Z"
    }
  },
  "result": true
}
```

### `POST /auth/signup`

Auth tələb etmir.

**Body**
```json
{ "full_name": "John Doe", "phone": "+994516667766", "password": "1234" }
```

**Cavab (200)** — `data: null`. Token qaytarmır, ona görə `entities/session` qeydiyyatdan sonra avtomatik `login()` çağırır.
```json
{ "message": "Successfully registered", "data": null, "result": true }
```

### `POST /auth/refresh`

Auth tələb etmir (refresh token body-də gedir).

**Body**
```json
{ "refresh_token": "..." }
```

**Cavab (200)**
```json
{ "message": "Ok", "data": { "access_token": "...", "refresh_token": "..." }, "result": true }
```

---

## Profile

### `GET /profile` (auth)

**Cavab (200)**
```json
{
  "message": "Ok",
  "data": {
    "id": 3,
    "full_name": "John Doe",
    "phone": "+994516667766",
    "email": "sinaqemail@test.com",
    "address": "Aga Neymatulla 80",
    "img_url": "https://...",
    "role": "COMMERCE",
    "created_at": "2025-06-12T05:47:24.588Z"
  },
  "result": true
}
```
`email` canlı cavabda var, Postman nümunəsində yox idi — modeldə optional saxlanılıb.

### `PUT /profile` (auth)

**Body** (`password`/`password_repeat` yalnız şifrə dəyişəndə göndərilir)
```json
{
  "full_name": "John Doe",
  "img_url": "https://...",
  "address": "Aga Neymatulla 80",
  "password": "12345",
  "password_repeat": "12345"
}
```

**Cavab (200)** — yenilənmiş profil obyekti (yuxarıdakı kimi).

---

## Categories

### `GET /categories` (auth)

Admin-in `/admin/categories`-i ilə eyni modeli qaytarır, sadəcə auth yolu fərqlidir (Client-in öz JWT-si).

**Cavab (200)**
```json
{
  "message": "Ok",
  "data": [
    {
      "id": 34,
      "name": "Ev və Bağ (həyət)",
      "img_url": "https://...",
      "description": "Ev dekorasyon, mebel, bağ aksesuarları və daha çoxu.",
      "created_at": "2025-07-30T06:49:19.110Z"
    }
  ],
  "result": true
}
```

---

## Campaigns

### `GET /campaigns`

**Yeganə auth tələb etməyən Client endpoint.** Landing üçün istifadə olunur.

**Cavab (200)**
```json
{
  "message": "Ok",
  "data": [
    { "id": 132, "title": "Təzə Tərəvəz Kampanyası", "description": "...", "img_url": "https://...", "created_at": "2026-08-..." }
  ],
  "result": true
}
```

---

## Products

### `GET /products` (auth)

**Query** (hamısı optional): `limit`, `page`, `search` (title + description + qiymətdə axtarır), `category_id`.

**Cavab (200)**
```json
{
  "message": "Ok",
  "data": [
    {
      "id": 154,
      "title": "Notebook",
      "img_url": "https://...",
      "description": "oyun notebooku",
      "price": "1540.00",
      "type": "piece",
      "created_at": "2026-09-06T19:39:33.715Z",
      "category": { "id": 100, "name": "Notebook" }
    }
  ],
  "pagination": { "next": null, "prev": null, "current": 1, "total": 2, "totalPages": 1 },
  "result": true
}
```
`type` — Admin-dəki `ProductMeasure` enum-un eynisi: `kg | gr | litre | ml | meter | cm | mm | piece | packet | box`.

### `GET /products/:id` (auth)

Tək məhsulun detalı — girişli istifadəçi üçün `is_favorite` bayrağı əlavə olunur.

**Cavab (200)**
```json
{
  "message": "Ok",
  "data": {
    "id": 1,
    "title": "Producty-1",
    "img_url": "",
    "description": "Lorem ipsum",
    "price": "12.90",
    "type": "kg",
    "created_at": "2025-06-12T06:38:08.292Z",
    "category": { "id": 1, "name": "Elektronika" },
    "is_favorite": false
  },
  "result": true
}
```

---

## Favorites

### `POST /products/:id/favorite` (auth)

Toggle — eyni endpoint həm əlavə edir, həm çıxarır (məhsulun mövcud vəziyyətinə görə). Body yoxdur.

**Cavab (200)**
```json
{ "message": "Successfully added favorites", "data": null, "result": true }
```
Çıxaranda: `"Successfully removed favorites"`.

### `GET /products/favorites` (auth)

**Cavab (200)** — `Product[]` (kateqoriya obyekti tam formada, `id/name/img_url/description/created_at`).

---

## Basket

Basket sətirləri `product_id`-yə görə deyil, path-dəki `:id` **məhsul id-si** ilə idarə olunur (basket sətrinin öz id-si yalnız cavabda görünür). Bütün əməliyyatlar body qəbul etmir, yenilənmiş basket-in tamını qaytarır.

### `GET /basket` (auth)

**Cavab (200)**
```json
{
  "message": "Ok",
  "data": {
    "items": [
      {
        "id": 8,
        "quantity": 1,
        "total_price": "12.90",
        "product": { "id": 5, "title": "Producty-2 Icki", "img_url": "", "description": "Lorem ipsum", "price": "12.90", "type": "litre", "created_at": "...", "category": { "...": "..." } }
      }
    ],
    "total": "12.90",
    "count": 1
  },
  "result": true
}
```
Boş səbətdə: `data: { items: [], total: "0.00", count: 0 }`.

### `POST /basket/:productId/add` (auth)

Miqdarı 1 artırır (məhsul səbətdə yoxdursa yaradır). Cavab — yenilənmiş `GET /basket` ilə eyni şəkil.

### `POST /basket/:productId/remove` (auth)

Miqdarı 1 azaldır (0-a düşsə sətir silinir). Cavab — yenilənmiş basket.

### `DELETE /basket/:productId/remove-all` (auth)

Məhsulu miqdarından asılı olmayaraq tamamilə səbətdən çıxarır. Cavab — yenilənmiş basket.

### `DELETE /basket/clear` (auth)

Bütün səbəti təmizləyir. Cavab — `{ items: [], total: "0.00", count: 0 }`.

---

## Orders

### `POST /orders/checkout` (auth)

Cari basket-dən sifariş yaradır (basket-i də təmizləyir — canlı yoxlanılmayıb, Postman-da belə göstərilir).

**Body**
```json
{ "paymentMethod": "CARD", "note": "Lorem ipsum", "address": "Aga Neymatulla", "phone": "+994103193897" }
```
`paymentMethod` enum: `CARD | CASH`.

**Cavab (201/200)** — `Order` obyekti (aşağıdakı `GET /orders/user/:id` ilə eyni forma). Səbət boşdursa `400 Basket is empty. Add items before checkout.`

> Postman-dakı saxlanmış nümunə cavab zərfsiz (`{id, orderNumber, ...}` birbaşa) görünür, amma `GET /orders/user` və `GET /basket` canlıda standart `{message,data,result}` zərfi ilə qayıdır — checkout da ehtimal ki eynidir. Qoşarkən canlı cavabı yoxlayıb bu qeydi düzəlt.

### `GET /orders/user` (auth)

İstifadəçinin bütün sifarişləri (səhifələmə görünmür — hamısı bir dəfəyə gəlir).

**Cavab (200)**
```json
{
  "message": "Ok",
  "data": [
    {
      "id": 322,
      "orderNumber": "ORD-20260815-845",
      "total": "20.59",
      "deliveryFee": "0.00",
      "paymentMethod": "CASH",
      "status": "READY",
      "note": "",
      "address": "Aga Neymatulla 80",
      "phone": "+994516667766",
      "createdAt": "2026-08-15T13:15:08.627Z",
      "updatedAt": "2026-08-16T20:35:08.805Z",
      "items": [ { "id": 675, "quantity": 1, "total_price": "2.00", "product": { "...": "..." } } ]
    }
  ],
  "result": true
}
```
`status` — Admin-dəki `OrderStatus` enum-un eynisi: `PENDING | CONFIRMED | PREPARING | READY | DELIVERED | CANCELLED`.

### `GET /orders/user/:id` (auth)

Tək sifarişin detalı — yuxarıdakı siyahı elementinin eynisi, `data` bir obyekt.

---

## Upload

### `POST /upload`

`multipart/form-data`, sahə adı: `file`. Admin ilə paylaşılan endpoint.

**Cavab (201)**
```json
{ "message": "File uploaded successfully", "data": { "url": "https://..." }, "result": true }
```

**Qərar: hazırda istifadə olunmur.** Profil/başqa formalarda (olsaydı) `img_url` sadə mətn input olacaq — Admin panelindəki eyni qərar (`Admin/API.md` → Upload bölməsi).

---

## Kod tərəfində qarşılıq (planlaşdırılan FSD)

| API resurs | FSD entity | Fayl |
|---|---|---|
| Auth/Profile | `entities/session` | `src/entities/session` |
| Categories | `entities/category` | `src/entities/category` |
| Campaigns | `entities/campaign` | `src/entities/campaign` |
| Products | `entities/product` | `src/entities/product` |
| Favorites | `entities/favorite` | `src/entities/favorite` |
| Basket | `entities/basket` | `src/entities/basket` |
| Orders | `entities/order` | *(hələ yaradılmayıb)* |
| Upload | — | `shared/api/upload.ts` *(hələ yaradılmayıb)* |

Admin-dən fərqli olaraq Frontend-də React Query yoxdur — `apiFetch` sadə `fetch` sarğısıdır, Server Component-lərdə Next-in öz ISR keşi (`revalidate`), Client Component-lərdə `useState`/`useEffect` istifadə olunur (bax `entities/campaign`, `entities/category`, `entities/session`).
