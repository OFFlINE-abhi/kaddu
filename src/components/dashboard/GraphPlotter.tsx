"use client";

import { useEffect, useRef, useState, useMemo } from "react";
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

// 📌 Register Chart.js components & plugins
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

interface GraphProps {
  expression: string;
}

export default function GraphPlotter({ expression }: GraphProps) {
  const chartRef = useRef<any>(null);
  const [graphData, setGraphData] = useState<{
    labels: number[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      borderWidth: number;
      backgroundColor: string;
      pointRadius: number;
      tension: number;
    }[];
  }>({ labels: [], datasets: [] });

  // Function to generate graph data
  const generateGraphData = useMemo(() => {
    return () => {
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

      return {
        labels: xValues,
        datasets: [
          {
            label: `f(x) = ${expression}`,
            data: yValues,
            borderColor: "#4ade80", // Green
            borderWidth: 2,
            backgroundColor: "rgba(74, 222, 128, 0.1)", // Transparent fill
            pointRadius: 0,
            tension: 0.2, // Smooth curves
          },
        ],
      };
    };
  }, [expression]);

  // Update graph data on expression change
  useEffect(() => {
    setGraphData(generateGraphData());
  }, [expression, generateGraphData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, labels: { color: "#ffffff" } },
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
        title: { display: true, text: "x", color: "#ffffff" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: { color: "#ffffff" },
      },
      y: {
        title: { display: true, text: "f(x)", color: "#ffffff" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: { color: "#ffffff" },
      },
    },
  };

  // Reset Zoom Function
  const handleResetZoom = () => {
    if (chartRef.current) chartRef.current.resetZoom();
  };

  return (
    <div className="bg-zinc-900 mt-4 p-5 rounded-lg shadow-md">
      <div className="text-white font-semibold mb-2">📊 Graph</div>
      <div className="h-64">
        <Line ref={chartRef} data={graphData as any} options={options as any} />
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
