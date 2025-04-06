"use client";

import { useState, useEffect, useRef } from "react";
import { create, all } from "mathjs";
import { motion } from "framer-motion";
import { BsBackspace } from "react-icons/bs";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import clsx from "clsx";

// Register Chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

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
  const chartRef = useRef<any>(null);

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

  const handleClick = (value: string) => setInput((prev) => prev + value);
  const handleClear = () => {
    setInput("");
    setResult("");
  };
  const handleBackspace = () => setInput((prev) => prev.slice(0, -1));

  const handleEvaluate = () => {
    try {
      const scope = isDegrees
        ? {
            sin: (x: number) => Math.sin((x * Math.PI) / 180),
            cos: (x: number) => Math.cos((x * Math.PI) / 180),
            tan: (x: number) => Math.tan((x * Math.PI) / 180),
          }
        : {};

      const evalResult = math.evaluate(input, scope);
      setResult(evalResult.toString());
      setHistory((prev) => [`${input} = ${evalResult}`, ...prev]);
    } catch {
      setResult("Error");
    }
  };

  const toggleAngleMode = () => setIsDegrees((prev) => !prev);

  const generateGraphData = () => {
    const xValues: number[] = [];
    const yValues: number[] = [];

    for (let x = -10; x <= 10; x += 0.1) {
      try {
        const y = math.evaluate(input.replace(/x/g, `(${x})`));
        xValues.push(x);
        yValues.push(typeof y === "number" ? y : NaN);
      } catch {
        xValues.push(x);
        yValues.push(NaN);
      }
    }

    return {
      labels: xValues,
      datasets: [
        {
          label: `f(x) = ${input}`,
          data: yValues,
          borderColor: "#4ade80",
          tension: 0.1,
          pointRadius: 0,
        },
      ],
    };
  };

  const buttons = [
    "7", "8", "9", "/", "sin(",
    "4", "5", "6", "*", "cos(",
    "1", "2", "3", "-", "tan(",
    "0", ".", "(", ")", "+",
    "^", "sqrt(", "log10(", "log(", "="
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-xl w-full max-w-lg mx-auto border border-zinc-200 dark:border-zinc-700"
    >
      {/* Display */}
      <div className="bg-zinc-800 text-white p-4 rounded-lg mb-4 font-mono shadow-inner">
        <div className="text-sm text-zinc-400 break-words">{input || "0"}</div>
        <div className="text-2xl font-bold mt-2">{result}</div>
      </div>

      {/* Angle Mode */}
      <button
        onClick={toggleAngleMode}
        className="mb-3 px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded-full text-sm"
      >
        Mode: {isDegrees ? "Degrees" : "Radians"}
      </button>

      {/* Buttons */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {buttons.map((btn) => (
          <motion.button
            whileTap={{ scale: 0.95 }}
            key={btn}
            className={clsx(
              "p-3 rounded font-semibold text-sm transition",
              ["+", "-", "*", "/", "^", "="].includes(btn)
                ? "bg-emerald-600 text-white hover:bg-emerald-500"
                : ["sin(", "cos(", "tan(", "sqrt(", "log(", "log10("].includes(btn)
                ? "bg-teal-600 text-white hover:bg-teal-500"
                : "bg-gray-700 text-white hover:bg-gray-600"
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

      {/* Graph Plotter */}
      {input && (
        <div className="bg-zinc-900 mt-4 p-4 rounded-lg shadow-md">
          <div className="text-white font-semibold mb-2">Graph</div>
          <div className="h-64">
            <Line ref={chartRef} data={generateGraphData()} options={{ responsive: true }} />
          </div>
          <button
            onClick={() => chartRef.current?.resetZoom()}
            className="mt-3 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
          >
            Reset Zoom
          </button>
        </div>
      )}

      {/* History */}
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
