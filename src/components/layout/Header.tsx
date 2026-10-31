import React, { useState, useRef, useEffect } from 'react';
import { Search, Sun, Moon, Monitor, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { CategoryId } from '../../types';

interface HeaderProps {
  onOpenSearch: () => void;
  onNavigateHome: () => void;
  onNavigateCategory: (cat: CategoryId) => void;
  onNavigateAll: () => void;
  activeCategory?: CategoryId | 'all' | null;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onNavigateHome,
  onNavigateCategory,
  onNavigateAll,
  activeCategory,
}) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setThemeDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-[#090a0f]/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 rounded-md py-1 pr-2 whitespace-nowrap shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center font-bold text-sm tracking-tighter shadow-sm transition-transform group-hover:scale-105">
            ∑
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-base tracking-tight text-neutral-900 dark:text-white leading-none">
              OmniCalc
            </span>
            <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 tracking-wider">
              PRECISION SUITE
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 single-line clean navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600 dark:text-neutral-400">
          <button
            onClick={onNavigateAll}
            className={`transition-colors hover:text-neutral-900 dark:hover:text-white whitespace-nowrap shrink-0 ${
              activeCategory === 'all' ? 'text-neutral-950 dark:text-white font-semibold' : ''
            }`}
          >
            All Tools
          </button>
          <button
            onClick={() => onNavigateCategory('health')}
            className={`transition-colors hover:text-neutral-900 dark:hover:text-white whitespace-nowrap shrink-0 ${
              activeCategory === 'health' ? 'text-neutral-950 dark:text-white font-semibold' : ''
            }`}
          >
            Health
          </button>
          <button
            onClick={() => onNavigateCategory('converters')}
            className={`transition-colors hover:text-neutral-900 dark:hover:text-white whitespace-nowrap shrink-0 ${
              activeCategory === 'converters' ? 'text-neutral-950 dark:text-white font-semibold' : ''
            }`}
          >
            Converters
          </button>
          <button
            onClick={() => onNavigateCategory('finance')}
            className={`transition-colors hover:text-neutral-900 dark:hover:text-white whitespace-nowrap shrink-0 ${
              activeCategory === 'finance' ? 'text-neutral-950 dark:text-white font-semibold' : ''
            }`}
          >
            Finance
          </button>
          <button
            onClick={() => onNavigateCategory('creative')}
            className={`transition-colors hover:text-neutral-900 dark:hover:text-white whitespace-nowrap shrink-0 ${
              activeCategory === 'creative' ? 'text-neutral-950 dark:text-white font-semibold' : ''
            }`}
          >
            Creative & Dev
          </button>
          <button
            onClick={() => onNavigateCategory('datetime')}
            className={`transition-colors hover:text-neutral-900 dark:hover:text-white whitespace-nowrap shrink-0 ${
              activeCategory === 'datetime' ? 'text-neutral-950 dark:text-white font-semibold' : ''
            }`}
          >
            Date & Time
          </button>
        </nav>

        {/* Zone 3: Actions (Search + Theme) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2.5 px-3 py-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 hover:bg-neutral-200/80 dark:bg-neutral-900 dark:hover:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-800 transition-colors whitespace-nowrap shrink-0"
            title="Search Calculators (Ctrl+K)"
            aria-label="Open search dialog"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search calculators...</span>
            <span className="hidden sm:inline-flex items-center text-[10px] text-neutral-400 dark:text-neutral-500 px-1.5 py-0.5 rounded bg-neutral-200/70 dark:bg-neutral-800 font-mono">
              Ctrl K
            </span>
          </button>

          {/* Theme Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-colors flex items-center justify-center"
              aria-label="Toggle theme menu"
              title="Change theme"
            >
              {resolvedTheme === 'dark' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </button>

            {themeDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-lg py-1.5 z-50 text-xs">
                <button
                  onClick={() => {
                    setTheme('light');
                    setThemeDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${
                    theme === 'light' ? 'text-neutral-900 dark:text-white font-semibold' : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  Light
                </button>
                <button
                  onClick={() => {
                    setTheme('dark');
                    setThemeDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${
                    theme === 'dark' ? 'text-neutral-900 dark:text-white font-semibold' : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-blue-400" />
                  Dark
                </button>
                <button
                  onClick={() => {
                    setTheme('system');
                    setThemeDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${
                    theme === 'system' ? 'text-neutral-900 dark:text-white font-semibold' : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  System
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
