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
 * BLVTwoColumn — Executive two-column analytics layout.
 * grid grid-cols-1 lg:grid-cols-2 gap-6
 * Left: routing trends / transaction volume
 * Right: org activation / engagement
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
          <h3 className="text-xl font-semibold text-white mb-4">{leftTitle}</h3>
        )}
        {leftContent}
      </BLVCard>
      <BLVCard>
        {rightTitle && (
          <h3 className="text-xl font-semibold text-white mb-4">{rightTitle}</h3>
        )}
        {rightContent}
      </BLVCard>
    </div>
  );
};
