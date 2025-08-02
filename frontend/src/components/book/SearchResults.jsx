// frontend/src/components/book/SearchResults.jsx
import React from "react";
import BookItem from "./BookItem";
import Spinner from "../ui/Spinner";

function SearchResults({
  isLoading,
  results,
  currentUser,
  onAddToList,
  wantListIds,
}) {
  if (isLoading)
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  if (results === null)
    return (
      <div className="text-center py-8 bg-slate-50 rounded-lg">
        <p className="text-slate-500">Perform a search to see results here.</p>
      </div>
    );
  if (results.length === 0)
    return (
      <div className="text-center py-8 bg-slate-50 rounded-lg">
        <p className="text-slate-600">
          No books found. Try a different search!
        </p>
      </div>
    );

  return (
    <ul role="list" className="-my-4 divide-y divide-slate-200">
      {results.map((book) => (
        <li key={book.id} className="py-1 hover:bg-slate-50 rounded-lg">
          <BookItem
            book={book}
            context="search"
            currentUser={currentUser}
            isInList={wantListIds.has(book.id)}
            onAdd={onAddToList}
          />
        </li>
      ))}
    </ul>
  );
}
export default SearchResults;
