// frontend/src/components/SearchBar.jsx
import React, { useState } from "react";

function SearchBar({ onSearch, isLoading }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!searchTerm.trim()) return;
    onSearch(searchTerm.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <svg
          className="h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for 'Moby Dick' or 'Jane Austen'..."
        className="block w-full rounded-md border-0 py-2.5 pl-10 pr-32 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="absolute inset-y-0 right-0 flex items-center rounded-r-md bg-indigo-600 px-4 font-semibold text-sm text-white hover:bg-indigo-500 disabled:bg-slate-400"
        disabled={isLoading}
      >
        {isLoading ? "..." : "Search"}
      </button>
    </form>
  );
}

export default SearchBar;
