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

/**
 * TotalsRow — Executive KPI row (legacy wrapper).
 */
export const TotalsRow: React.FC<TotalsRowProps> = ({ metrics }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-[#111418] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.4),0_4px_16px_rgba(0,0,0,0.3)] transition-all duration-200 hover:border-[rgba(255,255,255,0.18)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[rgba(255,255,255,0.60)] mb-2">
                  {metric.label}
                </p>
                <p className="text-2xl font-bold text-white">{metric.value}</p>
              </div>
              {metric.icon && (
                <div className="text-[rgba(255,255,255,0.35)] flex-shrink-0">{metric.icon}</div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div
        className="w-full"
        style={{ height: "1px", background: "rgba(255,255,255,0.08)" }}
      />
    </div>
  );
};
