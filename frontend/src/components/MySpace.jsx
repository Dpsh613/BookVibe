import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function MySpace({ currentTheme, onResumeBook, onBack }) {
  const { user, logout } = useContext(AuthContext);
  const [savedBooks, setSavedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/library`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          },
        );
        setSavedBooks(response.data);
      } catch (error) {
        console.error("Failed to fetch library:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchLibrary();
  }, [user]);

  const handleLogout = () => {
    logout();
    onBack(); // Send them back to the landing page
  };

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in duration-1000">
      <button
        onClick={onBack}
        className="absolute top-0 left-4 md:left-0 text-sm tracking-widest uppercase opacity-50 hover:opacity-100 transition-all flex items-center gap-2"
      >
        <span>← Back</span>
      </button>

      {/* NEW: Right Side Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-0 right-4 md:right-0 text-sm tracking-widest uppercase opacity-40 hover:opacity-100 transition-all"
      >
        Log out
      </button>

      {/* Header Area */}
      <div className="text-center mb-16 mt-8 w-full flex flex-col items-center">
        <span className="text-sm tracking-widest uppercase opacity-50 mb-4 block">
          Welcome back, {user?.name.split(" ")[0]}
        </span>
        <h2 className="text-3xl md:text-4xl literary-text">Your Space</h2>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center animate-pulse">
          <div className="w-8 h-8 rounded-full border-t-2 border-current animate-spin mb-6 opacity-50"></div>
          <p className="literary-text text-xl opacity-70">
            Dusting off the shelves...
          </p>
        </div>
      ) : savedBooks.length === 0 ? (
        <div className="py-20 text-center">
          <p className="literary-text text-xl opacity-70 mb-4">
            Your space is currently empty.
          </p>
          <p className="text-sm opacity-50">Go back and discover a feeling.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
          {savedBooks.map((book) => (
            <div
              key={book._id}
              className={`p-6 rounded-2xl border ${currentTheme.border} bg-black/5 dark:bg-white/5 backdrop-blur-sm shadow-lg flex gap-6 items-center transition-all hover:scale-[1.02]`}
            >
              {/* Book Cover */}
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-24 h-36 object-cover rounded shadow-md shrink-0"
                />
              ) : (
                <div className="w-24 h-36 bg-black/20 dark:bg-white/20 rounded shadow-inner flex items-center justify-center shrink-0">
                  <span className="opacity-40 text-[10px] uppercase">
                    No Cover
                  </span>
                </div>
              )}

              {/* Book Details */}
              <div className="flex flex-col flex-grow">
                <h3 className="text-xl literary-text mb-1 leading-tight">
                  {book.title}
                </h3>
                <p className="text-xs uppercase tracking-widest opacity-60 mb-4">
                  {book.author}
                </p>

                {book.moodWhenStarted && (
                  <p className="text-xs italic opacity-50 mb-4">
                    Started while feeling: {book.moodWhenStarted}
                  </p>
                )}

                <button
                  onClick={() => onResumeBook(book)}
                  className={`mt-auto w-full py-2 rounded border border-current opacity-70 hover:opacity-100 transition-all text-sm`}
                >
                  Resume Reading
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
