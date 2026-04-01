import { useEffect, useRef } from "react";

export function JitsiMeeting({ roomName, displayName, onEndCall }) {
  const jitsiContainerRef = useRef(null);
  const apiRef = useRef(null);

  useEffect(() => {
    const loadJitsi = async () => {
      if (!window.JitsiMeetExternalAPI) {
        const script = document.createElement("script");
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => (script.onload = resolve));
      }

      const domain = "meet.jit.si";
      const options = {
        roomName,
        parentNode: jitsiContainerRef.current,
        width: "100%",
        height: 500, // adjust as needed
        userInfo: {
          displayName
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            "microphone", "camera", "hangup",
            "fullscreen", "fodeviceselection", "chat",
            "settings", "raisehand", "videoquality"
          ]
        }
      };

      apiRef.current = new window.JitsiMeetExternalAPI(domain, options);

      apiRef.current.addEventListener("readyToClose", () => {
        onEndCall();
      });
    };

    loadJitsi();

    return () => {
      apiRef.current?.dispose();
    };
  }, [roomName, displayName]);

  return <div ref={jitsiContainerRef} className="w-full rounded-xl overflow-hidden shadow-lg border border-gray-200" />;
}