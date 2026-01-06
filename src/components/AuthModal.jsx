import { useState } from "react"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "../services/Firebase"
import { updateProfile } from "firebase/auth"

export default function AuthModal({ open, onClose, mode, setMode }) {
  // 🔹 STATE (ALL hooks at top)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!open) return null

  const isValidUWEmail = (email) => email.endsWith("@uw.edu")

  function resetForm() {
    setFirstName("")
    setLastName("")
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setError("")
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!isValidUWEmail(email)) {
        throw new Error("Only @uw.edu emails are allowed")
      }

      if (mode === "signup") {
        if (!firstName || !lastName) {
          throw new Error("Please enter your first and last name")
        }

        if (password !== confirmPassword) {
          throw new Error("Passwords do not match")
        }

        // 1️⃣ Create Auth user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        )

        await updateProfile(userCredential.user, {
          displayName: `${firstName} ${lastName}`,
        })

        // 2️⃣ Save profile to Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          firstName,
          lastName,
          email,
          createdAt: serverTimestamp(),
          role: "student",
        })
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }

      resetForm()
      onClose()
    } catch (err) {
      console.error(err)

      if (err.code === "auth/email-already-in-use") {
        setError("An account with this email already exists.")
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address.")
      } else if (err.code === "auth/weak-password") {
        setError("Password must be at least 6 characters.")
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-xl w-full max-w-md shadow-xl">

        <h2 className="text-2xl font-bold mb-4 text-center">
          {mode === "signin" ? "Sign In" : "Create Account"}
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {mode === "signup" && (
            <div className="flex gap-2">
              <input
                className="w-1/2 px-3 py-2 border rounded-md"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                className="w-1/2 px-3 py-2 border rounded-md"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          )}

          <input
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Email (@uw.edu)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {mode === "signup" && (
            <input
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-400 hover:bg-amber-300 text-teal-900 font-semibold py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Loading..." : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          {mode === "signin" ? (
            <>
              Don’t have an account?{" "}
              <span
                onClick={() => setMode("signup")}
                className="text-blue-600 cursor-pointer hover:underline"
              >
                Create Account
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setMode("signin")}
                className="text-blue-600 cursor-pointer hover:underline"
              >
                Sign In
              </span>
            </>
          )}
        </p>

        <button
          onClick={() => {
            resetForm()
            onClose()
          }}
          className="block mx-auto mt-6 text-sm text-gray-500 hover:text-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  )
}