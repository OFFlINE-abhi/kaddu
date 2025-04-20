// src/components/ui/Label.tsx

import { LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils"; // Utility to merge classNames

export function Label({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...props}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
    />
  );
}
