import React, { useState, useContext } from "react";
import axios from "axios";
import { ReactReader, ReactReaderStyle } from "react-reader";
import { AuthContext } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import InteractiveWait from "./InteractiveWait";

export default function ReadingRoom({
  activeBook,
  bookData,
  location,
  setLocation,
  currentTheme,
  isBookLoading,
  onClose,
  mood,
}) {
  const { user } = useContext(AuthContext);
  const [userReadyToRead, setUserReadyToRead] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authReason, setAuthReason] = useState(null); // 'book' or 'journal'

  // 1. User clicks Close Book
  const handleCloseRequest = () => {
    setShowPrompt(true); // Ask them if they want to save
  };

  // 2. User clicks "Yes, save my spot"
  const handleSaveProgress = async () => {
    if (!user) {
      setShowAuthModal(true); // Need to login first!
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/library/save`,
        {
          bookId: activeBook.id,
          title: activeBook.title,
          author: activeBook.author,
          coverImage: activeBook.coverImage,
          readLink: activeBook.readLink,
          lastLocation: location,
          moodWhenStarted: mood,
        },
        { headers: { Authorization: `Bearer ${user.token}` } },
      );
      onClose();
    } catch (error) {
      console.error("Failed to save:", error);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col animate-in fade-in duration-1000 font-sans"
      style={{ backgroundColor: currentTheme.hexBg, color: currentTheme.text }}
    >
      {/* Save Prompt Overlay */}
      {showPrompt && !showAuthModal && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="text-center space-y-8 p-10">
            <h3 className="text-3xl md:text-4xl literary-text text-white">
              Bookmark your place?
            </h3>
            <div className="flex flex-col gap-4 max-w-xs mx-auto">
              <button
                onClick={handleSaveProgress}
                className="px-8 py-4 rounded-full bg-white text-black hover:scale-105 transition-all"
              >
                Yes, save my spot
              </button>
              <button
                onClick={() => onClose()}
                className="px-8 py-4 rounded-full border border-white text-white opacity-70 hover:opacity-100 transition-all"
              >
                No, just close
              </button>
              <button
                onClick={() => setShowPrompt(false)}
                className="w-full py-3 mt-2 text-sm text-white opacity-50 hover:opacity-100 underline underline-offset-4 transition-all"
              >
                Cancel, return to reading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal Triggered if not logged in */}
      {showAuthModal && (
        <AuthModal
          currentTheme={currentTheme}
          onComplete={() => {
            setShowAuthModal(false);
            // 2. Only save the book if that was the reason!
            if (authReason === "book") {
              handleSaveProgress();
            }
          }}
          onCancel={() => {
            setShowAuthModal(false);
            if (authReason === "book") setShowPrompt(false);
          }}
        />
      )}

      {/* HEADER NAVBAR */}
      <div
        className="flex justify-between items-center px-4 md:px-10 py-3 md:py-6 border-b shrink-0"
        style={{ borderColor: currentTheme.tocBg }}
      >
        <div className="flex flex-col min-w-0 mr-4">
          <h2 className="text-lg md:text-2xl font-bold tracking-tight opacity-90 truncate">
            {activeBook.title}
          </h2>
          <span className="text-xs md:text-sm uppercase tracking-widest opacity-60 truncate mt-0.5">
            {activeBook.author}
          </span>
        </div>
        <button
          onClick={handleCloseRequest}
          className="shrink-0 text-xs md:text-sm px-5 py-2 md:px-8 md:py-3 rounded-full border border-current opacity-60 hover:opacity-100 transition-all hover:bg-black/5 dark:hover:bg-white/5"
        >
          Close Book
        </button>
      </div>

      {/* READER AREA */}
      <div className="relative flex-grow w-full overflow-hidden">
        {!userReadyToRead ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center overflow-y-auto pb-10">
            <InteractiveWait
              phase="reading"
              mood={mood}
              bookTitle={activeBook.title}
              isReady={!isBookLoading && bookData !== null}
              onProceed={() => setUserReadyToRead(true)}
              currentTheme={currentTheme}
              waitMessage="Preparing your book in the background..."
              readyMessage="The pages are ready."
              buttonText="Step Inside the Book"
              onRequestAuth={() => {
                setAuthReason("journal");
                setShowAuthModal(true);
              }}
            />
          </div>
        ) : bookData ? (
          <div className="absolute inset-0 w-full h-full">
            <ReactReader
              key={activeBook.id}
              url={bookData}
              title={activeBook.title}
              location={location}
              locationChanged={(epubcifi) => setLocation(epubcifi)}
              epubOptions={{
                manager: "continuous",
                flow: "scrolled",
                allowScriptedContent: true,
                // to help toc snap to exact chapter start
                snap: true,
                restore: true,
              }}
              getRendition={(rendition) => {
                rendition.themes.default({
                  body: {
                    background: `${currentTheme.hexBg} !important`,
                    color: `${currentTheme.epubText} !important`,
                    "font-family":
                      '"Georgia", "Times New Roman", serif !important',
                    "font-size": "clamp(8px, 2.5vw, 22px) !important",
                    "line-height": "1.7 !important",
                    // THE NEW PADDING LOGIC
                    padding: "0 2px !important",
                    margin: "0 !important",
                    "box-sizing": "border-box !important",
                    "max-width": "100% !important",
                    "overflow-x": "hidden !important",
                    "scrollbar-width": "thin",
                    "scrollbar-color": `${currentTheme.scrollbarThumb} ${currentTheme.scrollbarTrack}`,
                  },
                  "::-webkit-scrollbar": {
                    width: "8px !important",
                  },
                  "::-webkit-scrollbar-track": {
                    background: `${currentTheme.scrollbarTrack} !important`,
                  },
                  "::-webkit-scrollbar-thumb": {
                    background: `${currentTheme.scrollbarThumb} !important`,
                    "border-radius": "6px !important",
                  },
                  "h1, h2, h3, h4, h5, h6": {
                    color: `${currentTheme.epubText} !important`,
                    "word-wrap": "break-word !important",
                  },
                  "p, div, span": {
                    "word-wrap": "break-word !important",
                  },
                });
              }}
              readerStyles={{
                ...ReactReaderStyle,
                container: {
                  ...ReactReaderStyle.container,
                  overflow: "hidden",
                },
                readerArea: {
                  ...ReactReaderStyle.readerArea,
                  backgroundColor: currentTheme.hexBg,
                  transition: "all 0.3s ease",
                  // THE NEW PADDING LOGIC
                  padding: "0 !important",
                },
                titleArea: { display: "none" },
                arrow: { display: "none" },
                footerArea: {
                  backgroundColor: currentTheme.hexBg,
                  color: currentTheme.epubText,
                  opacity: 0.6,
                },

                // --- TOC (LEFT NAVBAR) - YOUR WORKING OLD LOGIC ---
                tocButton: {
                  ...ReactReaderStyle.tocButton,
                  color: currentTheme.epubText,
                  margin: "12px",
                  opacity: 0.8,
                  zIndex: 101,
                },
                tocButtonBar: {
                  ...ReactReaderStyle.tocButtonBar,
                  background: currentTheme.epubText,
                },
                tocButtonExpanded: {
                  ...ReactReaderStyle.tocButtonExpanded,
                  background: currentTheme.tocBg,
                },
                tocArea: {
                  ...ReactReaderStyle.tocArea,
                  backgroundColor: currentTheme.tocBg,
                  color: currentTheme.epubText,
                  width: "85vw",
                  maxWidth: "350px",
                  boxShadow: "4px 0 25px rgba(0,0,0,0.5)",
                },
                tocAreaButton: {
                  ...ReactReaderStyle.tocAreaButton,
                  color: currentTheme.epubText,
                  whiteSpace: "normal",
                  wordWrap: "break-word",
                  lineHeight: "1.2",
                  padding: "16px 0px 16px 5px",
                  borderBottom: `1px solid ${currentTheme.epubText}20`,
                  textAlign: "left",
                  width: "100%",
                  display: "block",
                },
              }}
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="opacity-50 text-sm">
              Failed to load the book. Please try another.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
