import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, React.CSSProperties> = {
  primary: { background: "#6366f1", color: "#fff", border: "none" },
  secondary: { background: "#e5e7eb", color: "#111827", border: "none" },
  ghost: { background: "transparent", color: "#6366f1", border: "1px solid #6366f1" },
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, React.CSSProperties> = {
  sm: { padding: "4px 12px", fontSize: "13px" },
  md: { padding: "8px 16px", fontSize: "14px" },
  lg: { padding: "12px 24px", fontSize: "16px" },
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  style,
  children,
  ...props
}) => {
  return (
    <button
      style={{
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: 500,
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};
