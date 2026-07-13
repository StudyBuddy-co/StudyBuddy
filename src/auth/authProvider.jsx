import { useEffect, useState } from "react"
import { AuthContext } from "./authContext"
import { supabase } from "../services/supabaseClient"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState({
    name: "Student",
    avatar_url: "/StudyBuddy/default-avatar.svg",
    email: null,
  })

  const [loading, setLoading] = useState(true)

  const fetchOrCreateProfile = async (currentUser) => {
    if (!currentUser) return

    setUserProfile({
      id: currentUser.id ?? null,
      name: "Student",
      avatar_url: "/StudyBuddy/default-avatar.svg",
      email: currentUser.email ?? null,
    })

    try {
      const { data, error } = await supabase
        .from("profile")
        .select("name, avatar_url, email")
        .eq("id", currentUser.id)
        .maybeSingle()

      if (error) {
        console.error("Fetch profile error:", error)
      }

      if (data) {
        setUserProfile({
          id: currentUser.id,
          name: data.name || currentUser.user_metadata?.firstName || "Student",
          avatar_url: data.avatar_url || "/StudyBuddy/default-avatar.svg",
          email: data.email || currentUser.email || null,
        })
        return
      }

      // create profile if missing
      const profileRow = {
        id: currentUser.id,
        name: currentUser.user_metadata?.firstName || "Student",
        avatar_url: "/StudyBuddy/default-avatar.svg",
        email: currentUser.email || null,
      }

      const { data: newProfile, error: upsertError } = await supabase
        .from("profile")
        .upsert(profileRow, { onConflict: "id" })
        .select()
        .maybeSingle()

      if (upsertError) {
        console.error("Create profile error:", upsertError)
        return
      }

      if (newProfile) {
        setUserProfile({
          id: currentUser.id,
          name: newProfile.name || currentUser.user_metadata?.firstName || "Student",
          avatar_url: newProfile.avatar_url || "/StudyBuddy/default-avatar.svg",
          email: newProfile.email || currentUser.email || null,
        })
      }
    } catch (err) {
      console.error("Profile error:", err)
    }
  }

  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      setLoading(true)

      const {
        data: { session },
      } = await supabase.auth.getSession()

      const currentUser = session?.user ?? null

      if (!mounted) return

      setUser(currentUser)

      if (currentUser) {
        await fetchOrCreateProfile(currentUser)
      }

      setLoading(false)
    }

    initAuth()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null

        setUser(currentUser)

        if (!currentUser) {
          setUserProfile({
            id: null,
            name: "Student",
            avatar_url: "/StudyBuddy/default-avatar.svg",
            email: null,
          })
          return
        }

        void fetchOrCreateProfile(currentUser)
      }
    )

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  // 🔥 IMPORTANT: don't render app until auth is resolved
  if (loading) return null

  return (
    <AuthContext.Provider value={{ user, userProfile, setUserProfile, loading }}>
      {children}
    </AuthContext.Provider>
  )
}