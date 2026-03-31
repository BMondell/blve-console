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
    <div className={`space-y-[var(--blv-md)] ${className}`}>
      <div className="flex items-center gap-[var(--blv-md)]">
        {icon && <div className="text-[var(--blv-accent)]">{icon}</div>}
        <h2 className="text-[1.5rem] font-bold text-[var(--blv-text-primary)]">{title}</h2>
      </div>
      {subtitle && (
        <p className="text-[var(--blv-text-primary)]-secondary text-[1rem]">{subtitle}</p>
      )}
    </div>
  );
};
