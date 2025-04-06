import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils"; // Utility for handling Tailwind classes dynamically

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

export default function CustomInput({ label, className, ...props }: CustomInputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-foreground mb-1">{label}</label>}
      <input
        className={cn(
          "w-full px-4 py-2 border rounded-lg bg-background text-foreground",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
          "border-muted transition-all duration-200 ease-in-out",
          className
        )}
        {...props}
      />
    </div>
  );
}
