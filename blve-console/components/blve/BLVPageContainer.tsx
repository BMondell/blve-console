"use client";

import React from "react";

interface BLVPageContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

/**
 * BLVΞPageContainer – A page wrapper component following the BLVΞ design system.
 * 
 * Features:
 * - Consistent page padding (p-6)
 * - Consistent spacing (space-y-6)
 * - Light gray background (bg-gray-50)
 * - Optional title and subtitle
 * - Ensures all content follows BLVΞ standards
 */
export const BLVPageContainer: React.FC<BLVPageContainerProps> = ({
  children,
  title,
  subtitle,
  className = "",
}) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="p-6 space-y-6">
        {(title || subtitle) && (
          <div className="space-y-1">
            {title && <h1 className="text-3xl font-bold text-gray-900">{title}</h1>}
            {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
          </div>
        )}
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};
