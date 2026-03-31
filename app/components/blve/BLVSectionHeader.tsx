"use client";
import React from "react";

interface BLVSectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const BLVSectionHeader: React.FC<BLVSectionHeaderProps> = ({
  title,
  subtitle,
  icon,
  className = "",
}) => {
  return (
    <div className={`space-y-blv-md ${className}`}>
      <div className="flex items-center gap-blv-md">
        {icon && <div className="text-blv-accent">{icon}</div>}
        <h2 className="text-blv-2xl font-bold text-blv-text">{title}</h2>
      </div>
      {subtitle && (
        <p className="text-blv-text-secondary text-blv-base">{subtitle}</p>
      )}
    </div>
  );
};
