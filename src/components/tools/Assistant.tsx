"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bot,
  SendHorizonal,
  X,
  Download,
  Trash2,
  Plus,
} from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/app/firebase";
import VoiceButton from "./VoiceButton";
import useVoiceToText from "@/components/hooks/useVoiceToText";

const SYSTEM_PROMPT = "You are Kaddu's helpful assistant. Keep responses short, friendly, and emoji-rich.";

export default function Assistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<{ sender: string; text: string }[]>([]);
  const [history, setHistory] = useState<
    { title: string; content: { sender: string; text: string }[] }[]
  >([]);
  const [showHistory, setShowHistory] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  const { transcript } = useVoiceToText();

  const chatRef = useRef<HTMLDivElement>(null);
  const assistantRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const auth = getAuth(app);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user?.displayName) {
        setUserName(user.displayName.split(" ")[0]);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight });
  }, [chat]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const stored = localStorage.getItem("assistant-chat");
    const savedHistory = localStorage.getItem("assistant-history");
    if (stored) setChat(JSON.parse(stored));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    localStorage.setItem("assistant-chat", JSON.stringify(chat));
  }, [chat]);

  useEffect(() => {
    localStorage.setItem("assistant-history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (assistantRef.current && !assistantRef.current.contains(e.target as Node)) {
        setOpen(false);
        setShowHistory(false);
      }
    };
    if (open || showHistory) {
      window.addEventListener("mousedown", handleClickOutside);
    }
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [open, showHistory]);

  useEffect(() => {
    if (transcript) {
      setInput(transcript); // ✅ This only writes the new speech result
    }
  }, [transcript]);
  

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { sender: "user", text: trimmed };
    const thinking = { sender: "bot", text: "Thinking..." };
    setChat((prev) => [...prev, userMessage, thinking]);
    setInput("");

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...chat.map((m) => ({
              role: m.sender === "user" ? "user" : "assistant",
              content: m.text,
            })),
            { role: "user", content: trimmed },
          ],
        }),
      });
      const data = await res.json();
      const reply = data.reply?.trim() || "Hmm, I couldn't understand that.";
      setChat((prev) => [...prev.slice(0, -1), { sender: "bot", text: reply }]);
    } catch {
      setChat((prev) => [...prev.slice(0, -1), { sender: "bot", text: "Oops! Something went wrong." }]);
    }
  };

  const clearChat = () => {
    setChat([]);
    localStorage.removeItem("assistant-chat");
  };

  const newChat = () => {
    if (chat.length) {
      setHistory((prev) => [
        ...prev,
        { title: chat[0]?.text?.slice(0, 30) + "...", content: chat },
      ]);
    }
    setChat([]);
    setInput("");
    localStorage.removeItem("assistant-chat");
  };

  const downloadChat = () => {
    const content = chat.map((c) => `${c.sender.toUpperCase()}: ${c.text}`).join("\n\n");
    const blob = new Blob([content], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "chat.txt";
    a.click();
  };

  const loadHistory = (index: number) => {
    setChat(history[index].content);
    setShowHistory(false);
    setTimeout(() => setOpen(true), 200);
  };

  const deleteHistory = (index: number) => {
    const updated = [...history];
    updated.splice(index, 1);
    setHistory(updated);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("assistant-history");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg transition"
      >
        <Bot size={18} />
        <span className="text-sm font-medium">Assistant</span>
      </button>

      {open && (
        <div
          ref={assistantRef}
          className="absolute bottom-16 right-0 w-[320px] sm:w-[360px] bg-zinc-900 border border-zinc-700 text-white rounded-xl shadow-2xl flex flex-col animate-fade-in"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-zinc-700">
            <h2 className="font-semibold text-base">💬 Ask Assistant</h2>
            <button onClick={() => setOpen(false)} title="Close">
              <X size={18} className="text-zinc-400 hover:text-white transition" />
            </button>
          </div>

          {/* Chat */}
          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3 max-h-[300px] scroll-smooth"
          >
            {chat.length === 0 ? (
              <div className="text-sm text-zinc-400">
                <p className="italic mb-1">Hello {userName || "there"}! 👋</p>
                <p className="italic">
                  I'm your assistant built by <span className="text-blue-500 font-semibold">Kaddu</span>! Let's chat 😊
                </p>
              </div>
            ) : (
              chat.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] px-4 py-2 rounded-lg text-sm whitespace-pre-wrap leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white self-end ml-auto"
                      : "bg-zinc-800 text-white self-start"
                  }`}
                >
                  {msg.text}
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <div className="flex items-center gap-2 border-t border-zinc-700 p-3">
            <input
              ref={inputRef}
              className="flex-1 bg-zinc-800 text-white text-sm px-3 py-2 rounded-md outline-none border border-zinc-600 focus:ring-1 focus:ring-blue-500"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <VoiceButton onResult={(text: string) => setInput((prev) => prev + " " + text)} />
            <button
              onClick={handleSend}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
              title="Send"
            >
              <SendHorizonal size={16} />
            </button>
          </div>

          {/* Footer Controls */}
          <div className="flex justify-between px-4 py-2 text-xs text-zinc-400 bg-zinc-800 rounded-b-lg">
            <button onClick={newChat} className="flex items-center gap-1 hover:text-white">
              <Plus size={12} /> New Chat
            </button>
            <button onClick={clearChat} className="flex items-center gap-1 hover:text-white">
              <Trash2 size={12} /> Clear
            </button>
            <button onClick={downloadChat} className="flex items-center gap-1 hover:text-white">
              <Download size={12} /> .txt
            </button>
            <button onClick={() => setShowHistory(true)} className="hover:text-white">
              🕓 History
            </button>
          </div>
        </div>
      )}

      {/* Chat History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-zinc-900 border border-zinc-700 text-white rounded-xl w-[90%] max-w-md p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">📜 Chat History</h2>
              <button onClick={() => setShowHistory(false)} title="Close">
                <X size={18} className="text-zinc-400 hover:text-white" />
              </button>
            </div>
            {history.length === 0 ? (
              <p className="text-sm text-zinc-400 italic">No saved chats yet.</p>
            ) : (
              <ul className="space-y-3 max-h-[300px] overflow-y-auto">
                {history.map((item, index) => (
                  <li key={index} className="flex justify-between items-center bg-zinc-800 p-3 rounded-md">
                    <div
                      className="text-sm cursor-pointer hover:underline"
                      onClick={() => loadHistory(index)}
                    >
                      {item.title}
                    </div>
                    <button onClick={() => deleteHistory(index)} className="text-red-500 hover:text-red-600" title="Delete history">
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {history.length > 0 && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={clearHistory}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
