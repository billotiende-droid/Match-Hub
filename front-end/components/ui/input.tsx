import * as React from "react";

import { cn } from "@/lib/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-[var(--color-border)] bg-white dark:bg-[var(--surface)] text-[var(--foreground)] px-3 py-2 text-sm outline-none",
          "placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30",
          "disabled:cursor-not-allowed disabled:opacity-60",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
