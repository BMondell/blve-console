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
    sm: "text-[1.125rem]",
    md: "text-[1.5rem]",
    lg: "text-[1.875rem]",
  };

  return (
    <div className={`space-y-[var(--blv-md)] ${className}`}>
      <div className="flex items-center justify-between">
        <p className="text-[var(--blv-text-primary)]-secondary text-[0.875rem] font-medium">{label}</p>
        {icon && <div className="text-[var(--blv-text-primary)]-tertiary flex-shrink-0">{icon}</div>}
      </div>
      <p className={`${sizeClasses[size]} font-bold text-[var(--blv-text-primary)]`}>
        {value}
      </p>
      {trend && (
        <p
          className={`text-[0.875rem] font-medium ${
            trend.direction === "up" ? "text-green-500" : "text-red-500"
          }`}
        >
          {trend.direction === "up" ? "↑" : "↓"} {Math.abs(trend.value)}%
        </p>
      )}
    </div>
  );
};
