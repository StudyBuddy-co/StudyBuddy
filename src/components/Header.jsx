import { useState, useEffect } from "react";

export function Header({ onNavigate, isAuthenticated, onSignIn, onSignOut }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    darkMode
      ? root.classList.add("dark")
      : root.classList.remove("dark");
  }, [darkMode]);

  return (
    <header className="
      w-full px-6 py-4 shadow-lg
      bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400
      dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
    ">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Left */}
        <button
          onClick={() => onNavigate("home")}
          className="text-white text-2xl font-bold hover:text-yellow-200 transition"
        >
          StudyBuddy 🎓
        </button>

        {/* Right */}
        <div className="flex items-center space-x-4">

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-2xl text-white hover:scale-110 transition"
            aria-label="Toggle theme"
          >
            {darkMode ? "🌞" : "🌙"}
          </button>

          {!isAuthenticated ? (
            <>
              <button className="text-white hover:text-yellow-200 transition">
                Sign In
              </button>
              <button
                onClick={onSignIn}
                className="bg-amber-400 text-teal-900 px-4 py-2 rounded-lg font-semibold hover:bg-amber-300 transition"
              >
                Create Account
              </button>
            </>
          ) : (
            <button onClick={onSignOut} className="text-white">
              Sign Out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}