"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce effect to reduce frequent updates
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(handler);
  }, [query]);

  // Focus input when clicking the search icon
  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div role="search" className="relative w-full max-w-md">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-4 pr-10 py-2 rounded-lg bg-card text-foreground placeholder:text-muted border border-transparent transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        aria-label="Search"
        aria-live="polite"
      />
      <Search
        className="absolute right-3 top-2.5 h-5 w-5 text-muted cursor-pointer"
        aria-hidden="true"
        onClick={focusInput} // Click to focus input
      />
    </div>
  );
}
