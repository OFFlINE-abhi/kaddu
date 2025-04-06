"use client";

import { useCallback } from "react";
import Particles from "react-tsparticles"; // ✅ correct import for v3+
import { loadAll } from "tsparticles-all"; // ✅ correct loader for v3+
import type { Engine } from "tsparticles-engine"; // ✅ correct type

export default function ParticleBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadAll(engine); // ✅ loads all presets/features
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: false },
        background: {
          color: { value: "transparent" },
        },
        particles: {
          number: { value: 35 },
          color: { value: "#00ffff" },
          size: { value: 3 },
          move: { enable: true, speed: 1.6 },
          opacity: { value: 0.25 },
          links: { enable: true, color: "#00ffff", distance: 130 },
        },
      }}
      className="absolute inset-0 z-0"
    />
  );
}
