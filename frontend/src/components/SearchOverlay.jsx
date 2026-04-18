import React, { useState, useEffect } from "react";

export default function SearchOverlay({
  isOpen,
  onClose,
  onSearch,
  currentTheme,
}) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const suggestions = [
    "Jane Austen",
    "Edgar Allan Poe",
    "Mystery",
    "Philosophy",
    "Charles Dickens",
    "Ghost Stories",
  ];

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 animate-in fade-in duration-500 bg-black/50 backdrop-blur-md ${currentTheme?.text}`}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-8 right-8 uppercase tracking-widest text-sm opacity-50 hover:opacity-100 transition-opacity"
      >
        Close ✕
      </button>

      {/* Main Search Container - Uses theme colors! */}
      <div
        className="w-full max-w-2xl p-10 md:p-16 rounded-[2rem] border shadow-2xl"
        style={{
          backgroundColor: currentTheme.hexBg,
          borderColor: currentTheme.epubText,
        }}
      >
        <h2 className="text-2xl md:text-4xl mb-10 literary-text text-center leading-tight">
          Know exactly where you want to wander?
        </h2>

        <form
          onSubmit={handleSubmit}
          className="relative mb-12 flex items-center"
        >
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, or feeling..."
            className="w-full bg-transparent border-b border-current pb-4 text-xl md:text-2xl outline-none opacity-60 focus:opacity-100 transition-all placeholder-current"
          />
          <button
            type="submit"
            className="absolute right-0 bottom-4 uppercase text-xs tracking-widest opacity-50 hover:opacity-100 font-bold"
          >
            Search
          </button>
        </form>

        {/* Suggestions */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest opacity-50 mb-6">
            Or explore by author & genre
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => onSearch(s)}
                className="px-5 py-2 rounded-full border border-current opacity-60 hover:opacity-100 hover:scale-105 transition-all text-sm shadow-sm"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
