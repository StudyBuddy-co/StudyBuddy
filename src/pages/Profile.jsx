// src/pages/Profile.jsx
import { useState, useEffect } from "react"
import { supabase } from "../services/supabaseClient"
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card"
import { Input } from "../components/Input"
import { Textarea } from "../components/textarea"
import { Button } from "../components/Button"
import { Badge } from "../components/Badge"

export default function Profile({ user }) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState(null)

  const [newClass, setNewClass] = useState("")
  const [newStrength, setNewStrength] = useState("")
  const [newArea, setNewArea] = useState("")

  // Load profile from Supabase
  useEffect(() => {
    if (!user) return

    const fetchProfile = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("profile")
        .select("*")
        .eq("id", user.id)
        .single()

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error)
      }

      setProfileData(
        data || {
          name: user.user_metadata?.firstName + " " + user.user_metadata?.lastName || "",
          email: user.email,
          bio: "",
          school: "",
          major: "",
          year: "",
          location: "",
          classesTaken: [],
          strengths: [],
          areasOfDevelopment: [],
        }
      )
      setLoading(false)
    }

    fetchProfile()
  }, [user])

  // Save profile to Supabase
  const saveProfile = async () => {
    if (!user) return
    setLoading(true)

    try {
      const { error } = await supabase
        .from("profile")
        .upsert([{ ...profileData, id: user.id }])

      if (error) throw error
      setIsEditing(false)
    } catch (err) {
      console.error("Failed to save profile:", err)
      alert(err.message || "Failed to save profile")
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = (field, value, setValue) => {
    if (!value.trim()) return
    setProfileData({ ...profileData, [field]: [...profileData[field], value.trim()] })
    setValue("")
  }

  const handleRemoveItem = (field, index) => {
    setProfileData({ ...profileData, [field]: profileData[field].filter((_, i) => i !== index) })
  }

  if (loading || !profileData) return <p>Loading profile...</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-teal-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            My Profile 👤
          </h1>
          <p className="text-gray-600">Manage your account, skills, and learning resources</p>
        </div>

        {/* Profile Info */}
        <Card className="shadow-lg border-stone-200">
          <CardContent className="flex items-center gap-6 pt-6">
            <div className="flex-1">
              {isEditing ? (
                <>
                  <Input
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    placeholder="Your Name"
                    className="mb-2"
                  />
                  <Input
                    value={profileData.email}
                    readOnly
                    className="mb-2 bg-gray-100 cursor-not-allowed"
                  />
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">{profileData.name}</h2>
                  <p className="text-gray-600">{profileData.email}</p>
                </>
              )}
            </div>

            <Button onClick={() => (isEditing ? saveProfile() : setIsEditing(true))}>
              {isEditing ? "Save Profile" : "Edit Profile"}
            </Button>
          </CardContent>
        </Card>

        {/* Classes Taken */}
        <Card className="shadow-lg border-stone-200">
          <CardHeader><CardTitle>📖 Classes Taken</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {profileData.classesTaken.map((cls, i) => (
              <Badge key={i} variant="outline">{cls}{isEditing && <button onClick={() => handleRemoveItem("classesTaken", i)}>×</button>}</Badge>
            ))}
            {isEditing && (
              <div className="flex gap-2 mt-2 w-full">
                <Input value={newClass} onChange={e => setNewClass(e.target.value)} placeholder="Add a class..." />
                <Button onClick={() => handleAddItem("classesTaken", newClass, setNewClass)}>Add</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Strengths */}
        <Card className="shadow-lg border-stone-200">
          <CardHeader><CardTitle>💪 Strengths</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {profileData.strengths.map((s, i) => (
              <Badge key={i} variant="outline">{s}{isEditing && <button onClick={() => handleRemoveItem("strengths", i)}>×</button>}</Badge>
            ))}
            {isEditing && (
              <div className="flex gap-2 mt-2 w-full">
                <Input value={newStrength} onChange={e => setNewStrength(e.target.value)} placeholder="Add a strength..." />
                <Button onClick={() => handleAddItem("strengths", newStrength, setNewStrength)}>Add</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Areas of Development */}
        <Card className="shadow-lg border-stone-200">
          <CardHeader><CardTitle>🎯 Areas I Need Help In</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {profileData.areasOfDevelopment.map((a, i) => (
              <Badge key={i} variant="outline">{a}{isEditing && <button onClick={() => handleRemoveItem("areasOfDevelopment", i)}>×</button>}</Badge>
            ))}
            {isEditing && (
              <div className="flex gap-2 mt-2 w-full">
                <Input value={newArea} onChange={e => setNewArea(e.target.value)} placeholder="Add an area..." />
                <Button onClick={() => handleAddItem("areasOfDevelopment", newArea, setNewArea)}>Add</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}