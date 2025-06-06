"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils"; // Utility to merge Tailwind classes

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={cn(
          "flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500",
          className
        )}
      />
    );
  }
);

Input.displayName = "Input";
