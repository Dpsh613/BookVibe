import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios

// --- CONFIGURATION ---
const MOODS = [
  {
    id: "reflective",
    label: "Reflective",
    bg: "bg-slate-900",
    text: "text-slate-200",
    border: "border-slate-700",
    prompt: "I want to think deeply.",
  },
  {
    id: "nostalgic",
    label: "Nostalgic",
    bg: "bg-[#f4ecd8]",
    text: "text-amber-950",
    border: "border-amber-200",
    prompt: "I want something comforting.",
  },
  {
    id: "dark",
    label: "Dark",
    bg: "bg-zinc-950",
    text: "text-zinc-300",
    border: "border-zinc-800",
    prompt: "I want tension and mystery.",
  },
  {
    id: "romantic",
    label: "Romantic",
    bg: "bg-rose-50",
    text: "text-rose-950",
    border: "border-rose-200",
    prompt: "I want to feel dreamy.",
  },
  {
    id: "escapist",
    label: "Escapist",
    bg: "bg-teal-950",
    text: "text-teal-100",
    border: "border-teal-800",
    prompt: "Take me far away.",
  },
];

const ERAS = [
  {
    id: "victorian",
    label: "19th Century",
    desc: "Gaslight, grand estates, and classical prose.",
  },
  {
    id: "roaring",
    label: "Early 20th Century",
    desc: "Modernism, societal shifts, and jazz age.",
  },
  {
    id: "ancient",
    label: "Antiquity",
    desc: "Myths, early philosophy, and epics.",
  },
];

export default function App() {
  const [step, setStep] = useState(0);
  const [mood, setMood] = useState(null);
  const [era, setEra] = useState(null);

  // --- NEW STATE FOR API DATA ---
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [displayStep, setDisplayStep] = useState(0);
  const [fadeState, setFadeState] = useState("opacity-100 translate-y-0");

  // Smooth Transitions
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

  // --- NEW FUNCTION TO FETCH BOOKS ---
  const handleDiscover = async (selectedEra) => {
    setEra(selectedEra);
    setStep(3); // Move to loading/results step
    setIsLoading(true);

    try {
      // Call your local backend API!
      const response = await axios.get(
        `http://localhost:5000/api/books/discover?mood=${mood}&era=${selectedEra}`,
      );

      // Delay slightly just to ensure the smooth CSS transition finishes before snapping data in
      setTimeout(() => {
        setBooks(response.data.results);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error fetching books:", error);
      setIsLoading(false);
    }
  };

  const currentTheme = mood
    ? MOODS.find((m) => m.id === mood)
    : { bg: "bg-stone-50", text: "text-stone-800", border: "border-stone-200" };

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-center transition-colors duration-1000 ease-in-out ${currentTheme.bg} ${currentTheme.text}`}
    >
      {displayStep > 0 && (
        <div
          className="absolute top-8 left-8 text-sm tracking-widest uppercase opacity-50 cursor-pointer hover:opacity-100 transition-opacity"
          onClick={() => {
            setStep(0);
            setBooks([]);
          }}
        >
          BookVibe
        </div>
      )}

      <main
        className={`w-full max-w-4xl px-6 transition-all duration-700 ease-in-out ${fadeState}`}
      >
        {/* STEP 0: Landing */}
        {displayStep === 0 && (
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-light literary-text tracking-wide">
              Read by feeling.
            </h1>
            <p className="opacity-70 text-lg font-light tracking-wide max-w-md mx-auto">
              Drop the genres. Forget the categories. Tell us where your mind is
              right now.
            </p>
            <button
              onClick={() => setStep(1)}
              className="mt-8 px-8 py-3 rounded-full border border-current opacity-70 hover:opacity-100 hover:scale-105 transition-all duration-300"
            >
              Begin
            </button>
          </div>
        )}

        {/* STEP 1: Mood Selector */}
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

        {/* STEP 2: Era Selector */}
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
                  // TRIGGER API CALL HERE
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

        {/* STEP 3: Discovery (The Real Books) */}
        {displayStep === 3 && (
          <div className="w-full flex flex-col items-center text-center space-y-8">
            <span className="text-sm tracking-widest uppercase opacity-50 block">
              A quiet discovery
            </span>

            {isLoading ? (
              // --- BEAUTIFUL LOADING STATE ---
              <div className="py-20 flex flex-col items-center animate-pulse">
                <div className="w-8 h-8 rounded-full border-t-2 border-current animate-spin mb-6 opacity-50"></div>
                <p className="literary-text text-xl opacity-70">
                  Curating your space...
                </p>
              </div>
            ) : (
              // --- REAL BOOK RESULTS ---
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
                      <h3 className="text-2xl literary-text mb-2 text-balance leading-tight">
                        {book.title}
                      </h3>
                      <p className="text-xs uppercase tracking-widest opacity-60 mb-6">
                        {book.author}
                      </p>

                      {/* Real Book Cover! */}
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-32 h-48 object-cover mx-auto rounded shadow-lg mb-6"
                        />
                      ) : (
                        <div className="w-32 h-48 mx-auto bg-black/20 dark:bg-white/20 rounded shadow-inner mb-6 flex items-center justify-center">
                          <span className="opacity-40 text-xs">No Cover</span>
                        </div>
                      )}

                      <p className="text-xs leading-relaxed opacity-70 mb-8 line-clamp-3">
                        Subjects: {book.subjects.slice(0, 3).join(", ")}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        console.log("Open EPUB link:", book.readLink)
                      }
                      className={`w-full py-3 rounded-lg bg-current opacity-90 hover:opacity-100 hover:scale-[1.02] transition-all flex justify-center items-center`}
                    >
                      <span
                        className={`text-sm font-medium ${mood === "nostalgic" || mood === "romantic" ? "text-white" : "text-black dark:text-zinc-900"}`}
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
      </main>
    </div>
  );
}
