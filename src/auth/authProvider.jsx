import { useEffect, useState } from "react"
import { AuthContext } from "./authContext"
import { supabase } from "../services/supabaseClient"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState({
    name: "Student",
    avatar_url: "/default-avatar.png",
    email: null,
  })
  const [loading, setLoading] = useState(true)

  // Fetch or create profile safely
  const fetchOrCreateProfile = async (currentUser) => {
    if (!currentUser) return

    // Reset to defaults immediately
    setUserProfile({ name: "Student", avatar_url: "/default-avatar.png" })

    try {
      const { data, error } = await supabase
        .from("profile")
        .select("name, avatar_url, email")
        .eq("id", currentUser.id)
        .maybeSingle()

      if (error) console.log("Fetch profile error:", error)

      if (data) {
        setUserProfile({
          id: currentUser.id,
          name: data.name || currentUser.user_metadata?.firstName || "Student",
          avatar_url: data.avatar_url || "/default-avatar.png",
          email: data.email || currentUser.email || null,
        })
      } else {
        // Profile does not exist, create one (use upsert to avoid race-condition conflicts)
        const profileRow = {
          id: currentUser.id,
          name: currentUser.user_metadata?.firstName || "Student",
          avatar_url: "/default-avatar.png",
          email: currentUser.email || null,
        }

        const { data: newProfile, error: upsertError } = await supabase
          .from("profile")
          .upsert([profileRow], { onConflict: "id" })
          .select()
          .maybeSingle()

        if (upsertError) {
          // If unique-violation still occurs or other DB error, log and attempt to fetch the existing profile
          console.log("Create/upsert profile error:", upsertError)

          // If duplicate key happened (code 23505), refetch the profile
          if (upsertError.code === "23505") {
            const { data: existing, error: fetchErr } = await supabase
              .from("profile")
              .select("name, avatar_url, email")
              .eq("id", currentUser.id)
              .maybeSingle()

            if (fetchErr) console.log("Fetch after conflict error:", fetchErr)
            if (existing) {
              setUserProfile({
                id: currentUser.id,
                name: existing.name || currentUser.user_metadata?.firstName || "Student",
                avatar_url: existing.avatar_url || "/default-avatar.png",
                email: existing.email || currentUser.email || null,
              })
            }
          }
        }

        if (newProfile) {
          setUserProfile({
            id: currentUser.id,
            name: newProfile.name,
            avatar_url: newProfile.avatar_url,
            email: newProfile.email || currentUser.email || null,
          })
        }
      }
    } catch (err) {
      console.error("Unexpected error fetching/creating profile:", err)
    }
  }

  useEffect(() => {
    // Initialize session
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const currentUser = session?.user ?? null
      setUser(currentUser)

      if (currentUser) fetchOrCreateProfile(currentUser)
      setLoading(false)
    }

    init()

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)

      if (currentUser) {
        fetchOrCreateProfile(currentUser)
      } else {
        // Logged out: reset profile
        setUserProfile({ id: null, name: "Student", avatar_url: "/default-avatar.png", email: null })
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  // Optional: render loading indicator
  if (loading) return null

  return (
    <AuthContext.Provider value={{ user, userProfile, setUserProfile }}>
      {children}
    </AuthContext.Provider>
  )
}