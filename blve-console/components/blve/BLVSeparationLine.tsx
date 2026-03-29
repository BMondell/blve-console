"use client";

import React from "react";

interface BLVSeparationLineProps {
  className?: string;
}

/**
 * BLVΞSeparationLine – A subtle full-width divider component following the BLVΞ design system.
 * 
 * Features:
 * - Subtle gray border (border-gray-200)
 * - Full-width horizontal line
 * - Consistent spacing integration
 * - Never corporate or cluttered
 */
export const BLVSeparationLine: React.FC<BLVSeparationLineProps> = ({
  className = "",
}) => {
  return <div className={`border-t border-gray-200 ${className}`}></div>;
};
