export function normalizePhone(input: string): string {
  const digits = input.replace(/[^\d]/g, "");
  if (!digits) return "";
  if (digits.startsWith("994")) return `+${digits}`;
  if (digits.startsWith("0")) return `+994${digits.slice(1)}`;
  return `+994${digits}`;
}
