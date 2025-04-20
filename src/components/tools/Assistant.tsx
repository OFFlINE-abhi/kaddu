"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bot, SendHorizonal, X, Download, Trash2, Plus,
} from "lucide-react";
import {
  getAuth, onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore, collection, addDoc, getDocs, deleteDoc, doc,
} from "firebase/firestore";
import { app } from "@/app/firebase";
import VoiceButton from "./VoiceButton";
import ReactMarkdown from "react-markdown";

const SYSTEM_PROMPT =
  "You are Kaddu's helpful assistant. Keep responses short, friendly, and emoji-rich. Format your responses using markdown.";

export default function Assistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<{ sender: string; text: string }[]>([]);
  const [history, setHistory] = useState<
    { id?: string; title: string; content: { sender: string; text: string }[] }[]
  >([]);
  const [showHistory, setShowHistory] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [botTyping, setBotTyping] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const assistantRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const auth = getAuth(app);
  const db = getFirestore(app);

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

  const fetchHistory = async () => {
    const user = auth.currentUser;
    if (!user) {
      setHistory([]);
      return;
    }
  
    const querySnapshot = await getDocs(collection(db, "assistant-history"));
    const loaded = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        title: doc.data().title || "Untitled",
        content: doc.data().content || [],
        uid: doc.data().uid,
      }))
      .filter((item: any) => item.uid === user.uid); // only user's own history
    setHistory(loaded);
  };
  
  

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    const handleClickOutside = async (e: MouseEvent) => {
      if (assistantRef.current && !assistantRef.current.contains(e.target as Node)) {
        await autoSaveChat();
        setOpen(false);
        setShowHistory(false);
      }
    };
    const handleEscape = async (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        await autoSaveChat();
        setOpen(false);
        setShowHistory(false);
      }
    };
    if (open || showHistory) {
      window.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("keydown", handleEscape);
    }
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, showHistory, chat]);

  const autoSaveChat = async () => {
    const user = auth.currentUser;
    const chatToSave = [...chat]; // capture latest
  
    if (!user || chatToSave.length === 0) return;
  
    const title = chatToSave[0]?.text?.slice(0, 30) + "...";
    try {
      await addDoc(collection(db, "assistant-history"), {
        title,
        content: chatToSave,
        uid: user.uid,
        timestamp: Date.now(),
      });
      fetchHistory();
    } catch (err) {
      console.error("Failed to auto-save chat:", err);
    }
  };
   
  
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { sender: "user", text: trimmed };
    const thinking = { sender: "bot", text: "Thinking..." };
    setChat((prev) => [...prev, userMessage, thinking]);
    setInput("");
    setBotTyping(true);

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

      let shownText = "";
      setChat((prev) => [...prev.slice(0, -1), { sender: "bot", text: "" }]);

      for (let i = 0; i <= reply.length; i++) {
        shownText = reply.slice(0, i);
        await new Promise((r) => setTimeout(r, 12));
        setChat((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { sender: "bot", text: shownText };
          return updated;
        });
      }
    } catch {
      setChat((prev) => [
        ...prev.slice(0, -1),
        { sender: "bot", text: "Oops! Something went wrong." },
      ]);
    } finally {
      setBotTyping(false);
    }
  };

  const newChat = async () => {
    const currentChat = [...chat]; // preserve before clearing
    setChat([]); // clear UI immediately
    setInput("");
  
    if (currentChat.length > 0) {
      const user = auth.currentUser;
      if (user) {
        const title = currentChat[0]?.text?.slice(0, 30) + "...";
        try {
          await addDoc(collection(db, "assistant-history"), {
            title,
            content: currentChat,
            uid: user.uid,
            timestamp: Date.now(),
          });
          fetchHistory();
        } catch (err) {
          console.error("Failed to save chat:", err);
        }
      }
    }
  };
  

  const downloadChat = (chatToDownload = chat, filename = "chat.txt") => {
    const content = chatToDownload.map((c) => `${c.sender.toUpperCase()}: ${c.text}`).join("\n\n");
    const blob = new Blob([content], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  };

  const loadHistory = (index: number) => {
    setChat(history[index].content);
    setShowHistory(false);
    setOpen(true);
  };

  const deleteHistory = async (index: number) => {
    const item = history[index];
    if (item.id) await deleteDoc(doc(db, "assistant-history", item.id));
    const updated = [...history];
    updated.splice(index, 1);
    setHistory(updated);
  };

  const clearHistory = async () => {
    const all = await getDocs(collection(db, "assistant-history"));
    for (const docSnap of all.docs) {
      await deleteDoc(doc(db, "assistant-history", docSnap.id));
    }
    setHistory([]);
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
          className="fixed bottom-24 right-6 w-[90vw] max-w-md bg-zinc-900 border border-zinc-700 text-white rounded-2xl shadow-2xl flex flex-col animate-fade-in"
        >
          <div className="flex justify-between items-center p-4 border-b border-zinc-700">
            <h2 className="font-semibold text-base">💬 Assistant</h2>
            <button onClick={() => setOpen(false)} title="Close">
              <X size={18} className="text-zinc-400 hover:text-white transition" />
            </button>
          </div>

          <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 max-h-[300px] scroll-smooth">
            {chat.length === 0 ? (
              <div className="text-sm text-zinc-400">
                <p className="italic mb-1">Hello {userName || "there"}! 👋</p>
                <p className="italic">I'm your assistant built by <span className="text-blue-500 font-semibold">Kaddu</span>! Let's chat 😊</p>
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
                  {msg.sender === "bot" ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
                </div>
              ))
            )}
          </div>

          <div className="flex flex-col gap-2 border-t border-zinc-700 p-3">
            <label htmlFor="voiceLang" className="sr-only">Select Voice Language</label>
            <select
              id="voiceLang"
              className="w-full bg-zinc-800 text-white text-sm px-3 py-2 rounded-md border border-zinc-600"
              value={localStorage.getItem("voiceLang") || "en-US"}
              onChange={(e) => {
                localStorage.setItem("voiceLang", e.target.value);
                window.dispatchEvent(new Event("voiceLangChanged"));
              }}
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="hi-IN">Hindi (India)</option>
              <option value="es-ES">Spanish</option>
              <option value="fr-FR">French</option>
            </select>

            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                className="flex-1 bg-zinc-800 text-white text-sm px-3 py-2 rounded-md border border-zinc-600"
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
              <VoiceButton
                onResult={(text: string) => {
                  setInput(text);
                  setTimeout(() => handleSend(), 100);
                }}
              />
              <button
  onClick={handleSend}
  disabled={botTyping}
  className={`p-2 rounded-md transition ${
    botTyping
      ? "bg-blue-400 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700"
  } text-white`}
  title="Send"
  aria-label="Send message"
>
  {botTyping ? (
    <svg
      className="animate-spin h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        strokeOpacity="0.25"
        strokeWidth="4"
      />
      <path
        d="M4 12a8 8 0 018-8"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  ) : (
    <SendHorizonal size={16} />
  )}
</button>

            </div>
          </div>

          <div className="flex justify-between px-4 py-2 text-xs text-zinc-400 bg-zinc-800 rounded-b-lg">
            <button onClick={newChat} className="flex items-center gap-1 hover:text-white"><Plus size={12} /> New</button>
            <button onClick={() => setChat([])} className="flex items-center gap-1 hover:text-white"><Trash2 size={12} /> Clear</button>
            <button onClick={() => downloadChat()} className="flex items-center gap-1 hover:text-white"><Download size={12} /> .txt</button>
            <button onClick={() => setShowHistory(true)} className="hover:text-white">🕓 History</button>
          </div>
        </div>
      )}

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
                    <div className="text-sm cursor-pointer hover:underline" onClick={() => loadHistory(index)}>
                      {item.title}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => downloadChat(item.content, `chat-${index + 1}.txt`)} title="Download chat">
                        <Download size={14} className="text-green-400 hover:text-green-500" />
                      </button>
                      <button onClick={() => deleteHistory(index)} title="Delete chat">
                        <Trash2 size={14} className="text-red-500 hover:text-red-600" />
                      </button>
                    </div>
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
