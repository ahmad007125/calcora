import React, { useState } from 'react';
import { CalculatorWrapper } from '../../common/CalculatorWrapper';
import { CalculatorMeta, CategoryId } from '../../../types';
import { Copy, Check, RefreshCw, Dices, Shield, Code, Sparkles } from 'lucide-react';

interface TextDataCalculatorsProps {
  meta: CalculatorMeta;
  onNavigateHome: () => void;
  onNavigateCategory: (cat: CategoryId) => void;
  onNavigateCalculator: (id: string) => void;
}

export const TextDataCalculators: React.FC<TextDataCalculatorsProps> = ({
  meta,
  onNavigateHome,
  onNavigateCategory,
  onNavigateCalculator,
}) => {
  // Word Counter State
  const [textInput, setTextInput] = useState<string>(
    'OmniCalc provides precision computing instruments for professionals, engineers, and creatives worldwide.'
  );

  // Case Converter State
  const [caseInput, setCaseInput] = useState<string>('hello world from omnicalc developer tools');

  // Password Generator State
  const [pwdLength, setPwdLength] = useState<number>(16);
  const [incUpper, setIncUpper] = useState<boolean>(true);
  const [incLower, setIncLower] = useState<boolean>(true);
  const [incNumbers, setIncNumbers] = useState<boolean>(true);
  const [incSymbols, setIncSymbols] = useState<boolean>(true);
  const [generatedPwd, setGeneratedPwd] = useState<string>('X9#kL2!mP7$wQ8*z');

  // Random Number State
  const [rngMin, setRngMin] = useState<number>(1);
  const [rngMax, setRngMax] = useState<number>(100);
  const [rngCount, setRngCount] = useState<number>(5);
  const [rngUnique, setRngUnique] = useState<boolean>(true);
  const [rngResults, setRngResults] = useState<number[]>([14, 27, 42, 68, 91]);

  // Statistics State
  const [rawNumbers, setRawNumbers] = useState<string>('12, 19, 24, 28, 35, 42, 51, 60, 68, 85');

  // Ratio State
  const [ratioA, setRatioA] = useState<number>(16);
  const [ratioB, setRatioB] = useState<number>(9);
  const [ratioC, setRatioC] = useState<number>(1920);

  // Base Converter State
  const [decVal, setDecVal] = useState<string>('255');

  // JSON Formatter State
  const [jsonInput, setJsonInput] = useState<string>(
    '{"product":"OmniCalc","version":2.0,"active":true,"categories":["health","finance","converters"]}'
  );
  const [jsonOutput, setJsonOutput] = useState<string>('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Base64 State
  const [b64Text, setB64Text] = useState<string>('Hello, OmniCalc!');
  const [b64Encoded, setB64Encoded] = useState<string>('SGVsbG8sIE9tbmlDYWxjIQ==');

  // Reset Handler
  const handleReset = () => {
    setTextInput('OmniCalc provides precision computing instruments for professionals, engineers, and creatives worldwide.');
    setCaseInput('hello world from omnicalc developer tools');
    setPwdLength(16);
    setRngMin(1);
    setRngMax(100);
    setRngCount(5);
    setRawNumbers('12, 19, 24, 28, 35, 42, 51, 60, 68, 85');
    setRatioA(16);
    setRatioB(9);
    setRatioC(1920);
    setDecVal('255');
  };

  // 1. Word & Character Counter Math
  const charCountWithSpaces = textInput.length;
  const charCountNoSpaces = textInput.replace(/\s+/g, '').length;
  const wordsArray = textInput.trim().split(/\s+/).filter(Boolean);
  const wordCount = wordsArray.length;
  const sentenceCount = textInput.split(/[.!?]+/).filter(Boolean).length;
  const paragraphCount = textInput.split(/\n+/).filter(Boolean).length;
  const readingTimeMin = (wordCount / 200).toFixed(1); // 200 wpm
  const speakingTimeMin = (wordCount / 130).toFixed(1); // 130 wpm

  // 2. Password Generator
  const generatePassword = () => {
    let chars = '';
    if (incUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (incLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (incNumbers) chars += '0123456789';
    if (incSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

    let pwd = '';
    const array = new Uint32Array(pwdLength);
    crypto.getRandomValues(array);
    for (let i = 0; i < pwdLength; i++) {
      pwd += chars[array[i] % chars.length];
    }
    setGeneratedPwd(pwd);
  };

  // 3. Random Number Generator
  const generateRandomNumbers = () => {
    const list: number[] = [];
    const min = Math.min(rngMin, rngMax);
    const max = Math.max(rngMin, rngMax);
    const range = max - min + 1;

    if (rngUnique && rngCount > range) {
      for (let i = min; i <= max; i++) list.push(i);
    } else {
      while (list.length < rngCount) {
        const val = Math.floor(Math.random() * range) + min;
        if (rngUnique) {
          if (!list.includes(val)) list.push(val);
        } else {
          list.push(val);
        }
      }
    }
    setRngResults(list);
  };

  // 4. Statistics Solver
  const parsedNums = rawNumbers
    .split(/[\s,;\n]+/)
    .map(Number)
    .filter(n => !isNaN(n));
  parsedNums.sort((a, b) => a - b);

  const statsCount = parsedNums.length;
  const statsSum = parsedNums.reduce((a, b) => a + b, 0);
  const statsMean = statsCount > 0 ? statsSum / statsCount : 0;
  const statsMin = statsCount > 0 ? parsedNums[0] : 0;
  const statsMax = statsCount > 0 ? parsedNums[statsCount - 1] : 0;
  const statsRange = statsMax - statsMin;

  // Median
  let statsMedian = 0;
  if (statsCount > 0) {
    const mid = Math.floor(statsCount / 2);
    statsMedian = statsCount % 2 !== 0 ? parsedNums[mid] : (parsedNums[mid - 1] + parsedNums[mid]) / 2;
  }

  // Variance & Standard Deviation
  const variance = statsCount > 1
    ? parsedNums.reduce((acc, val) => acc + Math.pow(val - statsMean, 2), 0) / (statsCount - 1)
    : 0;
  const stdDev = Math.sqrt(variance);

  // 5. Ratio Solver (A : B = C : D)
  const ratioD = ratioA > 0 ? (ratioB * ratioC) / ratioA : 0;

  // 6. Multi-Base Converter
  const numInt = parseInt(decVal, 10);
  const binVal = isNaN(numInt) ? '0' : numInt.toString(2);
  const octVal = isNaN(numInt) ? '0' : numInt.toString(8);
  const hexVal = isNaN(numInt) ? '0' : numInt.toString(16).toUpperCase();

  // 7. JSON Formatter
  const formatJson = (spaces: number = 2) => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, spaces));
      setJsonError(null);
    } catch (err: any) {
      setJsonError(err.message || 'Invalid JSON syntax');
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed));
      setJsonError(null);
    } catch (err: any) {
      setJsonError(err.message || 'Invalid JSON syntax');
    }
  };

  // 8. Base64 encode / decode
  const handleB64Encode = (str: string) => {
    try {
      setB64Text(str);
      setB64Encoded(btoa(unescape(encodeURIComponent(str))));
    } catch {}
  };

  const handleB64Decode = (str: string) => {
    try {
      setB64Encoded(str);
      setB64Text(decodeURIComponent(escape(atob(str))));
    } catch {}
  };

  // Primary Copy Resolver
  let copyVal = '';
  let copyLbl = 'Result';

  switch (meta.id) {
    case 'word-counter':
    case 'reading-time':
      copyVal = `Words: ${wordCount}, Characters: ${charCountWithSpaces}, Reading Time: ${readingTimeMin} min`;
      copyLbl = 'Stats';
      break;
    case 'password-generator':
      copyVal = generatedPwd;
      copyLbl = 'Password';
      break;
    case 'random-number':
      copyVal = rngResults.join(', ');
      copyLbl = 'Numbers';
      break;
    case 'statistics-calculator':
      copyVal = `Mean: ${statsMean.toFixed(2)}, Median: ${statsMedian}, StdDev: ${stdDev.toFixed(2)}`;
      copyLbl = 'Statistics';
      break;
    case 'ratio-calculator':
      copyVal = `D = ${ratioD.toFixed(2)} (${ratioA}:${ratioB} = ${ratioC}:${ratioD.toFixed(2)})`;
      copyLbl = 'Ratio';
      break;
    case 'base-converter':
      copyVal = `Dec: ${decVal} | Hex: ${hexVal} | Bin: ${binVal}`;
      copyLbl = 'Values';
      break;
    case 'json-formatter':
      copyVal = jsonOutput || jsonInput;
      copyLbl = 'JSON';
      break;
    case 'base64-converter':
      copyVal = b64Encoded;
      copyLbl = 'Base64';
      break;
    default:
      copyVal = wordCount.toString();
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
      {/* 1. WORD & CHARACTER COUNTER */}
      {(meta.id === 'word-counter' || meta.id === 'reading-time') && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <textarea
              rows={6}
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              placeholder="Paste or type text to calculate real-time word count, character metrics, and speech durations..."
              className="w-full text-sm font-sans p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-400"
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-center">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Words</span>
                <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white tabular-nums">{wordCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-center">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Characters</span>
                <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white tabular-nums">{charCountWithSpaces}</div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-center">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">No Spaces</span>
                <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white tabular-nums">{charCountNoSpaces}</div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-center">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Sentences</span>
                <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white tabular-nums">{sentenceCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-center">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Reading Time</span>
                <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">{readingTimeMin}m</div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-center">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Speaking Time</span>
                <div className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 tabular-nums">{speakingTimeMin}m</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TEXT CASE CONVERTER */}
      {meta.id === 'text-case-converter' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <textarea
              rows={3}
              value={caseInput}
              onChange={e => setCaseInput(e.target.value)}
              placeholder="Type or paste text..."
              className="w-full text-sm font-sans p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              {[
                { name: 'UPPERCASE', text: caseInput.toUpperCase() },
                { name: 'lowercase', text: caseInput.toLowerCase() },
                { name: 'Title Case', text: caseInput.replace(/\w\S*/g, w => (w.replace(/^\w/, c => c.toUpperCase()))) },
                { name: 'Sentence case', text: caseInput.charAt(0).toUpperCase() + caseInput.slice(1).toLowerCase() },
                { name: 'camelCase', text: caseInput.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()) },
                { name: 'kebab-case', text: caseInput.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') },
                { name: 'snake_case', text: caseInput.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') },
                { name: 'PascalCase', text: caseInput.replace(/\w+/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase()).replace(/\s+/g, '') },
              ].map(item => (
                <div key={item.name} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1.5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase">{item.name}</span>
                    <p className="font-mono text-xs text-neutral-900 dark:text-white truncate mt-1">{item.text}</p>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(item.text)}
                    className="self-end text-[10px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 mt-2"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. PASSWORD GENERATOR */}
      {meta.id === 'password-generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-neutral-700 dark:text-neutral-300">Password Length</span>
                <span className="font-mono font-bold text-neutral-900 dark:text-white">{pwdLength} characters</span>
              </div>
              <input
                type="range"
                min="8"
                max="64"
                value={pwdLength}
                onChange={e => setPwdLength(parseInt(e.target.value))}
                className="w-full accent-neutral-900 dark:accent-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
                <input type="checkbox" checked={incUpper} onChange={e => setIncUpper(e.target.checked)} className="rounded" />
                <span>Uppercase (A-Z)</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
                <input type="checkbox" checked={incLower} onChange={e => setIncLower(e.target.checked)} className="rounded" />
                <span>Lowercase (a-z)</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
                <input type="checkbox" checked={incNumbers} onChange={e => setIncNumbers(e.target.checked)} className="rounded" />
                <span>Numbers (0-9)</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
                <input type="checkbox" checked={incSymbols} onChange={e => setIncSymbols(e.target.checked)} className="rounded" />
                <span>Symbols (!@#$%)</span>
              </label>
            </div>

            <button
              onClick={generatePassword}
              className="w-full py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-medium text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Generate New Password
            </button>
          </div>

          <div className="lg:col-span-5 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Generated Password</span>
            <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 font-mono text-sm font-bold text-neutral-900 dark:text-white break-all">
              {generatedPwd}
            </div>
            <div className="pt-2 text-xs text-neutral-500 space-y-1">
              <p>Entropy: <strong className="text-emerald-500">Very Strong ({Math.round(pwdLength * 5.95)} bits)</strong></p>
              <p>Generated locally via cryptographic Web Crypto API.</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. RANDOM NUMBER & DICE */}
      {meta.id === 'random-number' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-neutral-500 block mb-1">Minimum</label>
                <input type="number" value={rngMin} onChange={e => setRngMin(parseInt(e.target.value) || 0)} className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900" />
              </div>
              <div>
                <label className="text-xs text-neutral-500 block mb-1">Maximum</label>
                <input type="number" value={rngMax} onChange={e => setRngMax(parseInt(e.target.value) || 0)} className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900" />
              </div>
              <div>
                <label className="text-xs text-neutral-500 block mb-1">Quantity</label>
                <input type="number" min="1" max="100" value={rngCount} onChange={e => setRngCount(parseInt(e.target.value) || 1)} className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900" />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300">
              <input type="checkbox" checked={rngUnique} onChange={e => setRngUnique(e.target.checked)} className="rounded" />
              <span>Unique numbers only (no duplicates)</span>
            </label>

            <button
              onClick={generateRandomNumbers}
              className="w-full py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-medium text-xs flex items-center justify-center gap-2"
            >
              <Dices className="w-4 h-4" /> Draw Random Numbers
            </button>
          </div>

          <div className="lg:col-span-5 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase">Results</span>
            <div className="flex flex-wrap gap-2 pt-2">
              {rngResults.map((num, i) => (
                <div key={i} className="w-12 h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center font-mono font-bold text-base text-neutral-900 dark:text-white">
                  {num}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. STATISTICS SOLVER */}
      {meta.id === 'statistics-calculator' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div>
              <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block mb-1">
                Input Numbers (separated by commas or spaces)
              </label>
              <textarea
                rows={3}
                value={rawNumbers}
                onChange={e => setRawNumbers(e.target.value)}
                className="w-full text-xs font-mono p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-center border border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 uppercase">Sample Count</span>
                <div className="text-xl font-bold font-mono text-neutral-900 dark:text-white">{statsCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-center border border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 uppercase">Mean (Average)</span>
                <div className="text-xl font-bold font-mono text-neutral-900 dark:text-white">{statsMean.toFixed(2)}</div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-center border border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 uppercase">Median</span>
                <div className="text-xl font-bold font-mono text-neutral-900 dark:text-white">{statsMedian}</div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-center border border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 uppercase">Std Deviation (s)</span>
                <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{stdDev.toFixed(2)}</div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-center border border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 uppercase">Variance (s²)</span>
                <div className="text-xl font-bold font-mono text-neutral-900 dark:text-white">{variance.toFixed(2)}</div>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-center border border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 uppercase">Range (Max - Min)</span>
                <div className="text-xl font-bold font-mono text-neutral-900 dark:text-white">{statsRange}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. RATIO CALCULATOR */}
      {meta.id === 'ratio-calculator' && (
        <div className="bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-6">
          <h3 className="text-xs font-semibold text-neutral-900 dark:text-white">Solve Proportion: A : B = C : D</h3>
          <div className="flex flex-wrap items-center gap-3 font-mono text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-neutral-400">A</span>
              <input type="number" value={ratioA} onChange={e => setRatioA(parseFloat(e.target.value) || 1)} className="w-20 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900" />
            </div>
            <span className="text-xl text-neutral-400 mt-4">:</span>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-neutral-400">B</span>
              <input type="number" value={ratioB} onChange={e => setRatioB(parseFloat(e.target.value) || 1)} className="w-20 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900" />
            </div>
            <span className="text-xl text-neutral-400 mt-4">=</span>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-neutral-400">C</span>
              <input type="number" value={ratioC} onChange={e => setRatioC(parseFloat(e.target.value) || 1)} className="w-24 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900" />
            </div>
            <span className="text-xl text-neutral-400 mt-4">:</span>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-neutral-400">D (Result)</span>
              <div className="w-24 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold">
                {ratioD.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. BASE CONVERTER */}
      {meta.id === 'base-converter' && (
        <div className="bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
          <label className="text-xs text-neutral-500 block">Decimal Number (Base 10)</label>
          <input
            type="number"
            value={decVal}
            onChange={e => setDecVal(e.target.value)}
            className="w-full text-xl font-mono font-bold px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1">
              <span className="text-[10px] text-neutral-400 font-bold uppercase">Binary (Base 2)</span>
              <div className="font-mono text-sm font-bold text-neutral-900 dark:text-white break-all">{binVal}</div>
            </div>
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1">
              <span className="text-[10px] text-neutral-400 font-bold uppercase">Octal (Base 8)</span>
              <div className="font-mono text-sm font-bold text-neutral-900 dark:text-white break-all">{octVal}</div>
            </div>
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1">
              <span className="text-[10px] text-neutral-400 font-bold uppercase">Hexadecimal (Base 16)</span>
              <div className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 break-all">{hexVal}</div>
            </div>
          </div>
        </div>
      )}

      {/* 8. JSON FORMATTER */}
      {meta.id === 'json-formatter' && (
        <div className="space-y-4 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-neutral-900 dark:text-white">Raw JSON Input</span>
            <div className="flex gap-2 text-xs">
              <button onClick={() => formatJson(2)} className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-medium">Beautify (2 Spaces)</button>
              <button onClick={() => formatJson(4)} className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800">4 Spaces</button>
              <button onClick={minifyJson} className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800">Minify</button>
            </div>
          </div>

          <textarea
            rows={5}
            value={jsonInput}
            onChange={e => setJsonInput(e.target.value)}
            className="w-full font-mono text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
          />

          {jsonError && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs font-mono">
              {jsonError}
            </div>
          )}

          {jsonOutput && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-neutral-900 dark:text-white">Formatted JSON</span>
              <pre className="p-3 rounded-xl bg-neutral-900 text-neutral-200 font-mono text-xs overflow-x-auto max-h-60">
                {jsonOutput}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* 9. BASE64 CONVERTER */}
      {meta.id === 'base64-converter' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <div className="space-y-2">
            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Plain Text (UTF-8)</span>
            <textarea
              rows={4}
              value={b64Text}
              onChange={e => handleB64Encode(e.target.value)}
              className="w-full font-mono text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
            />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Base64 Encoded</span>
            <textarea
              rows={4}
              value={b64Encoded}
              onChange={e => handleB64Decode(e.target.value)}
              className="w-full font-mono text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400"
            />
          </div>
        </div>
      )}
    </CalculatorWrapper>
  );
};
