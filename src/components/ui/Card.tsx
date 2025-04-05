"use client";
import { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/lib/utils"; // Optional if you're using a `cn` utility for class merging

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-2xl bg-white/10 text-white backdrop-blur-md border border-white/10",
        className
      )}
    >
      {children}
    </div>
  );
}
