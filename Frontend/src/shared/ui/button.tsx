import type { ComponentProps } from "react";

// Auth formlarının əsas düyməsi: tam en × 48, radius 10, yaşıl (#92D871).
export function Button({ className = "", ...props }: ComponentProps<"button">) {
  return (
    <button
      className={`inline-flex h-12 w-full items-center justify-center rounded-[10px] bg-[#92D871] px-4 text-[18px] font-medium leading-none text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    />
  );
}
