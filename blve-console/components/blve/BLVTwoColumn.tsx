"use client";

import React from "react";
import { BLVCard } from "./BLVCard";

interface BLVTwoColumnProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  leftTitle?: string;
  rightTitle?: string;
  className?: string;
}

/**
 * BLVΞTwoColumn – A responsive two-column analytics layout component following the BLVΞ design system.
 * 
 * Features:
 * - Responsive grid (1 col mobile, 2 col desktop)
 * - Consistent spacing (gap-6)
 * - Uses BLVCard for uniform styling
 * - Optional section titles
 * - Flexible content slots
 */
export const BLVTwoColumn: React.FC<BLVTwoColumnProps> = ({
  leftContent,
  rightContent,
  leftTitle,
  rightTitle,
  className = "",
}) => {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      <BLVCard>
        {leftTitle && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {leftTitle}
          </h3>
        )}
        {leftContent}
      </BLVCard>
      <BLVCard>
        {rightTitle && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {rightTitle}
          </h3>
        )}
        {rightContent}
      </BLVCard>
    </div>
  );
};
