import type { ComponentProps } from "react";

interface ContainerProps extends ComponentProps<"div"> {
  wide?: boolean;
}

export function Container({ className = "", wide = false, ...props }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full ${wide ? "max-w-[1620px]" : "max-w-[1200px]"} px-4 sm:px-6 lg:px-8 ${className}`}
      {...props}
    />
  );
}
