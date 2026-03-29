"use client";

import React from "react";

interface BLVSectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * BLVΞSectionHeader – A section header component following the BLVΞ design system.
 * 
 * Features:
 * - text-xl font-bold for primary headers
 * - text-gray-600 for subtitles
 * - Optional icon support for visual hierarchy
 * - Warm, modern typography
 * - Consistent spacing
 */
export const BLVSectionHeader: React.FC<BLVSectionHeaderProps> = ({
  title,
  subtitle,
  icon,
  className = "",
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-3">
        {icon && <div className="text-gray-600 flex-shrink-0">{icon}</div>}
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
    </div>
  );
};
