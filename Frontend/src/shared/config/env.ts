// API kök URL-i. `.env` faylında NEXT_PUBLIC_API_BASE_URL ilə əvəz oluna bilər.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://api.sarkhanrahimli.dev/api/tiktak";

// MÜVƏQQƏTİ: backend ayaqda olmayanda (məs. hazırkı 502) auth-qorumalı
// səhifələrə (checkout, favorites) /login-ə yönləndirmədən baxıb dizayn
// işi görmək üçün. `.env.local`-da `NEXT_PUBLIC_SKIP_AUTH_GUARD=true` ilə
// açılır, default `false` (.env.local commit olunmur — production/başqa
// mühitə sızmır). Backend düzələndə bu flag-ı söndürüb normal axını
// yoxlamaq lazımdır.
export const SKIP_AUTH_GUARD = process.env.NEXT_PUBLIC_SKIP_AUTH_GUARD === "true";
