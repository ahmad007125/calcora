import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Star, History, ArrowRight, CornerDownLeft } from 'lucide-react';
import { CALCULATORS, CATEGORIES } from '../../data/registry';
import { CalculatorMeta, CategoryId } from '../../types';
import { useFavorites } from '../../context/FavoritesContext';
import { DynamicIcon } from './DynamicIcon';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCalculator: (id: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCalculator,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { recent, isFavorite, addRecent } = useFavorites();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setSelectedCategory('all');
    }
  }, [isOpen]);

  // Global hotkey
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger search open
          const btn = document.querySelector('[aria-label="Open search dialog"]') as HTMLButtonElement | null;
          btn?.click();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter calculations
  const filteredCalculators = CALCULATORS.filter(calc => {
    if (selectedCategory !== 'all' && calc.category !== selectedCategory) {
      return false;
    }
    if (!query.trim()) return true;

    const q = query.toLowerCase().trim();
    const titleMatch = calc.title.toLowerCase().includes(q);
    const shortTitleMatch = calc.shortTitle.toLowerCase().includes(q);
    const descMatch = calc.description.toLowerCase().includes(q);
    const keywordMatch = calc.keywords.some(k => k.toLowerCase().includes(q));

    return titleMatch || shortTitleMatch || descMatch || keywordMatch;
  });

  const handleSelect = (calc: CalculatorMeta) => {
    addRecent(calc.id);
    onSelectCalculator(calc.id);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredCalculators.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCalculators.length) % Math.max(1, filteredCalculators.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCalculators[selectedIndex]) {
        handleSelect(filteredCalculators[selectedIndex]);
      }
    }
  };

  // Keep selected item in view
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#0c0d12] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-200 dark:border-neutral-800">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search 60+ precision calculators, converters, formulas..."
            className="w-full bg-transparent text-sm sm:text-base text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700">
              ESC
            </kbd>
          )}
        </div>

        {/* Filter Categories Bar */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-neutral-100 dark:border-neutral-800/60 overflow-x-auto text-xs bg-neutral-50/50 dark:bg-neutral-900/30">
          <button
            onClick={() => { setSelectedCategory('all'); setSelectedIndex(0); }}
            className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-medium'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            All ({CALCULATORS.length})
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setSelectedIndex(0); }}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-medium'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              {cat.shortName}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div ref={listRef} className="overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/40 p-2">
          {filteredCalculators.length === 0 ? (
            <div className="py-12 text-center text-neutral-400">
              <p className="text-sm">No calculators found matching &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-neutral-500 mt-1">Try keywords like &ldquo;mortgage&rdquo;, &ldquo;bmi&rdquo;, &ldquo;unit&rdquo;, or &ldquo;contrast&rdquo;</p>
            </div>
          ) : (
            filteredCalculators.map((calc, idx) => {
              const isSelected = idx === selectedIndex;
              const hasStar = isFavorite(calc.id);
              const isRecent = recent.includes(calc.id);

              return (
                <div
                  key={calc.id}
                  onClick={() => handleSelect(calc)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-900 dark:text-white'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 ${
                      isSelected 
                        ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white' 
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                    }`}>
                      <DynamicIcon name={calc.iconName} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{calc.title}</span>
                        {hasStar && (
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                        )}
                        {isRecent && !query && (
                          <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                            <History className="w-3 h-3" /> Recent
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate mt-0.5">
                        {calc.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-neutral-400 capitalize hidden sm:inline">
                      {calc.category}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${isSelected ? 'translate-x-0.5 text-neutral-900 dark:text-white' : ''}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="px-4 py-2.5 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/30 flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 font-mono bg-neutral-200/80 dark:bg-neutral-800 rounded">↑</kbd>
              <kbd className="px-1 py-0.5 font-mono bg-neutral-200/80 dark:bg-neutral-800 rounded">↓</kbd> to navigate
            </span>
            <span className="flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3" /> Enter to open
            </span>
          </div>
          <span>{filteredCalculators.length} available</span>
        </div>
      </div>
    </div>
  );
};
