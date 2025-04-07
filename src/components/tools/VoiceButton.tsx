"use client";

import { useEffect } from "react";
import { BsMicFill } from "react-icons/bs";
import useVoiceToText from "../hooks/useVoiceToText";

type VoiceButtonProps = {
  onResult: (text: string) => void;
};

const VoiceButton = ({ onResult }: VoiceButtonProps) => {
  const { transcript, toggleListening, listening, stopListening } = useVoiceToText();

  // Send transcript result when available
  useEffect(() => {
    if (transcript) {
      onResult(transcript);
    }
  }, [transcript, onResult]);

  // Cleanup when unmounted or navigating away
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return (
    <button
      onClick={toggleListening}
      aria-label={listening ? "Stop voice recognition" : "Start voice recognition"}
      title={listening ? "Stop Listening" : "Start Listening"}
      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 
        ${
          listening
            ? "bg-red-500 animate-pulse shadow-md shadow-red-400"
            : "bg-gray-700 hover:bg-gray-600"
        }`}
    >
      <BsMicFill className="text-white text-2xl" />
    </button>
  );
};

export default VoiceButton;
