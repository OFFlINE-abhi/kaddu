"use client";
import { ReactNode } from "react";

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {children}
    </div>
  );
}
