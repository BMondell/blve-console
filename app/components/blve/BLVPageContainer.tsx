"use client";
import React from "react";

interface BLVPageContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const BLVPageContainer: React.FC<BLVPageContainerProps> = ({
  title,
  subtitle,
  children,
  className = "",
}) => {
  return (
    <div className={`min-h-screen bg-blv-bg p-blv-xl ${className}`}>
      <div className="max-w-7xl mx-auto space-y-blv-2xl">
        {/* Header */}
        <div className="space-y-blv-md">
          <h1 className="text-blv-3xl font-bold text-blv-text">{title}</h1>
          {subtitle && (
            <p className="text-blv-text-secondary text-blv-base">{subtitle}</p>
          )}
        </div>

        {/* Content */}
        <div className="space-y-blv-2xl">
          {children}
        </div>
      </div>
    </div>
  );
};
