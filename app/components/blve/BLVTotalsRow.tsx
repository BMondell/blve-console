"use client";
import React from "react";
import { BLVCard } from "./BLVCard";
import { BLVMetric } from "./BLVMetric";

interface Metric {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
}

interface BLVTotalsRowProps {
  metrics: Metric[];
  className?: string;
}

export const BLVTotalsRow: React.FC<BLVTotalsRowProps> = ({
  metrics,
  className = "",
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[var(--blv-lg)] ${className}`}>
      {metrics.map((metric, idx) => (
        <BLVCard key={idx} hoverable>
          <BLVMetric
            label={metric.label}
            value={metric.value}
            icon={metric.icon}
            trend={metric.trend}
            size="lg"
          />
        </BLVCard>
      ))}
    </div>
  );
};
