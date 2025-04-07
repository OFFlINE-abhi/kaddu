"use client";

import dynamic from "next/dynamic";

// Dynamically import Line from react-chartjs-2 for client-side rendering only
const Line = dynamic(() =>
  import("react-chartjs-2").then((mod) => mod.Line), {
  ssr: false,
  loading: () => <p className="text-center text-sm text-gray-500">Loading chart...</p>,
});

export default Line;
