'use client';

import { useEffect, useState } from 'react';

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const Clock = () => {
  const [time, setTime] = useState<string>(formatTime(new Date()));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(formatTime(new Date()));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <time
      dateTime={new Date().toISOString()}
      className="text-sm text-gray-400 font-mono tracking-wide"
      aria-label="Current time"
    >
      {time}
    </time>
  );
};

export default Clock;
