"use client";

import { useEffect, useState } from "react";

interface WeatherData {
  location: {
    name: string;
  };
  current: {
    temp_c: number;
    condition: {
      icon: string;
      text: string;
    };
  };
}

const LiveWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [locationError, setLocationError] = useState<string>("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const { latitude, longitude } = coords;
          const res = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=3b13e3aecad84094841181014250504&q=${latitude},${longitude}`
          );

          if (!res.ok) {
            throw new Error("Failed to fetch weather.");
          }

          const data: WeatherData = await res.json();
          setWeather(data);
        } catch (err) {
          setLocationError("Failed to fetch weather data.");
        }
      },
      () => setLocationError("Permission denied or unavailable.")
    );
  }, []);

  return (
    <div className="text-sm text-muted-foreground flex items-center gap-2">
      {locationError && <span className="text-red-400">{locationError}</span>}

      {!locationError && !weather && <span>Fetching weather...</span>}

      {weather && (
        <>
          <img
            src={weather.current.condition.icon}
            alt={weather.current.condition.text}
            className="w-6 h-6"
          />
          <span>
            {weather.location.name} - {weather.current.temp_c}°C
          </span>
        </>
      )}
    </div>
  );
};

export default LiveWeather;
