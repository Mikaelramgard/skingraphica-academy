"use client";

import { motion } from "framer-motion";

interface MasteryRingProps {
  progress: number; // 0–100
  size?: number;
  strokeWidth?: number;
  tone?: "accent" | "mastery";
  children?: React.ReactNode;
}

const TICK_COUNT = 24;

export function MasteryRing({
  progress,
  size = 88,
  strokeWidth = 5,
  tone = "accent",
  children,
}: MasteryRingProps) {
  const radius = size / 2 - strokeWidth * 2.2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, progress));
  const offset = circumference - (clamped / 100) * circumference;
  const center = size / 2;
  const progressColor = tone === "accent" ? "#2447F5" : "#B5852E";

  const ticks = Array.from({ length: TICK_COUNT }, (_, i) => {
    const angle = (i / TICK_COUNT) * 2 * Math.PI - Math.PI / 2;
    const outer = size / 2 - 2;
    const inner = outer - 4;
    return {
      x1: center + Math.cos(angle) * inner,
      y1: center + Math.sin(angle) * inner,
      x2: center + Math.cos(angle) * outer,
      y2: center + Math.sin(angle) * outer,
    };
  });

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        {ticks.map((t, i) => (
          <line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke="#E8E7E2"
            strokeWidth={1}
            strokeLinecap="round"
          />
        ))}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#F3F2EF"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}
