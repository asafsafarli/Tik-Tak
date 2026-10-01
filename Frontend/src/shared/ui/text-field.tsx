import type { ComponentProps } from "react";

interface TextFieldProps extends ComponentProps<"input"> {
  label: string;
}

export function TextField({ label, id, className = "", ...props }: TextFieldProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label
        htmlFor={id}
        className="text-[16px] font-normal leading-none tracking-normal text-ink"
      >
        {label}
      </label>
      <input
        id={id}
        className={`h-12 w-full rounded-[10px] border border-transparent bg-brand-soft px-4 text-[16px] leading-none text-ink outline-none transition-colors placeholder:font-light placeholder:text-[#BABBC2] focus:border-leaf focus:bg-white ${className}`}
        {...props}
      />
    </div>
  );
}
