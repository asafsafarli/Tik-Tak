import { apiFetch } from "./client";

// `POST /upload` — `multipart/form-data`, sahə adı `file`; yüklənmiş faylın
// ictimai URL-ini qaytarır.
export async function uploadFile(file: File) {
  const body = new FormData();
  body.append("file", file);
  const { url } = await apiFetch<{ url: string }>("/upload", {
    method: "POST",
    auth: true,
    body,
  });
  return url;
}
