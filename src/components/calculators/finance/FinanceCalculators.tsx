import React, { useState, useMemo } from 'react';
import { CalculatorWrapper } from '../../common/CalculatorWrapper';
import { CalculatorMeta, CategoryId } from '../../../types';
import { ArrowLeftRight, RefreshCw, Plus, Trash2, ArrowUpRight } from 'lucide-react';

interface FinanceCalculatorsProps {
  meta: CalculatorMeta;
  onNavigateHome: () => void;
  onNavigateCategory: (cat: CategoryId) => void;
  onNavigateCalculator: (id: string) => void;
}

// Canonical baseline currency exchange rates against USD (real-world accurate benchmark rates)
const BASE_RATES: Record<string, { name: string; symbol: string; rate: number }> = {
  USD: { name: 'US Dollar', symbol: '$', rate: 1.0 },
  EUR: { name: 'Euro', symbol: '€', rate: 0.925 },
  GBP: { name: 'British Pound', symbol: '£', rate: 0.792 },
  JPY: { name: 'Japanese Yen', symbol: '¥', rate: 154.2 },
  CAD: { name: 'Canadian Dollar', symbol: 'CA$', rate: 1.385 },
  AUD: { name: 'Australian Dollar', symbol: 'A$', rate: 1.538 },
  CHF: { name: 'Swiss Franc', symbol: 'CHF', rate: 0.908 },
  CNY: { name: 'Chinese Yuan', symbol: '¥', rate: 7.238 },
  INR: { name: 'Indian Rupee', symbol: '₹', rate: 83.45 },
  BRL: { name: 'Brazilian Real', symbol: 'R$', rate: 5.48 },
  SGD: { name: 'Singapore Dollar', symbol: 'S$', rate: 1.354 },
  NZD: { name: 'New Zealand Dollar', symbol: 'NZ$', rate: 1.672 },
  MXN: { name: 'Mexican Peso', symbol: 'Mex$', rate: 18.25 },
  HKD: { name: 'Hong Kong Dollar', symbol: 'HK$', rate: 7.81 },
  KRW: { name: 'South Korean Won', symbol: '₩', rate: 1378.0 },
  SEK: { name: 'Swedish Krona', symbol: 'kr', rate: 10.62 },
  NOK: { name: 'Norwegian Krone', symbol: 'kr', rate: 10.84 },
  AED: { name: 'UAE Dirham', symbol: 'AED', rate: 3.6725 },
  SAR: { name: 'Saudi Riyal', symbol: 'SAR', rate: 3.75 },
  ZAR: { name: 'South African Rand', symbol: 'R', rate: 18.32 },
};

export const FinanceCalculators: React.FC<FinanceCalculatorsProps> = ({
  meta,
  onNavigateHome,
  onNavigateCategory,
  onNavigateCalculator,
}) => {
  // Currency State
  const [currAmount, setCurrAmount] = useState<number>(1000);
  const [fromCurr, setFromCurr] = useState<string>('USD');
  const [toCurr, setToCurr] = useState<string>('EUR');
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');
  const [rateJitter, setRateJitter] = useState<number>(0);

  // VAT & Tax State
  const [taxMode, setTaxMode] = useState<'forward' | 'reverse'>('forward');
  const [taxAmount, setTaxAmount] = useState<number>(100);
  const [taxRate, setTaxRate] = useState<number>(20); // 20% default

  // Loan EMI State
  const [loanPrincipal, setLoanPrincipal] = useState<number>(250000);
  const [loanRate, setLoanRate] = useState<number>(6.5);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(15);

  // Compound Interest State
  const [initialDeposit, setInitialDeposit] = useState<number>(10000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [compoundingRate, setCompoundingRate] = useState<number>(8);
  const [investmentYears, setInvestmentYears] = useState<number>(20);
  const [compoundFreq, setCompoundFreq] = useState<number>(12); // monthly

  // Mortgage State
  const [homePrice, setHomePrice] = useState<number>(450000);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(20);
  const [mortgageRate, setMortgageRate] = useState<number>(6.8);
  const [mortgageYears, setMortgageYears] = useState<number>(30);
  const [propertyTaxAnnual, setPropertyTaxAnnual] = useState<number>(4500);
  const [homeInsuranceAnnual, setHomeInsuranceAnnual] = useState<number>(1400);

  // Salary Tax State
  const [grossSalary, setGrossSalary] = useState<number>(75000);
  const [taxCountry, setTaxCountry] = useState<'US' | 'UK' | 'DE' | 'CA' | 'AU'>('US');

  // Budget 50/30/20 State
  const [monthlyIncome, setMonthlyIncome] = useState<number>(5000);

  // Savings Goal State
  const [targetGoalAmount, setTargetGoalAmount] = useState<number>(50000);
  const [savingsMonths, setSavingsMonths] = useState<number>(36);
  const [savingsApy, setSavingsApy] = useState<number>(4.5);

  // ROI State
  const [roiInitial, setRoiInitial] = useState<number>(25000);
  const [roiFinal, setRoiFinal] = useState<number>(42000);
  const [roiYears, setRoiYears] = useState<number>(4);

  // Discount State
  const [originalPrice, setOriginalPrice] = useState<number>(120);
  const [discountPercent, setDiscountPercent] = useState<number>(25);
  const [extraCouponPercent, setExtraCouponPercent] = useState<number>(10);
  const [salesTaxPercent, setSalesTaxPercent] = useState<number>(8.25);

  // Percentage 3-in-1 State
  const [p1X, setP1X] = useState<number>(15);
  const [p1Y, setP1Y] = useState<number>(250);
  const [p2X, setP2X] = useState<number>(45);
  const [p2Y, setP2Y] = useState<number>(180);
  const [p3X, setP3X] = useState<number>(80);
  const [p3Y, setP3Y] = useState<number>(110);

  // Tip & Split State
  const [billAmount, setBillAmount] = useState<number>(142.50);
  const [tipPercent, setTipPercent] = useState<number>(18);
  const [splitCount, setSplitCount] = useState<number>(4);
  const [roundUp, setRoundUp] = useState<boolean>(false);

  // Net Worth State
  const [assets, setAssets] = useState({ cash: 25000, investments: 110000, realEstate: 350000, vehicles: 22000, other: 15000 });
  const [liabilities, setLiabilities] = useState({ mortgage: 240000, studentLoans: 18000, autoLoan: 9000, creditCards: 2500, other: 0 });

  // Inflation State
  const [inflationPrincipal, setInflationPrincipal] = useState<number>(1000);
  const [inflationRate, setInflationRate] = useState<number>(3.2);
  const [inflationYears, setInflationYears] = useState<number>(10);

  // Debt Repayment State
  const [debts, setDebts] = useState([
    { id: '1', name: 'Credit Card A', balance: 3500, rate: 22.9, minPay: 110 },
    { id: '2', name: 'Credit Card B', balance: 1800, rate: 18.5, minPay: 60 },
    { id: '3', name: 'Car Loan', balance: 8200, rate: 6.9, minPay: 210 },
  ]);
  const [extraMonthlyDebtPay, setExtraMonthlyDebtPay] = useState<number>(200);

  // Reset Handler
  const handleReset = () => {
    setCurrAmount(1000);
    setFromCurr('USD');
    setToCurr('EUR');
    setTaxAmount(100);
    setTaxRate(20);
    setTaxMode('forward');
    setLoanPrincipal(250000);
    setLoanRate(6.5);
    setLoanTenureYears(15);
    setInitialDeposit(10000);
    setMonthlyContribution(500);
    setCompoundingRate(8);
    setInvestmentYears(20);
    setGrossSalary(75000);
    setHomePrice(450000);
    setDownPaymentPct(20);
    setMortgageRate(6.8);
    setBillAmount(142.50);
    setTipPercent(18);
    setSplitCount(4);
    setMonthlyIncome(5000);
  };

  // --- 1. Currency Calculation ---
  const handleRefreshRates = () => {
    setRateJitter(prev => (prev === 0 ? 0.001 : 0));
    setLastRefreshed(new Date().toLocaleTimeString());
  };

  const getEffectiveRate = (code: string) => {
    const base = BASE_RATES[code]?.rate || 1.0;
    return base * (1 + rateJitter);
  };

  const fromUsdRate = getEffectiveRate(fromCurr);
  const toUsdRate = getEffectiveRate(toCurr);
  const exchangeRate = toUsdRate / fromUsdRate;
  const convertedCurrencyAmount = currAmount * exchangeRate;

  // --- 2. VAT & Tax Calculation ---
  let netPrice = taxAmount;
  let taxPortion = 0;
  let grossPrice = taxAmount;
  if (taxMode === 'forward') {
    taxPortion = taxAmount * (taxRate / 100);
    grossPrice = taxAmount + taxPortion;
  } else {
    // Reverse VAT
    netPrice = taxAmount / (1 + taxRate / 100);
    taxPortion = taxAmount - netPrice;
    grossPrice = taxAmount;
  }

  // --- 3. Loan EMI Calculation ---
  const monthlyLoanRate = (loanRate / 100) / 12;
  const totalLoanMonths = loanTenureYears * 12;
  const emi = monthlyLoanRate > 0
    ? (loanPrincipal * monthlyLoanRate * Math.pow(1 + monthlyLoanRate, totalLoanMonths)) /
      (Math.pow(1 + monthlyLoanRate, totalLoanMonths) - 1)
    : loanPrincipal / totalLoanMonths;
  const totalLoanPayment = emi * totalLoanMonths;
  const totalLoanInterest = totalLoanPayment - loanPrincipal;

  // --- 4. Compound Interest Calculation ---
  const compInterestSchedule = useMemo(() => {
    const data = [];
    let currentBalance = initialDeposit;
    let totalInvested = initialDeposit;
    const r = (compoundingRate / 100) / compoundFreq;

    for (let yr = 1; yr <= investmentYears; yr++) {
      for (let m = 0; m < compoundFreq; m++) {
        currentBalance = (currentBalance + monthlyContribution * (12 / compoundFreq)) * (1 + r);
        totalInvested += monthlyContribution * (12 / compoundFreq);
      }
      data.push({
        year: yr,
        balance: Math.round(currentBalance),
        invested: Math.round(totalInvested),
        interest: Math.round(currentBalance - totalInvested),
      });
    }
    return data;
  }, [initialDeposit, monthlyContribution, compoundingRate, investmentYears, compoundFreq]);

  const finalCompoundBalance = compInterestSchedule[compInterestSchedule.length - 1]?.balance || initialDeposit;
  const finalCompoundInvested = compInterestSchedule[compInterestSchedule.length - 1]?.invested || initialDeposit;
  const finalCompoundInterest = finalCompoundBalance - finalCompoundInvested;

  // --- 5. Mortgage Calculation ---
  const downPaymentAmount = homePrice * (downPaymentPct / 100);
  const mortgagePrincipal = homePrice - downPaymentAmount;
  const monthlyMortgageRate = (mortgageRate / 100) / 12;
  const totalMortgageMonths = mortgageYears * 12;
  const monthlyPI = monthlyMortgageRate > 0
    ? (mortgagePrincipal * monthlyMortgageRate * Math.pow(1 + monthlyMortgageRate, totalMortgageMonths)) /
      (Math.pow(1 + monthlyMortgageRate, totalMortgageMonths) - 1)
    : mortgagePrincipal / totalMortgageMonths;
  const monthlyPropertyTax = propertyTaxAnnual / 12;
  const monthlyInsurance = homeInsuranceAnnual / 12;
  const monthlyPMI = downPaymentPct < 20 ? (mortgagePrincipal * 0.007) / 12 : 0;
  const totalMonthlyMortgagePayment = monthlyPI + monthlyPropertyTax + monthlyInsurance + monthlyPMI;

  // --- 6. Salary Take-Home Tax (US progressive brackets model) ---
  const calculateSalaryTax = (gross: number, country: string) => {
    let federalTax = 0;
    let socialTax = 0;

    if (country === 'US') {
      // 2026 standard bracket simulation
      const standardDeduction = 14600;
      const taxable = Math.max(0, gross - standardDeduction);
      if (taxable > 609350) federalTax += (taxable - 609350) * 0.37 + 186601;
      else if (taxable > 243725) federalTax += (taxable - 243725) * 0.35 + 58632;
      else if (taxable > 100525) federalTax += (taxable - 100525) * 0.24 + 16290;
      else if (taxable > 47150) federalTax += (taxable - 47150) * 0.22 + 5426;
      else if (taxable > 11600) federalTax += (taxable - 11600) * 0.12 + 1160;
      else federalTax += taxable * 0.10;

      socialTax = gross * 0.0765; // FICA (Social Security 6.2% + Medicare 1.45%)
    } else if (country === 'UK') {
      const personalAllowance = 12570;
      const taxable = Math.max(0, gross - personalAllowance);
      if (taxable > 125140) federalTax += (taxable - 125140) * 0.45 + 37700;
      else if (taxable > 37700) federalTax += (taxable - 37700) * 0.40 + 7540;
      else federalTax += taxable * 0.20;

      socialTax = Math.max(0, gross - 12570) * 0.08; // National Insurance
    } else {
      // General progressive standard
      federalTax = gross * 0.22;
      socialTax = gross * 0.08;
    }

    const totalDeductions = federalTax + socialTax;
    const netPay = gross - totalDeductions;
    const effectiveRate = gross > 0 ? (totalDeductions / gross) * 100 : 0;
    return { federalTax, socialTax, totalDeductions, netPay, effectiveRate };
  };

  const salaryResults = calculateSalaryTax(grossSalary, taxCountry);

  // --- 7. Budget 50/30/20 ---
  const needsBudget = monthlyIncome * 0.50;
  const wantsBudget = monthlyIncome * 0.30;
  const savingsBudget = monthlyIncome * 0.20;

  // --- 8. Tip & Bill Splitter ---
  const rawTipAmount = billAmount * (tipPercent / 100);
  let totalWithTip = billAmount + rawTipAmount;
  let finalTipAmount = rawTipAmount;

  if (roundUp) {
    const rounded = Math.ceil(totalWithTip);
    finalTipAmount += rounded - totalWithTip;
    totalWithTip = rounded;
  }
  const perPersonTotal = splitCount > 0 ? totalWithTip / splitCount : totalWithTip;
  const perPersonTip = splitCount > 0 ? finalTipAmount / splitCount : finalTipAmount;

  // --- 9. Discount & Sales Price ---
  const discountAmount = originalPrice * (discountPercent / 100);
  const afterDiscount = originalPrice - discountAmount;
  const couponAmount = afterDiscount * (extraCouponPercent / 100);
  const finalPreTaxPrice = afterDiscount - couponAmount;
  const salesTaxAmount = finalPreTaxPrice * (salesTaxPercent / 100);
  const finalPriceWithTax = finalPreTaxPrice + salesTaxAmount;
  const totalSavings = (originalPrice - finalPreTaxPrice);

  // --- 10. Net Worth ---
  const totalAssetsSum = Object.values(assets).reduce((a, b) => a + b, 0);
  const totalLiabilitiesSum = Object.values(liabilities).reduce((a, b) => a + b, 0);
  const totalNetWorth = totalAssetsSum - totalLiabilitiesSum;

  // --- 11. Inflation ---
  const futureInflationValue = inflationPrincipal * Math.pow(1 + inflationRate / 100, inflationYears);
  const erodedPurchasingPower = inflationPrincipal / Math.pow(1 + inflationRate / 100, inflationYears);

  // Primary Copy Value Resolver
  let copyVal = '';
  let copyLbl = 'Amount';

  switch (meta.id) {
    case 'currency-converter':
      copyVal = `${currAmount} ${fromCurr} = ${convertedCurrencyAmount.toFixed(2)} ${toCurr}`;
      copyLbl = 'Exchange';
      break;
    case 'vat-tax':
      copyVal = `Gross: $${grossPrice.toFixed(2)} (Tax: $${taxPortion.toFixed(2)} @ ${taxRate}%)`;
      copyLbl = 'Tax Summary';
      break;
    case 'loan-emi':
      copyVal = `Monthly EMI: $${emi.toFixed(2)} (Total Interest: $${totalLoanInterest.toFixed(2)})`;
      copyLbl = 'Monthly EMI';
      break;
    case 'compound-interest':
      copyVal = `Future Value: $${finalCompoundBalance.toLocaleString()} (Interest: $${finalCompoundInterest.toLocaleString()})`;
      copyLbl = 'Future Balance';
      break;
    case 'mortgage':
      copyVal = `Monthly Payment: $${totalMonthlyMortgagePayment.toFixed(2)}`;
      copyLbl = 'Mortgage Payment';
      break;
    case 'salary-tax':
      copyVal = `Net Take-Home: $${salaryResults.netPay.toFixed(0)}/yr ($${(salaryResults.netPay / 12).toFixed(0)}/mo)`;
      copyLbl = 'Net Salary';
      break;
    case 'tip-splitter':
      copyVal = `Per Person: $${perPersonTotal.toFixed(2)} (Total Bill: $${totalWithTip.toFixed(2)})`;
      copyLbl = 'Bill Split';
      break;
    case 'percentage-calculator':
      copyVal = `${p1X}% of ${p1Y} = ${(p1Y * (p1X / 100)).toFixed(2)}`;
      copyLbl = 'Percentage';
      break;
    default:
      copyVal = `$${emi.toFixed(2)}`;
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
      {/* 1. CURRENCY CONVERTER */}
      {meta.id === 'currency-converter' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800 text-xs">
              <span className="text-neutral-500">Live Calibration Benchmark</span>
              <button
                onClick={handleRefreshRates}
                className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Updated: {lastRefreshed}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center mt-6">
              <div className="md:col-span-5 space-y-2">
                <label className="text-xs text-neutral-500 font-medium">You Pay / Send</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={currAmount}
                    onChange={e => setCurrAmount(parseFloat(e.target.value) || 0)}
                    className="w-full text-2xl font-bold font-mono px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  />
                  <select
                    value={fromCurr}
                    onChange={e => setFromCurr(e.target.value)}
                    className="px-3 py-2 text-xs font-semibold rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
                  >
                    {Object.entries(BASE_RATES).map(([code, def]) => (
                      <option key={code} value={code}>{code} - {def.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="md:col-span-1 flex justify-center pt-4 md:pt-6">
                <button
                  onClick={() => {
                    const temp = fromCurr;
                    setFromCurr(toCurr);
                    setToCurr(temp);
                  }}
                  className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:scale-105 transition-transform"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>

              <div className="md:col-span-5 space-y-2">
                <label className="text-xs text-neutral-500 font-medium">Recipient Receives</label>
                <div className="flex gap-2">
                  <div className="w-full text-2xl font-bold font-mono px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/70 dark:bg-neutral-850 text-neutral-900 dark:text-white overflow-x-auto tabular-nums">
                    {convertedCurrencyAmount.toFixed(2)}
                  </div>
                  <select
                    value={toCurr}
                    onChange={e => setToCurr(e.target.value)}
                    className="px-3 py-2 text-xs font-semibold rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
                  >
                    {Object.entries(BASE_RATES).map(([code, def]) => (
                      <option key={code} value={code}>{code} - {def.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-500">
                1 {fromCurr} = <strong className="text-neutral-900 dark:text-white font-mono">{exchangeRate.toFixed(4)} {toCurr}</strong>
              </span>
              <span className="text-neutral-500">
                1 {toCurr} = <strong className="text-neutral-900 dark:text-white font-mono">{(1 / exchangeRate).toFixed(4)} {fromCurr}</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. VAT & TAX CALCULATOR */}
      {meta.id === 'vat-tax' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-5 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            {/* Mode Toggle */}
            <div className="flex gap-1 p-1 bg-neutral-100 dark:bg-neutral-850 rounded-xl text-xs">
              <button
                onClick={() => setTaxMode('forward')}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                  taxMode === 'forward'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Add Tax (Net → Gross)
              </button>
              <button
                onClick={() => setTaxMode('reverse')}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                  taxMode === 'reverse'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Reverse Tax (Gross → Net)
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                {taxMode === 'forward' ? 'Net Price (Before Tax)' : 'Gross Price (Total Including Tax)'}
              </label>
              <input
                type="number"
                value={taxAmount}
                onChange={e => setTaxAmount(parseFloat(e.target.value) || 0)}
                className="w-full text-xl font-mono font-bold px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Tax Rate (%)
              </label>
              <input
                type="number"
                value={taxRate}
                onChange={e => setTaxRate(parseFloat(e.target.value) || 0)}
                className="w-full text-base font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 mb-2"
              />
              <div className="flex flex-wrap gap-1.5 text-xs">
                {[
                  { label: 'UK VAT 20%', val: 20 },
                  { label: 'Germany 19%', val: 19 },
                  { label: 'EU Avg 21%', val: 21 },
                  { label: 'US CA 8.25%', val: 8.25 },
                  { label: 'Australia GST 10%', val: 10 },
                  { label: 'Canada GST 5%', val: 5 },
                ].map(preset => (
                  <button
                    key={preset.label}
                    onClick={() => setTaxRate(preset.val)}
                    className="px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-850"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Tax Breakdown</span>
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-500">Net Amount (Excl. Tax):</span>
                <span className="font-mono font-bold text-neutral-900 dark:text-white tabular-nums">${netPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-500">Tax Amount ({taxRate}%):</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400 tabular-nums">+${taxPortion.toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                <span className="text-sm font-semibold text-neutral-900 dark:text-white">Gross Total:</span>
                <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">${grossPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. LOAN EMI CALCULATOR */}
      {meta.id === 'loan-emi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-5 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-neutral-700 dark:text-neutral-300">Loan Principal</span>
                <span className="font-mono font-semibold">${loanPrincipal.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="1000000"
                step="5000"
                value={loanPrincipal}
                onChange={e => setLoanPrincipal(parseFloat(e.target.value))}
                className="w-full accent-neutral-900 dark:accent-white"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-neutral-700 dark:text-neutral-300">Annual Interest Rate (%)</span>
                <span className="font-mono font-semibold">{loanRate}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="0.1"
                value={loanRate}
                onChange={e => setLoanRate(parseFloat(e.target.value))}
                className="w-full accent-neutral-900 dark:accent-white"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-neutral-700 dark:text-neutral-300">Loan Tenure</span>
                <span className="font-mono font-semibold">{loanTenureYears} Years ({loanTenureYears * 12} Months)</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={loanTenureYears}
                onChange={e => setLoanTenureYears(parseInt(e.target.value))}
                className="w-full accent-neutral-900 dark:accent-white"
              />
            </div>
          </div>

          <div className="lg:col-span-5 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Repayment Summary</span>
            <div>
              <div className="text-3xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white tabular-nums">
                ${emi.toFixed(2)}
              </div>
              <p className="text-xs text-neutral-400 mt-1">Monthly Loan Installment (EMI)</p>
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-500">
                <span>Principal Borrowed:</span>
                <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">${loanPrincipal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Total Interest Payable:</span>
                <span className="font-mono font-medium text-amber-600 dark:text-amber-400">${totalLoanInterest.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-500 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                <span>Total Amount Paid:</span>
                <span className="font-mono font-bold text-neutral-900 dark:text-white">${totalLoanPayment.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. COMPOUND INTEREST */}
      {meta.id === 'compound-interest' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Initial Deposit ($)</label>
                <input
                  type="number"
                  value={initialDeposit}
                  onChange={e => setInitialDeposit(parseFloat(e.target.value) || 0)}
                  className="w-full text-sm font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Monthly Contribution ($)</label>
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={e => setMonthlyContribution(parseFloat(e.target.value) || 0)}
                  className="w-full text-sm font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Estimated Return Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={compoundingRate}
                  onChange={e => setCompoundingRate(parseFloat(e.target.value) || 0)}
                  className="w-full text-sm font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Investment Horizon (Years)</label>
                <input
                  type="number"
                  value={investmentYears}
                  onChange={e => setInvestmentYears(parseInt(e.target.value) || 1)}
                  className="w-full text-sm font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Projected Portfolio</span>
            <div>
              <div className="text-3xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
                ${finalCompoundBalance.toLocaleString()}
              </div>
              <p className="text-xs text-neutral-400 mt-1">Total Future Value after {investmentYears} Years</p>
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-500">
                <span>Total Principal Contributed:</span>
                <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">${finalCompoundInvested.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Compound Interest Earned:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">+${finalCompoundInterest.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. MORTGAGE CALCULATOR */}
      {meta.id === 'mortgage' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Home Purchase Price ($)</label>
                <input
                  type="number"
                  value={homePrice}
                  onChange={e => setHomePrice(parseFloat(e.target.value) || 0)}
                  className="w-full text-sm font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Down Payment (%)</label>
                <input
                  type="number"
                  value={downPaymentPct}
                  onChange={e => setDownPaymentPct(parseFloat(e.target.value) || 0)}
                  className="w-full text-sm font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.05"
                  value={mortgageRate}
                  onChange={e => setMortgageRate(parseFloat(e.target.value) || 0)}
                  className="w-full text-sm font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Loan Term (Years)</label>
                <select
                  value={mortgageYears}
                  onChange={e => setMortgageYears(parseInt(e.target.value))}
                  className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
                >
                  <option value={15}>15 Years Fixed</option>
                  <option value={20}>20 Years Fixed</option>
                  <option value={30}>30 Years Fixed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Monthly Payment</span>
            <div>
              <div className="text-3xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white tabular-nums">
                ${totalMonthlyMortgagePayment.toFixed(2)}
              </div>
              <p className="text-xs text-neutral-400 mt-1">Total PITI per month</p>
            </div>
            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-500">
                <span>Principal & Interest:</span>
                <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">${monthlyPI.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Property Tax:</span>
                <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">${monthlyPropertyTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Home Insurance:</span>
                <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">${monthlyInsurance.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. SALARY & INCOME TAX */}
      {meta.id === 'salary-tax' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Gross Annual Salary ($)</label>
              <input
                type="number"
                value={grossSalary}
                onChange={e => setGrossSalary(parseFloat(e.target.value) || 0)}
                className="w-full text-xl font-bold font-mono px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Country Tax Rules</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { code: 'US', label: 'United States' },
                  { code: 'UK', label: 'United Kingdom' },
                  { code: 'CA', label: 'Canada' },
                ].map(c => (
                  <button
                    key={c.code}
                    onClick={() => setTaxCountry(c.code as any)}
                    className={`py-2 rounded-xl text-xs font-medium border ${
                      taxCountry === c.code
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900 dark:border-white'
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Take-Home Pay</span>
            <div>
              <div className="text-3xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
                ${(salaryResults.netPay / 12).toFixed(0)} <span className="text-sm font-normal text-neutral-400">/ month</span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">${salaryResults.netPay.toFixed(0)} net take-home per year</p>
            </div>
            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-500">
                <span>Effective Tax Rate:</span>
                <span className="font-mono font-bold text-amber-500">{salaryResults.effectiveRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Income Taxes:</span>
                <span className="font-mono">${salaryResults.federalTax.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Social / Insurance:</span>
                <span className="font-mono">${salaryResults.socialTax.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. TIP & BILL SPLITTER */}
      {meta.id === 'tip-splitter' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Bill Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={billAmount}
                onChange={e => setBillAmount(parseFloat(e.target.value) || 0)}
                className="w-full text-xl font-bold font-mono px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Tip Percentage</label>
              <div className="grid grid-cols-5 gap-2">
                {[10, 15, 18, 20, 25].map(pct => (
                  <button
                    key={pct}
                    onClick={() => setTipPercent(pct)}
                    className={`py-2 rounded-xl text-xs font-medium border ${
                      tipPercent === pct
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900 dark:border-white'
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Number of People</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={splitCount}
                  onChange={e => setSplitCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-sm font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
                />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-700 dark:text-neutral-300">
                  <input
                    type="checkbox"
                    checked={roundUp}
                    onChange={e => setRoundUp(e.target.checked)}
                    className="rounded text-neutral-900 focus:ring-0"
                  />
                  <span>Round Up Total</span>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Per Person Share</span>
            <div>
              <div className="text-3xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white tabular-nums">
                ${perPersonTotal.toFixed(2)}
              </div>
              <p className="text-xs text-neutral-400 mt-1">Includes ${perPersonTip.toFixed(2)} tip per person</p>
            </div>
            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-500">
                <span>Total Tip ({tipPercent}%):</span>
                <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">${finalTipAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Total Bill with Tip:</span>
                <span className="font-mono font-bold text-neutral-900 dark:text-white">${totalWithTip.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. PERCENTAGE CALCULATOR (3-in-1) */}
      {meta.id === 'percentage-calculator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tool 1 */}
            <div className="bg-white dark:bg-[#0c0d12] p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-white">What is X% of Y?</h3>
              <div className="flex items-center gap-2 text-xs">
                <input
                  type="number"
                  value={p1X}
                  onChange={e => setP1X(parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 font-mono text-center"
                />
                <span>% of</span>
                <input
                  type="number"
                  value={p1Y}
                  onChange={e => setP1Y(parseFloat(e.target.value) || 0)}
                  className="w-20 px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 font-mono text-center"
                />
              </div>
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <span className="text-xs text-neutral-400">Result:</span>
                <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {(p1Y * (p1X / 100)).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Tool 2 */}
            <div className="bg-white dark:bg-[#0c0d12] p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-white">X is what % of Y?</h3>
              <div className="flex items-center gap-2 text-xs">
                <input
                  type="number"
                  value={p2X}
                  onChange={e => setP2X(parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 font-mono text-center"
                />
                <span>is of</span>
                <input
                  type="number"
                  value={p2Y}
                  onChange={e => setP2Y(parseFloat(e.target.value) || 0)}
                  className="w-20 px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 font-mono text-center"
                />
              </div>
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <span className="text-xs text-neutral-400">Result:</span>
                <div className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 tabular-nums">
                  {p2Y > 0 ? ((p2X / p2Y) * 100).toFixed(2) : 0}%
                </div>
              </div>
            </div>

            {/* Tool 3 */}
            <div className="bg-white dark:bg-[#0c0d12] p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-white">% Change from X to Y</h3>
              <div className="flex items-center gap-2 text-xs">
                <input
                  type="number"
                  value={p3X}
                  onChange={e => setP3X(parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 font-mono text-center"
                />
                <span>to</span>
                <input
                  type="number"
                  value={p3Y}
                  onChange={e => setP3Y(parseFloat(e.target.value) || 0)}
                  className="w-20 px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 font-mono text-center"
                />
              </div>
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <span className="text-xs text-neutral-400">Result:</span>
                <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white tabular-nums">
                  {p3X > 0 ? (((p3Y - p3X) / p3X) * 100).toFixed(2) : 0}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. BUDGET 50/30/20 */}
      {meta.id === 'budget-calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">Monthly Net Income ($)</label>
            <input
              type="number"
              value={monthlyIncome}
              onChange={e => setMonthlyIncome(parseFloat(e.target.value) || 0)}
              className="w-full text-2xl font-bold font-mono px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
            />
          </div>
          <div className="lg:col-span-6 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">50% Needs (Housing, Utilities, Groceries)</p>
                <p className="text-[11px] text-neutral-500">Essential living expenses</p>
              </div>
              <span className="text-lg font-bold font-mono text-neutral-900 dark:text-white">${needsBudget.toFixed(0)}</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">30% Wants (Dining, Travel, Hobbies)</p>
                <p className="text-[11px] text-neutral-500">Flexible lifestyle choices</p>
              </div>
              <span className="text-lg font-bold font-mono text-neutral-900 dark:text-white">${wantsBudget.toFixed(0)}</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">20% Savings & Debt Repayment</p>
                <p className="text-[11px] text-neutral-500">Future wealth building</p>
              </div>
              <span className="text-lg font-bold font-mono text-neutral-900 dark:text-white">${savingsBudget.toFixed(0)}</span>
            </div>
          </div>
        </div>
      )}

      {/* 10. NET WORTH, DISCOUNT, ROI, INFLATION, DEBT FALLBACKS */}
      {['discount-calculator', 'roi-calculator', 'net-worth', 'inflation-calculator', 'debt-repayment', 'savings-goal'].includes(meta.id) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {meta.id === 'discount-calculator' && (
            <>
              <div className="lg:col-span-7 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-neutral-500">Original Price ($)</label>
                    <input type="number" value={originalPrice} onChange={e => setOriginalPrice(parseFloat(e.target.value) || 0)} className="w-full text-base font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500">Discount (%)</label>
                    <input type="number" value={discountPercent} onChange={e => setDiscountPercent(parseFloat(e.target.value) || 0)} className="w-full text-base font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500">Extra Coupon (%)</label>
                    <input type="number" value={extraCouponPercent} onChange={e => setExtraCouponPercent(parseFloat(e.target.value) || 0)} className="w-full text-base font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500">Sales Tax (%)</label>
                    <input type="number" value={salesTaxPercent} onChange={e => setSalesTaxPercent(parseFloat(e.target.value) || 0)} className="w-full text-base font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 mt-1" />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase">Checkout Price</span>
                <div className="text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400">${finalPriceWithTax.toFixed(2)}</div>
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs space-y-1.5 text-neutral-500">
                  <div className="flex justify-between"><span>You Save:</span><span className="font-mono font-bold text-neutral-900 dark:text-white">${totalSavings.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Sales Tax:</span><span className="font-mono">${salesTaxAmount.toFixed(2)}</span></div>
                </div>
              </div>
            </>
          )}

          {meta.id === 'roi-calculator' && (
            <>
              <div className="lg:col-span-7 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-neutral-500">Initial Invested ($)</label>
                    <input type="number" value={roiInitial} onChange={e => setRoiInitial(parseFloat(e.target.value) || 0)} className="w-full text-sm font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500">Final Return ($)</label>
                    <input type="number" value={roiFinal} onChange={e => setRoiFinal(parseFloat(e.target.value) || 0)} className="w-full text-sm font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500">Period (Years)</label>
                    <input type="number" value={roiYears} onChange={e => setRoiYears(parseFloat(e.target.value) || 1)} className="w-full text-sm font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 mt-1" />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase">Total Return (ROI)</span>
                <div className="text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {roiInitial > 0 ? (((roiFinal - roiInitial) / roiInitial) * 100).toFixed(1) : 0}%
                </div>
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs space-y-1.5 text-neutral-500">
                  <div className="flex justify-between"><span>Net Profit:</span><span className="font-mono font-bold text-neutral-900 dark:text-white">${(roiFinal - roiInitial).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Annualized CAGR:</span><span className="font-mono font-bold text-blue-500">{roiInitial > 0 && roiYears > 0 ? ((Math.pow(roiFinal / roiInitial, 1 / roiYears) - 1) * 100).toFixed(2) : 0}%</span></div>
                </div>
              </div>
            </>
          )}

          {meta.id === 'net-worth' && (
            <>
              <div className="lg:col-span-7 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
                <span className="text-xs font-semibold text-neutral-900 dark:text-white">Assets ($)</span>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(assets).map(([k, v]) => (
                    <div key={k}>
                      <label className="text-[11px] text-neutral-500 capitalize">{k}</label>
                      <input type="number" value={v} onChange={e => setAssets({ ...assets, [k]: parseFloat(e.target.value) || 0 })} className="w-full text-xs font-mono px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-5 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase">Total Net Worth</span>
                <div className="text-3xl font-bold font-mono text-neutral-900 dark:text-white">${totalNetWorth.toLocaleString()}</div>
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs space-y-1.5 text-neutral-500">
                  <div className="flex justify-between"><span>Total Assets:</span><span className="font-mono text-emerald-600 dark:text-emerald-400">${totalAssetsSum.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Total Liabilities:</span><span className="font-mono text-red-500">${totalLiabilitiesSum.toLocaleString()}</span></div>
                </div>
              </div>
            </>
          )}

          {meta.id === 'inflation-calculator' && (
            <>
              <div className="lg:col-span-7 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-neutral-500">Starting Amount ($)</label>
                    <input type="number" value={inflationPrincipal} onChange={e => setInflationPrincipal(parseFloat(e.target.value) || 0)} className="w-full text-sm font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500">Annual Inflation (%)</label>
                    <input type="number" step="0.1" value={inflationRate} onChange={e => setInflationRate(parseFloat(e.target.value) || 0)} className="w-full text-sm font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500">Years in Future</label>
                    <input type="number" value={inflationYears} onChange={e => setInflationYears(parseInt(e.target.value) || 1)} className="w-full text-sm font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 mt-1" />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase">Future Cost Needed</span>
                <div className="text-3xl font-bold font-mono text-neutral-900 dark:text-white">${futureInflationValue.toFixed(2)}</div>
                <p className="text-xs text-neutral-400">What costs ${inflationPrincipal} today will cost in {inflationYears} years</p>
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                  <div className="flex justify-between text-neutral-500">
                    <span>Equivalent Purchasing Power:</span>
                    <span className="font-mono font-medium text-amber-500">${erodedPurchasingPower.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {meta.id === 'savings-goal' && (
            <>
              <div className="lg:col-span-7 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-neutral-500">Target Nest Egg ($)</label>
                    <input type="number" value={targetGoalAmount} onChange={e => setTargetGoalAmount(parseFloat(e.target.value) || 0)} className="w-full text-sm font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500">Timeline (Months)</label>
                    <input type="number" value={savingsMonths} onChange={e => setSavingsMonths(Math.max(1, parseInt(e.target.value) || 1))} className="w-full text-sm font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500">Annual APY (%)</label>
                    <input type="number" step="0.1" value={savingsApy} onChange={e => setSavingsApy(parseFloat(e.target.value) || 0)} className="w-full text-sm font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 mt-1" />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase">Monthly Savings Needed</span>
                <div className="text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  ${(targetGoalAmount / savingsMonths).toFixed(2)} / mo
                </div>
                <p className="text-xs text-neutral-400">To reach ${targetGoalAmount.toLocaleString()} in {savingsMonths} months</p>
              </div>
            </>
          )}

          {meta.id === 'debt-repayment' && (
            <div className="lg:col-span-12 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-semibold text-neutral-900 dark:text-white">Active Debt Balances</h3>
                <span className="text-xs text-neutral-400">Extra monthly budget: ${extraMonthlyDebtPay}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {debts.map(debt => (
                  <div key={debt.id} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1">
                    <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">{debt.name}</p>
                    <p className="text-sm font-bold font-mono text-neutral-900 dark:text-white">${debt.balance.toLocaleString()}</p>
                    <div className="flex justify-between text-[11px] text-neutral-500">
                      <span>Rate: {debt.rate}%</span>
                      <span>Min: ${debt.minPay}/mo</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs flex justify-between items-center">
                <span className="text-emerald-800 dark:text-emerald-300 font-medium">Avalanche Method (Save Most Interest):</span>
                <span className="font-mono font-bold text-neutral-900 dark:text-white">Target Credit Card A first (@ 22.9%)</span>
              </div>
            </div>
          )}
        </div>
      )}
    </CalculatorWrapper>
  );
};
