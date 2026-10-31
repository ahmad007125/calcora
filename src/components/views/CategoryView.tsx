import React, { useState } from 'react';
import { Search, ArrowRight, ChevronRight, ArrowLeft } from 'lucide-react';
import { CATEGORIES, CALCULATORS } from '../../data/registry';
import { CategoryId } from '../../types';
import { DynamicIcon } from '../common/DynamicIcon';
import { categoryVisual } from '../../data/visuals';
import { StockPhoto } from '../graphics/StockPhoto';

interface CategoryViewProps {
  categoryId: CategoryId | 'all';
  onNavigateHome: () => void;
  onNavigateCategory: (cat: CategoryId) => void;
  onSelectCalculator: (id: string) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  categoryId,
  onNavigateHome,
  onNavigateCategory,
  onSelectCalculator,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const currentCategory = categoryId === 'all' 
    ? {
        id: 'all' as const,
        name: 'All Calculators & Converters',
        shortName: 'All Tools',
        description: 'Complete directory of 60+ precision calculators, physical unit converters, financial planners, and developer tools.',
        iconName: 'Calculator',
        count: CALCULATORS.length,
        image: '/images/hero-calculator.jpg',
        imageAlt: 'Desktop calculator used for professional calculations',
      }
    : CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0];

  const tools = CALCULATORS.filter(c => {
    if (categoryId !== 'all' && c.category !== categoryId) return false;
    if (!filterQuery.trim()) return true;

    const q = filterQuery.toLowerCase().trim();
    return (
      c.title.toLowerCase().includes(q) ||
      c.shortTitle.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.keywords.some(k => k.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-150">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-6">
        <button
          onClick={onNavigateHome}
          className="hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-neutral-900 dark:text-neutral-100 font-medium">
          {currentCategory.name}
        </span>
      </nav>

      <div className="relative mb-8 h-44 sm:h-56 rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
        <StockPhoto
          src={currentCategory.image || categoryVisual(categoryId).src}
          alt={currentCategory.imageAlt || categoryVisual(categoryId).alt}
          className="h-full"
          overlay
        />
        <div className="absolute inset-0 flex items-end p-6">
          <p className="text-white text-sm font-medium drop-shadow-md max-w-xl">
            Visual tools for {currentCategory.shortName.toLowerCase()} — formulas you can trust.
          </p>
        </div>
      </div>

      {/* Category Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0c0d12] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white shrink-0 mt-0.5">
            <DynamicIcon name={currentCategory.iconName} className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {currentCategory.name}
              </h1>
              <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                {tools.length} calculators
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1.5 max-w-2xl leading-relaxed">
              {currentCategory.description}
            </p>
          </div>
        </div>

        {/* Quick Search in Category */}
        <div className="w-full md:w-72 relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
            placeholder={`Filter ${currentCategory.shortName}...`}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0c0d12] text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-400"
          />
        </div>
      </div>

      {/* Category Filter Chips (if in 'all' view) */}
      <div className="flex items-center gap-2 py-4 overflow-x-auto text-xs border-b border-neutral-100 dark:border-neutral-800/80 mb-6">
        <button
          onClick={() => onNavigateCategory('all' as any)}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
            categoryId === 'all'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950'
              : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 dark:bg-neutral-900'
          }`}
        >
          All ({CALCULATORS.length})
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => onNavigateCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
              categoryId === cat.id
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 dark:bg-neutral-900'
            }`}
          >
            {cat.shortName}
          </button>
        ))}
      </div>

      {/* Calculators Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.length === 0 ? (
          <div className="col-span-full py-16 text-center text-neutral-400">
            <p className="text-sm font-medium">No tools found matching &ldquo;{filterQuery}&rdquo;</p>
            <p className="text-xs text-neutral-500 mt-1">Try another keyword or clear the search filter.</p>
          </div>
        ) : (
          tools.map(tool => (
            <div
              key={tool.id}
              onClick={() => onSelectCalculator(tool.id)}
              className="group p-5 rounded-2xl bg-white dark:bg-[#0c0d12] border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white group-hover:scale-105 transition-transform">
                    <DynamicIcon name={tool.iconName} className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-medium text-neutral-400 capitalize">
                    {tool.category}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white group-hover:underline">
                  {tool.title}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-850 flex items-center justify-between text-xs text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white">
                <span>Launch tool</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
