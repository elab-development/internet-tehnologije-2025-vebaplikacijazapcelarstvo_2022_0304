"use client";
import { useState, useEffect } from "react";

type SearchFilterProps = {
  onSearch: (query: string) => void;
  onFilterChange: (filter: string) => void;
  placeholder?: string;
};

export default function SearchFilter({
  onSearch,
  onFilterChange,
  placeholder = "Pretraži...",
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("sve");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search (čeka 500ms pre pretrage)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Pozovi onSearch kada se debounced query promeni
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    onFilterChange(filter);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     focus:ring-2 focus:ring-amber-500 focus:border-transparent 
                     dark:bg-gray-700 dark:text-white transition-all"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          {["sve", "slaba", "srednja", "jaka"].map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedFilter === filter
                  ? "bg-amber-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Active search indicator */}
      {debouncedQuery && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Pretraga: <span className="font-semibold">{debouncedQuery}</span>
        </div>
      )}
    </div>
  );
}