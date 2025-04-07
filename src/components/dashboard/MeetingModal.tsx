"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MeetingModal({ isOpen, onClose }: MeetingModalProps) {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const domain = "meet.jit.si";
    const newRoom = `kaddu-meeting-${uuidv4()}`;
    setRoomId(newRoom);

    const options = {
      roomName: newRoom,
      width: "100%",
      height: 500,
      parentNode: jitsiContainerRef.current,
      configOverwrite: {
        startWithAudioMuted: true,
        startWithVideoMuted: true,
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
      },
      userInfo: {
        displayName: getAuth().currentUser?.displayName || "Guest",
      },
    };

    // @ts-ignore
    const api = new window.JitsiMeetExternalAPI(domain, options);

    // Save meeting history in Firebase
    const saveMeeting = async () => {
      const db = getFirestore();
      const user = getAuth().currentUser;
      if (user) {
        await addDoc(collection(db, "meetings"), {
          uid: user.uid,
          displayName: user.displayName,
          roomId: newRoom,
          timestamp: serverTimestamp(),
        });
      }
    };

    saveMeeting();

    return () => api?.dispose();
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-zinc-900 p-6 rounded-xl shadow-xl w-[90%] max-w-5xl text-white relative"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">📹 Live Meeting</h2>
              <button onClick={onClose} className="text-white text-lg hover:text-red-400">✖</button>
            </div>

            <div ref={jitsiContainerRef} className="w-full h-[500px] rounded-md overflow-hidden bg-black" />

            <p className="text-sm mt-4 text-white/70">
              Invite Link:{" "}
              <span className="text-blue-400 underline break-all">
                https://meet.jit.si/{roomId}
              </span>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
