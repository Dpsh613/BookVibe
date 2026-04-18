import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { MOODS, ERAS, DEFAULT_THEME } from "./utils/constants";
import ReadingRoom from "./components/ReadingRoom";
import MySpace from "./components/MySpace";
import { AuthContext } from "./context/AuthContext";
import InteractiveWait from "./components/InteractiveWait";
import SearchOverlay from "./components/SearchOverlay"; // NEW IMPORT

export default function App() {
  const { user, logout } = useContext(AuthContext);

  const [step, setStep] = useState(0);
  const [prevStep, setPrevStep] = useState(0);

  const [mood, setMood] = useState(null);
  const [era, setEra] = useState(null);

  // dislay none on css so it wont always reload when searching books...
  const [searchId, setSearchId] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // NEW STATE

  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userReadyForBooks, setUserReadyForBooks] = useState(false);

  const [activeBook, setActiveBook] = useState(null);
  const [location, setLocation] = useState(null);

  const [bookData, setBookData] = useState(null);
  const [isBookLoading, setIsBookLoading] = useState(false);

  const [displayStep, setDisplayStep] = useState(0);
  const [fadeState, setFadeState] = useState("opacity-100 translate-y-0");

  useEffect(() => {
    if (step !== displayStep) {
      setFadeState("opacity-0 translate-y-4");
      const timeout = setTimeout(() => {
        setDisplayStep(step);
        setFadeState("opacity-100 translate-y-0");
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [step, displayStep]);

  useEffect(() => {
    if (displayStep === 4 && activeBook && !bookData) {
      setIsBookLoading(true);
      const proxyUrl = `${import.meta.env.VITE_API_URL}/api/books/proxy?url=${encodeURIComponent(activeBook.readLink)}`;
      axios
        .get(proxyUrl, { responseType: "arraybuffer" })
        .then((response) => {
          setBookData(response.data);
          setIsBookLoading(false);
        })
        .catch((error) => {
          console.error("Failed to load book data:", error);
          setIsBookLoading(false);
        });
    }
  }, [displayStep, activeBook, bookData]);

  const handleDiscover = async (selectedEra) => {
    setEra(selectedEra);
    setSearchId((prev) => prev + 1);
    setStep(3);
    setIsLoading(true);
    setUserReadyForBooks(false);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/books/discover?mood=${mood}&era=${selectedEra}`,
      );
      setBooks(response.data.results);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error);
      setIsLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setIsSearchOpen(false);

    setSearchId((prev) => prev + 1);
    setStep(3);
    setIsLoading(true);
    setUserReadyForBooks(false);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/books/search?q=${encodeURIComponent(query)}`,
      );
      setBooks(response.data.results);
      setIsLoading(false);
    } catch (error) {
      console.error("Error searching books:", error);
      setIsLoading(false);
    }
  };

  const handleResumeBook = (savedBook) => {
    setBookData(null);
    setActiveBook({
      id: savedBook.bookId,
      title: savedBook.title,
      author: savedBook.author,
      readLink: savedBook.readLink,
      coverImage: savedBook.coverImage,
    });
    setLocation(savedBook.lastLocation);
    if (savedBook.moodWhenStarted) setMood(savedBook.moodWhenStarted);
    setStep(4);
  };

  const handleLogout = () => {
    logout();
    setStep(0);
  };

  const currentTheme = mood ? MOODS.find((m) => m.id === mood) : DEFAULT_THEME;

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-center transition-colors duration-1000 ease-in-out ${currentTheme.bg} ${currentTheme.text}`}
    >
      {/* SEARCH OVERLAY */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearch}
        currentTheme={currentTheme}
      />

      {/* FIXED GLOBAL HEADER */}
      {displayStep !== 4 && (
        <header className="fixed top-0 left-0 w-full px-6 py-8 md:px-10 flex justify-between items-center z-50 pointer-events-none">
          <div className="pointer-events-auto">
            {displayStep === 5 ? (
              <button
                onClick={() => setStep(prevStep)}
                className="text-sm tracking-widest uppercase opacity-50 hover:opacity-100 transition-all flex items-center gap-2"
              >
                ← Back
              </button>
            ) : (
              // ALWAYS VISIBLE BOOKVIBE LOGO
              <button
                onClick={() => {
                  setStep(0);
                  setBooks([]);
                }}
                className="text-sm tracking-widest uppercase opacity-50 hover:opacity-100 transition-all font-semibold"
              >
                BookVibe
              </button>
            )}
          </div>

          <div className="pointer-events-auto flex items-center gap-6 md:gap-8">
            {/* NEW SEARCH BUTTON ALWAYS IN HEADER */}
            {displayStep !== 5 && (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-sm tracking-widest uppercase opacity-50 hover:opacity-100 transition-all flex items-center gap-2"
              >
                Search
              </button>
            )}

            {displayStep === 5 ? (
              <button
                onClick={handleLogout}
                className="text-sm tracking-widest uppercase opacity-40 hover:opacity-100 transition-all"
              >
                Log out
              </button>
            ) : user ? (
              <button
                onClick={() => {
                  setPrevStep(step);
                  setStep(5);
                }}
                className="text-sm tracking-widest uppercase opacity-50 hover:opacity-100 transition-all"
              >
                My Space
              </button>
            ) : null}
          </div>
        </header>
      )}

      {/* Main Content Area */}
      {displayStep !== 4 && (
        <main
          className={`w-full max-w-4xl px-6 transition-all duration-700 ease-in-out ${fadeState} mt-16`}
        >
          {displayStep === 0 && (
            <div className="text-center space-y-8">
              <h1 className="text-5xl md:text-6xl font-light literary-text tracking-wide">
                Read by feeling.
              </h1>
              <p className="opacity-70 text-lg font-light tracking-wide max-w-md mx-auto">
                Drop the genres. Forget the categories. Tell us where your mind
                is right now.
              </p>
              <button
                onClick={() => setStep(1)}
                className="mt-8 px-8 py-3 rounded-full border border-current opacity-70 hover:opacity-100 hover:scale-105 transition-all duration-300"
              >
                Begin
              </button>
            </div>
          )}

          {/* STEP 1 - RESTORED ORIGINAL LAYOUT */}
          {displayStep === 1 && (
            <div className="w-full">
              <h2 className="text-3xl md:text-4xl text-center mb-12 literary-text">
                How are you feeling?
              </h2>
              <div className="flex flex-col gap-4">
                {MOODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setMood(m.id);
                      setStep(2);
                    }}
                    className={`group w-full p-6 text-left rounded-xl border ${currentTheme.border} hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 flex justify-between items-center`}
                  >
                    <span className="text-xl literary-text">{m.label}</span>
                    <span className="opacity-0 group-hover:opacity-60 transition-opacity text-sm tracking-wider">
                      {m.prompt}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {displayStep === 2 && (
            <div className="w-full">
              <div className="text-center mb-12">
                <span className="text-sm tracking-widest uppercase opacity-50 mb-4 block">
                  Mood: {MOODS.find((m) => m.id === mood)?.label}
                </span>
                <h2 className="text-3xl md:text-4xl literary-text">
                  Where do you want to escape to?
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {ERAS.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => handleDiscover(e.id)}
                    className={`p-6 text-center rounded-xl border ${currentTheme.border} hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 flex flex-col items-center gap-3 hover:-translate-y-1`}
                  >
                    <span className="text-lg literary-text">{e.label}</span>
                    <span className="text-xs opacity-60 leading-relaxed">
                      {e.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* displayStepREPLACE {displayStep === 3 && ...} WITH THIS: */}
          <div
            className={
              displayStep === 3
                ? "w-full flex flex-col items-center text-center space-y-8 min-h-[60vh] justify-center"
                : "hidden"
            }
          >
            {!userReadyForBooks ? (
              <InteractiveWait
                key={searchId} // <-- ADD THE KEY HERE
                phase="discovery"
                mood={mood}
                isReady={!isLoading && books.length > 0}
                onProceed={() => setUserReadyForBooks(true)}
                currentTheme={currentTheme}
                buttonText="View Recommendations"
              />
            ) : (
              <div className="w-full flex flex-col items-center animate-in fade-in duration-700">
                <span className="text-sm tracking-widest uppercase opacity-50 block mb-8">
                  A quiet discovery
                </span>

                {books.length === 0 ? (
                  <div className="py-12 text-center max-w-md">
                    <p className="text-xl literary-text opacity-70 mb-4">
                      We couldn't find exactly what you were looking for.
                    </p>
                    <button
                      onClick={() => setStep(1)}
                      className="text-sm opacity-50 hover:opacity-100 underline decoration-1 underline-offset-4 transition-all mt-4"
                    >
                      Try another search or pick a mood
                    </button>
                  </div>
                ) : (
                  <div
                    className="flex overflow-x-auto gap-6 w-full pb-8 snap-x scrollbar-hide"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {books.map((book) => (
                      <div
                        key={book.id}
                        className={`flex-shrink-0 w-80 p-8 rounded-2xl border ${currentTheme.border} bg-black/5 dark:bg-white/5 backdrop-blur-sm shadow-xl transition-all duration-500 snap-center flex flex-col justify-between`}
                      >
                        <div>
                          {book.coverImage ? (
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="w-32 h-48 object-cover mx-auto rounded shadow-lg mb-6"
                            />
                          ) : (
                            <div className="w-32 h-48 mx-auto bg-black/20 dark:bg-white/20 rounded shadow-inner mb-6 flex items-center justify-center">
                              <span className="opacity-40 text-xs">
                                No Cover
                              </span>
                            </div>
                          )}
                          <h3 className="text-2xl literary-text mb-2 text-balance leading-tight">
                            {book.title}
                          </h3>
                          <p className="text-xs uppercase tracking-widest opacity-60 mb-6">
                            {book.author}
                          </p>
                          <p className="text-xs leading-relaxed opacity-70 mb-8 line-clamp-3">
                            Subjects: {book.subjects?.slice(0, 3).join(", ")}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setBookData(null);
                            setLocation(null);
                            setActiveBook(book);
                            setStep(4);
                          }}
                          className={`w-full py-3 rounded-lg ${currentTheme.buttonBg || "bg-current"} ${currentTheme.buttonText || currentTheme.text} opacity-95 hover:opacity-100 hover:scale-[1.02] shadow-md transition-all flex justify-center items-center`}
                        >
                          <span
                            className="text-sm font-semibold tracking-wide"
                            style={
                              !currentTheme.buttonBg
                                ? { color: currentTheme.epubText }
                                : {}
                            }
                          >
                            Enter the Book
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => setStep(1)}
                  className="text-sm opacity-50 hover:opacity-100 underline decoration-1 underline-offset-4 transition-all mt-4"
                >
                  Change my mood
                </button>
              </div>
            )}
          </div>

          {displayStep === 5 && (
            <MySpace
              currentTheme={currentTheme}
              onResumeBook={handleResumeBook}
            />
          )}
        </main>
      )}

      {displayStep === 4 && activeBook && (
        <ReadingRoom
          activeBook={activeBook}
          bookData={bookData}
          location={location}
          setLocation={setLocation}
          currentTheme={currentTheme}
          isBookLoading={isBookLoading}
          mood={mood}
          onClose={() => {
            setStep(3);
            setTimeout(() => {
              setBookData(null);
              setActiveBook(null);
              setLocation(null);
            }, 600);
          }}
        />
      )}
    </div>
  );
}
