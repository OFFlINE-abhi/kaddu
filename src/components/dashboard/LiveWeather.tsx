"use client";

import { useEffect, useState, useCallback } from "react";
import { FiAlertCircle } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Image from "next/image";
import { db } from "@/app/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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

  const logWeatherFetch = async (
    latitude: number,
    longitude: number,
    locationName: string
  ) => {
    try {
      await addDoc(collection(db, "weatherLogs"), {
        location: locationName,
        latitude,
        longitude,
        timestamp: serverTimestamp(),
      });
      console.log("✅ Weather fetch logged in Firestore");
    } catch (err) {
      console.error("❌ Error logging weather fetch:", err);
    }
  };

  const fetchWeather = useCallback(async (latitude: number, longitude: number) => {
    try {
      console.log(`Fetching weather for: ${latitude}, ${longitude}`);

      const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
      if (!API_KEY) throw new Error("Weather API key is missing.");

      const res = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}`
      );

      if (!res.ok) throw new Error("Failed to fetch weather data.");

      const data: WeatherData = await res.json();

      console.log("Fetched Data:", data);
      setWeather(data);
      logWeatherFetch(latitude, longitude, data.location.name);
    } catch (err) {
      setError("Could not retrieve weather data.");
      console.error("Weather API error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => fetchWeather(coords.latitude, coords.longitude),
      (err) => {
        setError("Location access denied. Unable to fetch weather.");
        console.error("Geolocation error:", err);
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  }, [fetchWeather]);

  return (
    <div className="text-sm text-gray-400 flex items-center gap-2 p-2 bg-zinc-800 rounded-lg shadow-md overflow-hidden">
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
          <Image
            src={`https:${weather.current.condition.icon}`}
            alt={weather.current.condition.text}
            width={30}
            height={30}
            className="w-6 h-6"
          />
          <span>
            📍 <strong>{weather.location.name}</strong> ({weather.location.lat},{" "}
            {weather.location.lon}) -{" "}
            <strong>{weather.current.temp_c}°C</strong>
          </span>
        </div>
      )}
    </div>
  );
};

export default LiveWeather;
