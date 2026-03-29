"use client";

import React from "react";

interface BLVCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

/**
 * BLVΞCard – A foundational card component following the BLVΞ design system.
 * 
 * Features:
 * - White background with rounded-xl corners
 * - Soft shadow (shadow-sm) and subtle border (border-gray-100)
 * - Consistent padding (p-6)
 * - Optional hover states with smooth transitions
 * - Fully responsive and accessible
 */
export const BLVCard: React.FC<BLVCardProps> = ({
  children,
  className = "",
  onClick,
  hoverable = true,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl p-6 shadow-sm border border-gray-100
        ${hoverable ? "hover:shadow-md transition-shadow duration-200" : ""}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
