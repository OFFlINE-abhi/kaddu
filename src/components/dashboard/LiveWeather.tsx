"use client";

import { useEffect, useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface WeatherData {
  location: { name: string; lat: number; lon: number };
  current: {
    temp_c: number;
    condition: { icon: string; text: string };
  };
}

const LiveWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    const fetchWeather = async (latitude: number, longitude: number) => {
      try {
        console.log(`Fetching weather for: ${latitude}, ${longitude}`);

        const res = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=3b13e3aecad84094841181014250504&q=${latitude},${longitude}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch weather data.");
        }

        const data: WeatherData = await res.json();

        // Ensure correct coordinates are being used
        console.log("Fetched Data:", data);

        setWeather(data);
      } catch (err) {
        setError("Could not retrieve weather data.");
      } finally {
        setLoading(false);
      }
    };

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => fetchWeather(coords.latitude, coords.longitude),
      (err) => {
        setError("Location access denied. Unable to fetch weather.");
        console.error("Geolocation error:", err);
        setLoading(false);
      },
      { enableHighAccuracy: true } // ✅ Forces precise GPS location
    );
  }, []);

  return (
    <div className="text-sm text-gray-400 flex items-center gap-2 p-2 bg-zinc-800 rounded-lg shadow-md">
      {loading && (
        <span className="flex items-center gap-1 text-blue-400">
          <AiOutlineLoading3Quarters className="animate-spin" /> Fetching weather...
        </span>
      )}

      {error && (
        <span className="flex items-center gap-1 text-red-400">
          <FiAlertCircle /> {error}
        </span>
      )}

      {weather && !loading && (
        <div className="flex items-center gap-2 text-white">
          <img src={weather.current.condition.icon} alt={weather.current.condition.text} className="w-6 h-6" />
          <span>
            📍 <strong>{weather.location.name}</strong> ({weather.location.lat}, {weather.location.lon}) -{" "}
            <strong>{weather.current.temp_c}°C</strong>
          </span>
        </div>
      )}
    </div>
  );
};

export default LiveWeather;
