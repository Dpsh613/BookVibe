// frontend/src/components/book/WantToReadList.jsx
import React from "react";
import BookItem from "./BookItem";
import Spinner from "../ui/Spinner";

function WantToReadList({ list, onRemoveFromList, isLoading, isLoggedIn }) {
  if (isLoading)
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  if (!isLoggedIn)
    return (
      <div className="text-center py-8 bg-slate-50 rounded-lg">
        <p className="text-slate-600">Log in to see your list.</p>
      </div>
    );
  if (list.length === 0)
    return (
      <div className="text-center py-8 bg-slate-50 rounded-lg">
        <p className="text-slate-600">
          Your list is empty. Add books from the search results!
        </p>
      </div>
    );

  return (
    <ul role="list" className="-my-4 divide-y divide-slate-200">
      {list.map((book) => (
        <li
          key={book.id || book._id}
          className="py-1 hover:bg-slate-50 rounded-lg"
        >
          <BookItem
            book={book}
            context="list"
            onRemove={onRemoveFromList}
            currentUser={isLoggedIn} // Pass true since we know they are logged in
          />
        </li>
      ))}
    </ul>
  );
}
export default WantToReadList;
