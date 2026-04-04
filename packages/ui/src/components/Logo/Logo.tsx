import React from "react";

export interface LogoProps {
  variant: "icon" | "typo";
  theme: "dark" | "light";
  width?: number | string;
  height?: number | string;
}

const svgImports: Record<string, string> = {};

// We use inline SVG data URIs so the component works without a bundler loader
export const Logo: React.FC<LogoProps> = ({
  variant,
  theme,
  width,
  height,
}) => {
  const defaultWidth = variant === "icon" ? 120 : 400;
  const defaultHeight = variant === "icon" ? 132 : 125;

  return (
    <img
      src={new URL(
        `../../assets/wispear-logo-${variant}-${theme}.svg`,
        import.meta.url
      ).href}
      alt={`Wispear logo${variant === "typo" ? " with text" : ""} (${theme})`}
      width={width ?? defaultWidth}
      height={height ?? defaultHeight}
    />
  );
};
