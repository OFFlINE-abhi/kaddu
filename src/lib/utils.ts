type ClassValue = string | number | null | false | undefined | Record<string, boolean>;

export function cn(...inputs: ClassValue[]): string {
  return inputs
    .flatMap((input) => {
      if (typeof input === "string" || typeof input === "number") return input;
      if (typeof input === "object" && input !== null) {
        return Object.entries(input)
          .filter(([_, value]) => Boolean(value))
          .map(([key]) => key);
      }
      return [];
    })
    .filter(Boolean)
    .join(" ");
}
