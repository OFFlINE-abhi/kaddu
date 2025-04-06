"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-4 pr-10 py-2 rounded-lg bg-card text-foreground placeholder:text-muted transition-all border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        aria-label="Search"
      />
      <Search
        className="absolute right-3 top-2.5 h-5 w-5 text-muted pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}
