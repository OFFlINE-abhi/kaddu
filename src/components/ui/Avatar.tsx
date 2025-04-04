"use client";
import Image from "next/image";

export function Avatar({
  src,
  alt = "User Avatar",
  className = "",
}: {
  src?: string | null;
  alt?: string;
  className?: string;
}) {
  return (
    <Image
      src={src || "/default-avatar.png"}
      alt={alt}
      width={48}
      height={48}
      className={`rounded-full ${className}`}
    />
  );
}
