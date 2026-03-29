"use client";

import React from "react";

interface AnalyticsSectionProps {
  title: string;
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  title,
  leftContent,
  rightContent,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          {leftContent}
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          {rightContent}
        </div>
      </div>
    </div>
  );
};
