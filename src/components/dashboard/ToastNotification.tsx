"use client";

import { useEffect, useState } from "react";

const ToastNotification = ({ message }: { message: string }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-black/80 text-white px-4 py-2 rounded-md shadow-md animate-fadeIn">
      {message}
    </div>
  );
};

export default ToastNotification;
