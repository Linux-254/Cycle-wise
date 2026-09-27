import React from 'react';

interface CyclewiseLogoProps {
  className?: string;
  size?: number;
  variant?: 'gold' | 'light' | 'dark';
}

export const CyclewiseLogo: React.FC<CyclewiseLogoProps> = ({
  className = 'w-8 h-8',
  size = 32,
  variant = 'gold',
}) => {
  const getGradientIds = () => {
    if (variant === 'light') return { start: '#FFFFFF', end: '#E5E7EB' };
    if (variant === 'dark') return { start: '#0B132B', end: '#1C2B4E' };
    return { start: '#F59E0B', end: '#E7B84B' };
  };

  const colors = getGradientIds();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={`cwLogoGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.start} />
          <stop offset="100%" stopColor={colors.end} />
        </linearGradient>
      </defs>

      {/* Top Outer Circular Arc Arrow */}
      <path
        d="M 32 18 A 38 38 0 0 1 72 26"
        stroke={`url(#cwLogoGrad-${variant})`}
        strokeWidth="9"
        strokeLinecap="round"
      />

      {/* Bottom Outer Circular Arc Arrow with Arrow Head */}
      <path
        d="M 68 82 A 38 38 0 0 1 28 74"
        stroke={`url(#cwLogoGrad-${variant})`}
        strokeWidth="9"
        strokeLinecap="round"
      />
      {/* Bottom Left Arrowhead */}
      <polygon
        points="22,63 35,73 22,81"
        fill={`url(#cwLogoGrad-${variant})`}
      />

      {/* Central 'W' Brand Glyph with Ascending Arrow breaking out to top-right */}
      <path
        d="M 28 42 L 39 70 L 50 48 L 61 70 L 80 26"
        stroke={`url(#cwLogoGrad-${variant})`}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Top Right Ascending Arrowhead */}
      <polygon
        points="80,18 84,33 69,28"
        fill={`url(#cwLogoGrad-${variant})`}
      />
    </svg>
  );
};
