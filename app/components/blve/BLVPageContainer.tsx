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
    <div className={`min-h-screen bg-[var(--blv-bg)] p-[var(--blv-xl)] ${className}`}>
      <div className="max-w-7xl mx-auto space-y-blv-2xl">
        {/* Header */}
        <div className="space-y-[var(--blv-md)]">
          <h1 className="text-[1.875rem] font-bold text-[var(--blv-text-primary)]">{title}</h1>
          {subtitle && (
            <p className="text-[var(--blv-text-primary)]-secondary text-[1rem]">{subtitle}</p>
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
