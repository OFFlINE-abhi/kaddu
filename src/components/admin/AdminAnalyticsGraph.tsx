"use client";

import { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import { collection, onSnapshot, getFirestore } from "firebase/firestore";

Chart.register(...registerables);

export default function AdminAnalyticsGraph() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chartInstance, setChartInstance] = useState<Chart | null>(null);
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "analytics"), (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      const labels = data.map((d) => d.label);
      const values = data.map((d) => d.count);

      if (chartInstance) {
        chartInstance.data.labels = labels;
        chartInstance.data.datasets[0].data = values;
        chartInstance.update();
      } else if (chartRef.current) {
        const newChart = new Chart(chartRef.current, {
          type: "line",
          data: {
            labels,
            datasets: [
              {
                label: "User Events",
                data: values,
                borderColor: "rgb(59,130,246)",
                backgroundColor: "rgba(59,130,246,0.2)",
                tension: 0.3,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                labels: {
                  color: "#fff",
                },
              },
            },
            scales: {
              x: {
                ticks: { color: "#ccc" },
              },
              y: {
                ticks: { color: "#ccc" },
              },
            },
          },
        });
        setChartInstance(newChart);
      }
    });

    return () => unsubscribe();
  }, [chartInstance, db]);

  return (
    <div className="mt-6 p-4 bg-zinc-900 rounded-xl border border-zinc-700 shadow-lg">
      <h2 className="text-lg font-semibold text-white mb-3">📊 Real-Time Analytics</h2>
      <canvas ref={chartRef} />
    </div>
  );
}
