"use client"

import type * as React from "react"

export interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "unstyled"
  isLoading?: boolean
  loadingText?: string
}

function Button({
  className = "",
  variant = "default",
  isLoading = false,
  loadingText,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const variantClasses = {
    default: "bg-[#d97638] hover:bg-[#c4671f] text-black",
    outline: "border border-[#e8dfd6] bg-white hover:bg-[#faf8f6] text-gray-700",
    ghost: "hover:bg-[#faf8f6] text-gray-700",
    destructive: "bg-red-600 hover:bg-red-700 text-white",
    unstyled: "",
  }

  const baseClasses =
    variant === "unstyled"
      ? ""
      : "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50"

  const finalClasses = `${baseClasses} ${variantClasses[variant]} ${className}`.trim()

  const content = isLoading ? (
    <>
      <svg className="size-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {loadingText || children}
    </>
  ) : (
    children
  )

  return (
    <button className={finalClasses} disabled={disabled || isLoading} {...props}>
      {content}
    </button>
  )
}

export { Button }


