import React from 'react';

interface ParkerloopLogoProps {
  className?: string;
  size?: number;
}

export const ParkerloopLogo: React.FC<ParkerloopLogoProps> = ({ className = 'w-8 h-8', size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Parkerloop Logo"
    >
      <defs>
        {/* Golden amber loop gradient */}
        <linearGradient id="parkerloop-grad" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="45%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* Ambient inner glow */}
        <linearGradient id="parkerloop-glow" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#B45309" stopOpacity="0.05" />
        </linearGradient>

        {/* Subtle drop shadow */}
        <filter id="parkerloop-shadow" x="0" y="0" width="48" height="48" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#F59E0B" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Rounded squircle container with dark glass tone */}
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="12"
        fill="#0F172A"
        stroke="#1E293B"
        strokeWidth="1.5"
      />

      {/* Subtle inner radial depth */}
      <circle cx="24" cy="24" r="16" fill="url(#parkerloop-glow)" />

      {/* 
        The "P" Loop Monogram:
        Continuous rhythmic loop forming a sleek lowercase 'p' / loop ribbon.
        Stem on left (x=15), looping up and around (r=9) back into the stem.
      */}
      <path
        d="M 16 36 
           V 16 
           C 16 11.58 19.58 8 24 8 
           C 28.42 8 32 11.58 32 16 
           C 32 20.42 28.42 24 24 24 
           H 16"
        stroke="url(#parkerloop-grad)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#parkerloop-shadow)"
      />

      {/* Center resonance loop node / play pulse */}
      <circle
        cx="24"
        cy="16"
        r="2.5"
        fill="#FEF3C7"
      />

      {/* Dynamic looping soundwave echo arcs */}
      <path
        d="M 33 21 C 35.5 19.5 37 17.5 37 15"
        stroke="#F59E0B"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M 36 24 C 39.5 22 41.5 19 41.5 15"
        stroke="#FDE68A"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
};
