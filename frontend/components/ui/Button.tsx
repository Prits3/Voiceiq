"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-violet-600 text-white hover:bg-violet-500 focus:ring-violet-500 disabled:opacity-50 shadow-lg shadow-violet-500/10 hover:shadow-violet-500/20",
  secondary:
    "bg-white/8 text-slate-200 hover:bg-white/12 focus:ring-white/20 disabled:opacity-50 border border-white/10",
  danger:
    "bg-red-600 text-white hover:bg-red-500 focus:ring-red-500 disabled:opacity-50",
  ghost:
    "bg-transparent text-slate-400 hover:bg-white/[0.04] hover:text-white focus:ring-white/20 disabled:opacity-50",
  outline:
    "border border-white/10 bg-transparent text-slate-300 hover:bg-white/[0.04] hover:text-white focus:ring-violet-500 disabled:opacity-50",
};

// min-h ensures every size meets the 44px Apple HIG / WCAG touch target minimum
const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs min-h-[44px]",
  md: "px-4 py-2 text-sm min-h-[44px]",
  lg: "px-6 py-3 text-base min-h-[52px]",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#05050a]",
          "disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
