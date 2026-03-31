"use client";
import React from "react";

interface BLVCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

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
        bg-[var(--blv-card)] border border-[var(--blv-border)] rounded-[var(--blv-radius-xl)] p-[var(--blv-lg)]
        ${hoverable ? "hover:border-[var(--blv-accent)] hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-300 cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
