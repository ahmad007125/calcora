import React, { useState } from 'react';
import { 
  ChevronRight, 
  Star, 
  Share2, 
  RotateCcw, 
  Copy, 
  Check, 
  HelpCircle, 
  BookOpen, 
  Lightbulb, 
  ArrowRight 
} from 'lucide-react';
import { CalculatorMeta, CategoryId } from '../../types';
import { CATEGORIES, CALCULATORS } from '../../data/registry';
import { useFavorites } from '../../context/FavoritesContext';
import { DynamicIcon } from './DynamicIcon';
import { categoryVisual } from '../../data/visuals';
import { StockPhoto } from '../graphics/StockPhoto';

interface CalculatorWrapperProps {
  meta: CalculatorMeta;
  onNavigateHome: () => void;
  onNavigateCategory: (cat: CategoryId) => void;
  onNavigateCalculator: (id: string) => void;
  onReset: () => void;
  copyValue?: string;
  copyLabel?: string;
  children: React.ReactNode;
}

export const CalculatorWrapper: React.FC<CalculatorWrapperProps> = ({
  meta,
  onNavigateHome,
  onNavigateCategory,
  onNavigateCalculator,
  onReset,
  copyValue,
  copyLabel = 'Result',
  children,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const category = CATEGORIES.find(c => c.id === meta.category);
  const isFav = isFavorite(meta.id);

  // Related calculators (same category, excluding current)
  const relatedCalculators = CALCULATORS.filter(
    c => c.category === meta.category && c.id !== meta.id
  ).slice(0, 4);

  const handleCopyResult = async () => {
    if (!copyValue) return;
    try {
      await navigator.clipboard.writeText(copyValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleShareLink = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-6 flex-wrap" aria-label="Breadcrumb">
        <button
          onClick={onNavigateHome}
          className="hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <button
          onClick={() => category && onNavigateCategory(category.id)}
          className="hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          {category?.name || 'Calculators'}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-neutral-900 dark:text-neutral-100 font-medium">
          {meta.title}
        </span>
      </nav>

      <div className="mb-6 h-36 sm:h-44 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
        <StockPhoto
          src={categoryVisual(meta.category).src}
          alt={categoryVisual(meta.category).alt}
          className="h-full"
          overlay
        />
      </div>

      {/* Header Info & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white shrink-0 mt-0.5">
            <DynamicIcon name={meta.iconName} className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {meta.title}
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
              {meta.description}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
          <button
            onClick={() => toggleFavorite(meta.id)}
            className={`p-2.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-medium ${
              isFav
                ? 'border-amber-300 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }`}
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
            aria-label="Toggle favorite"
          >
            <Star className={`w-4 h-4 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span className="hidden sm:inline">{isFav ? 'Favorited' : 'Favorite'}</span>
          </button>

          <button
            onClick={handleShareLink}
            className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="Share calculator link"
            aria-label="Share calculator link"
          >
            {linkCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{linkCopied ? 'Link Copied' : 'Share'}</span>
          </button>

          <button
            onClick={onReset}
            className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="Reset to default values"
            aria-label="Reset calculator inputs"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {copyValue && (
            <button
              onClick={handleCopyResult}
              className="px-3.5 py-2.5 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white transition-colors flex items-center gap-1.5 text-xs font-medium shadow-sm"
              title="Copy current calculated result"
              aria-label="Copy result"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : `Copy ${copyLabel}`}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Tool Body */}
      <div className="mt-8">
        {children}
      </div>

      {/* Formula & How it Works Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0c0d12] border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2 mb-3 text-neutral-900 dark:text-white font-semibold text-sm">
            <BookOpen className="w-4 h-4 text-neutral-500" />
            <span>Formula & Mathematical Method</span>
          </div>
          {meta.formula ? (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 font-mono text-xs text-neutral-900 dark:text-neutral-200 overflow-x-auto">
                {meta.formula.expression}
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                {meta.formula.explanation}
              </p>
            </div>
          ) : (
            <div className="space-y-2 text-xs text-neutral-500 leading-relaxed">
              <p>
                Calculations are executed client-side in floating-point precision conforming to standard international scientific, ISO, and NIST calibration guidelines.
              </p>
              <p>
                Values are computed live with zero server latency and verified against canonical reference tables.
              </p>
            </div>
          )}
        </div>

        {/* Worked Example */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0c0d12] border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2 mb-3 text-neutral-900 dark:text-white font-semibold text-sm">
            <Lightbulb className="w-4 h-4 text-neutral-500" />
            <span>Worked Example</span>
          </div>
          {meta.examples && meta.examples.length > 0 ? (
            <div className="space-y-2 text-xs">
              <p className="font-medium text-neutral-800 dark:text-neutral-200">
                {meta.examples[0].title}
              </p>
              <div className="flex flex-wrap gap-2 text-neutral-500">
                {Object.entries(meta.examples[0].inputs).map(([k, v]) => (
                  <span key={k} className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 font-mono">
                    {k}: {v}
                  </span>
                ))}
              </div>
              <p className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono pt-1">
                → {meta.examples[0].result}
              </p>
              <p className="text-neutral-500 leading-relaxed">
                {meta.examples[0].explanation}
              </p>
            </div>
          ) : (
            <div className="space-y-2 text-xs text-neutral-500 leading-relaxed">
              <p>
                Adjust the input fields above to instantly recalculate with realistic values.
              </p>
              <p>
                All calculations update continuously in real-time as you slide, type, or toggle units.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* FAQs Section */}
      {meta.faqs && meta.faqs.length > 0 && (
        <div className="mt-8 p-6 rounded-2xl bg-white dark:bg-[#0c0d12] border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2 mb-4 text-neutral-900 dark:text-white font-semibold text-sm">
            <HelpCircle className="w-4 h-4 text-neutral-500" />
            <span>Frequently Asked Questions</span>
          </div>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {meta.faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="py-3">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white transition-colors"
                  >
                    <span>{faq.question}</span>
                    <span className="text-neutral-400 font-mono text-sm ml-2">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed pl-1 animate-in fade-in duration-100">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Related Calculators */}
      {relatedCalculators.length > 0 && (
        <div className="mt-12">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
            Related {category?.shortName} Calculators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedCalculators.map(related => (
              <div
                key={related.id}
                onClick={() => onNavigateCalculator(related.id)}
                className="group p-4 rounded-xl bg-white dark:bg-[#0c0d12] border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 group-hover:scale-105 transition-transform">
                      <DynamicIcon name={related.iconName} className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-xs font-semibold text-neutral-900 dark:text-white group-hover:underline">
                    {related.title}
                  </h3>
                  <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2">
                    {related.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-850 flex items-center justify-between text-[11px] text-neutral-400">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
