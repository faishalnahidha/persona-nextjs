"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputGroupVariants = cva(
  "flex h-9 rounded-md border border-input bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] md:text-sm disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      size: {
        default: "px-3 py-1",
        sm: "px-2 py-0.5 text-sm",
        lg: "px-4 py-2 text-lg",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

interface InputGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof inputGroupVariants> {}

const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      className={cn(inputGroupVariants({ size }), className)}
      {...props}
    />
  )
)
InputGroup.displayName = "InputGroup"

const InputGroupInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-transparent flex-1 min-w-0 border-0 bg-transparent px-3 py-1 text-base shadow-none outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed md:text-sm",
      className
    )}
    {...props}
  />
))
InputGroupInput.displayName = "InputGroupInput"

const InputGroupAddon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: "inline-start" | "inline-end"
  }
>(({ className, align = "inline-start", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-0 px-1",
      align === "inline-start" && "order-first",
      align === "inline-end" && "order-last",
      className
    )}
    {...props}
  />
))
InputGroupAddon.displayName = "InputGroupAddon"

const InputGroupButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "ghost" | "default"
    size?: "icon-xs" | "icon-sm" | "icon" | "default"
  }
>(({ className, variant = "default", size = "icon", ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md font-medium transition-colors outline-none disabled:pointer-events-none disabled:opacity-50",
      variant === "ghost" && "hover:bg-accent hover:text-accent-foreground",
      variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90",
      size === "icon-xs" && "h-7 w-7",
      size === "icon-sm" && "h-8 w-8",
      size === "icon" && "h-9 w-9",
      size === "default" && "px-4 py-2",
      className
    )}
    {...props}
  />
))
InputGroupButton.displayName = "InputGroupButton"

export {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
}
