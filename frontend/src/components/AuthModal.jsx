import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AuthModal({ currentTheme, onComplete, onCancel }) {
  const { login, register } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
      onComplete(); // Triggers the save to database function
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
      {/* ADDED 'relative' to this container so the X stays exactly in the top right corner */}
      <div
        className={`relative p-10 md:p-14 rounded-2xl border ${currentTheme.border} w-full max-w-md bg-opacity-95 shadow-2xl`}
        style={{ backgroundColor: currentTheme.hexBg }}
      >
        {/* NEW Elegant 'X' Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-6 right-6 text-lg opacity-40 hover:opacity-100 transition-all w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5"
          aria-label="Close"
        >
          ✕
        </button>

        <h3 className="text-3xl literary-text mb-2 text-center mt-2">
          Identify Yourself
        </h3>
        <p className="text-sm opacity-60 text-center mb-8">
          {isLogin
            ? "Welcome back to your space."
            : "Create your personal library."}
        </p>

        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {!isLogin && (
            <input
              type="text"
              placeholder="Your Name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="bg-transparent border-b border-current pb-2 outline-none opacity-80 focus:opacity-100 transition-opacity placeholder-current"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="bg-transparent border-b border-current pb-2 outline-none opacity-80 focus:opacity-100 transition-opacity placeholder-current"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="bg-transparent border-b border-current pb-2 outline-none opacity-80 focus:opacity-100 transition-opacity placeholder-current"
          />

          <button
            type="submit"
            className={`mt-4 w-full py-4 rounded-full border border-current opacity-80 hover:opacity-100 transition-all`}
          >
            {isLogin ? "Enter" : "Begin Journey"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs opacity-50 hover:opacity-100 underline underline-offset-4 transition-all"
          >
            {isLogin ? "I don't have a space yet" : "I already have a space"}
          </button>
        </div>
      </div>
    </div>
  );
}
