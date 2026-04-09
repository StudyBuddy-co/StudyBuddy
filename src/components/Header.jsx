import { useState, useEffect, useRef } from "react"
import { NavLink } from "react-router-dom"
import { supabase } from "../services/supabaseClient"

import AuthModal from "./AuthModal"
import { useAuth } from "../auth/useAuth"

export function Header() {
  const { user, userProfile } = useAuth()
  const isAuthenticated = !!user

  const [darkMode, setDarkMode] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState("signin")
  const [menuOpen, setMenuOpen] = useState(false)

  const menuRef = useRef(null)

  useEffect(() => {
    const root = document.documentElement
    darkMode
      ? root.classList.add("dark")
      : root.classList.remove("dark")
  }, [darkMode])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

    async function handleSignOut() {
      setMenuOpen(false)
      await supabase.auth.signOut()
    }

  const navClass = ({ isActive }) =>
    `text-white font-medium transition-colors duration-200
     hover:text-yellow-200
     ${isActive ? "text-yellow-300 underline underline-offset-4" : ""}`

  return (
    <>
      <header className="w-full px-6 py-4 shadow-lg bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center space-x-8">
            <NavLink
              to={isAuthenticated ? "/dashboard" : "/"}
              className="text-white text-2xl font-bold hover:text-yellow-200 transition"
            >
              StudyBuddy 🎓
            </NavLink>

<nav className="hidden md:flex space-x-6">
  {isAuthenticated ? (
    <>
      <NavLink to="/dashboard" className={navClass}>Dashboard</NavLink>
      <NavLink to="/findtutor" className={navClass}>Find Tutor</NavLink>
      <NavLink to="/messages" className={navClass}>Messaging</NavLink>
      <NavLink to="/contact" className={navClass}>Contact</NavLink>
    </>
  ) : (
    <>
      <NavLink to="/" end className={navClass}>Home</NavLink>
      <NavLink to="/about" className={navClass}>About</NavLink>
      <NavLink to="/contact" className={navClass}>Contact</NavLink>
    </>
  )}
</nav>
          </div>

          {/* RIGHT */}
          <div className="flex items-center space-x-4">

            {/* Dark mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-2xl text-white hover:scale-110 transition"
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
              <div className="relative" ref={menuRef}>
                {/* Avatar + Name */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 text-white hover:text-yellow-200 transition"
                >
                  <img
                    src={userProfile.avatar_url || "/StudyBuddy/default-avatar.svg"}
                    alt="User avatar"
                    className="w-8 h-8 rounded-full object-cover border border-white"
                  />
                  <span className="font-medium">
                    {userProfile.name || "Account"}
                  </span>
                </button>

                {/* Dropdown */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden z-50">
                    <NavLink
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                      onClick={() => setMenuOpen(false)}
                    >
                      Profile
                    </NavLink>

                    <NavLink
                      to="/settings"
                      className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                      onClick={() => setMenuOpen(false)}
                    >
                      Settings
                    </NavLink>

                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        mode={authMode}
        setMode={setAuthMode}
      />
    </>
  )
}