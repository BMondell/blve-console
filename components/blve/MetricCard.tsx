"use client";
import React from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
}

/**
 * MetricCard — Executive metric card (legacy wrapper).
 */
export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon,
  trend,
}) => {
  const trendColor = trend?.direction === "up" ? "text-[#4ADE80]" : "text-[#F87171]";
  const trendArrow = trend?.direction === "up" ? "↑" : "↓";

  return (
    <div className="bg-[#111418] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.4),0_4px_16px_rgba(0,0,0,0.3)] transition-all duration-200 hover:border-[rgba(255,255,255,0.18)]">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-[rgba(255,255,255,0.60)] mb-2">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {trend && (
            <p className={`text-sm font-semibold mt-2 ${trendColor}`}>
              {trendArrow} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && (
          <div className="text-[rgba(255,255,255,0.35)] ml-4 flex-shrink-0 mt-1">{icon}</div>
        )}
      </div>
    </div>
  );
};
