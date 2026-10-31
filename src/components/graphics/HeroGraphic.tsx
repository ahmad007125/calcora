import React from 'react';

export const FormulaChips: React.FC<{ className?: string }> = ({ className = '' }) => {
  const chips = [
    { label: 'BMI', formula: 'kg / m²', x: '4%', y: '12%' },
    { label: 'EMI', formula: 'P·r(1+r)ⁿ', x: '68%', y: '8%' },
    { label: 'TDEE', formula: 'BMR × PAL', x: '8%', y: '78%' },
    { label: 'VAT', formula: 'net × (1+t)', x: '72%', y: '72%' },
  ];

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      {chips.map(chip => (
        <div
          key={chip.label}
          className="absolute hidden sm:flex items-center gap-2 rounded-full border border-white/20 bg-black/45 px-3 py-1.5 backdrop-blur-md shadow-lg"
          style={{ left: chip.x, top: chip.y }}
        >
          <span className="text-[10px] font-semibold tracking-wide text-emerald-300">{chip.label}</span>
          <span className="font-mono text-[10px] text-white/80">{chip.formula}</span>
        </div>
      ))}
    </div>
  );
};

export const CalculatorIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 280 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="28" y="18" width="160" height="184" rx="18" fill="currentColor" className="text-neutral-900 dark:text-neutral-100" opacity="0.92" />
      <rect x="42" y="32" width="132" height="42" rx="8" fill="#0b1220" className="dark:fill-neutral-200" />
      <text x="162" y="58" textAnchor="end" fill="#34d399" fontFamily="JetBrains Mono, ui-monospace, monospace" fontSize="16" fontWeight="600">
        42.86
      </text>
      {[0, 1, 2, 3].map(row =>
        [0, 1, 2, 3].map(col => (
          <rect
            key={`${row}-${col}`}
            x={42 + col * 32}
            y={86 + row * 26}
            width="26"
            height="20"
            rx="5"
            fill={col === 3 ? '#10b981' : '#1f2937'}
            className={col === 3 ? '' : 'dark:fill-neutral-300'}
            opacity={col === 3 ? 1 : 0.9}
          />
        ))
      )}
      <circle cx="228" cy="58" r="34" stroke="#10b981" strokeWidth="3" fill="none" opacity="0.7" />
      <path d="M214 58h28M228 44v28" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
      <circle cx="236" cy="168" r="22" fill="#10b981" opacity="0.2" />
      <path d="M226 168h20M236 158v20" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M196 112c18-6 32 10 48 4" stroke="currentColor" className="text-emerald-400" strokeWidth="1.5" strokeDasharray="3 4" />
    </svg>
  );
};
