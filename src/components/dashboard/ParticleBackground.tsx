"use client";

import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadAll } from "tsparticles-all"; // ✅ Compatible with v3+
import type { Engine } from "tsparticles-engine";

export default function ParticleBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadAll(engine); // ✅ Ensures compatibility
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: false },
        background: { color: "transparent" },
        particles: {
          number: { value: 40, density: { enable: true, area: 800 } },
          color: { value: "#00ffff" },
          shape: { type: "circle" },
          size: { value: { min: 1, max: 3 }, random: true },
          move: {
            enable: true,
            speed: 1.2,
            direction: "none",
            random: false,
            straight: false,
            outModes: { default: "bounce" },
          },
          opacity: { value: 0.3, random: true },
          links: {
            enable: true,
            distance: 120,
            color: "#00ffff",
            opacity: 0.2,
            width: 1,
          },
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: "repulse" },
            onClick: { enable: true, mode: "push" },
          },
          modes: {
            repulse: { distance: 100, duration: 0.4 },
            push: { particles_nb: 4 },
          },
        },
      }}
      className="absolute inset-0 z-0"
    />
  );
}
