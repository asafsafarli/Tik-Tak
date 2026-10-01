import { apiFetch } from "./client";

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
