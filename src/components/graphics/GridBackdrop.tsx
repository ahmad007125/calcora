import React from 'react';

export const GridBackdrop: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.08),_transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.12),_transparent_50%)]" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.35] dark:opacity-[0.22]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="omnicalc-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-neutral-400 dark:text-neutral-700" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#omnicalc-grid)" />
      </svg>
    </div>
  );
};
