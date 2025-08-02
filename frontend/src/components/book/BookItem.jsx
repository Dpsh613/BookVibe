// frontend/src/components/book/BookItem.jsx
import React from "react";
import BookActionButton from "./BookActionButton";

function BookItem({ book, ...props }) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-lg">
      <div className="flex-1 min-w-0">
        <p className="truncate font-semibold text-slate-800">
          {book.title || "No Title"}
        </p>
        <p className="truncate text-sm text-slate-500">
          {book.authors || "Unknown Author"}
        </p>
      </div>
      <div className="flex-shrink-0 ml-4">
        <BookActionButton
          {...props}
          onAdd={() => props.onAdd(book)}
          onRemove={() => props.onRemove(book.id)}
        />
      </div>
    </div>
  );
}

export default BookItem;
