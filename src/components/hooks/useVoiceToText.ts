import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
    SpeechRecognition: new () => SpeechRecognition;
  }

  interface SpeechRecognition extends EventTarget {
    start(): void;
    stop(): void;
    abort(): void;
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  }

  interface SpeechRecognitionResult {
    readonly [index: number]: SpeechRecognitionAlternative;
    readonly isFinal: boolean;
    readonly length: number;
  }

  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }

  interface SpeechRecognitionResultList {
    readonly [index: number]: SpeechRecognitionResult;
    readonly length: number;
  }

  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
  }
}

export default function useVoiceToText() {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [language, setLanguage] = useState("en-US");

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const lastResultRef = useRef("");
  const manuallyStoppedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const spokenText = result[0].transcript.trim();
        if (result.isFinal) {
          finalTranscript += spokenText + " ";
        }
      }

      const trimmed = finalTranscript.trim();
      if (trimmed && trimmed !== lastResultRef.current) {
        lastResultRef.current = trimmed;
        setTranscript(trimmed);
      }
    };

    recognition.onerror = (event) => {
      if (event.error === "aborted") {
        // Expected sometimes during manual stop or rapid restart; not critical.
        console.warn("Speech recognition aborted.");
        return;
      }

      console.error("Speech recognition error:", event.error);
      setListening(false);

      if (event.error === "not-allowed") {
        alert("Microphone access denied. Please allow microphone permission.");
      }
    };

    recognition.onend = () => {
      if (listening && !manuallyStoppedRef.current) {
        try {
          recognition.start();
        } catch (err) {
          console.warn("Restart failed:", err);
        }
      } else {
        setListening(false);
        manuallyStoppedRef.current = false;
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [language]);

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      setTranscript("");
      manuallyStoppedRef.current = false;
      setListening(true);

      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn("Recognition start error (maybe already running):", err);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && listening) {
      manuallyStoppedRef.current = true;
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  const toggleListening = () => {
    listening ? stopListening() : startListening();
  };

  return {
    transcript,
    listening,
    language,
    setLanguage,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript: () => setTranscript(""),
  };
}
