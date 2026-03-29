"use client";

import React from "react";

interface DashboardLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  children,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 text-sm mt-1">
            Executive overview and analytics
          </p>
        </div>
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};
