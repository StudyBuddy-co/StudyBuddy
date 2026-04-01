import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "../components/Card";
import { Button } from "../components/Button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/Avatar";
import { Badge } from "../components/Badge";

export default function MeetingRoomPage({ meeting, tutorProfile, onNavigate }) {
  const jitsiContainerRef = useRef(null);
  const [jitsiApi, setJitsiApi] = useState(null);
  const [canJoin, setCanJoin] = useState(false);
  const [timeUntil, setTimeUntil] = useState(null);
  const [hasJoined, setHasJoined] = useState(false);

  // --- Check if within 10 minutes of meeting start ---
  useEffect(() => {
    const check = () => {
      if (!meeting?.scheduled_at) return;
      const now = Date.now();
      const start = new Date(meeting.scheduled_at).getTime();
      const diff = start - now; // ms until meeting
      const diffMins = Math.floor(diff / 60000);

      if (diff <= 10 * 60 * 1000 && diff > -60 * 60 * 1000) {
        // Within 10 mins before OR up to 1 hour after start
        setCanJoin(true);
        setTimeUntil(null);
      } else if (diff > 0) {
        setCanJoin(false);
        setTimeUntil(diffMins);
      } else {
        // Meeting time has passed by more than 1 hour
        setCanJoin(false);
        setTimeUntil(null);
      }
    };

    check();
    const interval = setInterval(check, 30000); // re-check every 30s
    return () => clearInterval(interval);
  }, [meeting?.scheduled_at]);

  // --- Start Jitsi ---
  function startJitsi() {
    if (!jitsiContainerRef.current || !meeting?.room_id) return;

    const domain = "meet.jit.si";
    const options = {
      roomName: `studybuddy-${meeting.room_id}`,
      parentNode: jitsiContainerRef.current,
      width: "100%",
      height: 500,
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        DEFAULT_BACKGROUND: "#f0fdfa",
        SHOW_CHROME_EXTENSION_BANNER: false,
        TOOLBAR_BUTTONS: [
          "microphone", "camera", "chat",
          "desktop", "hangup", "raisehand", "tileview",
        ],
      },
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
      },
    };

    const api = new window.JitsiMeetExternalAPI(domain, options);
    api.addEventListener("videoConferenceJoined", () => {
      console.log("Joined Jitsi Meeting");
    });
    setJitsiApi(api);
  }

  // --- Load Jitsi only after user clicks Join ---
  useEffect(() => {
    if (!hasJoined) return;

    if (!window.JitsiMeetExternalAPI) {
      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => startJitsi();
    } else {
      startJitsi();
    }

    return () => {
      if (jitsiApi) jitsiApi.dispose();
    };
  }, [hasJoined]);

  // --- End session: dispose Jitsi but do NOT change meeting status ---
  const handleEndCall = () => {
    if (jitsiApi) jitsiApi.dispose();
    setJitsiApi(null);
    setHasJoined(false);
    onNavigate("messages");
  };

  const scheduled = meeting?.scheduled_at ? new Date(meeting.scheduled_at) : null;

  // --- Not yet joinable ---
  if (!canJoin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-teal-50 flex items-center justify-center p-6">
        <Card className="border-stone-200 shadow-lg max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <div className="text-5xl">🕐</div>
            <h2 className="text-2xl font-bold text-gray-800">Meeting Not Available Yet</h2>
            {timeUntil !== null ? (
              <p className="text-gray-600">
                This meeting starts in{" "}
                <span className="font-semibold text-teal-600">
                  {timeUntil >= 60
                    ? `${Math.floor(timeUntil / 60)}h ${timeUntil % 60}m`
                    : `${timeUntil} minute${timeUntil !== 1 ? "s" : ""}`}
                </span>
                .<br />
                You can join up to 10 minutes before the start time.
              </p>
            ) : (
              <p className="text-gray-600">This meeting has ended or is no longer available.</p>
            )}
            {scheduled && (
              <p className="text-sm text-gray-500">
                Scheduled for{" "}
                {scheduled.toLocaleDateString()} at{" "}
                {scheduled.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
            <Button
              onClick={() => onNavigate("messages")}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white w-full"
            >
              Back to Messages
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- Joinable but not yet joined ---
  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-teal-50 flex items-center justify-center p-6">
        <Card className="border-stone-200 shadow-lg max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <div className="text-5xl">🎓</div>
            <h2 className="text-2xl font-bold text-gray-800">Ready to Join?</h2>
            <p className="text-gray-600">
              Your session with{" "}
              <span className="font-semibold">{tutorProfile?.name || "your peer"}</span> is ready.
            </p>
            {scheduled && (
              <p className="text-sm text-gray-500">
                {scheduled.toLocaleDateString()} at{" "}
                {scheduled.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
            <div className="flex gap-3">
              <Button
                onClick={() => onNavigate("messages")}
                className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
              >
                Back
              </Button>
              <Button
                onClick={() => setHasJoined(true)}
                className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
              >
                Join Meeting
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- In meeting ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Session Header */}
        <Card className="border-stone-200 shadow-lg bg-gradient-to-r from-teal-50 to-cyan-50">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={tutorProfile?.avatar_url}
                  alt={tutorProfile?.name}
                />
                <AvatarFallback>{tutorProfile?.name?.charAt(0) ?? "P"}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Study Session</h2>
                <p className="text-gray-600">
                  with {tutorProfile?.name || "your peer"} • Started at{" "}
                  {scheduled?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700">● Live</Badge>
            </div>
            <Button
              variant="destructive"
              onClick={handleEndCall}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              End Session
            </Button>
          </CardContent>
        </Card>

        {/* Jitsi Video Area */}
        <Card className="border-stone-200 shadow-lg">
          <CardContent className="p-4">
            <div
              ref={jitsiContainerRef}
              className="rounded-xl border border-gray-200 shadow-lg overflow-hidden w-full h-[500px]"
            />
          </CardContent>
        </Card>

        {/* Chat Placeholder */}
        <Card className="border-stone-200 shadow-lg">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">Chat</h3>
            <div className="h-48 border border-gray-200 rounded-lg p-2 overflow-y-auto text-sm text-gray-700">
              <p className="text-gray-400 italic">Chat coming soon…</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}