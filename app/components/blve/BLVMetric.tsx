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

export const BLVMetric: React.FC<BLVMetricProps> = ({
  label,
  value,
  icon,
  trend,
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "text-blv-lg",
    md: "text-blv-2xl",
    lg: "text-blv-3xl",
  };

  return (
    <div className={`space-y-blv-md ${className}`}>
      <div className="flex items-center justify-between">
        <p className="text-blv-text-secondary text-blv-sm font-medium">{label}</p>
        {icon && <div className="text-blv-text-tertiary flex-shrink-0">{icon}</div>}
      </div>
      <p className={`${sizeClasses[size]} font-bold text-blv-text`}>
        {value}
      </p>
      {trend && (
        <p
          className={`text-blv-sm font-medium ${
            trend.direction === "up" ? "text-green-500" : "text-red-500"
          }`}
        >
          {trend.direction === "up" ? "↑" : "↓"} {Math.abs(trend.value)}%
        </p>
      )}
    </div>
  );
};
