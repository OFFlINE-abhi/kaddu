"use client";

import { useEffect } from "react";
import { BsMicFill } from "react-icons/bs";
import useVoiceToText from "../hooks/useVoiceToText";

const VoiceButton = ({ onResult }: { onResult: (text: string) => void }) => {
  const { transcript, toggleListening, listening, stopListening } = useVoiceToText();

  useEffect(() => {
    if (transcript) onResult(transcript);
  }, [transcript]);

  // Auto stop when unmounted or navigated away
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  return (
    <button
      onClick={toggleListening}
      title={listening ? "Stop listening" : "Start listening"}
      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
        listening
          ? "bg-red-500 animate-pulse shadow-lg shadow-red-300"
          : "bg-gray-700 hover:bg-gray-600"
      }`}
    >
      <BsMicFill className="text-white text-2xl" />
    </button>
  );
};

export default VoiceButton;
