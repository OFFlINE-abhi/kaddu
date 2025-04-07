"use client";

import { useEffect, useRef, useState } from "react";
import { db } from "@/app/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: number;
  meetingRoom: string;
}

interface ChatHistoryPanelProps {
  meetingRoom: string;
}

const ChatHistoryPanel: React.FC<ChatHistoryPanelProps> = ({ meetingRoom }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const chatQuery = query(
      collection(db, "jitsiChatLogs"),
      where("meetingRoom", "==", meetingRoom),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
      const chats: ChatMessage[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ChatMessage[];

      setMessages(chats);
    });

    return () => unsubscribe();
  }, [meetingRoom]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 w-full h-80 overflow-y-auto text-sm">
      <h3 className="text-lg font-semibold mb-2 text-white">💬 Chat History</h3>
      <div className="space-y-2 text-white">
        {messages.length === 0 ? (
          <p className="text-zinc-400">No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id}>
              <span className="text-blue-400 font-medium">{msg.user}:</span>{" "}
              <span>{msg.message}</span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatHistoryPanel;
