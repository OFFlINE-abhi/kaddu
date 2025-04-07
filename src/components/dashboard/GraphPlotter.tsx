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
  ChartOptions,
  ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";
import { evaluate } from "mathjs";

interface GraphProps {
  expression: string;
}

// Register Chart.js core components
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

export default function GraphPlotter({ expression }: GraphProps) {
  const chartRef = useRef<ChartJSOrUndefined<"line">>(null);
  const [graphData, setGraphData] = useState<ChartData<"line">>({
    labels: [],
    datasets: [],
  });

  // Safely load chartjs-plugin-zoom on client only
  useEffect(() => {
    const loadZoomPlugin = async () => {
      const zoomPlugin = (await import("chartjs-plugin-zoom")).default;
      ChartJS.register(zoomPlugin);
    };
    loadZoomPlugin();
  }, []);

  const generateGraphData = useMemo(() => {
    return (): ChartData<"line"> => {
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
            borderColor: "#4ade80",
            borderWidth: 2,
            backgroundColor: "rgba(74, 222, 128, 0.1)",
            pointRadius: 0,
            tension: 0.2,
          },
        ],
      };
    };
  }, [expression]);

  useEffect(() => {
    setGraphData(generateGraphData());
  }, [expression, generateGraphData]);

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, labels: { color: "#ffffff" } },
      tooltip: { enabled: true },
      zoom: {
        pan: { enabled: true, mode: "xy" },
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

  const handleResetZoom = () => {
    chartRef.current?.resetZoom();
  };

  return (
    <div className="bg-zinc-900 mt-4 p-5 rounded-lg shadow-md">
      <div className="text-white font-semibold mb-2">📊 Graph</div>
      <div className="h-64">
        <Line ref={chartRef} data={graphData} options={options} />
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
