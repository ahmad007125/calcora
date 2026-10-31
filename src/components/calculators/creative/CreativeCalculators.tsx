import React, { useState } from 'react';
import { CalculatorWrapper } from '../../common/CalculatorWrapper';
import { CalculatorMeta, CategoryId } from '../../../types';
import { ArrowLeftRight, Copy, Check, Sparkles } from 'lucide-react';

interface CreativeCalculatorsProps {
  meta: CalculatorMeta;
  onNavigateHome: () => void;
  onNavigateCategory: (cat: CategoryId) => void;
  onNavigateCalculator: (id: string) => void;
}

// Color Math Helpers
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16);
  if (isNaN(bigint)) return [0, 0, 0];
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Relative Luminance for WCAG Contrast
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(v => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const l1 = getLuminance(r1, g1, b1);
  const l2 = getLuminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Color blindness matrix transformation
function simulateColorBlindness(hex: string, type: 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'): string {
  const [r, g, b] = hexToRgb(hex);
  let nr = r, ng = g, nb = b;

  if (type === 'protanopia') {
    nr = 0.56667 * r + 0.43333 * g;
    ng = 0.55833 * r + 0.44167 * g;
    nb = 0.24167 * g + 0.75833 * b;
  } else if (type === 'deuteranopia') {
    nr = 0.625 * r + 0.375 * g;
    ng = 0.7 * r + 0.3 * g;
    nb = 0.3 * g + 0.7 * b;
  } else if (type === 'tritanopia') {
    nr = 0.95 * r + 0.05 * g;
    ng = 0.43333 * g + 0.56667 * b;
    nb = 0.475 * g + 0.525 * b;
  } else if (type === 'achromatopsia') {
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    nr = ng = nb = gray;
  }
  return rgbToHex(Math.round(nr), Math.round(ng), Math.round(nb));
}

export const CreativeCalculators: React.FC<CreativeCalculatorsProps> = ({
  meta,
  onNavigateHome,
  onNavigateCategory,
  onNavigateCalculator,
}) => {
  // Contrast Checker State
  const [textColor, setTextColor] = useState<string>('#ffffff');
  const [bgColor, setBgColor] = useState<string>('#0f172a');

  // Palette & Converter State
  const [baseHex, setBaseHex] = useState<string>('#3b82f6');

  // Gradient Generator State
  const [gradType, setGradType] = useState<'linear' | 'radial'>('linear');
  const [gradAngle, setGradAngle] = useState<number>(135);
  const [gradColor1, setGradColor1] = useState<string>('#6366f1');
  const [gradColor2, setGradColor2] = useState<string>('#a855f7');

  // Box Shadow State
  const [shadowX, setShadowX] = useState<number>(0);
  const [shadowY, setShadowY] = useState<number>(10);
  const [shadowBlur, setShadowBlur] = useState<number>(25);
  const [shadowSpread, setShadowSpread] = useState<number>(-5);
  const [shadowOpacity, setShadowOpacity] = useState<number>(20);
  const [shadowInset, setShadowInset] = useState<boolean>(false);

  // Border Radius State
  const [radiusTL, setRadiusTL] = useState<number>(16);
  const [radiusTR, setRadiusTR] = useState<number>(16);
  const [radiusBR, setRadiusBR] = useState<number>(16);
  const [radiusBL, setRadiusBL] = useState<number>(16);
  const [linkRadius, setLinkRadius] = useState<boolean>(true);

  // CSS Clamp State
  const [clampMinPx, setClampMinPx] = useState<number>(16);
  const [clampMaxPx, setClampMaxPx] = useState<number>(32);
  const [clampMinVw, setClampMinVw] = useState<number>(320);
  const [clampMaxVw, setClampMaxVw] = useState<number>(1280);

  // Aspect Ratio State
  const [arWidth, setArWidth] = useState<number>(1920);
  const [arHeight, setArHeight] = useState<number>(1080);
  const [newWidth, setNewWidth] = useState<number>(800);

  // Typography Scale State
  const [typeBaseSize, setTypeBaseSize] = useState<number>(16);
  const [typeScaleRatio, setTypeScaleRatio] = useState<number>(1.25); // Major Third

  const handleReset = () => {
    setTextColor('#ffffff');
    setBgColor('#0f172a');
    setBaseHex('#3b82f6');
    setGradAngle(135);
    setGradColor1('#6366f1');
    setGradColor2('#a855f7');
    setShadowX(0);
    setShadowY(10);
    setShadowBlur(25);
    setShadowSpread(-5);
    setRadiusTL(16);
    setRadiusTR(16);
    setRadiusBR(16);
    setRadiusBL(16);
    setClampMinPx(16);
    setClampMaxPx(32);
    setArWidth(1920);
    setArHeight(1080);
    setTypeBaseSize(16);
    setTypeScaleRatio(1.25);
  };

  // 1. Contrast calculations
  const contrastRatio = getContrastRatio(textColor, bgColor);
  const aaNormalPass = contrastRatio >= 4.5;
  const aaLargePass = contrastRatio >= 3.0;
  const aaaNormalPass = contrastRatio >= 7.0;
  const aaaLargePass = contrastRatio >= 4.5;

  // 2. Color conversions
  const [rgbR, rgbG, rgbB] = hexToRgb(baseHex);
  const [hslH, hslS, hslL] = rgbToHsl(rgbR, rgbG, rgbB);

  // Palette Generation
  const compH = (hslH + 180) % 360;
  const compHex = rgbToHex(...hslToRgb(compH, hslS, hslL));
  const analogous1 = rgbToHex(...hslToRgb((hslH + 30) % 360, hslS, hslL));
  const analogous2 = rgbToHex(...hslToRgb((hslH + 330) % 360, hslS, hslL));
  const triadic1 = rgbToHex(...hslToRgb((hslH + 120) % 360, hslS, hslL));
  const triadic2 = rgbToHex(...hslToRgb((hslH + 240) % 360, hslS, hslL));
  const shadeLight = rgbToHex(...hslToRgb(hslH, hslS, Math.min(95, hslL + 25)));
  const shadeDark = rgbToHex(...hslToRgb(hslH, hslS, Math.max(10, hslL - 25)));

  // 3. Gradient CSS
  const gradientCss = gradType === 'linear'
    ? `linear-gradient(${gradAngle}deg, ${gradColor1}, ${gradColor2})`
    : `radial-gradient(circle, ${gradColor1}, ${gradColor2})`;

  // 4. Box Shadow CSS
  const shadowRgba = `rgba(0, 0, 0, ${(shadowOpacity / 100).toFixed(2)})`;
  const boxShadowCss = `${shadowInset ? 'inset ' : ''}${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${shadowRgba}`;

  // 5. Border Radius CSS
  const borderRadiusCss = `${radiusTL}px ${radiusTR}px ${radiusBR}px ${radiusBL}px`;

  // 6. CSS Clamp Formula
  // slope = (maxFontSize - minFontSize) / (maxViewport - minViewport)
  // yAxisIntersection = -minViewport * slope + minFontSize
  const slope = (clampMaxPx - clampMinPx) / (clampMaxVw - clampMinVw);
  const yAxisIntersection = -clampMinVw * slope + clampMinPx;
  const clampVw = (slope * 100).toFixed(3);
  const clampRem = (yAxisIntersection / 16).toFixed(3);
  const clampMinRem = (clampMinPx / 16).toFixed(3);
  const clampMaxRem = (clampMaxPx / 16).toFixed(3);
  const clampCss = `clamp(${clampMinRem}rem, ${clampVw}vw + ${clampRem}rem, ${clampMaxRem}rem)`;

  // 7. Aspect Ratio Calculation
  // GCD helper
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const commonDiv = gcd(Math.round(arWidth), Math.round(arHeight));
  const simplifiedRatio = `${arWidth / commonDiv}:${arHeight / commonDiv}`;
  const calculatedNewHeight = Math.round((newWidth / arWidth) * arHeight);

  // 8. Typography Scale Steps
  const typeSteps = [
    { label: '4XL / Display', power: 4 },
    { label: '3XL / Heading 1', power: 3 },
    { label: '2XL / Heading 2', power: 2 },
    { label: 'XL / Heading 3', power: 1 },
    { label: 'Base / Body', power: 0 },
    { label: 'SM / Subtext', power: -1 },
    { label: 'XS / Caption', power: -2 },
  ].map(s => {
    const px = Math.round(typeBaseSize * Math.pow(typeScaleRatio, s.power));
    const rem = (px / 16).toFixed(3);
    return { ...s, px, rem };
  });

  // Primary Copy Resolver
  let copyVal = '';
  let copyLbl = 'CSS Code';

  switch (meta.id) {
    case 'color-contrast':
      copyVal = `Contrast: ${contrastRatio.toFixed(2)}:1 (AA: ${aaNormalPass ? 'Pass' : 'Fail'}, AAA: ${aaaNormalPass ? 'Pass' : 'Fail'})`;
      copyLbl = 'Contrast';
      break;
    case 'color-palette':
      copyVal = `HEX: ${baseHex} | RGB(${rgbR}, ${rgbG}, ${rgbB}) | HSL(${hslH}, ${hslS}%, ${hslL}%)`;
      copyLbl = 'Color Values';
      break;
    case 'gradient-generator':
      copyVal = `background: ${gradientCss};`;
      copyLbl = 'CSS Gradient';
      break;
    case 'box-shadow':
      copyVal = `box-shadow: ${boxShadowCss};`;
      copyLbl = 'box-shadow';
      break;
    case 'border-radius':
      copyVal = `border-radius: ${borderRadiusCss};`;
      copyLbl = 'border-radius';
      break;
    case 'css-clamp':
      copyVal = `font-size: ${clampCss};`;
      copyLbl = 'clamp()';
      break;
    case 'aspect-ratio':
      copyVal = `aspect-ratio: ${simplifiedRatio}; (or ${newWidth} x ${calculatedNewHeight}px)`;
      copyLbl = 'Ratio';
      break;
    case 'typography-scale':
      copyVal = typeSteps.map(s => `--font-${s.label.split(' ')[0].toLowerCase()}: ${s.rem}rem; /* ${s.px}px */`).join('\n');
      copyLbl = 'CSS Variables';
      break;
    default:
      copyVal = contrastRatio.toFixed(2);
  }

  return (
    <CalculatorWrapper
      meta={meta}
      onNavigateHome={onNavigateHome}
      onNavigateCategory={onNavigateCategory}
      onNavigateCalculator={onNavigateCalculator}
      onReset={handleReset}
      copyValue={copyVal}
      copyLabel={copyLbl}
    >
      {/* 1. COLOR CONTRAST CHECKER */}
      {meta.id === 'color-contrast' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-xs font-semibold text-neutral-900 dark:text-white">Color Pickers</span>
              <button
                onClick={() => {
                  const temp = textColor;
                  setTextColor(bgColor);
                  setBgColor(temp);
                }}
                className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" /> Swap Colors 
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-neutral-500 font-medium">Text (Foreground)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={e => setTextColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-neutral-200 dark:border-neutral-700 bg-transparent"
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={e => setTextColor(e.target.value)}
                    className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-neutral-500 font-medium">Background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={e => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-neutral-200 dark:border-neutral-700 bg-transparent"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={e => setBgColor(e.target.value)}
                    className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
                  />
                </div>
              </div>
            </div>

            {/* Quick Preset Pairs */}
            <div className="pt-2">
              <span className="text-[11px] text-neutral-400 block mb-2">Tested Presets:</span>
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  { text: '#ffffff', bg: '#090a0f', name: 'Dark Mode' },
                  { text: '#0f172a', bg: '#ffffff', name: 'Light Mode' },
                  { text: '#3b82f6', bg: '#ffffff', name: 'Blue on White' },
                  { text: '#10b981', bg: '#064e3b', name: 'Green on Emerald' },
                  { text: '#f59e0b', bg: '#ffffff', name: 'Yellow (Fails)' },
                ].map(pair => (
                  <button
                    key={pair.name}
                    onClick={() => { setTextColor(pair.text); setBgColor(pair.bg); }}
                    className="px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-850"
                  >
                    {pair.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contrast Score & Live Preview */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase">WCAG 2.1 Contrast Ratio</span>
                <span className="text-3xl font-bold font-mono text-neutral-900 dark:text-white tabular-nums">
                  {contrastRatio.toFixed(2)} : 1
                </span>
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center text-xs">
                <div className={`p-2.5 rounded-xl border ${aaNormalPass ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900 text-red-700 dark:text-red-400'}`}>
                  <p className="font-bold">AA Normal</p>
                  <p className="text-[10px] mt-0.5">{aaNormalPass ? 'Pass (≥ 4.5:1)' : 'Fail'}</p>
                </div>
                <div className={`p-2.5 rounded-xl border ${aaLargePass ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900 text-red-700 dark:text-red-400'}`}>
                  <p className="font-bold">AA Large</p>
                  <p className="text-[10px] mt-0.5">{aaLargePass ? 'Pass (≥ 3:1)' : 'Fail'}</p>
                </div>
                <div className={`p-2.5 rounded-xl border ${aaaNormalPass ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900 text-red-700 dark:text-red-400'}`}>
                  <p className="font-bold">AAA Normal</p>
                  <p className="text-[10px] mt-0.5">{aaaNormalPass ? 'Pass (≥ 7:1)' : 'Fail'}</p>
                </div>
                <div className={`p-2.5 rounded-xl border ${aaaLargePass ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900 text-red-700 dark:text-red-400'}`}>
                  <p className="font-bold">AAA Large</p>
                  <p className="text-[10px] mt-0.5">{aaaLargePass ? 'Pass (≥ 4.5:1)' : 'Fail'}</p>
                </div>
              </div>

              {/* Live Preview Box */}
              <div 
                className="p-6 rounded-xl border border-neutral-300 dark:border-neutral-700 transition-colors shadow-inner"
                style={{ backgroundColor: bgColor, color: textColor }}
              >
                <p className="text-xl font-bold tracking-tight mb-2">
                  Large Text Headline (18pt / 24px)
                </p>
                <p className="text-sm leading-relaxed">
                  Normal text paragraph for body copy readability (14pt / 16px). High contrast guarantees crisp legibility for all users.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. COLOR PALETTE & CONVERTER */}
      {meta.id === 'color-palette' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="color"
                value={baseHex}
                onChange={e => setBaseHex(e.target.value)}
                className="w-16 h-16 rounded-2xl cursor-pointer border border-neutral-200 dark:border-neutral-700 bg-transparent shrink-0"
              />
              <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold">HEX</span>
                  <div className="font-mono text-sm font-semibold text-neutral-900 dark:text-white uppercase mt-0.5">{baseHex}</div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold">RGB</span>
                  <div className="font-mono text-sm font-semibold text-neutral-900 dark:text-white mt-0.5">rgb({rgbR}, {rgbG}, {rgbB})</div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold">HSL</span>
                  <div className="font-mono text-sm font-semibold text-neutral-900 dark:text-white mt-0.5">hsl({hslH}, {hslS}%, {hslL}%)</div>
                </div>
              </div>
            </div>

            {/* Generated Harmonies */}
            <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <span className="text-xs font-semibold text-neutral-900 dark:text-white">Harmonious Color Palettes</span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-2">
                  <span className="text-[11px] font-medium text-neutral-500">Complementary</span>
                  <div className="flex h-12 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
                    <div style={{ backgroundColor: baseHex }} className="flex-1" />
                    <div style={{ backgroundColor: compHex }} className="flex-1" />
                  </div>
                  <div className="flex justify-between font-mono text-[10px] text-neutral-400">
                    <span>{baseHex}</span>
                    <span>{compHex}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-2">
                  <span className="text-[11px] font-medium text-neutral-500">Analogous</span>
                  <div className="flex h-12 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
                    <div style={{ backgroundColor: analogous2 }} className="flex-1" />
                    <div style={{ backgroundColor: baseHex }} className="flex-1" />
                    <div style={{ backgroundColor: analogous1 }} className="flex-1" />
                  </div>
                  <div className="flex justify-between font-mono text-[10px] text-neutral-400">
                    <span>{analogous2}</span>
                    <span>{analogous1}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-2">
                  <span className="text-[11px] font-medium text-neutral-500">Triadic</span>
                  <div className="flex h-12 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
                    <div style={{ backgroundColor: baseHex }} className="flex-1" />
                    <div style={{ backgroundColor: triadic1 }} className="flex-1" />
                    <div style={{ backgroundColor: triadic2 }} className="flex-1" />
                  </div>
                  <div className="flex justify-between font-mono text-[10px] text-neutral-400">
                    <span>{triadic1}</span>
                    <span>{triadic2}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-2">
                  <span className="text-[11px] font-medium text-neutral-500">Shades</span>
                  <div className="flex h-12 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
                    <div style={{ backgroundColor: shadeLight }} className="flex-1" />
                    <div style={{ backgroundColor: baseHex }} className="flex-1" />
                    <div style={{ backgroundColor: shadeDark }} className="flex-1" />
                  </div>
                  <div className="flex justify-between font-mono text-[10px] text-neutral-400">
                    <span>Light</span>
                    <span>Dark</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. GRADIENT GENERATOR */}
      {meta.id === 'gradient-generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex gap-2">
              <button
                onClick={() => setGradType('linear')}
                className={`flex-1 py-2 text-xs font-medium rounded-xl border ${
                  gradType === 'linear' ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900 dark:border-white' : 'border-neutral-200 dark:border-neutral-800'
                }`}
              >
                Linear Gradient
              </button>
              <button
                onClick={() => setGradType('radial')}
                className={`flex-1 py-2 text-xs font-medium rounded-xl border ${
                  gradType === 'radial' ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900 dark:border-white' : 'border-neutral-200 dark:border-neutral-800'
                }`}
              >
                Radial Gradient
              </button>
            </div>

            {gradType === 'linear' && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-neutral-500">Angle</span>
                  <span className="font-mono">{gradAngle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={gradAngle}
                  onChange={e => setGradAngle(parseInt(e.target.value))}
                  className="w-full accent-neutral-900 dark:accent-white"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-neutral-500 block mb-1">Start Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={gradColor1} onChange={e => setGradColor1(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent" />
                  <input type="text" value={gradColor1} onChange={e => setGradColor1(e.target.value)} className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900" />
                </div>
              </div>
              <div>
                <label className="text-xs text-neutral-500 block mb-1">End Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={gradColor2} onChange={e => setGradColor2(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent" />
                  <input type="text" value={gradColor2} onChange={e => setGradColor2(e.target.value)} className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900" />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div 
              className="w-full h-52 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md transition-all flex items-center justify-center"
              style={{ background: gradientCss }}
            >
              <span className="px-4 py-2 rounded-xl bg-black/40 text-white font-mono text-xs backdrop-blur-md">
                Live Gradient Preview
              </span>
            </div>
            <div className="p-4 rounded-xl bg-neutral-900 text-neutral-200 dark:bg-[#0c0d12] border border-neutral-800 font-mono text-xs overflow-x-auto">
              background: {gradientCss};
            </div>
          </div>
        </div>
      )}

      {/* 4. COLOR BLINDNESS SIMULATOR */}
      {meta.id === 'color-blindness' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex items-center gap-4">
              <input type="color" value={baseHex} onChange={e => setBaseHex(e.target.value)} className="w-12 h-12 rounded-xl cursor-pointer" />
              <div>
                <span className="text-xs text-neutral-500 font-medium">Testing Color: </span>
                <span className="font-mono text-sm font-bold text-neutral-900 dark:text-white uppercase">{baseHex}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              {[
                { type: 'protanopia' as const, name: 'Protanopia', desc: 'Red-blind (1% of males)' },
                { type: 'deuteranopia' as const, name: 'Deuteranopia', desc: 'Green-blind (6% of males)' },
                { type: 'tritanopia' as const, name: 'Tritanopia', desc: 'Blue-blind (Rare)' },
                { type: 'achromatopsia' as const, name: 'Achromatopsia', desc: 'Total Monochromacy' },
              ].map(sim => {
                const simulatedColor = simulateColorBlindness(baseHex, sim.type);
                return (
                  <div key={sim.type} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 space-y-2">
                    <p className="text-xs font-semibold text-neutral-900 dark:text-white">{sim.name}</p>
                    <p className="text-[10px] text-neutral-400">{sim.desc}</p>
                    <div className="h-16 rounded-lg border border-neutral-200 dark:border-neutral-700" style={{ backgroundColor: simulatedColor }} />
                    <p className="font-mono text-xs text-neutral-500 text-center">{simulatedColor}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. BOX SHADOW & BORDER RADIUS & CLAMP & ASPECT RATIO & TYPOGRAPHY */}
      {['box-shadow', 'border-radius', 'css-clamp', 'aspect-ratio', 'typography-scale'].includes(meta.id) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {meta.id === 'box-shadow' && (
            <>
              <div className="lg:col-span-6 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1"><span>X Offset: {shadowX}px</span></div>
                  <input type="range" min="-50" max="50" value={shadowX} onChange={e => setShadowX(parseInt(e.target.value))} className="w-full" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span>Y Offset: {shadowY}px</span></div>
                  <input type="range" min="-50" max="50" value={shadowY} onChange={e => setShadowY(parseInt(e.target.value))} className="w-full" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span>Blur Radius: {shadowBlur}px</span></div>
                  <input type="range" min="0" max="100" value={shadowBlur} onChange={e => setShadowBlur(parseInt(e.target.value))} className="w-full" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span>Spread: {shadowSpread}px</span></div>
                  <input type="range" min="-30" max="50" value={shadowSpread} onChange={e => setShadowSpread(parseInt(e.target.value))} className="w-full" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span>Opacity: {shadowOpacity}%</span></div>
                  <input type="range" min="0" max="100" value={shadowOpacity} onChange={e => setShadowOpacity(parseInt(e.target.value))} className="w-full" />
                </div>
              </div>
              <div className="lg:col-span-6 space-y-6">
                <div className="h-56 bg-neutral-50 dark:bg-neutral-900 rounded-2xl flex items-center justify-center p-8 border border-neutral-200 dark:border-neutral-800">
                  <div 
                    className="w-36 h-36 bg-white dark:bg-[#14161f] rounded-2xl border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-xs font-medium text-neutral-500"
                    style={{ boxShadow: boxShadowCss }}
                  >
                    Card Element
                  </div>
                </div>
                <div className="p-3 bg-neutral-900 text-white rounded-xl font-mono text-xs overflow-x-auto">
                  box-shadow: {boxShadowCss};
                </div>
              </div>
            </>
          )}

          {meta.id === 'border-radius' && (
            <>
              <div className="lg:col-span-6 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="flex justify-between text-xs"><span>Top Left: {radiusTL}px</span></div>
                <input type="range" min="0" max="100" value={radiusTL} onChange={e => {
                  const val = parseInt(e.target.value);
                  setRadiusTL(val);
                  if (linkRadius) { setRadiusTR(val); setRadiusBR(val); setRadiusBL(val); }
                }} className="w-full" />
                <div className="flex justify-between text-xs"><span>Top Right: {radiusTR}px</span></div>
                <input type="range" min="0" max="100" value={radiusTR} onChange={e => setRadiusTR(parseInt(e.target.value))} className="w-full" disabled={linkRadius} />
                <div className="flex justify-between text-xs"><span>Bottom Right: {radiusBR}px</span></div>
                <input type="range" min="0" max="100" value={radiusBR} onChange={e => setRadiusBR(parseInt(e.target.value))} className="w-full" disabled={linkRadius} />
                <div className="flex justify-between text-xs"><span>Bottom Left: {radiusBL}px</span></div>
                <input type="range" min="0" max="100" value={radiusBL} onChange={e => setRadiusBL(parseInt(e.target.value))} className="w-full" disabled={linkRadius} />
                <label className="flex items-center gap-2 text-xs pt-2">
                  <input type="checkbox" checked={linkRadius} onChange={e => setLinkRadius(e.target.checked)} />
                  <span>Link all corners equally</span>
                </label>
              </div>
              <div className="lg:col-span-6 space-y-6">
                <div className="h-56 bg-neutral-50 dark:bg-neutral-900 rounded-2xl flex items-center justify-center p-8 border border-neutral-200 dark:border-neutral-800">
                  <div 
                    className="w-40 h-40 bg-neutral-900 dark:bg-white transition-all shadow-md"
                    style={{ borderRadius: borderRadiusCss }}
                  />
                </div>
                <div className="p-3 bg-neutral-900 text-white rounded-xl font-mono text-xs">
                  border-radius: {borderRadiusCss};
                </div>
              </div>
            </>
          )}

          {meta.id === 'css-clamp' && (
            <>
              <div className="lg:col-span-6 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-neutral-500">Min Font Size (px)</label>
                    <input type="number" value={clampMinPx} onChange={e => setClampMinPx(parseFloat(e.target.value) || 0)} className="w-full font-mono text-xs px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500">Max Font Size (px)</label>
                    <input type="number" value={clampMaxPx} onChange={e => setClampMaxPx(parseFloat(e.target.value) || 0)} className="w-full font-mono text-xs px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500">Min Viewport Width (px)</label>
                    <input type="number" value={clampMinVw} onChange={e => setClampMinVw(parseFloat(e.target.value) || 0)} className="w-full font-mono text-xs px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500">Max Viewport Width (px)</label>
                    <input type="number" value={clampMaxVw} onChange={e => setClampMaxVw(parseFloat(e.target.value) || 0)} className="w-full font-mono text-xs px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 mt-1" />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-6 space-y-4">
                <div className="p-6 bg-white dark:bg-[#0c0d12] rounded-2xl border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[11px] font-semibold text-neutral-400 uppercase">Generated CSS Rule</span>
                  <div className="mt-2 p-3 bg-neutral-900 text-emerald-400 rounded-xl font-mono text-xs break-all">
                    font-size: {clampCss};
                  </div>
                </div>
              </div>
            </>
          )}

          {meta.id === 'aspect-ratio' && (
            <>
              <div className="lg:col-span-6 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-neutral-500">Original Width (px)</label>
                    <input type="number" value={arWidth} onChange={e => setArWidth(parseFloat(e.target.value) || 1)} className="w-full font-mono text-xs px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500">Original Height (px)</label>
                    <input type="number" value={arHeight} onChange={e => setArHeight(parseFloat(e.target.value) || 1)} className="w-full font-mono text-xs px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 mt-1" />
                  </div>
                </div>
                <div className="pt-2">
                  <label className="text-xs text-neutral-500">Calculate New Height for Width (px)</label>
                  <input type="number" value={newWidth} onChange={e => setNewWidth(parseFloat(e.target.value) || 1)} className="w-full font-mono text-xs px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 mt-1" />
                </div>
              </div>
              <div className="lg:col-span-6 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase">Aspect Ratio Math</span>
                <div className="text-3xl font-bold font-mono text-neutral-900 dark:text-white">{simplifiedRatio}</div>
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500 space-y-1">
                  <p>Scaled Dimensions: <strong className="font-mono text-neutral-900 dark:text-white">{newWidth} × {calculatedNewHeight}px</strong></p>
                  <p>CSS Property: <strong className="font-mono text-neutral-900 dark:text-white">aspect-ratio: {simplifiedRatio};</strong></p>
                </div>
              </div>
            </>
          )}

          {meta.id === 'typography-scale' && (
            <div className="lg:col-span-12 space-y-6">
              <div className="bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-3">
                  <label className="text-xs text-neutral-500">Base Size (px):</label>
                  <input type="number" value={typeBaseSize} onChange={e => setTypeBaseSize(parseInt(e.target.value) || 16)} className="w-16 font-mono text-xs px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900" />
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-neutral-500">Scale Ratio:</span>
                  {[
                    { label: 'Minor Third (1.200)', val: 1.200 },
                    { label: 'Major Third (1.250)', val: 1.250 },
                    { label: 'Perfect Fourth (1.333)', val: 1.333 },
                    { label: 'Golden Ratio (1.618)', val: 1.618 },
                  ].map(r => (
                    <button
                      key={r.label}
                      onClick={() => setTypeScaleRatio(r.val)}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] ${typeScaleRatio === r.val ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold' : 'border-neutral-200 dark:border-neutral-800'}`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-100 dark:divide-neutral-800">
                {typeSteps.map(step => (
                  <div key={step.label} className="py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <div className="w-48 text-xs text-neutral-400 font-mono">
                      {step.label} ({step.px}px / {step.rem}rem)
                    </div>
                    <div 
                      className="font-medium text-neutral-900 dark:text-white truncate"
                      style={{ fontSize: `${step.px}px` }}
                    >
                      Typography hierarchy example
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </CalculatorWrapper>
  );
};
