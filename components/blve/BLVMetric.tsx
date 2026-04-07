"use client";
import React from "react";

interface BLVMetricProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  sparkline?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * BLVMetric — Executive metric display.
 * Large high-clarity number, muted sub-label, trend indicator, optional sparkline.
 */
export const BLVMetric: React.FC<BLVMetricProps> = ({
  label,
  value,
  icon,
  trend,
  sparkline,
  size = "md",
  className = "",
}) => {
  const valueSizes = {
    sm: "text-xl font-bold",
    md: "text-2xl font-bold",
    lg: "text-3xl font-bold",
  };

  const trendColor =
    trend?.direction === "up" ? "text-[#4ADE80]" : "text-[#F87171]";
  const trendArrow = trend?.direction === "up" ? "↑" : "↓";

  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      {/* Left: label + value + trend */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[rgba(255,255,255,0.60)] mb-2 truncate">
          {label}
        </p>
        <p className={`${valueSizes[size]} text-white leading-none`}>
          {value}
        </p>
        {trend && (
          <p className={`text-sm font-semibold mt-2 ${trendColor}`}>
            {trendArrow} {Math.abs(trend.value)}%
          </p>
        )}
      </div>

      {/* Right: sparkline or icon */}
      {sparkline ? (
        <div className="flex-shrink-0 w-20 h-10 opacity-80">{sparkline}</div>
      ) : icon ? (
        <div className="flex-shrink-0 text-[rgba(255,255,255,0.35)] mt-1">{icon}</div>
      ) : null}
    </div>
  );
};
