"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      render: (containerId: string, parameters: { sitekey: string; callback: () => void }) => void;
    };
  }
}

interface ReCAPTCHAProps {
  onVerify: () => void;
}

const ReCAPTCHA = ({ onVerify }: ReCAPTCHAProps) => {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (!siteKey) {
      console.error("❌ reCAPTCHA site key is missing. Please check your .env setup.");
      return;
    }

    const loadScript = () => {
      if (document.getElementById("recaptcha-script")) return;

      const script = document.createElement("script");
      script.id = "recaptcha-script";
      script.src =
        "https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };

    const renderCaptcha = () => {
      if (typeof window === "undefined") return;

      // @ts-ignore: ignore grecaptcha typing issue for now
      if (window.grecaptcha && window.grecaptcha.render) {
        const existing = document.getElementById("recaptcha-container");
        if (existing && !existing.hasChildNodes()) {
          window.grecaptcha.render("recaptcha-container", {
            sitekey: siteKey,
            callback: () => {
              onVerify();
            },
          });
        }
      } else {
        console.warn("⚠️ grecaptcha not available yet.");
      }
    };

    // Assign callback globally
    (window as any).onloadCallback = renderCaptcha;

    loadScript();

    return () => {
      delete (window as any).onloadCallback;
    };
  }, [onVerify, siteKey]);

  if (!siteKey) {
    return <p className="text-red-500">⚠️ Missing reCAPTCHA site key!</p>;
  }

  return <div id="recaptcha-container" className="flex justify-center my-4" />;
};

export default ReCAPTCHA;
