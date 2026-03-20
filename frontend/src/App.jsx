import React, { useState, useEffect } from "react";
import axios from "axios";
import { ReactReader, ReactReaderStyle } from "react-reader";

// --- CONFIGURATION ---
const MOODS =[
  {
    id: "reflective",
    label: "Reflective",
    bg: "bg-slate-900",
    text: "text-slate-200",
    border: "border-slate-700",
    prompt: "I want to think deeply.",
    hexBg: "#0f172a",
    tocBg: "#1e293b",
    epubText: "#e2e8f0",
    scrollbarThumb: "#334155", 
    scrollbarTrack: "#0f172a", 
  },
  {
    id: "nostalgic",
    label: "Nostalgic",
    bg: "bg-[#f4ecd8]",
    text: "text-amber-950",
    border: "border-amber-200",
    prompt: "I want something comforting.",
    hexBg: "#f4ecd8",
    tocBg: "#eaddc5",
    epubText: "#431407",
    scrollbarThumb: "#dcbda5",
    scrollbarTrack: "#f4ecd8",
  },
  {
    // THEME UPDATE: Deep, Gloomy, Vampiric Red.
    id: "dark",
    label: "Dark",
    bg: "bg-[#1a0b0c]",
    text: "text-[#fecaca]",
    border: "border-[#3f1619]",
    prompt: "I want tension and mystery.",
    hexBg: "#1a0b0c",     // Deep gloomy burgundy almost black
    tocBg: "#2d1417",     // Lighter maroon for the drawer
    epubText: "#fecaca",  // Pale red/pink text for readability
    scrollbarThumb: "#7f1d1d", // Deep blood red scrollbar
    scrollbarTrack: "#1a0b0c", 
  },
  {
    id: "romantic",
    label: "Romantic",
    bg: "bg-rose-50",
    text: "text-rose-950",
    border: "border-rose-200",
    prompt: "I want to feel dreamy.",
    hexBg: "#fff1f2",
    tocBg: "#ffe4e6",
    epubText: "#4c0519",
    scrollbarThumb: "#fecdd3",
    scrollbarTrack: "#fff1f2",
  },
  {
    id: "escapist",
    label: "Escapist",
    bg: "bg-teal-950",
    text: "text-teal-100",
    border: "border-teal-800",
    prompt: "Take me far away.",
    hexBg: "#042f2e",
    tocBg: "#115e59",
    epubText: "#ccfbf1",
    scrollbarThumb: "#134e4a", 
    scrollbarTrack: "#042f2e", 
  },
];

const ERAS =[
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
  const[step, setStep] = useState(0);
  const [mood, setMood] = useState(null);
  const[era, setEra] = useState(null);

  const[books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const[activeBook, setActiveBook] = useState(null);
  const [location, setLocation] = useState(null);

  const[bookData, setBookData] = useState(null);
  const[isBookLoading, setIsBookLoading] = useState(false);

  const [displayStep, setDisplayStep] = useState(0);
  const[fadeState, setFadeState] = useState("opacity-100 translate-y-0");

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

      const proxyUrl = `http://localhost:5000/api/books/proxy?url=${encodeURIComponent(
        activeBook.readLink
      )}`;

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
    setStep(3);
    setIsLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/books/discover?mood=${mood}&era=${selectedEra}`
      );

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
    : { bg: "bg-stone-50", hexBg: "#fafaf9", text: "text-stone-800", border: "border-stone-200" };

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-center transition-colors duration-1000 ease-in-out ${currentTheme.bg} ${currentTheme.text}`}
    >
      {/* STEPS 0 to 3: Constrained Layout */}
      {displayStep < 4 && (
        <>
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
            {/* STEP 0 */}
            {displayStep === 0 && (
              <div className="text-center space-y-8">
                <h1 className="text-5xl md:text-6xl font-light literary-text tracking-wide">
                  Read by feeling.
                </h1>
                <p className="opacity-70 text-lg font-light tracking-wide max-w-md mx-auto">
                  Drop the genres. Forget the categories. Tell us where your mind is right now.
                </p>
                <button
                  onClick={() => setStep(1)}
                  className="mt-8 px-8 py-3 rounded-full border border-current opacity-70 hover:opacity-100 hover:scale-105 transition-all duration-300"
                >
                  Begin
                </button>
              </div>
            )}

            {/* STEP 1 */}
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

            {/* STEP 2 */}
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
                      <span className="text-xs opacity-60 leading-relaxed">{e.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {displayStep === 3 && (
              <div className="w-full flex flex-col items-center text-center space-y-8">
                <span className="text-sm tracking-widest uppercase opacity-50 block">
                  A quiet discovery
                </span>

                {isLoading ? (
                  <div className="py-20 flex flex-col items-center animate-pulse">
                    <div className="w-8 h-8 rounded-full border-t-2 border-current animate-spin mb-6 opacity-50"></div>
                    <p className="literary-text text-xl opacity-70">Curating your space...</p>
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
                              <span className="opacity-40 text-xs">No Cover</span>
                            </div>
                          )}
                          <h3 className="text-2xl literary-text mb-2 text-balance leading-tight">
                            {book.title}
                          </h3>
                          <p className="text-xs uppercase tracking-widest opacity-60 mb-6">
                            {book.author}
                          </p>
                          <p className="text-xs leading-relaxed opacity-70 mb-8 line-clamp-3">
                            Subjects: {book.subjects.slice(0, 3).join(", ")}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setActiveBook(book);
                            setStep(4);
                          }}
                          className={`w-full py-3 rounded-lg bg-current opacity-90 hover:opacity-100 hover:scale-[1.02] transition-all flex justify-center items-center`}
                        >
                          <span
                            className={`text-sm font-medium ${
                              mood === "nostalgic" || mood === "romantic"
                                ? "text-white"
                                : "text-black dark:text-zinc-900"
                            }`}
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
        </>
      )}

      {/* STEP 4: PERFECTION */}
      {displayStep === 4 && activeBook && (
        <div 
          className="fixed inset-0 z-50 flex flex-col animate-in fade-in duration-1000 font-sans" 
          style={{ backgroundColor: currentTheme.hexBg }}
        >
          {/* CUSTOM NAVBAR HEADER - Increased Padding Here (px-10 md:px-16 py-8 md:py-10) */}
          <div className="flex justify-between items-center px-10 md:px-16 py-8 md:py-10 border-b" style={{ borderColor: currentTheme.tocBg }}>
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight opacity-90">{activeBook.title}</h2>
              <span className="text-xs uppercase tracking-widest opacity-60">{activeBook.author}</span>
            </div>
            <button
              onClick={() => {
                setStep(3);
                setBookData(null);
                console.log("Saving to DB before leaving: ", location);
              }}
              className="text-sm px-8 py-3 rounded-full border border-current opacity-60 hover:opacity-100 transition-all hover:bg-black/5 dark:hover:bg-white/5"
            >
              Close Book
            </button>
          </div>

          <div className="relative flex-grow w-full">
            {isBookLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center animate-pulse">
                <div className="w-8 h-8 rounded-full border-t-2 border-current animate-spin mb-4 opacity-50"></div>
                <p className="literary-text text-xl opacity-70">Opening the pages...</p>
              </div>
            ) : bookData ? (
              <div className="absolute inset-0 w-full h-full">
                <ReactReader
                  url={bookData}
                  title={activeBook.title}
                  location={location}
                  locationChanged={(epubcifi) => setLocation(epubcifi)}
                  epubOptions={{
                    manager: 'continuous',
                    flow: 'scrolled',
                    allowScriptedContent: true,
                  }}
                  getRendition={(rendition) => {
                    rendition.themes.default({
                      "body": {
                        "background": `${currentTheme.hexBg} !important`,
                        "color": `${currentTheme.epubText} !important`,
                        "font-family": '"Georgia", "Times New Roman", serif !important',
                        "font-size": "125% !important",
                        "line-height": "1.8 !important",
                        "padding": "5% 8% !important",
                        "scrollbar-width": "thin",
                        "scrollbar-color": `${currentTheme.scrollbarThumb} ${currentTheme.scrollbarTrack}`
                      },
                      "::-webkit-scrollbar": {
                        "width": "10px !important",
                      },
                      "::-webkit-scrollbar-track": {
                        "background": `${currentTheme.scrollbarTrack} !important`,
                      },
                      "::-webkit-scrollbar-thumb": {
                        "background": `${currentTheme.scrollbarThumb} !important`,
                        "border-radius": "6px !important",
                        "border": `3px solid ${currentTheme.scrollbarTrack} !important`
                      },
                      "p": {
                        "font-size": "1.1rem !important",
                      },
                      "h1, h2, h3, h4, h5, h6": {
                        "color": `${currentTheme.epubText} !important`,
                      },
                    });
                  }}
                  readerStyles={{
                    ...ReactReaderStyle,
                    readerArea: {
                      ...ReactReaderStyle.readerArea,
                      backgroundColor: currentTheme.hexBg,
                    },
                    titleArea: { display: "none" },
                    arrow: { display: 'none' },
                    footerArea: { backgroundColor: currentTheme.hexBg, color: currentTheme.epubText, opacity: 0.6},
                    
                    // --- THE FIX FOR THE BURGER MENU / TOC ---
                    tocButton: { 
                      ...ReactReaderStyle.tocButton,
                      color: currentTheme.epubText, 
                      margin: "15px", // Gives it breathing room from the edges
                      opacity: 0.8,
                    },
                    tocButtonBar: {
                      ...ReactReaderStyle.tocButtonBar,
                      background: currentTheme.epubText,
                    },
                    tocButtonExpanded: { 
                      ...ReactReaderStyle.tocButtonExpanded,
                      background: currentTheme.tocBg 
                    },
                    tocArea: { 
                      ...ReactReaderStyle.tocArea,
                      backgroundColor: currentTheme.tocBg, 
                      color: currentTheme.epubText,
                      padding: "40px 24px", 
                      width: "350px", 
                      boxShadow: "4px 0 25px rgba(0,0,0,0.5)", 
                    },
                  }}
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="opacity-50 text-sm">Failed to load the book. Please try another.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}