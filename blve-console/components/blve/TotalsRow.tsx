"use client";

import React from "react";

interface TotalMetric {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

interface TotalsRowProps {
  metrics: TotalMetric[];
}

export const TotalsRow: React.FC<TotalsRowProps> = ({ metrics }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {metric.value}
                </p>
              </div>
              {metric.icon && (
                <div className="text-gray-300 flex-shrink-0">{metric.icon}</div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200"></div>
    </div>
  );
};
