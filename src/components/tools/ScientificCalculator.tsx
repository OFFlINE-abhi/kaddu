// src/components/tools/ScientificCalculator.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { create, all } from "mathjs";
import { motion } from "framer-motion";
import { BsBackspace } from "react-icons/bs";
import clsx from "clsx";

// Setup mathjs instance
const math = create(all, {
  number: "number",
  precision: 14,
});

export default function ScientificCalculator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [isDegrees, setIsDegrees] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") handleEvaluate();
      else if (e.key === "Backspace") handleBackspace();
      else if (e.key === "Escape") handleClear();
      else if (/^[0-9+\-*/().^]$/.test(e.key)) handleClick(e.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleClick = (value: string) => {
    setInput((prev) => prev + value);
  };

  const handleClear = () => {
    setInput("");
    setResult("");
  };

  const handleBackspace = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const handleEvaluate = () => {
    try {
      const scope = isDegrees ? {
        sin: (x: number) => Math.sin((x * Math.PI) / 180),
        cos: (x: number) => Math.cos((x * Math.PI) / 180),
        tan: (x: number) => Math.tan((x * Math.PI) / 180),
      } : {};

      const evalResult = math.evaluate(input, scope);
      setResult(evalResult.toString());
      setHistory((prev) => [`${input} = ${evalResult}`, ...prev]);
    } catch {
      setResult("Error");
    }
  };

  const toggleAngleMode = () => setIsDegrees((prev) => !prev);

  const buttons = [
    "7", "8", "9", "/", "sin(",
    "4", "5", "6", "*", "cos(",
    "1", "2", "3", "-", "tan(",
    "0", ".", "(", ")", "+",
    "^", "sqrt(", "log10(", "log(", "="
  ];

  const isOperator = (val: string) => ["+", "-", "*", "/", "^", "="].includes(val);
  const isFunction = (val: string) =>
    ["sin(", "cos(", "tan(", "sqrt(", "log(", "log10("].includes(val);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-xl w-full max-w-md mx-auto border border-zinc-200 dark:border-zinc-700"
    >
      {/* Display Area */}
      <div className="bg-zinc-800 text-white p-4 rounded-lg mb-4 font-mono shadow-inner">
        <div className="text-sm text-zinc-400 break-words">{input || "0"}</div>
        <div className="text-2xl font-bold mt-2">{result}</div>
      </div>

      {/* Angle Mode Toggle */}
      <button
        onClick={toggleAngleMode}
        className="mb-3 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-sm"
      >
        Mode: {isDegrees ? "Degrees" : "Radians"}
      </button>

      {/* Button Grid */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {buttons.map((btn) => (
          <motion.button
            whileTap={{ scale: 0.95 }}
            key={btn}
            className={clsx(
              "p-3 rounded font-semibold text-sm transition",
              isOperator(btn)
                ? "bg-orange-600 text-white hover:bg-orange-500"
                : isFunction(btn)
                ? "bg-purple-600 text-white hover:bg-purple-500"
                : "bg-zinc-700 text-white hover:bg-zinc-600"
            )}
            onClick={() => (btn === "=" ? handleEvaluate() : handleClick(btn))}
          >
            {btn}
          </motion.button>
        ))}

        {/* Backspace */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleBackspace}
          className="col-span-2 bg-yellow-500 hover:bg-yellow-400 text-white rounded p-3 flex items-center justify-center gap-2 font-semibold"
        >
          <BsBackspace /> Back
        </motion.button>

        {/* Clear */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleClear}
          className="col-span-3 bg-red-600 hover:bg-red-500 text-white rounded p-3 font-semibold"
        >
          Clear
        </motion.button>
      </div>

      {/* History Section */}
      {history.length > 0 && (
        <div className="mt-4 bg-zinc-100 dark:bg-zinc-800 p-3 rounded max-h-40 overflow-auto text-sm font-mono text-zinc-700 dark:text-zinc-300">
          <h3 className="font-bold mb-2">🧾 History:</h3>
          {history.map((item, index) => (
            <div key={index} className="mb-1 border-b border-zinc-300 dark:border-zinc-700 pb-1">
              {item}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
