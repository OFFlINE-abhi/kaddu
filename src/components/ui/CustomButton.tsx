import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils"; // Utility function for merging Tailwind classes

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger"; // Different button styles
  className?: string;
}

export default function CustomButton({
  variant = "primary",
  className,
  children,
  ...props
}: CustomButtonProps) {
  const baseStyles = "px-4 py-2 font-semibold rounded-lg transition-all duration-200";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/80",
    secondary: "bg-muted text-foreground hover:bg-muted/80",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], "focus:outline-none focus:ring-2 focus:ring-offset-2", className)}
      {...props}
    >
      {children}
    </button>
  );
}
