// frontend/src/components/book/BookActionButton.jsx
import React from "react";

function BookActionButton({ context, currentUser, isInList, onAdd, onRemove }) {
  const handleAddClick = () => {
    // App.jsx will handle the login prompt via the onAddToList handler
    if (onAdd && !isInList) {
      onAdd();
    }
  };

  if (context === "list") {
    return (
      <button
        onClick={onRemove}
        className="text-sm font-semibold text-red-600 hover:text-red-500"
      >
        Remove
      </button>
    );
  }

  if (context === "search") {
    if (currentUser) {
      if (isInList) {
        return (
          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
            In List
          </span>
        );
      }
      return (
        <button
          onClick={handleAddClick}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
        >
          Add to List
        </button>
      );
    }
    // Logged out, onAdd will trigger the login prompt in App.jsx
    return (
      <button
        onClick={handleAddClick}
        className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
      >
        Add to List
      </button>
    );
  }

  return null;
}

export default BookActionButton;
