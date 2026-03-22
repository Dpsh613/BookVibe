import React, { useState, useContext } from "react";
import axios from "axios";
import { ReactReader, ReactReaderStyle } from "react-reader";
import { AuthContext } from "../context/authContext";
import AuthModal from "./AuthModal";

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
  const [showPrompt, setShowPrompt] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

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

    // Execute the save to database
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
      onClose(); // Successfully saved, now close the book
    } catch (error) {
      console.error("Failed to save:", error);
      onClose(); // Close anyway on error
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
            handleSaveProgress(); // Retry saving now that they are logged in!
          }}
          onCancel={() => {
            setShowAuthModal(false);
            setShowPrompt(false);
          }}
        />
      )}

      {/* CUSTOM NAVBAR HEADER */}
      <div
        className="flex justify-between items-center px-10 md:px-16 py-8 md:py-10 border-b"
        style={{ borderColor: currentTheme.tocBg }}
      >
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight opacity-90">
            {activeBook.title}
          </h2>
          <span className="text-xs uppercase tracking-widest opacity-60">
            {activeBook.author}
          </span>
        </div>
        <button
          onClick={handleCloseRequest}
          className="text-sm px-8 py-3 rounded-full border border-current opacity-60 hover:opacity-100 transition-all hover:bg-black/5 dark:hover:bg-white/5"
        >
          Close Book
        </button>
      </div>

      <div className="relative flex-grow w-full">
        {isBookLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center animate-pulse">
            <div className="w-8 h-8 rounded-full border-t-2 border-current animate-spin mb-4 opacity-50"></div>
            <p className="literary-text text-xl opacity-70">
              Opening the pages...
            </p>
          </div>
        ) : bookData ? (
          <div className="absolute inset-0 w-full h-full">
            <ReactReader
              url={bookData}
              title={activeBook.title}
              location={location}
              locationChanged={(epubcifi) => setLocation(epubcifi)}
              epubOptions={{
                manager: "continuous",
                flow: "scrolled",
                allowScriptedContent: true,
              }}
              getRendition={(rendition) => {
                rendition.themes.default({
                  body: {
                    background: `${currentTheme.hexBg} !important`,
                    color: `${currentTheme.epubText} !important`,
                    "font-family":
                      '"Georgia", "Times New Roman", serif !important',
                    "font-size": "125% !important",
                    "line-height": "1.8 !important",
                    padding: "5% 8% !important",
                    "scrollbar-width": "thin",
                    "scrollbar-color": `${currentTheme.scrollbarThumb} ${currentTheme.scrollbarTrack}`,
                  },
                  "::-webkit-scrollbar": {
                    width: "10px !important",
                  },
                  "::-webkit-scrollbar-track": {
                    background: `${currentTheme.scrollbarTrack} !important`,
                  },
                  "::-webkit-scrollbar-thumb": {
                    background: `${currentTheme.scrollbarThumb} !important`,
                    "border-radius": "6px !important",
                    border: `3px solid ${currentTheme.scrollbarTrack} !important`,
                  },
                  p: {
                    "font-size": "1.1rem !important",
                  },
                  "h1, h2, h3, h4, h5, h6": {
                    color: `${currentTheme.epubText} !important`,
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
                arrow: { display: "none" },
                footerArea: {
                  backgroundColor: currentTheme.hexBg,
                  color: currentTheme.epubText,
                  opacity: 0.6,
                },

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
                  background: currentTheme.tocBg,
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
            <p className="opacity-50 text-sm">
              Failed to load the book. Please try another.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
