import React from 'react';

export function FlagIcon({ country, size = 16 }: { country: 'ID' | 'GB' | 'US'; size?: number }) {
  const height = Math.round((size * 3) / 4);

  if (country === 'ID') {
    return (
      <svg
        width={size}
        height={height}
        viewBox="0 0 16 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ borderRadius: 2, flexShrink: 0, border: '1px solid rgba(255,255,255,0.15)' }}
      >
        <rect width="16" height="6" fill="#E11D48" />
        <rect y="6" width="16" height="6" fill="#F8FAFC" />
      </svg>
    );
  }

  // UK Flag (GB / EN)
  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 60 30"
      xmlns="http://www.w3.org/2000/svg"
      style={{ borderRadius: 2, flexShrink: 0, border: '1px solid rgba(255,255,255,0.15)' }}
    >
      <clipPath id="gb">
        <rect width="60" height="30" rx="2" />
      </clipPath>
      <g clipPath="url(#gb)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}
