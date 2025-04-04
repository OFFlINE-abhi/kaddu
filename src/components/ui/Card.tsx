"use client";
import { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl bg-white/10 text-white backdrop-blur-md border border-white/10 ${className}`}
    >
      {children}
    </div>
  );
}
