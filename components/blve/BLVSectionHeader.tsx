"use client";
import React from "react";

interface BLVSectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

/**
 * BLVSectionHeader — Executive section heading.
 * text-xl font-semibold | muted subtitle | optional icon + action slot
 */
export const BLVSectionHeader: React.FC<BLVSectionHeaderProps> = ({
  title,
  subtitle,
  icon,
  action,
  className = "",
}) => {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="text-[#3B82F6] flex-shrink-0">{icon}</div>
        )}
        <div>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          {subtitle && (
            <p className="text-sm text-[rgba(255,255,255,0.60)] mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};
