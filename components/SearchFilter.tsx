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

  const getFilterButtonStyle = (filter: string) => {
    const isSelected = selectedFilter === filter;

    switch (filter) {
      case "jaka":
        return isSelected
          ? "bg-green-500 text-white shadow-lg"
          : "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-500 hover:text-white border border-green-300 dark:border-green-700";
      
      case "srednja":
        return isSelected
          ? "bg-yellow-500 text-white shadow-lg"
          : "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500 hover:text-white border border-yellow-300 dark:border-yellow-700";
      
      case "slaba":
        return isSelected
          ? "bg-red-500 text-white shadow-lg"
          : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-500 hover:text-white border border-red-300 dark:border-red-700";
      
      case "sve":
      default:
        return isSelected
          ? "bg-amber-500 text-white shadow-lg"
          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-500 hover:text-white border border-gray-300 dark:border-gray-600";
    }
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
              className={`px-4 py-2 rounded-lg font-medium transition-all ${getFilterButtonStyle(filter)}`}
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