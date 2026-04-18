import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { DISCOVERY_THOUGHTS, READING_THOUGHTS } from "../utils/thoughts";

export default function InteractiveWait({
  phase = "discovery",
  mood,
  bookTitle,
  isReady,
  onProceed,
  currentTheme,
  buttonText = "Proceed",
  onRequestAuth,
}) {
  const { user } = useContext(AuthContext);
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");

  useEffect(() => {
    let thoughtsArray =
      phase === "reading"
        ? READING_THOUGHTS
        : DISCOVERY_THOUGHTS[mood] || DISCOVERY_THOUGHTS.default;
    setPrompt(thoughtsArray[Math.floor(Math.random() * thoughtsArray.length)]);
  }, [mood, phase]);

  useEffect(() => {
    let interval;
    if (!isReady) {
      interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isReady]);

  useEffect(() => {
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    if (phase === "reading") {
      if (seconds === 0)
        setLoadingMessage(
          pick(["Opening the cover...", "Smoothing the pages..."]),
        );
      else if (seconds === 3)
        setLoadingMessage(
          pick(["Finding your place...", "Preparing the ink..."]),
        );
      else if (seconds === 7)
        setLoadingMessage(
          pick(["Setting the scene...", "Waking up the characters..."]),
        );
      else if (seconds === 12) setLoadingMessage("Almost ready for you...");
    } else {
      if (seconds === 0)
        setLoadingMessage(
          pick([
            "Wandering through quiet shelves...",
            "Stepping into a world of stories...",
          ]),
        );
      else if (seconds === 3)
        setLoadingMessage(
          pick([
            "Searching for something that fits your mood...",
            "Looking for something that feels right...",
          ]),
        );
      else if (seconds === 7)
        setLoadingMessage(
          pick([
            "Turning pages, seeing what resonates...",
            "Letting the right story find you...",
          ]),
        );
      else if (seconds === 12)
        setLoadingMessage("Getting closer to your kind of story...");
    }
  }, [seconds, phase]);

  const handleSave = async () => {
    if (!user || !answer.trim()) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/reflections/save`,
        {
          mood: mood || "searching",
          prompt,
          answer,
          associatedBook: bookTitle || "Discovery Phase",
        },
        { headers: { Authorization: `Bearer ${user.token}` } },
      );
      setIsSaved(true);
    } catch (error) {
      console.error("Failed to save reflection", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 animate-in fade-in duration-1000 w-full max-w-xl mx-auto py-12">
      {/* 1. Loading Text Floats Elegantly at Top */}
      <div className="h-10 mb-8 flex items-center justify-center opacity-60">
        {!isReady && (
          <p className="text-xs uppercase tracking-widest text-center animate-pulse">
            {loadingMessage}
          </p>
        )}
      </div>

      {/* 2. Main Question breathing freely */}
      <h3 className="text-3xl md:text-4xl literary-text opacity-90 mb-10 text-center leading-snug">
        {prompt}
      </h3>

      {/* 3. Minimalist Input Area */}
      <div className="w-full flex flex-col gap-6 relative">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onClick={onRequestAuth}
          placeholder="Record a passing thought, or simply rest here..."
          className="w-full bg-transparent border-b-2 border-current/20 p-2 min-h-[60px] outline-none opacity-70 focus:opacity-100 focus:border-current transition-all placeholder-current/50 resize-none literary-text text-xl text-center"
          style={{ color: currentTheme?.text }}
        />

        <div className="flex justify-between items-center px-2">
          {!user ? (
            <span className="text-xs italic opacity-40">
              Log in to save thoughts.
            </span>
          ) : !isSaved ? (
            <button
              onClick={handleSave}
              disabled={!answer.trim()}
              className="text-xs uppercase tracking-widest font-semibold opacity-40 hover:opacity-100 disabled:opacity-20 transition-all"
            >
              Save Entry
            </button>
          ) : (
            <span className="text-xs uppercase tracking-widest opacity-60">
              Safely recorded.
            </span>
          )}
        </div>
      </div>

      {/* 4. Action Button Area */}
      <div className="mt-16 h-20 flex items-center justify-center w-full">
        {isReady ? (
          <button
            onClick={onProceed}
            className={`px-10 py-4 rounded-full ${currentTheme.buttonBg} ${currentTheme.buttonText} font-semibold text-sm uppercase tracking-widest shadow-xl transition-all hover:scale-105 animate-in slide-in-from-bottom-4`}
          >
            {buttonText}
          </button>
        ) : (
          <div className="w-8 h-8 rounded-full border-t-2 border-current opacity-40 animate-spin"></div>
        )}
      </div>
    </div>
  );
}
