import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function MySpace({ currentTheme, onResumeBook }) {
  const { user } = useContext(AuthContext);
  const [savedBooks, setSavedBooks] = useState([]);
  const [activeTab, setActiveTab] = useState("books");
  const [reflections, setReflections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/library`,
          { headers: { Authorization: `Bearer ${user.token}` } },
        );
        setSavedBooks(bookRes.data);

        const reflectionRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/reflections`,
          { headers: { Authorization: `Bearer ${user.token}` } },
        );
        setReflections(reflectionRes.data);
      } catch (error) {
        console.error("Failed to fetch space data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in duration-1000 pt-4">
      <div className="text-center mb-12 w-full flex flex-col items-center">
        <span className="text-sm tracking-widest uppercase opacity-50 mb-4 block">
          Welcome back, {user?.name.split(" ")[0]}
        </span>
        <h2 className="text-4xl md:text-5xl literary-text">
          Your Personal Space
        </h2>
      </div>

      <div className="flex gap-10 mb-12 border-b border-current/20 pb-4">
        <button
          onClick={() => setActiveTab("books")}
          className={`uppercase tracking-widest text-sm transition-all ${activeTab === "books" ? "opacity-100 font-semibold" : "opacity-40"}`}
        >
          Library
        </button>
        <button
          onClick={() => setActiveTab("journal")}
          className={`uppercase tracking-widest text-sm transition-all ${activeTab === "journal" ? "opacity-100 font-semibold" : "opacity-40"}`}
        >
          Mood Journal
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center py-24 opacity-50">
          <div className="w-8 h-8 rounded-full border-t-2 border-current animate-spin mb-4"></div>
        </div>
      ) : activeTab === "journal" ? (
        // --- IMPROVED JOURNAL LAYOUT ---
        <div className="columns-1 md:columns-2 gap-6 w-full max-w-5xl px-4 space-y-6">
          {reflections.length === 0 ? (
            <div className="py-20 text-center col-span-full">
              <p className="literary-text text-2xl opacity-70 mb-4">
                The pages are blank.
              </p>
              <p className="text-sm opacity-50">
                Record a passing thought next time a book opens.
              </p>
            </div>
          ) : (
            reflections.map((ref) => (
              <div
                key={ref._id}
                className={`break-inside-avoid p-8 rounded-xl border ${currentTheme.border} bg-white/5 dark:bg-black/5 shadow-sm hover:-translate-y-1 transition-transform relative overflow-hidden group`}
              >
                {/* Decorative pin/tape aesthetic */}
                <div
                  className={`absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-current opacity-10 rounded-b-md`}
                ></div>

                <div className="flex justify-between items-end mb-6 border-b border-current/10 pb-4">
                  <span className="text-xs uppercase tracking-widest opacity-40 font-semibold">
                    {new Date(ref.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-current/20 opacity-60">
                    {ref.mood}
                  </span>
                </div>

                <h4 className="text-sm font-semibold opacity-60 mb-3 uppercase tracking-wider line-clamp-2">
                  {ref.prompt}
                </h4>

                <p className="literary-text text-2xl leading-relaxed opacity-90 mb-6 italic">
                  "{ref.answer}"
                </p>

                {ref.associatedBook && (
                  <p className="text-xs uppercase tracking-widest opacity-40 pt-4 mt-4 border-t border-current/10">
                    Opened: <span className="italic">{ref.associatedBook}</span>
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        // --- LIBRARY LAYOUT ---
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl px-4">
          {savedBooks.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <p className="literary-text text-xl opacity-70 mb-4">
                Your library is currently empty.
              </p>
              <p className="text-sm opacity-50">
                Go back and discover a feeling.
              </p>
            </div>
          ) : (
            savedBooks.map((book) => (
              <div
                key={book._id}
                className={`p-6 rounded-2xl border ${currentTheme.border} bg-white/5 dark:bg-black/5 shadow-md flex flex-col gap-4 items-center text-center transition-all hover:-translate-y-2`}
              >
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-32 h-48 object-cover rounded shadow-xl -mt-12"
                  />
                ) : (
                  <div className="w-32 h-48 bg-black/10 dark:bg-white/10 rounded shadow-inner flex items-center justify-center -mt-12">
                    <span className="opacity-40 text-[10px] uppercase">
                      No Cover
                    </span>
                  </div>
                )}
                <div className="flex flex-col flex-grow w-full mt-2">
                  <h3 className="text-xl literary-text mb-1 leading-tight line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-xs uppercase tracking-widest opacity-60 mb-4">
                    {book.author}
                  </p>
                  <button
                    onClick={() => onResumeBook(book)}
                    className={`mt-auto w-full py-3 rounded-lg ${currentTheme.buttonBg} ${currentTheme.buttonText} opacity-90 hover:opacity-100 transition-all text-xs uppercase tracking-widest font-semibold shadow-sm`}
                  >
                    Resume Reading
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
