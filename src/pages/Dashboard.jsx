import { useNavigate } from "react-router-dom"
import { useAuth } from "../auth/useAuth"
import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card"
import { Progress } from "../components/Progress"
import { ImageWithFallback } from "../figma/ImageWithFallback"

export default function Dashboard() {
  const navigate = useNavigate()
  const { userProfile, setUserProfile } = useAuth()

  const quickActions = [
    { title: "Find Tutors", icon: "🔍", path: "/findtutor", description: "Connect with expert tutors", disabled: false },
    { title: "Messages", icon: "💬", path: "/messages", description: "Chat with your tutors", disabled: false },
    { title: "Resources", icon: "📚", path: "/resources", description: "Access study materials", disabled: true },
    { title: "AI Assistant", icon: "🤖", path: "/ai-assistant", description: "Get AI-powered help", disabled: true },
    { title: "Meeting Room", icon: "📞", path: "/meeting-room", description: "Join video sessions", disabled: true },
    { title: "Profile", icon: "👤", path: "/profile", description: "Manage your profile", disabled: false },
  ]

  const upcomingSessions = [
    { subject: "Calculus II", tutor: "Emma Wilson", time: "Today, 3:00 PM", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786" },
    { subject: "Chemistry", tutor: "Mark Chen", time: "Tomorrow, 1:00 PM", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" },
    { subject: "Literature", tutor: "Sarah Davis", time: "Wed, 2:30 PM", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80" },
  ]

  useEffect(() => {
  const handler = (e) => setUserProfile(e.detail)
  window.addEventListener('profile-updated', handler)
  return () => window.removeEventListener('profile-updated', handler)
}, [setUserProfile])

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-teal-50 p-6">
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
        <div className="bg-white rounded-xl shadow-lg p-8 text-center relative opacity-60 cursor-not-allowed">
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
            <Card>
              <CardHeader>
                <CardTitle>📅 Upcoming Sessions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingSessions.map((s) => (
                  <div
                    key={s.subject}
                    className="flex justify-between items-center p-4 bg-teal-50 rounded-lg"
                  >
                    <div className="flex gap-4 items-center">
                      <ImageWithFallback src={s.avatar} alt={s.tutor} className="w-12 h-12 rounded-full" />
                      <div>
                        <p className="font-semibold">{s.subject}</p>
                        <p className="text-sm text-gray-600">with {s.tutor}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-teal-600">{s.time}</p>
                      <button
                        onClick={() => navigate("/meeting-room")}
                        className="mt-2 px-4 py-1 text-sm rounded-md bg-teal-500 text-white hover:bg-teal-600 transition"
                      >
                        Join
                      </button>
                    </div>
                  </div>
                ))}
                  <button
                    onClick={() => navigate("/messaging")}
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