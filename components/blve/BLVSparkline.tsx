"use client";
import React from "react";

interface BLVSparklineProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
  className?: string;
}

/**
 * BLVSparkline — Minimal inline SVG sparkline.
 * Soft gradient fill, no axes, executive calm aesthetic.
 */
export const BLVSparkline: React.FC<BLVSparklineProps> = ({
  data,
  color = "#3B82F6",
  height = 40,
  width = 80,
  className = "",
}) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pad = 2;
  const w = width - pad * 2;
  const h = height - pad * 2;

  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * w;
    const y = pad + h - ((v - min) / range) * h;
    return `${x},${y}`;
  });

  const polyline = points.join(" ");
  const fillPath =
    `M ${points[0]} ` +
    points
      .slice(1)
      .map((p) => `L ${p}`)
      .join(" ") +
    ` L ${pad + w},${pad + h} L ${pad},${pad + h} Z`;

  const gradId = `spark-${color.replace(/[^a-zA-Z0-9]/g, "")}-${data.length}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {/* Gradient fill */}
      <path d={fillPath} fill={`url(#${gradId})`} />
      {/* Line */}
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
