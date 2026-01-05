import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./auth/authProvider";
import { useAuth } from "./auth/useAuth";

import { Header } from "./components/Header"
import { Footer } from "./components/Footer"

import Home from "./pages/Home"
import AboutPage from "./pages/About"
import ContactPage from "./pages/Contact"
/*import Dashboard from "./pages/Dashboard"*/

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/" />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/*<Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />*/}
        </Routes>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App