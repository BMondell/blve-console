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
        bg-blv-bg-secondary border border-blv-border rounded-blv-xl p-blv-lg
        ${hoverable ? "hover:border-blv-accent hover:shadow-blv-glow transition-all duration-300 cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
