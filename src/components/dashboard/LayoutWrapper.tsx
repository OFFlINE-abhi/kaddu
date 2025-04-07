"use client";

import { ReactNode } from "react";

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative flex min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-850 to-gray-800 text-white"
      role="main"
    >
      {children}
    </div>
  );
}
