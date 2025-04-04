"use client";

export function Button({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-200 transition-all ${className}`}
    >
      {children}
    </button>
  );
}
