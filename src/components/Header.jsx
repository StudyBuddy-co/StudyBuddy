import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import { signOut } from "firebase/auth"

import AuthModal from "./AuthModal"
import { useAuth } from "../auth/authContext"
import { auth } from "../services/Firebase"

export function Header() {
  const { user } = useAuth()
  const isAuthenticated = !!user

  const [darkMode, setDarkMode] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState("signin")

  useEffect(() => {
    const root = document.documentElement
    darkMode
      ? root.classList.add("dark")
      : root.classList.remove("dark")
  }, [darkMode])

  async function handleSignOut() {
    await signOut(auth)
  }

  const navClass = ({ isActive }) =>
    `text-white font-medium transition-colors duration-200
     hover:text-yellow-200
     ${isActive ? "text-yellow-300 underline underline-offset-4" : ""}`

  return (
    <>
      <header
        className="
          w-full px-6 py-4 shadow-lg
          bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400
          dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
        "
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center space-x-8">
            <NavLink
              to="/"
              className="text-white text-2xl font-bold hover:text-yellow-200 transition"
            >
              StudyBuddy 🎓
            </NavLink>

            {!isAuthenticated && (
              <nav className="hidden md:flex space-x-6">
                <NavLink to="/" end className={navClass}>
                  Home
                </NavLink>
                <NavLink to="/about" className={navClass}>
                  About
                </NavLink>
                <NavLink to="/contact" className={navClass}>
                  Contact
                </NavLink>
              </nav>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex items-center space-x-4">

            {/* Dark Mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-2xl text-white hover:scale-110 transition"
              aria-label="Toggle theme"
            >
              {darkMode ? "🌞" : "🌙"}
            </button>

            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    setAuthMode("signin")
                    setAuthOpen(true)
                  }}
                  className="text-white hover:text-yellow-200 transition"
                >
                  Sign In
                </button>

                <button
                  onClick={() => {
                    setAuthMode("signup")
                    setAuthOpen(true)
                  }}
                  className="bg-amber-400 text-teal-900 px-4 py-2 rounded-lg font-semibold hover:bg-amber-300 transition"
                >
                  Create Account
                </button>
              </>
            ) : (
              <button
                onClick={handleSignOut}
                className="text-white hover:text-yellow-200 transition"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </header>

      {/* AUTH MODAL */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        mode={authMode}
        setMode={setAuthMode}
      />
    </>
  )
}