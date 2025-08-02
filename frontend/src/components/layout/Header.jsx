// frontend/src/components/layout/Header.jsx
import React from "react";

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto max-w-4xl p-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Classic Book Finder
        </h1>
        <p className="mt-1 text-md text-slate-600">
          Discover and track your next favorite classic.
        </p>
      </div>
    </header>
  );
}

export default Header;
