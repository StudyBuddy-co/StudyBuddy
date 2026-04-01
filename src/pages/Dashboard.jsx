import { supabase } from "../services/supabaseClient";
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { useAuth } from "../auth/useAuth"
import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card"
import { Progress } from "../components/Progress"
import { ImageWithFallback } from "../figma/ImageWithFallback"

export default function Dashboard() {
  const navigate = useNavigate()
  const { userProfile, setUserProfile } = useAuth()
  const [sessions, setSessions] = useState([]);
const [participants, setParticipants] = useState({}); // Map: userId -> profile

useEffect(() => {
  if (!userProfile?.id) return;

  const fetchMeetings = async () => {
    const now = new Date().toISOString();

    // 1️⃣ Fetch upcoming meetings with conversation
    const { data, error } = await supabase
      .from("meetings")
      .select(`
        *,
        conversation:conversation_id (
          id,
          user_ids
        )
      `)
      .or(`created_by.eq.${userProfile.id},participant_id.eq.${userProfile.id}`)
      .in("status", ["pending", "confirmed"])
      .gt("scheduled_at", now)
      .order("scheduled_at", { ascending: true })
      .limit(3);

    if (error) {
      console.error(error);
      return;
    }

    setSessions(data ?? []);

    // 2️⃣ Collect all other user IDs
    const otherUserIds = data
      ?.map((m) => m.conversation.user_ids.find((id) => id !== userProfile.id))
      .filter(Boolean);

    if (!otherUserIds?.length) return;

    // 3️⃣ Fetch profiles for all other users
    const { data: profiles, error: profileError } = await supabase
      .from("profile")
      .select("id, name, avatar_url")
      .in("id", otherUserIds);

    if (profileError) {
      console.error(profileError);
      return;
    }

    // 4️⃣ Create a map of userId -> profile
    const profileMap = {};
    profiles?.forEach((p) => {
      profileMap[p.id] = p;
    });

    setParticipants(profileMap);
  };

  fetchMeetings();
}, [userProfile?.id]);

  const quickActions = [
    { title: "Find Tutors", icon: "🔍", path: "/findtutor", description: "Connect with expert tutors", disabled: false },
    { title: "Messages", icon: "💬", path: "/messages", description: "Chat with your tutors", disabled: false },
    { title: "Resources", icon: "📚", path: "/resources", description: "Access study materials", disabled: true },
    { title: "AI Assistant", icon: "🤖", path: "/ai-assistant", description: "Get AI-powered help", disabled: true },
    { title: "Meeting Room", icon: "📞", path: "/meeting-room", description: "Join video sessions", disabled: false },
    { title: "Profile", icon: "👤", path: "/profile", description: "Manage your profile", disabled: false },
  ]

  useEffect(() => {
  const handler = (e) => setUserProfile(e.detail)
  window.addEventListener('profile-updated', handler)
  return () => window.removeEventListener('profile-updated', handler)
}, [setUserProfile])

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-teal-50 py-16">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Welcome */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl p-8 text-white flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {(userProfile?.name || "Student").split(" ")[0]}! 👋
            </h1>
            <p className="text-teal-100 mt-2">Ready to continue your learning journey?</p>
          </div>
          <div className="hidden md:block text-6xl opacity-20">🎓</div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center relative">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action) => (
              <Card
                key={action.title}
                onClick={() => {
                  if (action.disabled) return; // stop navigation
                  navigate(action.path);
                }}
                className={`transition shadow-sm
                            ${action.disabled ? "cursor-not-allowed opacity-50" : "hover:scale-105 cursor-pointer"}`}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-2">{action.icon}</div>
                  <h3 className="font-semibold">{action.title}</h3>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Upcoming Sessions */}
          <div className="lg:col-span-2">
            <Card className="relative bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200">
              <CardContent className="space-y-4 border border-gray-300 rounded-lg p-4">
                <CardTitle>📅 Upcoming Sessions</CardTitle>

                {sessions.length === 0 && (
  <div className="text-sm text-gray-500">No upcoming sessions</div>
)}

{sessions.map((s) => {
  const scheduled = new Date(s.scheduled_at);
  // Get the other participant
  const otherUserId = s.conversation.user_ids.find((id) => id !== userProfile.id);
  const otherUser = participants[otherUserId];

  return (
    <div
      key={s.id}
      className="flex justify-between items-center p-4 border border-emerald-300 bg-teal-50 rounded-lg"
    >
      <div>
        <p className="font-semibold">
          {otherUser?.name || "Tutor"} • {scheduled.toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-600">
          {scheduled.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      <div className="text-right">
        <button
  onClick={() =>
    navigate("/meeting-room", {
      state: {
        meeting: s,           // 's' is the session/meeting object
        tutorProfile: otherUser  // already derived above in the map
      },
    })
  }
  className="mt-2 px-4 py-1 text-sm rounded-md bg-teal-500 text-white hover:bg-teal-600 transition"
>
  Join
</button>
      </div>
    </div>
  );
})}
                  <button
                    onClick={() => navigate("/messages")}
                    className="w-full border border-teal-300 text-teal-600 hover:bg-teal-50 rounded-md py-2"
                  >
                    Schedule New Session
                  </button>
              </CardContent>
            </Card>
          </div>

      <div className="relative bg-white rounded-xl shadow-lg p-8 text-center opacity-60 cursor-not-allowed pointer-events-none">
        {/* Coming Soon Badge */}
        <span className="absolute top-4 right-4 text-xs font-semibold uppercase tracking-wide bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
          Coming Soon
        </span>

          {/* Right Column: Study Progress */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>📈 Study Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Weekly Goal</span>
                    <span>12/15 hours</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Assignments Completed</span>
                    <span>8/10</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>⚡ Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-teal-50 p-3 rounded-lg border border-teal-100">
                  <div className="text-xl font-bold text-teal-600">24</div>
                  <div className="text-xs text-gray-600">Sessions Completed</div>
                </div>
                <div className="bg-cyan-50 p-3 rounded-lg border border-cyan-100">
                  <div className="text-xl font-bold text-cyan-600">4.9</div>
                  <div className="text-xs text-gray-600">Average Rating</div>
                </div>
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                  <div className="text-xl font-bold text-emerald-600">45h</div>
                  <div className="text-xs text-gray-600">Study Time</div>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                  <div className="text-xl font-bold text-amber-600">12</div>
                  <div className="text-xs text-gray-600">Certificates</div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
</div>
  )
}