"use client";

import { useEffect, useRef } from "react";
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
import { Line } from "react-chartjs-2";
import { evaluate } from "mathjs";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  zoomPlugin // 📌 Register zoom plugin
);

interface GraphProps {
  expression: string;
}

export default function GraphPlotter({ expression }: GraphProps) {
  const chartRef = useRef<any>(null);

  // Generate points
  const xValues: number[] = [];
  const yValues: number[] = [];
  for (let x = -10; x <= 10; x += 0.1) {
    try {
      const scope = { x };
      const y = evaluate(expression, scope);
      xValues.push(x);
      yValues.push(typeof y === "number" ? y : NaN);
    } catch {
      xValues.push(x);
      yValues.push(NaN);
    }
  }

  const data = {
    labels: xValues,
    datasets: [
      {
        label: `f(x) = ${expression}`,
        data: yValues,
        fill: false,
        borderColor: "#3b82f6",
        tension: 0.1,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
      zoom: {
        pan: {
          enabled: true,
          mode: "xy",
        },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "xy",
        },
        limits: {
          x: { min: -50, max: 50 },
          y: { min: -50, max: 50 },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "x" },
      },
      y: {
        title: { display: true, text: "f(x)" },
      },
    },
  };

  // Reset zoom button (optional)
  const handleResetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  return (
    <div className="bg-zinc-900 mt-4 p-4 rounded-lg shadow-md">
      <div className="text-white font-semibold mb-2">Graph</div>
      <div className="h-64">
        <Line ref={chartRef} data={data} options={options as any} />
      </div>
      <button
        onClick={handleResetZoom}
        className="mt-3 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
      >
        Reset Zoom
      </button>
    </div>
  );
}
