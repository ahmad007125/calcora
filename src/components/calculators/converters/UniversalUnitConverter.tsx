import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Check, Copy } from 'lucide-react';
import { CalculatorWrapper } from '../../common/CalculatorWrapper';
import { CalculatorMeta, CategoryId } from '../../../types';

interface UniversalUnitConverterProps {
  meta: CalculatorMeta;
  onNavigateHome: () => void;
  onNavigateCategory: (cat: CategoryId) => void;
  onNavigateCalculator: (id: string) => void;
}

type ConverterCategory = 
  | 'length' 
  | 'weight' 
  | 'temperature' 
  | 'area' 
  | 'volume' 
  | 'speed' 
  | 'time' 
  | 'pressure' 
  | 'energy' 
  | 'power' 
  | 'storage' 
  | 'cooking';

interface UnitDef {
  id: string;
  name: string;
  symbol: string;
  // ratio to base unit in category
  ratio: number;
}

const UNIT_SYSTEMS: Record<ConverterCategory, { name: string; base: string; units: UnitDef[] }> = {
  length: {
    name: 'Length & Distance',
    base: 'm',
    units: [
      { id: 'm', name: 'Meters', symbol: 'm', ratio: 1 },
      { id: 'cm', name: 'Centimeters', symbol: 'cm', ratio: 0.01 },
      { id: 'mm', name: 'Millimeters', symbol: 'mm', ratio: 0.001 },
      { id: 'km', name: 'Kilometers', symbol: 'km', ratio: 1000 },
      { id: 'in', name: 'Inches', symbol: 'in', ratio: 0.0254 },
      { id: 'ft', name: 'Feet', symbol: 'ft', ratio: 0.3048 },
      { id: 'yd', name: 'Yards', symbol: 'yd', ratio: 0.9144 },
      { id: 'mi', name: 'Miles', symbol: 'mi', ratio: 1609.344 },
      { id: 'nmi', name: 'Nautical Miles', symbol: 'NM', ratio: 1852 },
    ],
  },
  weight: {
    name: 'Weight & Mass',
    base: 'kg',
    units: [
      { id: 'kg', name: 'Kilograms', symbol: 'kg', ratio: 1 },
      { id: 'g', name: 'Grams', symbol: 'g', ratio: 0.001 },
      { id: 'mg', name: 'Milligrams', symbol: 'mg', ratio: 0.000001 },
      { id: 't', name: 'Metric Tonnes', symbol: 't', ratio: 1000 },
      { id: 'lb', name: 'Pounds', symbol: 'lbs', ratio: 0.45359237 },
      { id: 'oz', name: 'Ounces', symbol: 'oz', ratio: 0.028349523125 },
      { id: 'st', name: 'Stones', symbol: 'st', ratio: 6.35029 },
      { id: 'ct', name: 'Carats', symbol: 'ct', ratio: 0.0002 },
    ],
  },
  temperature: {
    name: 'Temperature',
    base: 'c',
    units: [
      { id: 'c', name: 'Celsius', symbol: '°C', ratio: 1 },
      { id: 'f', name: 'Fahrenheit', symbol: '°F', ratio: 1 },
      { id: 'k', name: 'Kelvin', symbol: 'K', ratio: 1 },
      { id: 'r', name: 'Rankine', symbol: '°R', ratio: 1 },
    ],
  },
  area: {
    name: 'Area',
    base: 'sqm',
    units: [
      { id: 'sqm', name: 'Square Meters', symbol: 'm²', ratio: 1 },
      { id: 'sqkm', name: 'Square Kilometers', symbol: 'km²', ratio: 1000000 },
      { id: 'sqft', name: 'Square Feet', symbol: 'ft²', ratio: 0.09290304 },
      { id: 'sqin', name: 'Square Inches', symbol: 'in²', ratio: 0.00064516 },
      { id: 'sqyd', name: 'Square Yards', symbol: 'yd²', ratio: 0.836127 },
      { id: 'ac', name: 'Acres', symbol: 'ac', ratio: 4046.8564224 },
      { id: 'ha', name: 'Hectares', symbol: 'ha', ratio: 10000 },
      { id: 'sqmi', name: 'Square Miles', symbol: 'mi²', ratio: 2589988.11 },
    ],
  },
  volume: {
    name: 'Volume & Capacity',
    base: 'l',
    units: [
      { id: 'l', name: 'Liters', symbol: 'L', ratio: 1 },
      { id: 'ml', name: 'Milliliters', symbol: 'mL', ratio: 0.001 },
      { id: 'cbm', name: 'Cubic Meters', symbol: 'm³', ratio: 1000 },
      { id: 'gal_us', name: 'US Gallons', symbol: 'gal', ratio: 3.78541 },
      { id: 'qt_us', name: 'US Quarts', symbol: 'qt', ratio: 0.946353 },
      { id: 'pt_us', name: 'US Pints', symbol: 'pt', ratio: 0.473176 },
      { id: 'cup_us', name: 'US Cups', symbol: 'cup', ratio: 0.236588 },
      { id: 'floz_us', name: 'US Fluid Ounces', symbol: 'fl oz', ratio: 0.0295735 },
      { id: 'cbft', name: 'Cubic Feet', symbol: 'ft³', ratio: 28.3168 },
    ],
  },
  speed: {
    name: 'Speed & Velocity',
    base: 'ms',
    units: [
      { id: 'ms', name: 'Meters / Second', symbol: 'm/s', ratio: 1 },
      { id: 'kmh', name: 'Kilometers / Hour', symbol: 'km/h', ratio: 0.277777778 },
      { id: 'mph', name: 'Miles / Hour', symbol: 'mph', ratio: 0.44704 },
      { id: 'knot', name: 'Knots', symbol: 'kn', ratio: 0.514444 },
      { id: 'fps', name: 'Feet / Second', symbol: 'ft/s', ratio: 0.3048 },
      { id: 'mach', name: 'Mach (at sea level)', symbol: 'Ma', ratio: 340.29 },
    ],
  },
  time: {
    name: 'Time',
    base: 's',
    units: [
      { id: 's', name: 'Seconds', symbol: 's', ratio: 1 },
      { id: 'ms', name: 'Milliseconds', symbol: 'ms', ratio: 0.001 },
      { id: 'min', name: 'Minutes', symbol: 'min', ratio: 60 },
      { id: 'hr', name: 'Hours', symbol: 'hr', ratio: 3600 },
      { id: 'day', name: 'Days', symbol: 'd', ratio: 86400 },
      { id: 'wk', name: 'Weeks', symbol: 'wk', ratio: 604800 },
      { id: 'mo', name: 'Months (30.44d)', symbol: 'mo', ratio: 2629746 },
      { id: 'yr', name: 'Years (365.25d)', symbol: 'yr', ratio: 31557600 },
    ],
  },
  pressure: {
    name: 'Pressure',
    base: 'pa',
    units: [
      { id: 'pa', name: 'Pascals', symbol: 'Pa', ratio: 1 },
      { id: 'kpa', name: 'Kilopascals', symbol: 'kPa', ratio: 1000 },
      { id: 'bar', name: 'Bar', symbol: 'bar', ratio: 100000 },
      { id: 'psi', name: 'Pounds / Sq Inch', symbol: 'psi', ratio: 6894.757 },
      { id: 'atm', name: 'Standard Atmospheres', symbol: 'atm', ratio: 101325 },
      { id: 'mmhg', name: 'Millimeters of Mercury', symbol: 'mmHg', ratio: 133.322 },
    ],
  },
  energy: {
    name: 'Energy',
    base: 'j',
    units: [
      { id: 'j', name: 'Joules', symbol: 'J', ratio: 1 },
      { id: 'kj', name: 'Kilojoules', symbol: 'kJ', ratio: 1000 },
      { id: 'cal', name: 'Calories', symbol: 'cal', ratio: 4.184 },
      { id: 'kcal', name: 'Kilocalories (Food)', symbol: 'kcal', ratio: 4184 },
      { id: 'wh', name: 'Watt-hours', symbol: 'Wh', ratio: 3600 },
      { id: 'kwh', name: 'Kilowatt-hours', symbol: 'kWh', ratio: 3600000 },
      { id: 'btu', name: 'British Thermal Units', symbol: 'BTU', ratio: 1055.06 },
    ],
  },
  power: {
    name: 'Power',
    base: 'w',
    units: [
      { id: 'w', name: 'Watts', symbol: 'W', ratio: 1 },
      { id: 'kw', name: 'Kilowatts', symbol: 'kW', ratio: 1000 },
      { id: 'mw', name: 'Megawatts', symbol: 'MW', ratio: 1000000 },
      { id: 'hp', name: 'Mechanical Horsepower', symbol: 'hp', ratio: 745.69987 },
      { id: 'ftlbs', name: 'Foot-Pounds / Sec', symbol: 'ft-lb/s', ratio: 1.355818 },
    ],
  },
  storage: {
    name: 'Digital Data Storage',
    base: 'b',
    units: [
      { id: 'b', name: 'Bytes', symbol: 'B', ratio: 1 },
      { id: 'bit', name: 'Bits', symbol: 'b', ratio: 0.125 },
      { id: 'kb', name: 'Kilobytes (Decimal)', symbol: 'KB', ratio: 1000 },
      { id: 'kib', name: 'Kibibytes (Binary)', symbol: 'KiB', ratio: 1024 },
      { id: 'mb', name: 'Megabytes (Decimal)', symbol: 'MB', ratio: 1000000 },
      { id: 'mib', name: 'Mebibytes (Binary)', symbol: 'MiB', ratio: 1048576 },
      { id: 'gb', name: 'Gigabytes (Decimal)', symbol: 'GB', ratio: 1000000000 },
      { id: 'gib', name: 'Gibibytes (Binary)', symbol: 'GiB', ratio: 1073741824 },
      { id: 'tb', name: 'Terabytes (Decimal)', symbol: 'TB', ratio: 1000000000000 },
      { id: 'tib', name: 'Tebibytes (Binary)', symbol: 'TiB', ratio: 1099511627776 },
    ],
  },
  cooking: {
    name: 'Cooking & Baking',
    base: 'ml',
    units: [
      { id: 'ml', name: 'Milliliters', symbol: 'mL', ratio: 1 },
      { id: 'tsp', name: 'Teaspoons (US)', symbol: 'tsp', ratio: 4.92892 },
      { id: 'tbsp', name: 'Tablespoons (US)', symbol: 'tbsp', ratio: 14.7868 },
      { id: 'cup', name: 'Cups (US)', symbol: 'cup', ratio: 236.588 },
      { id: 'floz', name: 'Fluid Ounces (US)', symbol: 'fl oz', ratio: 29.5735 },
      { id: 'pt', name: 'Pints (US)', symbol: 'pt', ratio: 473.176 },
      { id: 'qt', name: 'Quarts (US)', symbol: 'qt', ratio: 946.353 },
    ],
  },
};

export const UniversalUnitConverter: React.FC<UniversalUnitConverterProps> = ({
  meta,
  onNavigateHome,
  onNavigateCategory,
  onNavigateCalculator,
}) => {
  // Determine default category based on meta.id
  const getInitialCategory = (): ConverterCategory => {
    switch (meta.id) {
      case 'length-converter': return 'length';
      case 'weight-converter': return 'weight';
      case 'temperature-converter': return 'temperature';
      case 'area-converter': return 'area';
      case 'volume-converter': return 'volume';
      case 'speed-converter': return 'speed';
      case 'time-units-converter': return 'time';
      case 'data-storage-converter': return 'storage';
      case 'pressure-converter': return 'pressure';
      case 'energy-power-converter': return 'energy';
      case 'cooking-converter': return 'cooking';
      default: return 'length';
    }
  };

  const [currentCategory, setCurrentCategory] = useState<ConverterCategory>(getInitialCategory);
  const [inputValue, setInputValue] = useState<number>(1);
  const [fromUnitId, setFromUnitId] = useState<string>('m');
  const [toUnitId, setToUnitId] = useState<string>('ft');
  const [precision, setPrecision] = useState<number>(4);

  // Sync with meta change
  useEffect(() => {
    const cat = getInitialCategory();
    setCurrentCategory(cat);
    const catUnits = UNIT_SYSTEMS[cat].units;
    if (catUnits.length >= 2) {
      setFromUnitId(catUnits[0].id);
      setToUnitId(catUnits[1].id);
    }
  }, [meta.id]);

  // When category changes, reset from/to units
  const handleCategoryChange = (cat: ConverterCategory) => {
    setCurrentCategory(cat);
    const catUnits = UNIT_SYSTEMS[cat].units;
    if (catUnits.length >= 2) {
      setFromUnitId(catUnits[0].id);
      setToUnitId(catUnits[1].id);
    }
  };

  const units = UNIT_SYSTEMS[currentCategory].units;
  const fromUnit = units.find(u => u.id === fromUnitId) || units[0];
  const toUnit = units.find(u => u.id === toUnitId) || units[1];

  // Bidirectional Swap
  const handleSwap = () => {
    const temp = fromUnitId;
    setFromUnitId(toUnitId);
    setToUnitId(temp);
  };

  const handleReset = () => {
    setInputValue(1);
    const catUnits = UNIT_SYSTEMS[currentCategory].units;
    if (catUnits.length >= 2) {
      setFromUnitId(catUnits[0].id);
      setToUnitId(catUnits[1].id);
    }
    setPrecision(4);
  };

  // Temperature math vs standard ratio math
  const convertValue = (val: number, from: string, to: string, cat: ConverterCategory): number => {
    if (isNaN(val)) return 0;
    if (from === to) return val;

    if (cat === 'temperature') {
      // Convert to Celsius first
      let cVal = val;
      if (from === 'f') cVal = (val - 32) * (5 / 9);
      else if (from === 'k') cVal = val - 273.15;
      else if (from === 'r') cVal = (val - 491.67) * (5 / 9);

      // Convert Celsius to Target
      if (to === 'c') return cVal;
      if (to === 'f') return cVal * (9 / 5) + 32;
      if (to === 'k') return cVal + 273.15;
      if (to === 'r') return (cVal + 273.15) * 1.8;
      return cVal;
    }

    // Standard ratio
    const fromDef = units.find(u => u.id === from);
    const toDef = units.find(u => u.id === to);
    if (!fromDef || !toDef) return 0;

    // value in base unit
    const inBase = val * fromDef.ratio;
    // target value
    return inBase / toDef.ratio;
  };

  const outputValue = convertValue(inputValue, fromUnitId, toUnitId, currentCategory);

  const formattedOutput = Number(outputValue.toFixed(precision)).toString();
  const copyVal = `${inputValue} ${fromUnit.symbol} = ${formattedOutput} ${toUnit.symbol}`;

  // Quick preset conversions for the active category
  const quickList = units.filter(u => u.id !== fromUnitId).map(u => ({
    unit: u,
    val: convertValue(inputValue, fromUnitId, u.id, currentCategory),
  }));

  return (
    <CalculatorWrapper
      meta={meta}
      onNavigateHome={onNavigateHome}
      onNavigateCategory={onNavigateCategory}
      onNavigateCalculator={onNavigateCalculator}
      onReset={handleReset}
      copyValue={copyVal}
      copyLabel="Conversion"
    >
      <div className="space-y-6">
        {/* Category Selector Tabs */}
        {meta.id === 'universal-converter' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 p-1.5 bg-neutral-100/70 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs">
            {(Object.keys(UNIT_SYSTEMS) as ConverterCategory[]).map(catKey => {
              const active = currentCategory === catKey;
              return (
                <button
                  key={catKey}
                  onClick={() => handleCategoryChange(catKey)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                    active
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {UNIT_SYSTEMS[catKey].name}
                </button>
              );
            })}
          </div>
        )}

        {/* Main Interactive Conversion Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
          {/* Source Input */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span className="font-medium">From</span>
              <span>{fromUnit.name}</span>
            </div>
            <div className="space-y-2">
              <input
                type="number"
                step="any"
                value={inputValue}
                onChange={e => setInputValue(parseFloat(e.target.value) || 0)}
                className="w-full text-2xl sm:text-3xl font-bold font-mono px-3.5 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-400 tabular-nums"
              />
              <select
                value={fromUnitId}
                onChange={e => setFromUnitId(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:outline-none"
              >
                {units.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="lg:col-span-2 flex justify-center py-2 lg:py-0">
            <button
              onClick={handleSwap}
              className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-transform active:scale-95 shadow-xs"
              title="Swap From and To units"
              aria-label="Swap units"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          {/* Target Output */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span className="font-medium">To (Result)</span>
              <span>{toUnit.name}</span>
            </div>
            <div className="space-y-2">
              <div className="w-full text-2xl sm:text-3xl font-bold font-mono px-3.5 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/70 dark:bg-neutral-850 text-neutral-900 dark:text-white overflow-x-auto tabular-nums">
                {formattedOutput}
              </div>
              <select
                value={toUnitId}
                onChange={e => setToUnitId(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:outline-none"
              >
                {units.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Precision & Equation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Exact Conversion:</span>
            <span className="font-mono font-semibold text-neutral-900 dark:text-white">
              1 {fromUnit.symbol} = {convertValue(1, fromUnitId, toUnitId, currentCategory).toFixed(precision)} {toUnit.symbol}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Decimals:</span>
            {[2, 4, 6, 8].map(p => (
              <button
                key={p}
                onClick={() => setPrecision(p)}
                className={`px-2 py-0.5 rounded font-mono text-[11px] ${
                  precision === p
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Comprehensive Multi-Unit Equivalent Table */}
        <div className="bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <h3 className="text-xs font-semibold text-neutral-900 dark:text-white mb-3">
            All Equivalent Units for {inputValue} {fromUnit.symbol}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {quickList.map(item => (
              <div
                key={item.unit.id}
                onClick={() => setToUnitId(item.unit.id)}
                className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 cursor-pointer transition-colors"
              >
                <div className="text-[11px] text-neutral-400 truncate">
                  {item.unit.name}
                </div>
                <div className="text-sm font-bold font-mono text-neutral-900 dark:text-white mt-0.5 tabular-nums truncate">
                  {Number(item.val.toFixed(precision)).toString()} {item.unit.symbol}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
};
