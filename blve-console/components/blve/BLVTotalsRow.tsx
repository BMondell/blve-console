"use client";

import React from "react";
import { BLVCard } from "./BLVCard";

interface TotalMetric {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
}

interface BLVTotalsRowProps {
  metrics: TotalMetric[];
  className?: string;
}

/**
 * BLVΞTotalsRow – A horizontal totals layout component following the BLVΞ design system.
 * 
 * Features:
 * - Responsive grid (1 col mobile, 2 col tablet, 4 col desktop)
 * - Consistent spacing (gap-4)
 * - Uses BLVCard for uniform styling
 * - Optional trend indicators
 * - Icon support for visual clarity
 */
export const BLVTotalsRow: React.FC<BLVTotalsRowProps> = ({
  metrics,
  className = "",
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <BLVCard key={index} hoverable={false}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium mb-2">
                  {metric.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {metric.value}
                </p>
                {metric.trend && (
                  <p
                    className={`text-sm font-medium mt-2 ${
                      metric.trend.direction === "up"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {metric.trend.direction === "up" ? "↑" : "↓"}{" "}
                    {Math.abs(metric.trend.value)}%
                  </p>
                )}
              </div>
              {metric.icon && (
                <div className="text-gray-300 ml-4 flex-shrink-0">
                  {metric.icon}
                </div>
              )}
            </div>
          </BLVCard>
        ))}
      </div>
    </div>
  );
};
