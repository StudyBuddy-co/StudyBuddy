import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom"
import { AuthProvider } from "./auth/authProvider";
import { useAuth } from "./auth/useAuth";
import { supabase } from "./services/supabaseClient";

import { Header } from "./components/Header"
import { Footer } from "./components/Footer"
import AuthModal from "./components/AuthModal";

import Home from "./pages/Home"
import AboutPage from "./pages/About"
import ContactPage from "./pages/Contact"
import Dashboard from "./pages/Dashboard"
import Profile from "./pages/Profile"
import FindTutor from "./pages/FindTutor"
import PublicProfile from "./pages/PublicProfile";
import Message from "./pages/Message"
import MeetingRoomPage from "./pages/MeetingRoom"

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/" replace />
}

function App() {
const { user } = useAuth()
const [authOpen, setAuthOpen] = useState(false)
const [authMode, setAuthMode] = useState("signup")

useEffect(() => {
  if (!user?.id) return;

  const updateLastSeen = async () => {
    await supabase
      .from("profile")
      .update({ last_seen: new Date().toISOString() })
      .eq("id", user.id);
  };

  // update immediately on load
  updateLastSeen();

  // heartbeat every 15 seconds
  const interval = setInterval(updateLastSeen, 15000);

  return () => clearInterval(interval);
}, [user]);

function openSignup() {
  window.scrollTo({ top: 0, behavior: "smooth" })
  setAuthMode("signup")
  setAuthOpen(true)
}

function MeetingRoomRoute() {
  const location = useLocation();
  const navigate = useNavigate();
  const { meeting, tutorProfile } = location.state ?? {};

  return (
    <MeetingRoomPage
      meeting={meeting}
      tutorProfile={tutorProfile}
      onNavigate={(path) => navigate(`/${path}`)}
    />
  );
}

  return (
    <AuthProvider>
      <BrowserRouter basename="/StudyBuddy/">
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

          <Route
            path="/findtutor"
            element={
              <ProtectedRoute>
                <FindTutor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Message />
              </ProtectedRoute>
            }
          />

<Route path="/profile/:id" element={<PublicProfile />} />

<Route
            path="/meeting-room"
            element={
              <ProtectedRoute>
                <MeetingRoomRoute />
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