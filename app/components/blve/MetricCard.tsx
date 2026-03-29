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

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon,
  trend,
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p
              className={`text-sm font-medium mt-2 ${
                trend.direction === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.direction === "up" ? "↑" : "↓"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && (
          <div className="text-gray-400 ml-4 flex-shrink-0">{icon}</div>
        )}
      </div>
    </div>
  );
};
