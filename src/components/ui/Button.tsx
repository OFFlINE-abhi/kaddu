"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils"; // Optional, if you use it elsewhere

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-200 transition-all",
        className
      )}
    >
      {children}
    </button>
  );
}
