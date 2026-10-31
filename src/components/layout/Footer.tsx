import React from 'react';
import { CATEGORIES } from '../../data/registry';
import { CategoryId } from '../../types';
import { ShieldCheck, Zap, Lock, RefreshCw } from 'lucide-react';

interface FooterProps {
  onNavigateHome: () => void;
  onNavigateCategory: (cat: CategoryId) => void;
  onNavigateCalculator: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateHome,
  onNavigateCategory,
  onNavigateCalculator,
}) => {
  return (
    <footer className="mt-20 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#07080b] text-neutral-600 dark:text-neutral-400 text-xs">
      {/* Trust & Guarantee Strip */}
      <div className="border-b border-neutral-200/80 dark:border-neutral-800/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white text-xs">Instant Calculation</p>
              <p className="text-[11px] text-neutral-500">Pure client-side zero-latency math</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white text-xs">100% Private</p>
              <p className="text-[11px] text-neutral-500">Your numbers never leave your device</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white text-xs">Formula Verified</p>
              <p className="text-[11px] text-neutral-500">WHO, NIST, & financial standard math</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white text-xs">Zero Signup</p>
              <p className="text-[11px] text-neutral-500">Free forever, no registration wall</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-6 gap-8">
        <div className="col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center font-bold text-xs">
              ∑
            </div>
            <span className="font-semibold text-sm text-neutral-900 dark:text-white tracking-tight">
              OmniCalc
            </span>
          </div>
          <p className="text-neutral-500 text-xs leading-relaxed max-w-sm">
            Professional high-precision computation suite. Designed with the precision of Linear and the minimalism of Vercel for professionals, engineers, designers, and students.
          </p>
          <div className="pt-2 text-[11px] text-neutral-400">
            Keyboard shortcut: Press <span className="font-mono px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">Ctrl + K</span> anywhere to search.
          </div>
        </div>

        {/* Categories Columns */}
        {CATEGORIES.slice(0, 4).map((cat) => (
          <div key={cat.id} className="space-y-2.5">
            <button
              onClick={() => onNavigateCategory(cat.id)}
              className="font-semibold text-neutral-900 dark:text-white hover:underline text-left block"
            >
              {cat.shortName}
            </button>
            <ul className="space-y-1.5 text-[11px] text-neutral-500">
              {cat.id === 'health' && (
                <>
                  <li><button onClick={() => onNavigateCalculator('bmi')} className="hover:text-neutral-900 dark:hover:text-white">BMI Calculator</button></li>
                  <li><button onClick={() => onNavigateCalculator('bmr')} className="hover:text-neutral-900 dark:hover:text-white">BMR Calculator</button></li>
                  <li><button onClick={() => onNavigateCalculator('tdee')} className="hover:text-neutral-900 dark:hover:text-white">TDEE Calculator</button></li>
                  <li><button onClick={() => onNavigateCalculator('macro')} className="hover:text-neutral-900 dark:hover:text-white">Macro Calculator</button></li>
                </>
              )}
              {cat.id === 'converters' && (
                <>
                  <li><button onClick={() => onNavigateCalculator('universal-converter')} className="hover:text-neutral-900 dark:hover:text-white">Universal Converter</button></li>
                  <li><button onClick={() => onNavigateCalculator('length-converter')} className="hover:text-neutral-900 dark:hover:text-white">Length & Distance</button></li>
                  <li><button onClick={() => onNavigateCalculator('weight-converter')} className="hover:text-neutral-900 dark:hover:text-white">Weight & Mass</button></li>
                  <li><button onClick={() => onNavigateCalculator('temperature-converter')} className="hover:text-neutral-900 dark:hover:text-white">Temperature</button></li>
                </>
              )}
              {cat.id === 'finance' && (
                <>
                  <li><button onClick={() => onNavigateCalculator('currency-converter')} className="hover:text-neutral-900 dark:hover:text-white">Currency Converter</button></li>
                  <li><button onClick={() => onNavigateCalculator('loan-emi')} className="hover:text-neutral-900 dark:hover:text-white">Loan EMI</button></li>
                  <li><button onClick={() => onNavigateCalculator('compound-interest')} className="hover:text-neutral-900 dark:hover:text-white">Compound Interest</button></li>
                  <li><button onClick={() => onNavigateCalculator('vat-tax')} className="hover:text-neutral-900 dark:hover:text-white">VAT & Sales Tax</button></li>
                </>
              )}
              {cat.id === 'creative' && (
                <>
                  <li><button onClick={() => onNavigateCalculator('color-contrast')} className="hover:text-neutral-900 dark:hover:text-white">WCAG Contrast</button></li>
                  <li><button onClick={() => onNavigateCalculator('color-palette')} className="hover:text-neutral-900 dark:hover:text-white">Palette Generator</button></li>
                  <li><button onClick={() => onNavigateCalculator('gradient-generator')} className="hover:text-neutral-900 dark:hover:text-white">CSS Gradients</button></li>
                  <li><button onClick={() => onNavigateCalculator('css-clamp')} className="hover:text-neutral-900 dark:hover:text-white">Fluid Typography</button></li>
                </>
              )}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-200/80 dark:border-neutral-800/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <p>© {new Date().getFullYear()} OmniCalc Suite. Accurate, fast, and completely client-side. Photos via Unsplash.</p>
          <div className="flex items-center gap-6">
            <span>Client-side calculations</span>
            <span>·</span>
            <span>WCAG 2.1 AA Compliant</span>
            <span>·</span>
            <span>Dark & Light Themes</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
