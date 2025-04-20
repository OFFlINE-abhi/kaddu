"use client";

import { useEffect, useState } from "react";
import { BsMicFill } from "react-icons/bs";
import useVoiceToText from "../hooks/useVoiceToText";

type VoiceButtonProps = {
  onResult: (text: string) => void;
};

const VoiceButton = ({ onResult }: VoiceButtonProps) => {
  const {
    transcript,
    toggleListening,
    listening,
    stopListening,
    language,
    setLanguage,
    resetTranscript,
  } = useVoiceToText();

  const [error, setError] = useState<string | null>(null);

  // Auto-send transcript directly to bot
  useEffect(() => {
    if (transcript) {
      onResult(transcript);
      resetTranscript();
    }
  }, [transcript]);

  // Stop listening on unmount
  useEffect(() => stopListening, []);

  // Sync language from localStorage
  useEffect(() => {
    const storedLang = localStorage.getItem("voiceLang");
    if (storedLang) setLanguage(storedLang);

    const handleLangChange = () => {
      const lang = localStorage.getItem("voiceLang");
      if (lang) setLanguage(lang);
    };

    window.addEventListener("voiceLangChanged", handleLangChange);
    return () => window.removeEventListener("voiceLangChanged", handleLangChange);
  }, [setLanguage]);

  // Handle microphone access errors
  useEffect(() => {
    const handleMicAccessError = (e: Event) => {
      setError("Microphone access denied. Please allow mic access to use voice.");
    };

    window.addEventListener("micAccessDenied", handleMicAccessError);
    return () => window.removeEventListener("micAccessDenied", handleMicAccessError);
  }, []);

  useEffect(() => {
    if (error) {
      alert(`Voice Error: ${error}`);
      setError(null);
    }
  }, [error]);

  return (
    <div className="flex items-center justify-center">
      <button
        onClick={toggleListening}
        aria-label={listening ? "Stop voice recognition" : "Start voice recognition"}
        title={`Language: ${language} | Click to ${listening ? "stop" : "start"} listening`}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center 
          transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400
          ${listening ? "bg-red-500 shadow-lg shadow-red-400 animate-pulse" : "bg-gray-700 hover:bg-gray-600"}
        `}
      >
        <BsMicFill className="text-white text-2xl" />
        {listening && (
          <span className="absolute inset-0 rounded-full border-2 border-red-300 animate-ping pointer-events-none" />
        )}
      </button>
    </div>
  );
};

export default VoiceButton;
