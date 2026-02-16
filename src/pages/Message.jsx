import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { ImageWithFallback } from "../figma/ImageWithFallback";
// import dayjs from "dayjs";

/* -------------------- MATCH SCORE -------------------- */
const calculateMatchScore = (user, tutor) => {
  if (!user || !tutor) return 0;
  const userStrengths = user.areasOfStrength || [];
  const userNeeds = user.areasOfDevelopment || [];
  const tutorStrengths = tutor.areasOfStrength || [];
  const tutorNeeds = tutor.areasOfDevelopment || [];

  const tutorHelpsUser = tutorStrengths.filter((s) => userNeeds.includes(s)).length;
  const userHelpsTutor = tutorNeeds.filter((n) => userStrengths.includes(n)).length;

  if (!tutorHelpsUser && !userHelpsTutor) return 0;

  return Math.round(
    (tutorHelpsUser / Math.max(userNeeds.length, 1)) * 65 +
      (userHelpsTutor / Math.max(tutorNeeds.length, 1)) * 35
  );
};

export default function MessagesPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedChat, setSelectedChat] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [tutorProfile, setTutorProfile] = useState(null);
  const [matchScore, setMatchScore] = useState(0);
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineStatus, setOnlineStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationTutors, setConversationTutors] = useState({});
  const [lastMessages, setLastMessages] = useState({});

  /* -------------------- CURRENT USER -------------------- */
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) return;
      supabase
        .from("profile")
        .select("*")
        .eq("id", data.user.id)
        .maybeSingle()
        .then(({ data }) => setCurrentUser(data));
    });
  }, []);

  /* -------------------- ONLINE STATUS -------------------- */
  /*useEffect(() => {
  if (!currentUser?.id) return;

  supabase
    .from("profile")
    .update({ online: true })
    .eq("id", currentUser.id);

  return () => {
    supabase
      .from("profile")
      .update({ online: false })
      .eq("id", currentUser.id);
  };
}, [currentUser]);*/

  /* -------------------- HANDLE TAB CLOSE -------------------- */

/*useEffect(() => {
  if (!currentUser?.id) return;

  const handleUnload = () => {
    supabase
      .from("profile")
      .update({ online: false })
      .eq("id", currentUser.id);
  };

  window.addEventListener("beforeunload", handleUnload);
  return () => window.removeEventListener("beforeunload", handleUnload);
}, [currentUser]);*/

  /* -------------------- TUTOR ONLINE STATUS SUBSCRIPTION -------------------- */
useEffect(() => {
  if (!tutorProfile?.id) return;

  const sub = supabase
    .channel(`profile-status-${tutorProfile.id}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "profile",
        filter: `id=eq.${tutorProfile.id}`,
      },
      (payload) => {
        const isOnline =
          payload.new.last_seen &&
          Date.now() - new Date(payload.new.last_seen).getTime() < 30_000;

        setOnlineStatus(isOnline);
      }
    )
    .subscribe();

  return () => sub.unsubscribe();
}, [tutorProfile?.id]);

/* if this doenst work use sql,
create policy "Users can update their own profile"
on profile
for update
using (auth.uid() = id);*/


  /* -------------------- CONVERSATIONS -------------------- */
  useEffect(() => {
    if (!currentUser) return;

    const fetchConversations = async () => {
      const { data } = await supabase
        .from("conversations")
        .select("*")
        .contains("user_ids", [currentUser.id])
        .order("created_at", { ascending: false });

      setConversations(data ?? []);

      // Fetch tutor profiles + last messages for conversation list
const tutorIds = data
  ?.map((c) => c.user_ids.find((id) => id !== currentUser.id))
  .filter(Boolean);

if (tutorIds?.length) {
  // Tutor profiles
  const { data: tutors } = await supabase
    .from("profile")
    .select("id, name, avatar_url")
    .in("id", tutorIds);

  const tutorMap = {};
  tutors?.forEach((t) => {
    tutorMap[t.id] = t;
  });
  setConversationTutors(tutorMap);

  // Last messages
  const { data: lastMsgs } = await supabase
    .from("messages")
    .select("conversation_id, message, created_at")
    .in("conversation_id", data.map((c) => c.id))
    .order("created_at", { ascending: false });

  const lastMsgMap = {};
  lastMsgs?.forEach((m) => {
    if (!lastMsgMap[m.conversation_id]) {
      lastMsgMap[m.conversation_id] = m.message;
    }
  });
  setLastMessages(lastMsgMap);
}

      // Check if navigating from Connect button
      const tutorIdFromNav = location.state?.tutorId;
      const convoIdFromNav = location.state?.conversationId;

      if (convoIdFromNav) {
        const convo = data?.find((c) => c.id === convoIdFromNav);
        if (convo) setSelectedChat(convo);
      } else if (tutorIdFromNav) {
        let convo = data?.find((c) => c.user_ids.includes(tutorIdFromNav));
        if (!convo) {
          setIsLoading(true);
          const { data: newConvo } = await supabase
            .from("conversations")
            .insert({ user_ids: [currentUser.id, tutorIdFromNav] })
            .select("*")
            .maybeSingle();
          convo = newConvo;
          setIsLoading(false);
        }
        setSelectedChat(convo);
      } else if (!selectedChat && data?.length) {
        setSelectedChat(data[0]);
      }
    };

    fetchConversations();

    const sub = supabase
      .channel("public:conversations")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversations" },
        fetchConversations
      )
      .subscribe();

    return () => sub.unsubscribe();
  }, [currentUser]);

  /* -------------------- TUTOR PROFILE + MATCH -------------------- */
  useEffect(() => {
    if (!selectedChat || !currentUser) return;

    const tutorId = selectedChat.user_ids.find((id) => id !== currentUser.id);
    if (!tutorId) return;

    supabase
      .from("profile")
      .select("*")
      .eq("id", tutorId)
      .maybeSingle()
      .then(({ data }) => {
        setTutorProfile(data);
        setMatchScore(calculateMatchScore(currentUser, data));
        const isOnline =
        data?.last_seen &&
        Date.now() - new Date(data.last_seen).getTime() < 30_000;

      setOnlineStatus(isOnline);
      });
  }, [selectedChat, currentUser]);

  /* -------------------- MESSAGES -------------------- */
  useEffect(() => {
    if (!selectedChat || !currentUser) return;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
  .from("messages")
  .select(`
    *,
    meeting:meeting_id (*)
  `)
  .eq("conversation_id", selectedChat.id)
  .order("created_at");

        if (error) {
          console.error("Failed to fetch messages:", error);
          return;
        }
        setMessages(data ?? []);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();

    const channelName = `messages:${selectedChat.id}`;
    const sub = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedChat.id}`,
        },
        (payload) => {
          console.log("New message received:", payload);

          // If it has a meeting_id, fetch the full message with the relationship
          if (payload.new.meeting_id) {
            supabase
              .from("messages")
              .select(`
                *,
                meeting:meeting_id (*)
              `)
              .eq("id", payload.new.id)
              .maybeSingle()
              .then(({ data: fullMessage }) => {
                if (fullMessage) {
                  setMessages((m) => [...m, fullMessage]);
                }
              });
          } else {
            // Regular message, just add it
            setMessages((m) => [...m, payload.new]);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "meetings",
        },
        (payload) => {
          setMessages((msgs) =>
            msgs.map((m) =>
              m.meeting_id === payload.new.id
                ? { ...m, meeting: payload.new }
                : m
            )
          );
        }
      )
      .on("subscribe", (status) => {
        console.log(`Subscribed to ${channelName}:`, status);
      })
      .on("error", (error) => {
        console.error(`Realtime error on ${channelName}:`, error);
      })
      .subscribe((status) => {
        console.log(`Channel ${channelName} subscription status:`, status);
      });

    return () => {
      sub.unsubscribe();
    };
  }, [selectedChat?.id, currentUser?.id]);

  /* -------------------- TYPING INDICATOR -------------------- */
  useEffect(() => {
    if (!selectedChat) return;

    const typingChannel = supabase
      .channel(`typing:conversation_${selectedChat.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "conversations" },
        (payload) => setTypingUsers(payload.new.typing || [])
      )
      .subscribe();

    return () => typingChannel.unsubscribe();
  }, [selectedChat?.id]);

  /* -------------------- HANDLE CONNECT --------------------
  const handleConnect = async (tutor) => {
    if (!currentUser || !tutor) return;

    setIsLoading(true);

    // Check if conversation exists
    const { data: existingConvos } = await supabase
      .from("conversations")
      .select("*")
      .contains("user_ids", [currentUser.id, tutor.id]);

    let convo;
    if (existingConvos && existingConvos.length > 0) {
      convo = existingConvos[0];
    } else {
      const { data: newConvo } = await supabase
        .from("conversations")
        .insert({ user_ids: [currentUser.id, tutor.id] })
        .select("*")
        .maybeSingle();
      convo = newConvo;
    }

    // Short delay for loading animation
    setTimeout(() => {
      setIsLoading(false);
      navigate("/messages", { state: { tutorId: tutor.id, conversationId: convo.id } });
    }, 1500);
  };
*/
  /* -------------------- SEND MESSAGE -------------------- */
// --- Meeting Scheduling Logic ---
const [showScheduleModal, setShowScheduleModal] = useState(false);
const [selectedDate, setSelectedDate] = useState(null);
const [selectedTime, setSelectedTime] = useState(null);
const [currentMonth, setCurrentMonth] = useState(new Date());

const generateTimeSlots = () => {
  const slots = [];

  for (let hour = 9; hour <= 17; hour++) {
    const date = new Date();
    date.setHours(hour, 0, 0, 0);

    slots.push({
      value: `${hour.toString().padStart(2, "0")}:00`, // DB safe
      label: date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }), // 1:00 PM
    });
  }

  return slots;
};

const timeSlots = generateTimeSlots();

const isSlotInPast = (slotValue) => {
  if (!selectedDate) return false;

  const now = new Date();
  const slotDate = new Date(selectedDate);

  const [hour, minute] = slotValue.split(":");
  slotDate.setHours(Number(hour), Number(minute), 0, 0);

  return slotDate < now;
};

const getDaysInMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  return { daysInMonth, startingDayOfWeek, year, month };
};

const isDateAvailable = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

const handleDateSelect = (day) => {
  const { year, month } = getDaysInMonth(currentMonth);
  const selected = new Date(year, month, day);
  if (isDateAvailable(selected)) {
    setSelectedDate(selected);
    setSelectedTime(null);
  }
};

const handleScheduleRequest = async () => {
  if (!selectedDate || !selectedTime || !selectedChat?.id || !currentUser?.id) return;

  const tutorId = selectedChat.user_ids.find(id => id !== currentUser.id);

const scheduledAt = new Date(selectedDate);
const [hour, minute] = selectedTime.split(":");

scheduledAt.setHours(Number(hour), Number(minute), 0, 0);

  const { data: conflicts } = await supabase
  .from("meetings")
  .select("id")
  .eq("conversation_id", selectedChat.id)
  .eq("scheduled_at", scheduledAt.toISOString())
  .in("status", ["pending", "confirmed"]);

if (conflicts?.length) {
  alert("That time is already booked.");
  return;
}

  // 1️⃣ Create meeting row
  const { data: meeting, error: meetingError } = await supabase
    .from("meetings")
    .insert({
      conversation_id: selectedChat.id,
      room_id: crypto.randomUUID(),
      created_by: currentUser.id,
      participant_id: tutorId,
      scheduled_at: scheduledAt.toISOString(),
      status: "pending"
    })
    .select()
    .single();

  if (meetingError) {
    console.error(meetingError);
    return;
  }

  // 2️⃣ Send chat message referencing meeting
  const { data: insertedMessage, error: msgError } = await supabase.from("messages").insert({
    conversation_id: selectedChat.id,
    sender_id: currentUser.id,
    message: `Meeting scheduled for ${new Date(scheduledAt).toLocaleDateString()} at ${new Date(scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
    meeting_id: meeting.id
  }).select(`*,meeting:meeting_id(*)`).single();

  if (msgError) {
    console.error("Message insert error:", msgError);
    return;
  }

  // Optimistically add message with meeting to state
  if (insertedMessage) {
    setMessages((msgs) =>
  msgs.some((m) => m.id === insertedMessage.id)
    ? msgs
    : [...msgs, insertedMessage]
);
  }

  setShowScheduleModal(false);
  setSelectedDate(null);
  setSelectedTime(null);
};

const handleConfirmMeeting = async (meetingId) => {
  const { data: updatedMeeting, error } = await supabase
    .from("meetings")
    .update({ status: "confirmed" })
    .eq("id", meetingId)
    .select()
    .single();

  if (error) {
    console.error(error);
    return;
  }

  // Update message with new meeting status
  setMessages((msgs) =>
    msgs.map((m) =>
      m.meeting_id === meetingId
        ? { ...m, meeting: updatedMeeting }
        : m
    )
  );
};

const handleDeclineMeeting = async (meetingId) => {
  const meeting = messages.find(m => m.meeting?.id === meetingId)?.meeting;

  if (!meeting || meeting.participant_id !== currentUser.id) return;
  const { data: updatedMeeting, error } = await supabase
    .from("meetings")
    .update({ status: "declined" })
    .eq("id", meetingId)
    .select()
    .single();

  if (error) {
    console.error(error);
    return;
  }

  setMessages((msgs) =>
    msgs.map((m) =>
      m.meeting_id === meetingId
        ? { ...m, meeting: updatedMeeting }
        : m
    )
  );
};

const handleCancelMeeting = async (meetingId) => {
  const meeting = messages.find(m => m.meeting?.id === meetingId)?.meeting;

  if (!meeting || meeting.created_by !== currentUser.id) return;
  const { data: updatedMeeting, error } = await supabase
    .from("meetings")
    .update({ status: "cancelled" })
    .eq("id", meetingId)
    .select()
    .single();

  if (error) {
    console.error(error);
    return;
  }

  setMessages((msgs) =>
    msgs.map((m) =>
      m.meeting_id === meetingId
        ? { ...m, meeting: updatedMeeting }
        : m
    )
  );
};

const renderCalendar = () => {
  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isAvailable = isDateAvailable(date);
    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
    days.push(
      <button
        key={day}
        className={`w-8 h-8 rounded-full text-sm font-medium ${isSelected ? "bg-teal-500 text-white" : isAvailable ? "bg-white hover:bg-teal-100" : "bg-gray-100 text-gray-400"}`}
        disabled={!isAvailable}
        onClick={() => isAvailable && handleDateSelect(day)}
      >
        {day}
      </button>
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="px-2 py-1 text-lg">←</button>
        <span className="font-semibold">{currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}</span>
        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="px-2 py-1 text-lg">→</button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1 text-xs text-gray-500">
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
      </div>
      <div className="grid grid-cols-7 gap-1">{days}</div>
    </div>
  );
};

const handleSendMessage = async () => {
  if (!newMessage.trim() || !selectedChat?.id || !currentUser?.id) return;

  const messageText = newMessage.trim();

  try {
    const { data: insertedMessage, error } = await supabase.from("messages").insert({
      conversation_id: selectedChat.id,
      sender_id: currentUser.id,
      message: messageText
    }).select().single();

    if (error) {
      console.error("Failed to send message:", error);
      return;
    }

    // Immediately add the message to state (optimistic update)
    setMessages((msgs) =>
  msgs.some((m) => m.id === insertedMessage.id)
    ? msgs
    : [...msgs, insertedMessage]
);
    setNewMessage("");
  } catch (err) {
    console.error(err);
  }
};

  /* -------------------- TYPING -------------------- */
  const handleTyping = (text) => {
    setNewMessage(text);
    if (!selectedChat || !currentUser) return;
    // TODO: update typing array in Supabase
  };

  /* -------------------- RENDER -------------------- */
  if (isLoading) {
    return (
      <div className="flex flex-col bg-gradient-to-br from-stone-50 to-teal-50 p-6">
        <Card className="w-96 p-8 text-center shadow-xl border-teal-200">
          <div className="space-y-6">
            <div className="text-6xl animate-bounce">🤝</div>
            <h2 className="text-2xl font-bold text-gray-800">
              Connecting with Peer Tutor
            </h2>
            <p className="text-gray-600">
              We're setting up your connection and preparing your study space...
            </p>
            <div className="w-full bg-teal-100 rounded-full h-2">
              <div className="bg-gradient-to-r from-teal-400 to-cyan-400 h-2 rounded-full animate-pulse w-3/4"></div>
            </div>
            <div className="text-sm text-gray-500">
              You'll be able to help each other learn! 🎓
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-stone-50 to-teal-50 py-20">
      <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">
            Messages & Peer Tutors 💬
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Connect with your matched peer tutors</p>
        </div>

      {/* Find Tutors Card */}
        <Card className="border-dashed border-2 border-teal-300 bg-teal-50">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-teal-700">
                Looking for more study partners?
              </h3>
              <p className="text-sm text-teal-600">Browse matched peer tutors and connect instantly.</p>
            </div>
            <Button
              onClick={() => navigate("/findtutor")}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
            >
              Find Tutors
            </Button>
          </CardContent>
        </Card>

        {/* Conversations + Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations list */}
          <Card className="border-2 border-emerald-200 shadow-md">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
            </CardHeader>
            <CardContent className="p-0 border-t border-gray-200">
              {conversations.map((convo) => {
                const tutorId = convo.user_ids.find((id) => id !== currentUser?.id);
                return (
                  <div
                    key={convo.id}
                    onClick={() => setSelectedChat(convo)}
                    className={`p-4 cursor-pointer border-l-4 rounded-md ${
                      selectedChat?.id === convo.id
                        ? "bg-teal-400/10 border-emerald-500"
                        : "border-transparent hover:bg-gray-200/30"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <ImageWithFallback
                          src={conversationTutors[tutorId]?.avatar_url || `/avatars/${tutorId}.png`}
                          alt="Tutor"
                          className="w-10 h-10 rounded-full"
                        />
                      <div>
                        <h4 className="font-semibold">
                          {conversationTutors[tutorId]?.name || "Peer Tutor"}
                        </h4>
                        <p className="text-sm text-gray-600 truncate max-w-[180px]">
                          {lastMessages[convo.id] || "Start the conversation"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Chat window */}
          <div className="lg:col-span-2">
            <Card className="h-full flex flex-col border-2 border-emerald-200 shadow-md">
              {tutorProfile && (
                <div className="p-4 border-b bg-teal-400/10 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold">{tutorProfile.name}</span>
                    <span className={`text-sm ${onlineStatus ? "text-emerald-600" : "text-gray-400"}`}>
                      ● {onlineStatus ? "Online" : "Offline"}
                    </span>
                    <span className="border-2 border-teal-200 text-sm font-semibold text-teal-600 bg-white px-2 py-1 rounded">
                      Match: {matchScore}%
                    </span>
                  </div>
                  <Button
                    onClick={() => setShowScheduleModal(true)}
                    className="text-white bg-gradient-to-r from-teal-500 to-cyan-500 text-sm"
                  >
                    Schedule
                  </Button>
{showScheduleModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">

      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-semibold">Schedule Meeting</div>
        <button
          onClick={() => setShowScheduleModal(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="mb-4">
        {renderCalendar()}
      </div>

      {selectedDate && (
        <div className="mb-4">
          <div className="font-medium mb-2 flex items-center gap-2">
            ⏰ Select Time
          </div>

          <div className="flex flex-wrap gap-2">
            {timeSlots.map(slot => {
              const isPast = isSlotInPast(slot.value);

              return (
                <button
                  key={slot.value}
                  disabled={isPast}
                  className={`px-3 py-1 rounded-lg border ${
                    isPast
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      : selectedTime === slot.value
                      ? "bg-teal-500 text-white border-teal-500"
                      : "bg-white border-gray-200 hover:bg-teal-100"
                  }`}
                  onClick={() => !isPast && setSelectedTime(slot.value)}
                >
                  {slot.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 mt-4">
        <Button
          onClick={() => {
            handleScheduleRequest();
            setShowScheduleModal(false);
          }}
          disabled={!selectedDate || !selectedTime}
          className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
        >
          Request Meeting
        </Button>
      </div>
    </div>
  </div>
)}
                </div>
              )}

              <CardContent className="flex-1 overflow-y-auto space-y-2">
                {messages.map((m) => {
                  if (m.meeting) {
                    const scheduled = new Date(m.meeting.scheduled_at);
                    const isRequester = m.meeting.created_by === currentUser?.id;
                    const isParticipant = m.meeting.participant_id === currentUser?.id;

                    const statusStyles = {
                      cyan: "bg-cyan-50 border-cyan-200",
                      emerald: "bg-emerald-50 border-emerald-200",
                      red: "bg-red-50 border-red-200",
                      gray: "bg-gray-50 border-gray-200",
                    };

                    const statusConfig = {
                      pending: { color: "cyan", icon: "📅", text: "Meeting Scheduled" },
                      confirmed: { color: "emerald", icon: "✅", text: "Meeting Confirmed" },
                      declined: { color: "red", icon: "✕", text: "Meeting Declined" },
                      cancelled: { color: "gray", icon: "✕", text: "Meeting Cancelled" },
                    };

                    const { color, icon, text } = statusConfig[m.meeting.status] ?? statusConfig.pending;

                    return (
<div
  key={m.id}
  className={`flex my-2 ${
    m.meeting.created_by === currentUser?.id
      ? "justify-end"
      : "justify-start"
  }`}
>
                        <div className={`px-4 py-3 rounded-xl border max-w-xs ${statusStyles[color]}`}>
                          <div className="font-semibold text-lg">{icon} {text}</div>

                          {m.meeting.status !== "cancelled" && m.meeting.status !== "declined" && (
                            <div className="text-sm text-gray-700 mt-1">
                              {scheduled.toLocaleDateString()} at{" "}
                              {scheduled.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          )}

                          {/* Message for requester: show status */}
                          {isRequester && m.meeting.status === "pending" && (
                            <div className="text-xs text-gray-600 mt-2 mb-2">
                              Awaiting confirmation from {tutorProfile?.name}
                            </div>
                          )}

                          {/* Participant: confirm or decline */}
                          {isParticipant && m.meeting.status === "pending" && (
                            <div className="flex gap-2 justify-center mt-3">
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                                onClick={() => handleConfirmMeeting(m.meeting.id)}
                              >
                                ✅ Confirm
                              </Button>
                              <Button
                                size="sm"
                                className="bg-red-500 text-white hover:bg-red-600"
                                onClick={() => handleDeclineMeeting(m.meeting.id)}
                              >
                                ✕ Decline
                              </Button>
                            </div>
                          )}

                          {/* Requester: cancel button if pending */}
                          {isRequester && m.meeting.status === "pending" && (
                            <div className="mt-2">
                              <Button
                                size="sm"
                                className="bg-red-500 text-white hover:bg-red-600"
                                onClick={() => handleCancelMeeting(m.meeting.id)}
                              >
                                ✕ Cancel
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                  // Normal message
                  return (
                    <div key={m.id + (m.sender_id || "")} className={`flex ${m.sender_id === currentUser?.id ? "justify-end" : "justify-start"}`}>
                      <div className=" bg-stone-600/10 text-gray-900 px-4 py-2 rounded-xl bg-stone-100 relative">
                        <p>{m.message}</p>
                        <span className="text-xs text-gray-500 absolute bottom-0 right-1">
                          {m.sender_id === currentUser?.id && <span className="ml-1">{m.read ? "✓✓" : "✓"}</span>}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {typingUsers.length > 0 && (
                  <div className="text-sm italic text-gray-500">{typingUsers.join(", ")} is typing...</div>
                )}
              </CardContent>

              <div className="p-4 border-t flex gap-2 items-center">
                <Input
                  value={newMessage}
                  onChange={(e) => handleTyping(e.target.value)}
                  placeholder="Type a message…"
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>Send</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}