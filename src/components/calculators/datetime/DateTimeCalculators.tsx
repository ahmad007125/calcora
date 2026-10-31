import React, { useState, useEffect } from 'react';
import { CalculatorWrapper } from '../../common/CalculatorWrapper';
import { CalculatorMeta, CategoryId } from '../../../types';
import { Clock, Calendar, Globe, Sparkles } from 'lucide-react';

interface DateTimeCalculatorsProps {
  meta: CalculatorMeta;
  onNavigateHome: () => void;
  onNavigateCategory: (cat: CategoryId) => void;
  onNavigateCalculator: (id: string) => void;
}

const WORLD_CITIES = [
  { city: 'New York (EDT/EST)', tz: 'America/New_York', offset: -4 },
  { city: 'London (BST/GMT)', tz: 'Europe/London', offset: 1 },
  { city: 'Berlin / Paris (CEST)', tz: 'Europe/Berlin', offset: 2 },
  { city: 'Dubai (GST)', tz: 'Asia/Dubai', offset: 4 },
  { city: 'Mumbai (IST)', tz: 'Asia/Kolkata', offset: 5.5 },
  { city: 'Singapore (SGT)', tz: 'Asia/Singapore', offset: 8 },
  { city: 'Tokyo (JST)', tz: 'Asia/Tokyo', offset: 9 },
  { city: 'Sydney (AEST)', tz: 'Australia/Sydney', offset: 10 },
  { city: 'San Francisco (PDT/PST)', tz: 'America/Los_Angeles', offset: -7 },
];

export const DateTimeCalculators: React.FC<DateTimeCalculatorsProps> = ({
  meta,
  onNavigateHome,
  onNavigateCategory,
  onNavigateCalculator,
}) => {
  // Age State
  const [birthDate, setBirthDate] = useState<string>('1998-05-15');

  // Date Diff State
  const [dateStart, setDateStart] = useState<string>('2026-01-01');
  const [dateEnd, setDateEnd] = useState<string>('2026-12-31');

  // Working Days State
  const [workStart, setWorkStart] = useState<string>('2026-01-01');
  const [workEnd, setWorkEnd] = useState<string>('2026-03-31');
  const [customHolidaysCount, setCustomHolidaysCount] = useState<number>(2);

  // Time Duration State
  const [timeStart, setTimeStart] = useState<string>('09:00');
  const [timeEnd, setTimeEnd] = useState<string>('17:30');

  // Countdown State
  const [countdownTarget, setCountdownTarget] = useState<string>('2027-01-01T00:00');
  const [countdownTitle, setCountdownTitle] = useState<string>('New Year Celebration');
  const [nowDate, setNowDate] = useState<Date>(new Date());

  // Timezone State
  const [selectedHour, setSelectedHour] = useState<number>(14); // 2:00 PM UTC

  // Add/Subtract Days State
  const [baseDate, setBaseDate] = useState<string>('2026-10-30');
  const [daysDelta, setDaysDelta] = useState<number>(45);
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');

  // Live timer tick for countdown
  useEffect(() => {
    const timer = setInterval(() => setNowDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleReset = () => {
    setBirthDate('1998-05-15');
    setDateStart('2026-01-01');
    setDateEnd('2026-12-31');
    setWorkStart('2026-01-01');
    setWorkEnd('2026-03-31');
    setTimeStart('09:00');
    setTimeEnd('17:30');
    setCountdownTarget('2027-01-01T00:00');
    setSelectedHour(14);
    setBaseDate('2026-10-30');
    setDaysDelta(45);
    setOperation('add');
  };

  // 1. Age Calculation
  const bDate = new Date(birthDate);
  const today = nowDate;
  let ageYears = today.getFullYear() - bDate.getFullYear();
  let ageMonths = today.getMonth() - bDate.getMonth();
  let ageDays = today.getDate() - bDate.getDate();

  if (ageDays < 0) {
    ageMonths -= 1;
    const prevMonthDays = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    ageDays += prevMonthDays;
  }
  if (ageMonths < 0) {
    ageYears -= 1;
    ageMonths += 12;
  }

  const totalDaysLived = Math.max(0, Math.floor((today.getTime() - bDate.getTime()) / (1000 * 60 * 60 * 24)));
  const totalHoursLived = totalDaysLived * 24;

  // Next birthday calculation
  let nextBirthday = new Date(today.getFullYear(), bDate.getMonth(), bDate.getDate());
  if (nextBirthday < today) {
    nextBirthday = new Date(today.getFullYear() + 1, bDate.getMonth(), bDate.getDate());
  }
  const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // 2. Date Difference / Days Between
  const d1 = new Date(dateStart);
  const d2 = new Date(dateEnd);
  const totalDifferenceDays = Math.abs(Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
  const diffWeeks = Math.floor(totalDifferenceDays / 7);
  const diffRemainderDays = totalDifferenceDays % 7;

  // 3. Working Days Calculation
  const calculateWorkingDays = (start: Date, end: Date, holidays: number) => {
    let count = 0;
    const cur = new Date(start);
    while (cur <= end) {
      const day = cur.getDay();
      if (day !== 0 && day !== 6) { // Not Sunday or Saturday
        count++;
      }
      cur.setDate(cur.getDate() + 1);
    }
    return Math.max(0, count - holidays);
  };
  const netWorkingDays = calculateWorkingDays(new Date(workStart), new Date(workEnd), customHolidaysCount);

  // 4. Time Duration
  const [startH, startM] = timeStart.split(':').map(Number);
  const [endH, endM] = timeEnd.split(':').map(Number);
  let durM = (endH * 60 + endM) - (startH * 60 + startM);
  if (durM < 0) durM += 24 * 60; // crossed midnight
  const durationHours = Math.floor(durM / 60);
  const durationRemainingMinutes = durM % 60;
  const decimalHours = (durM / 60).toFixed(2);

  // 5. Countdown
  const targetDateObj = new Date(countdownTarget);
  const countdownRemainingMs = Math.max(0, targetDateObj.getTime() - nowDate.getTime());
  const cdDays = Math.floor(countdownRemainingMs / (1000 * 60 * 60 * 24));
  const cdHours = Math.floor((countdownRemainingMs / (1000 * 60 * 60)) % 24);
  const cdMinutes = Math.floor((countdownRemainingMs / (1000 * 60)) % 60);
  const cdSeconds = Math.floor((countdownRemainingMs / 1000) % 60);

  // 6. Add/Subtract Days
  const baseDateObj = new Date(baseDate);
  const finalCalculatedDate = new Date(baseDateObj);
  if (operation === 'add') {
    finalCalculatedDate.setDate(finalCalculatedDate.getDate() + daysDelta);
  } else {
    finalCalculatedDate.setDate(finalCalculatedDate.getDate() - daysDelta);
  }

  // Primary Copy Value Resolver
  let copyVal = '';
  let copyLbl = 'Date Result';

  switch (meta.id) {
    case 'age-calculator':
      copyVal = `Age: ${ageYears} years, ${ageMonths} months, ${ageDays} days (${totalDaysLived.toLocaleString()} total days)`;
      copyLbl = 'Age';
      break;
    case 'date-difference':
    case 'days-between-dates':
      copyVal = `Difference: ${totalDifferenceDays} days (${diffWeeks} weeks, ${diffRemainderDays} days)`;
      copyLbl = 'Days';
      break;
    case 'working-days':
      copyVal = `Working Days: ${netWorkingDays} days (excluding weekends & holidays)`;
      copyLbl = 'Business Days';
      break;
    case 'time-duration':
      copyVal = `Duration: ${durationHours} hours, ${durationRemainingMinutes} minutes (${decimalHours} hrs)`;
      copyLbl = 'Duration';
      break;
    case 'countdown-timer':
      copyVal = `${cdDays}d ${cdHours}h ${cdMinutes}m ${cdSeconds}s until ${countdownTitle}`;
      copyLbl = 'Countdown';
      break;
    case 'add-subtract-days':
      copyVal = `Date: ${finalCalculatedDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
      copyLbl = 'Date';
      break;
    default:
      copyVal = `${totalDifferenceDays} days`;
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
      {/* 1. AGE CALCULATOR */}
      {meta.id === 'age-calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Select Date of Birth
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              className="w-full text-base font-mono px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
            />
            <p className="text-xs text-neutral-500">
              Born on a <strong className="text-neutral-800 dark:text-neutral-200">{bDate.toLocaleDateString(undefined, { weekday: 'long' })}</strong>
            </p>
          </div>

          <div className="lg:col-span-6 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Exact Chronological Age</span>
            <div>
              <div className="text-3xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white tabular-nums">
                {ageYears} <span className="text-sm font-normal text-neutral-400">years</span> {ageMonths} <span className="text-sm font-normal text-neutral-400">months</span> {ageDays} <span className="text-sm font-normal text-neutral-400">days</span>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 block">Total Days Lived</span>
                <span className="text-base font-mono font-bold text-neutral-900 dark:text-white">{totalDaysLived.toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 block">Next Birthday</span>
                <span className="text-base font-mono font-bold text-emerald-600 dark:text-emerald-400">in {daysUntilBirthday} days</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. DATE DIFFERENCE & DAYS BETWEEN */}
      {(meta.id === 'date-difference' || meta.id === 'days-between-dates') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Start Date</label>
                <input
                  type="date"
                  value={dateStart}
                  onChange={e => setDateStart(e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">End Date</label>
                <input
                  type="date"
                  value={dateEnd}
                  onChange={e => setDateEnd(e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase">Elapsed Difference</span>
            <div className="text-4xl font-bold font-mono text-neutral-900 dark:text-white tabular-nums">
              {totalDifferenceDays} <span className="text-base font-normal text-neutral-400">Days</span>
            </div>
            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500 space-y-1">
              <p>Equivalent to: <strong className="font-mono text-neutral-900 dark:text-white">{diffWeeks} weeks, {diffRemainderDays} days</strong></p>
              <p>Total Hours: <strong className="font-mono text-neutral-900 dark:text-white">{(totalDifferenceDays * 24).toLocaleString()} hours</strong></p>
            </div>
          </div>
        </div>
      )}

      {/* 3. WORKING DAYS */}
      {meta.id === 'working-days' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-neutral-500 block mb-1">Start Date</label>
                <input type="date" value={workStart} onChange={e => setWorkStart(e.target.value)} className="w-full font-mono text-xs px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900" />
              </div>
              <div>
                <label className="text-xs text-neutral-500 block mb-1">End Date</label>
                <input type="date" value={workEnd} onChange={e => setWorkEnd(e.target.value)} className="w-full font-mono text-xs px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900" />
              </div>
            </div>
            <div>
              <label className="text-xs text-neutral-500 block mb-1">Public Holidays in Range</label>
              <input type="number" min="0" value={customHolidaysCount} onChange={e => setCustomHolidaysCount(parseInt(e.target.value) || 0)} className="w-24 font-mono text-xs px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900" />
            </div>
          </div>
          <div className="lg:col-span-5 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase">Net Working Days</span>
            <div className="text-4xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
              {netWorkingDays} <span className="text-base font-normal text-neutral-400">Days</span>
            </div>
            <p className="text-xs text-neutral-500">Excludes weekend Saturdays & Sundays and {customHolidaysCount} public holidays.</p>
          </div>
        </div>
      )}

      {/* 4. TIME DURATION */}
      {meta.id === 'time-duration' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-neutral-500 block mb-1">Start Time</label>
                <input type="time" value={timeStart} onChange={e => setTimeStart(e.target.value)} className="w-full font-mono text-base px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900" />
              </div>
              <div>
                <label className="text-xs text-neutral-500 block mb-1">End Time</label>
                <input type="time" value={timeEnd} onChange={e => setTimeEnd(e.target.value)} className="w-full font-mono text-base px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900" />
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase">Duration</span>
            <div className="text-3xl font-bold font-mono text-neutral-900 dark:text-white">
              {durationHours}h {durationRemainingMinutes}m
            </div>
            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500">
              Decimal hours: <strong className="font-mono text-neutral-900 dark:text-white">{decimalHours} hrs</strong>
            </div>
          </div>
        </div>
      )}

      {/* 5. COUNTDOWN */}
      {meta.id === 'countdown-timer' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-neutral-500 block mb-1">Event Name</label>
                <input type="text" value={countdownTitle} onChange={e => setCountdownTitle(e.target.value)} className="w-full text-xs px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900" />
              </div>
              <div>
                <label className="text-xs text-neutral-500 block mb-1">Target Date & Time</label>
                <input type="datetime-local" value={countdownTarget} onChange={e => setCountdownTarget(e.target.value)} className="w-full font-mono text-xs px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900" />
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 text-center">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">{countdownTitle}</h3>
              <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-900 dark:text-white tabular-nums">{cdDays}</div>
                  <span className="text-[10px] text-neutral-400 uppercase">Days</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-900 dark:text-white tabular-nums">{cdHours}</div>
                  <span className="text-[10px] text-neutral-400 uppercase">Hours</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-900 dark:text-white tabular-nums">{cdMinutes}</div>
                  <span className="text-[10px] text-neutral-400 uppercase">Minutes</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">{cdSeconds}</div>
                  <span className="text-[10px] text-neutral-400 uppercase">Seconds</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. TIME ZONE CONVERTER */}
      {meta.id === 'timezone-converter' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-5">
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-semibold text-neutral-900 dark:text-white">UTC Reference Time Scrubber</span>
                <span className="font-mono font-bold text-neutral-900 dark:text-white">{selectedHour}:00 UTC</span>
              </div>
              <input
                type="range"
                min="0"
                max="23"
                value={selectedHour}
                onChange={e => setSelectedHour(parseInt(e.target.value))}
                className="w-full accent-neutral-900 dark:accent-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              {WORLD_CITIES.map(c => {
                let localHour = Math.floor(selectedHour + c.offset);
                if (localHour < 0) localHour += 24;
                if (localHour >= 24) localHour -= 24;
                const minutesStr = c.offset % 1 !== 0 ? '30' : '00';
                const isWorkingHour = localHour >= 9 && localHour <= 17;

                return (
                  <div key={c.city} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-semibold text-neutral-900 dark:text-white">{c.city.split(' ')[0]}</p>
                      <p className="text-[10px] text-neutral-400">{c.city.split('(')[1]?.replace(')', '')}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-bold text-neutral-900 dark:text-white">
                        {localHour.toString().padStart(2, '0')}:{minutesStr}
                      </div>
                      <span className={`text-[10px] font-medium ${isWorkingHour ? 'text-emerald-500' : 'text-neutral-400'}`}>
                        {isWorkingHour ? 'Office Hours' : 'Outside Hours'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 7. ADD OR SUBTRACT DAYS */}
      {meta.id === 'add-subtract-days' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div>
              <label className="text-xs text-neutral-500 block mb-1">Starting Date</label>
              <input type="date" value={baseDate} onChange={e => setBaseDate(e.target.value)} className="w-full font-mono text-xs px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-neutral-500 block mb-1">Operation</label>
                <div className="flex gap-2">
                  <button onClick={() => setOperation('add')} className={`flex-1 py-1.5 rounded-lg text-xs font-medium border ${operation === 'add' ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950' : 'border-neutral-200 dark:border-neutral-800'}`}>+ Add</button>
                  <button onClick={() => setOperation('subtract')} className={`flex-1 py-1.5 rounded-lg text-xs font-medium border ${operation === 'subtract' ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950' : 'border-neutral-200 dark:border-neutral-800'}`}>− Subtract</button>
                </div>
              </div>
              <div>
                <label className="text-xs text-neutral-500 block mb-1">Number of Days</label>
                <input type="number" value={daysDelta} onChange={e => setDaysDelta(parseInt(e.target.value) || 0)} className="w-full font-mono text-xs px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900" />
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase">Calculated Date</span>
            <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white">
              {finalCalculatedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <p className="text-xs text-neutral-500">{finalCalculatedDate.toLocaleDateString(undefined, { weekday: 'long' })}</p>
          </div>
        </div>
      )}
    </CalculatorWrapper>
  );
};
