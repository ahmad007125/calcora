import React from 'react';
import { Search, ArrowRight, Star } from 'lucide-react';
import { CATEGORIES, CALCULATORS } from '../../data/registry';
import { CategoryId } from '../../types';
import { useFavorites } from '../../context/FavoritesContext';
import { DynamicIcon } from '../common/DynamicIcon';
import { STOCK_IMAGES } from '../../data/visuals';
import { CalculatorIllustration, FormulaChips } from '../graphics/HeroGraphic';
import { StockPhoto } from '../graphics/StockPhoto';

interface HomeViewProps {
  onOpenSearch: () => void;
  onSelectCalculator: (id: string) => void;
  onSelectCategory: (cat: CategoryId) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onOpenSearch,
  onSelectCalculator,
  onSelectCategory,
}) => {
  const { favorites, recent, isFavorite, toggleFavorite } = useFavorites();

  const popularCalculators = CALCULATORS.filter(c => c.popular).slice(0, 8);
  const featuredCalculators = CALCULATORS.filter(c => c.featured).slice(0, 6);

  // Favorited tools
  const favoriteTools = CALCULATORS.filter(c => favorites.includes(c.id));
  const recentTools = CALCULATORS.filter(c => recent.includes(c.id)).slice(0, 4);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-10 sm:pt-16 pb-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 text-xs text-neutral-600 dark:text-neutral-400 mb-6 backdrop-blur-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Over 60+ verified calculators & converters online</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.1] text-balance">
              Every calculation. <br className="hidden sm:inline" />
              <span className="text-neutral-400 dark:text-neutral-500">One simple place.</span>
            </h1>

            <p className="mt-5 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed text-balance">
              High-precision computational suite for finance, health, physical conversions, creative design, date arithmetic, and text metrics. 100% free, private, and client-side.
            </p>

            <div className="mt-8 max-w-xl mx-auto lg:mx-0">
              <button
                onClick={onOpenSearch}
                className="w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl bg-white dark:bg-[#0c0d12] border border-neutral-200 dark:border-neutral-800 shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Search className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors shrink-0" />
                  <span className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-500 truncate">
                    Search BMI, Currency, Loan EMI, Unit Converter, Box Shadow...
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-mono text-neutral-500 bg-neutral-100 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700">
                    Ctrl K
                  </kbd>
                </div>
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-neutral-500">
              <span className="text-[11px] text-neutral-400">Popular:</span>
              {['BMI', 'Currency', 'Loan EMI', 'Unit Converter', 'Contrast Checker', 'Word Counter'].map(name => {
                const match = CALCULATORS.find(c => c.shortTitle.toLowerCase() === name.toLowerCase() || c.title.toLowerCase().includes(name.toLowerCase()));
                if (!match) return null;
                return (
                  <button
                    key={name}
                    onClick={() => onSelectCalculator(match.id)}
                    className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors text-[11px]"
                  >
                    {match.shortTitle}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-xl">
              <StockPhoto
                src={STOCK_IMAGES.heroWorkspace}
                alt="Financial worksheets, calculator, and workspace for professional calculations"
                className="h-full w-full"
                overlay
              />
              <FormulaChips />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                <div className="rounded-2xl bg-white/90 dark:bg-black/55 backdrop-blur-md border border-white/30 px-4 py-3 max-w-[70%]">
                  <p className="text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">Precision workspace</p>
                  <p className="text-xs text-neutral-700 dark:text-neutral-200 mt-0.5">Finance, health, units, and design math in one suite.</p>
                </div>
                <CalculatorIllustration className="hidden sm:block w-28 h-22 drop-shadow-xl text-white" />
              </div>
            </div>
            <div className="absolute -z-10 -right-6 -bottom-6 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
          </div>
        </div>
      </section>

      {/* Six Primary Category Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
              Explore by Category
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Comprehensive tools organized into six distinct computational domains
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map(cat => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group rounded-2xl bg-white dark:bg-[#0c0d12] border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer flex flex-col justify-between hover:shadow-xs overflow-hidden"
            >
              <StockPhoto
                src={cat.image}
                alt={cat.imageAlt}
                className="h-32"
                overlay
              />
              <div className="p-5 flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-900 dark:text-white group-hover:scale-105 transition-transform">
                    <DynamicIcon name={cat.iconName} className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-medium text-neutral-400 bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded-full">
                    {cat.count} tools
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white group-hover:underline">
                  {cat.name}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-850 flex items-center justify-between text-xs text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white">
                <span className="font-medium">Browse category</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Favorites / Recents Bar (if any) */}
      {(favoriteTools.length > 0 || recentTools.length > 0) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0c0d12] border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Your Quick Access & Favorites
                </h2>
              </div>
              <span className="text-xs text-neutral-400">Stored in browser local storage</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {favoriteTools.slice(0, 6).map(fav => (
                <button
                  key={fav.id}
                  onClick={() => onSelectCalculator(fav.id)}
                  className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-left transition-colors flex items-center gap-2.5"
                >
                  <DynamicIcon name={fav.iconName} className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span className="text-xs font-medium text-neutral-900 dark:text-white truncate">
                    {fav.shortTitle}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Calculators Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
              Most Popular Calculators
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Everyday essential utilities calculated with real-time reactive precision
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularCalculators.map(calc => (
            <div
              key={calc.id}
              onClick={() => onSelectCalculator(calc.id)}
              className="group p-5 rounded-2xl bg-white dark:bg-[#0c0d12] border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white group-hover:scale-105 transition-transform">
                    <DynamicIcon name={calc.iconName} className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-medium text-neutral-400 capitalize">
                    {calc.category}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white group-hover:underline">
                  {calc.title}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                  {calc.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-850 flex items-center justify-between text-xs text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white">
                <span>Calculate</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Engineering & Dev Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-neutral-900 text-white dark:bg-[#0c0d12] border border-neutral-800 relative overflow-hidden">
          <img
            src={STOCK_IMAGES.precisionDesk}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-neutral-900/55" />
          <img
            src="/images/formula-orbit.svg"
            alt=""
            className="absolute right-4 top-1/2 -translate-y-1/2 w-44 h-44 opacity-70 hidden md:block"
          />
          <div className="relative max-w-2xl">
            <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
              Engineered for Accuracy
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              Deterministic calculations without telemetry or subscription fees.
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-3 leading-relaxed">
              Every formula in OmniCalc runs directly in your browser. Whether you are budgeting an amortized mortgage, checking WCAG AAA color contrast, or calculating caloric deficits, values are computed instantly without leaving your device.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => onSelectCalculator('currency-converter')}
                className="px-4 py-2 rounded-xl bg-white text-neutral-950 font-medium text-xs hover:bg-neutral-100 transition-colors"
              >
                Currency Converter
              </button>
              <button
                onClick={() => onSelectCalculator('universal-converter')}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-white font-medium text-xs hover:bg-neutral-700 transition-colors"
              >
                Universal Converter
              </button>
              <button
                onClick={() => onSelectCalculator('loan-emi')}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-white font-medium text-xs hover:bg-neutral-700 transition-colors"
              >
                Loan EMI Engine
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Full Directory Listing by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white mb-6">
          All Calculators & Converters Directory
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORIES.map(cat => {
            const tools = CALCULATORS.filter(c => c.category === cat.id);
            return (
              <div key={cat.id} className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <DynamicIcon name={cat.iconName} className="w-4 h-4 text-neutral-500" />
                    <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                      {cat.name}
                    </h3>
                  </div>
                  <span className="text-[11px] text-neutral-400 font-mono">{tools.length}</span>
                </div>

                <ul className="space-y-1.5 text-xs">
                  {tools.map(tool => (
                    <li key={tool.id}>
                      <button
                        onClick={() => onSelectCalculator(tool.id)}
                        className="w-full text-left py-1 px-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors flex items-center justify-between group"
                      >
                        <span className="truncate">{tool.title}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
