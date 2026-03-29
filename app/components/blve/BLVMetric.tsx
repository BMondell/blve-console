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
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * BLVΞMetric – A metric display component following the BLVΞ design system.
 * 
 * Features:
 * - text-gray-600 for labels
 * - Scalable value sizes (sm, md, lg)
 * - Optional trend indicators
 * - Icon support
 * - Consistent typography and spacing
 */
export const BLVMetric: React.FC<BLVMetricProps> = ({
  label,
  value,
  icon,
  trend,
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <p className="text-gray-600 text-sm font-medium">{label}</p>
        {icon && <div className="text-gray-400 flex-shrink-0">{icon}</div>}
      </div>
      <p className={`${sizeClasses[size]} font-bold text-gray-900`}>
        {value}
      </p>
      {trend && (
        <p
          className={`text-sm font-medium ${
            trend.direction === "up" ? "text-green-600" : "text-red-600"
          }`}
        >
          {trend.direction === "up" ? "↑" : "↓"} {Math.abs(trend.value)}%
        </p>
      )}
    </div>
  );
};
