import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./auth/authProvider";
import { useAuth } from "./auth/useAuth";

import { Header } from "./components/Header"
import { Footer } from "./components/Footer"
import AuthModal from "./components/AuthModal";

import Home from "./pages/Home"
import AboutPage from "./pages/About"
import ContactPage from "./pages/Contact"
import Dashboard from "./pages/Dashboard"
import Profile from "./pages/Profile"

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/" replace />
}

function App() {
const [authOpen, setAuthOpen] = useState(false)
const [authMode, setAuthMode] = useState("signup")
function openSignup() {
  window.scrollTo({ top: 0, behavior: "smooth" })
  setAuthMode("signup")
  setAuthOpen(true)
}
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header
          authOpen={authOpen}
          setAuthOpen={setAuthOpen}
          authMode={authMode}
          setAuthMode={setAuthMode}
        />

        <AuthModal
          open={authOpen}
          onClose={() => setAuthOpen(false)}
          mode={authMode}
          setMode={setAuthMode}
        />

        <Routes>
          <Route path="/" element={<Home openSignup={openSignup} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

        </Routes>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App