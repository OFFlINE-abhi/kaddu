"use client";

import { useEffect, useRef, useState } from "react";
import { db } from "@/app/firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";

declare global {
  interface Window {
    JitsiMeetExternalAPI?: any;
  }
}

interface JitsiMeetingComponentProps {
  roomName: string;
  displayName?: string;
  userId: string;
  isAdmin?: boolean;
  onMeetingEnd?: () => void;
  password?: string;
}

const JitsiMeetingComponent: React.FC<JitsiMeetingComponentProps> = ({
  roomName,
  displayName = "Guest",
  userId,
  isAdmin = false,
  onMeetingEnd,
  password,
}) => {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);
  const [participantCount, setParticipantCount] = useState(0);

  useEffect(() => {
    const loadJitsiScript = () =>
      new Promise<void>((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) return resolve();
        const script = document.createElement("script");
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Jitsi API"));
        document.body.appendChild(script);
      });

    const startMeeting = async () => {
      await loadJitsiScript();

      if (!window.JitsiMeetExternalAPI || !jitsiContainerRef.current) return;

      const domain = "meet.jit.si";

      apiRef.current = new window.JitsiMeetExternalAPI(domain, {
        roomName,
        parentNode: jitsiContainerRef.current,
        userInfo: { displayName },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          disableSimulcast: false,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          DEFAULT_REMOTE_DISPLAY_NAME: "Guest",
          TOOLBAR_BUTTONS: [
            "microphone", "camera", "chat", "participantsPane", "tileview",
            ...(isAdmin ? ["mute-everyone", "kick-everyone"] : []),
          ],
        },
      });

      // Set meeting password if provided
      if (password) {
        apiRef.current.addEventListener("participantRoleChanged", (event: any) => {
          if (event.role === "moderator") {
            apiRef.current.executeCommand("password", password);
          }
        });

        // Check password to join
        apiRef.current.addEventListener("passwordRequired", () => {
          apiRef.current.executeCommand("password", password);
        });
      }

      // Firebase Join Logging
      await setDoc(doc(db, "meetingLogs", `${userId}_${roomName}_${Date.now()}`), {
        userId,
        displayName,
        roomName,
        action: "join",
        timestamp: Timestamp.now(),
      });

      // Firebase Leave Logging
      apiRef.current.addEventListener("readyToClose", async () => {
        await setDoc(doc(db, "meetingLogs", `${userId}_${roomName}_leave_${Date.now()}`), {
          userId,
          displayName,
          roomName,
          action: "leave",
          timestamp: Timestamp.now(),
        });

        apiRef.current.dispose();
        onMeetingEnd?.();
      });

      // Realtime participant count
      apiRef.current.addEventListener("participantJoined", () => {
        updateParticipantCount();
      });

      apiRef.current.addEventListener("participantLeft", () => {
        updateParticipantCount();
      });

      const updateParticipantCount = async () => {
        const count = await apiRef.current.getNumberOfParticipants();
        setParticipantCount(count);
      };
    };

    startMeeting();

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
      }
    };
  }, [roomName, displayName, userId, isAdmin, password]);

  return (
    <div className="relative w-full h-[70vh] bg-black rounded-lg shadow-xl overflow-hidden">
      {/* Status Panel */}
      <div className="absolute top-2 right-4 z-10 text-white bg-zinc-900 bg-opacity-70 rounded px-4 py-1 text-sm">
        👥 Participants: {participantCount}
      </div>

      <div
        ref={jitsiContainerRef}
        className="w-full h-full"
      />
    </div>
  );
};

export default JitsiMeetingComponent;
