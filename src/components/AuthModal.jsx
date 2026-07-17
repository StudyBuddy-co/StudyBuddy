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
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { firstName, lastName } },
        });
        if (signUpError) throw signUpError;

        const displayName = [firstName, lastName].filter(Boolean).join(" ") || "Student";

        const { error: profileError } = await supabase
          .from("profile")
          .upsert(
            [
              {
                id: signUpData.user.id,
                email: signUpData.user.email,
                name: displayName,
                avatar_url: "/StudyBuddy/default-avatar.svg",
              },
            ],
            { onConflict: "id" }
          )
          .select()
          .maybeSingle();

        if (profileError) throw profileError;

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        onClose();
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
        navigate("/dashboard");
      }

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
      <div className="bg-white dark:bg-slate-900 border border-transparent dark:border-slate-700 p-8 rounded-xl w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">
          {mode === "signin" ? "Sign In" : "Create Account"}
        </h2>

        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm mb-3 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="flex gap-2">
              <input
                className="w-1/2 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                className="w-1/2 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          )}

          <input
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400"
            placeholder="Email (@uw.edu)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-300 hover:bg-amber-200 border border-amber-400 dark:border-amber-300 text-teal-900 font-semibold py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Loading..." : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-700 dark:text-gray-300">
          {mode === "signin" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Create Account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Sign In
              </button>
            </>
          )}
        </p>

        <button
          type="button"
          onClick={() => onClose()}
          className="block mx-auto mt-6 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}