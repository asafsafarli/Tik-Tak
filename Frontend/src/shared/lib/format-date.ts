const pad = (value: number) => String(value).padStart(2, "0");

// "10.09.2021"
export function formatDate(iso: string) {
  const date = new Date(iso);
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
}

// "18:30"
export function formatTime(iso: string) {
  const date = new Date(iso);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
