import React from "react";

export interface LogoProps {
  variant: "icon" | "wordmark" | "combined";
  theme: "dark" | "light";
  width?: number | string;
  height?: number | string;
}

const PearIcon: React.FC<{ theme: "dark" | "light"; id?: string }> = ({ theme, id = "" }) => {
  const isDark = theme === "dark";
  return (
    <g>
      <defs>
        <linearGradient id={`pearGrad${id}-${theme}`} x1="0%" y1="0%" x2="40%" y2="100%">
          <stop offset="0%" stopColor={isDark ? "#d4ff47" : "#b8e600"} />
          <stop offset="40%" stopColor={isDark ? "#55e292" : "#3bc776"} />
          <stop offset="100%" stopColor={isDark ? "#1990ff" : "#0070dd"} />
        </linearGradient>
        <filter id={`ringGlow${id}-${theme}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={isDark ? "6" : "4"} result="blur1" />
          {isDark && <feGaussianBlur stdDeviation="2" result="blur2" />}
          <feMerge>
            <feMergeNode in="blur1" />
            {isDark && <feMergeNode in="blur2" />}
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`baseLight${id}-${theme}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={isDark ? "12" : "10"} />
        </filter>
      </defs>

      <g transform="translate(0, 220)">
        <ellipse cx="150" cy="0" rx="70" ry="16" fill={isDark ? "#00ffff" : "#0070dd"} opacity={isDark ? 0.4 : 0.25} filter={`url(#baseLight${id}-${theme})`} />
        <ellipse cx="150" cy="0" rx="60" ry="14" fill="none" stroke={isDark ? "#00ffff" : "#0070dd"} strokeWidth={isDark ? 4 : 3} filter={`url(#ringGlow${id}-${theme})`} />
        <ellipse cx="150" cy="0" rx="56" ry="12" fill="none" stroke={isDark ? "#ffffff" : "#1d2050"} strokeWidth="1" opacity={isDark ? 0.8 : 0.4} />
      </g>

      <g transform="translate(0, -10)">
        <path d="M 152 75 C 152 45 178 40 188 45 C 183 62 163 72 152 75 Z" fill={isDark ? "#d4ff47" : "#b8e600"} />
        <path d="M 148 76 C 145 52 122 47 112 52 C 117 68 137 73 148 76 Z" fill={isDark ? "#aaff2b" : "#8ecc00"} />
        <path
          d="M 150 75 C 165 75 175 95 180 120 C 185 145 215 155 215 185 C 215 215 185 235 150 235 C 115 235 85 215 85 185 C 85 155 115 145 120 120 C 125 95 135 75 150 75 Z"
          fill={`url(#pearGrad${id}-${theme})`}
        />
      </g>
    </g>
  );
};

const Wordmark: React.FC<{ theme: "dark" | "light"; x?: number | string; y?: number }> = ({
  theme,
  x = "50%",
  y = 0,
}) => {
  const isDark = theme === "dark";
  const accentColor = isDark ? "#00ffff" : "#0070dd";
  const textColor = isDark ? "#ffffff" : "#1d2050";

  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontFamily="'Montserrat', 'Inter', 'Helvetica Neue', 'Segoe UI', sans-serif"
      fontSize="85"
      fontWeight="900"
      fill={textColor}
      letterSpacing="-2"
    >
      wis<tspan fill={accentColor}>p</tspan>ear<tspan fill={accentColor}>.ai</tspan>
    </text>
  );
};

const defaultSizes: Record<LogoProps["variant"], { w: number; h: number }> = {
  icon: { w: 120, h: 132 },
  wordmark: { w: 520, h: 100 },
  combined: { w: 800, h: 250 },
};

export const Logo: React.FC<LogoProps> = ({ variant, theme, width, height }) => {
  const w = width ?? defaultSizes[variant].w;
  const h = height ?? defaultSizes[variant].h;

  if (variant === "icon") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="60 30 200 220" width={w} height={h} role="img" aria-label={`Wispear logo (${theme})`}>
        <g transform="translate(20, 0)">
          <PearIcon theme={theme} id="icon" />
        </g>
      </svg>
    );
  }

  if (variant === "wordmark") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 100" width={w} height={h} role="img" aria-label={`Wispear wordmark (${theme})`}>
        <Wordmark theme={theme} y={78} />
      </svg>
    );
  }

  // combined
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 250" width={w} height={h} role="img" aria-label={`Wispear logo with text (${theme})`}>
      <g transform="translate(20, 0)">
        <PearIcon theme={theme} id="combined" />
      </g>
      <Wordmark theme={theme} x={280} y={165} />
    </svg>
  );
};
