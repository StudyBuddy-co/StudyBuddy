import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AuthModal({ open, onClose, mode, setMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const navigate = useNavigate();

  if (!open) return null;

  const isValidUWEmail = (email) => email.endsWith("@uw.edu");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!isValidUWEmail(email)) throw new Error("Only @uw.edu emails allowed");

      if (mode === "signup") {
        // 1️⃣ Sign up the user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { firstName, lastName } },
        });
        if (signUpError) throw signUpError;

        // 2️⃣ Create or update profile in Supabase (use snake_case column names)
        const displayName = [firstName, lastName].filter(Boolean).join(" ") || "Student";

        const { error: profileError } = await supabase
          .from("profile")
          .upsert(
            [
              {
                id: signUpData.user.id,
                email: signUpData.user.email,
                name: displayName,
                avatar_url: "/default-avatar.png",
              },
            ],
            { onConflict: "id" }
          )
          .select()
          .maybeSingle();

        if (profileError) throw profileError;

        // 3️⃣ Immediately sign in the user
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      onClose();
      navigate("/dashboard");
      } else {
        // Sign in flow
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      navigate("/dashboard");
      }

      // Reset form and close modal
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      onClose();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
                required
              />
              <input
                className="w-1/2 px-3 py-2 border rounded-md"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          )}

          <input
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Email (@uw.edu)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

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
          onClick={() => onClose()}
          className="block mx-auto mt-6 text-sm text-gray-500 hover:text-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  );
}