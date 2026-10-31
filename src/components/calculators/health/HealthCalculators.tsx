import React, { useState } from 'react';
import { CalculatorWrapper } from '../../common/CalculatorWrapper';
import { CalculatorMeta, CategoryId } from '../../../types';

interface HealthCalculatorProps {
  meta: CalculatorMeta;
  onNavigateHome: () => void;
  onNavigateCategory: (cat: CategoryId) => void;
  onNavigateCalculator: (id: string) => void;
}

export const HealthCalculators: React.FC<HealthCalculatorProps> = ({
  meta,
  onNavigateHome,
  onNavigateCategory,
  onNavigateCalculator,
}) => {
  // Common states
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(28);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(70);
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(9);
  const [weightLbs, setWeightLbs] = useState<number>(154);

  // Health-specific inputs
  const [activityLevel, setActivityLevel] = useState<number>(1.375); // Light exercise
  const [waistCm, setWaistCm] = useState<number>(82);
  const [neckCm, setNeckCm] = useState<number>(38);
  const [hipCm, setHipCm] = useState<number>(95);
  const [exerciseMinutes, setExerciseMinutes] = useState<number>(45);
  const [climate, setClimate] = useState<'moderate' | 'hot'>('moderate');
  const [fitnessGoal, setFitnessGoal] = useState<'maintenance' | 'loss' | 'gain'>('maintenance');
  const [lossRateKg, setLossRateKg] = useState<number>(0.5); // kg per week
  const [dietType, setDietType] = useState<'balanced' | 'lowcarb' | 'highprotein' | 'keto'>('balanced');
  const [lmpDate, setLmpDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 70); // 10 weeks ago
    return d.toISOString().split('T')[0];
  });
  const [restingHr, setRestingHr] = useState<number>(65);

  // Metric conversions
  const effectiveWeightKg = unit === 'metric' ? weightKg : weightLbs * 0.45359237;
  const effectiveHeightCm = unit === 'metric' ? heightCm : (heightFt * 12 + heightIn) * 2.54;
  const heightM = effectiveHeightCm / 100;

  // Reset helper
  const handleReset = () => {
    setAge(28);
    setHeightCm(175);
    setWeightKg(70);
    setHeightFt(5);
    setHeightIn(9);
    setWeightLbs(154);
    setGender('male');
    setActivityLevel(1.375);
    setWaistCm(82);
    setNeckCm(38);
    setHipCm(95);
    setExerciseMinutes(45);
    setLossRateKg(0.5);
    setRestingHr(65);
  };

  // 1. BMI Calculation
  const bmi = heightM > 0 ? effectiveWeightKg / (heightM * heightM) : 0;
  const minHealthyWeight = 18.5 * heightM * heightM;
  const maxHealthyWeight = 24.9 * heightM * heightM;
  let bmiCategory = 'Normal weight';
  let bmiColor = 'text-emerald-500';
  if (bmi < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = 'text-amber-500';
  } else if (bmi >= 25 && bmi < 29.9) {
    bmiCategory = 'Overweight';
    bmiColor = 'text-amber-500';
  } else if (bmi >= 30) {
    bmiCategory = 'Obesity';
    bmiColor = 'text-red-500';
  }

  // 2. BMR Calculation (Mifflin-St Jeor)
  const bmrMifflin = gender === 'male'
    ? 10 * effectiveWeightKg + 6.25 * effectiveHeightCm - 5 * age + 5
    : 10 * effectiveWeightKg + 6.25 * effectiveHeightCm - 5 * age - 161;

  // Harris-Benedict
  const bmrHarris = gender === 'male'
    ? 88.362 + (13.397 * effectiveWeightKg) + (4.799 * effectiveHeightCm) - (5.677 * age)
    : 447.593 + (9.247 * effectiveWeightKg) + (3.098 * effectiveHeightCm) - (4.330 * age);

  // 3. TDEE
  const tdee = Math.round(bmrMifflin * activityLevel);

  // 4. Calories targets
  const caloriesMaintenance = tdee;
  const caloriesMildDeficit = Math.round(tdee - 300);
  const caloriesDeficit = Math.round(tdee - 500);
  const caloriesSurplus = Math.round(tdee + 350);

  // 5. Ideal Weight (Devine, Robinson, Miller, Hamwi)
  const inchesOver5Ft = Math.max(0, (effectiveHeightCm / 2.54) - 60);
  const devineKg = gender === 'male' ? 50 + 2.3 * inchesOver5Ft : 45.5 + 2.3 * inchesOver5Ft;
  const robinsonKg = gender === 'male' ? 52 + 1.9 * inchesOver5Ft : 49 + 1.7 * inchesOver5Ft;
  const millerKg = gender === 'male' ? 56.2 + 1.41 * inchesOver5Ft : 53.1 + 1.36 * inchesOver5Ft;
  const hamwiKg = gender === 'male' ? 48 + 2.7 * inchesOver5Ft : 45.5 + 2.2 * inchesOver5Ft;

  // 6. Body Fat (Navy method)
  let bodyFatPct = 0;
  if (gender === 'male') {
    if (waistCm > neckCm) {
      bodyFatPct = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(effectiveHeightCm)) - 450;
    }
  } else {
    if ((waistCm + hipCm) > neckCm) {
      bodyFatPct = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(effectiveHeightCm)) - 450;
    }
  }
  bodyFatPct = Math.max(3, Math.min(60, bodyFatPct));
  const fatMassKg = (effectiveWeightKg * bodyFatPct) / 100;
  const leanMassKg = effectiveWeightKg - fatMassKg;

  // 7. Protein Target
  let proteinMultiplier = 1.6; // g/kg standard
  if (fitnessGoal === 'maintenance') proteinMultiplier = 1.6;
  if (fitnessGoal === 'loss') proteinMultiplier = 2.0; // preserve muscle on deficit
  if (fitnessGoal === 'gain') proteinMultiplier = 2.2;
  const dailyProteinGrams = Math.round(effectiveWeightKg * proteinMultiplier);

  // 8. Water Intake
  // Base 35ml per kg + 350ml per 30 mins exercise + climate adjustment
  const baseWaterMl = effectiveWeightKg * 35;
  const exerciseWaterMl = (exerciseMinutes / 30) * 350;
  const climateWaterMl = climate === 'hot' ? 500 : 0;
  const totalWaterLiters = (baseWaterMl + exerciseWaterMl + climateWaterMl) / 1000;
  const totalWaterGlasses = Math.round((totalWaterLiters * 1000) / 250);

  // 9. Calorie Deficit & Target Date
  const dailyDeficitNeeded = Math.round((lossRateKg * 7700) / 7);
  const targetDeficitCalories = Math.max(1200, tdee - dailyDeficitNeeded);
  const projectedLoss10kgWeeks = Math.round(10 / (lossRateKg || 0.1));

  // 10. Macro distribution
  let carbPct = 45;
  let proteinPct = 30;
  let fatPct = 25;
  if (dietType === 'lowcarb') {
    carbPct = 20; proteinPct = 40; fatPct = 40;
  } else if (dietType === 'highprotein') {
    carbPct = 35; proteinPct = 40; fatPct = 25;
  } else if (dietType === 'keto') {
    carbPct = 5; proteinPct = 25; fatPct = 70;
  }
  const macroProteinGrams = Math.round((tdee * (proteinPct / 100)) / 4);
  const macroCarbGrams = Math.round((tdee * (carbPct / 100)) / 4);
  const macroFatGrams = Math.round((tdee * (fatPct / 100)) / 9);

  // 11. Pregnancy Due Date
  const lmpObj = new Date(lmpDate);
  const dueDateObj = new Date(lmpObj.getTime() + 280 * 24 * 60 * 60 * 1000); // 40 weeks / 280 days
  const now = new Date();
  const diffDays = Math.max(0, Math.floor((now.getTime() - lmpObj.getTime()) / (1000 * 60 * 60 * 24)));
  const gestationWeeks = Math.floor(diffDays / 7);
  const gestationDaysRemainder = diffDays % 7;
  const daysRemaining = Math.max(0, Math.floor((dueDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  // 12. Heart Rate Zones (Karvonen method)
  const maxHr = 220 - age;
  const hrr = maxHr - restingHr; // Heart Rate Reserve
  const zone1 = [Math.round(restingHr + hrr * 0.5), Math.round(restingHr + hrr * 0.6)];
  const zone2 = [Math.round(restingHr + hrr * 0.6), Math.round(restingHr + hrr * 0.7)];
  const zone3 = [Math.round(restingHr + hrr * 0.7), Math.round(restingHr + hrr * 0.8)];
  const zone4 = [Math.round(restingHr + hrr * 0.8), Math.round(restingHr + hrr * 0.9)];
  const zone5 = [Math.round(restingHr + hrr * 0.9), maxHr];

  // Primary Copy Value resolver
  let copyVal = '';
  let copyLbl = 'Result';

  switch (meta.id) {
    case 'bmi':
      copyVal = `BMI: ${bmi.toFixed(2)} (${bmiCategory})`;
      copyLbl = 'BMI';
      break;
    case 'bmr':
      copyVal = `BMR: ${Math.round(bmrMifflin)} kcal/day`;
      copyLbl = 'BMR';
      break;
    case 'tdee':
    case 'calories':
      copyVal = `Daily Calories: ${tdee} kcal/day`;
      copyLbl = 'Calories';
      break;
    case 'ideal-weight':
      copyVal = `Ideal Weight: ${devineKg.toFixed(1)} kg (${(devineKg * 2.20462).toFixed(1)} lbs)`;
      copyLbl = 'Ideal Weight';
      break;
    case 'body-fat':
      copyVal = `Body Fat: ${bodyFatPct.toFixed(1)}%`;
      copyLbl = 'Body Fat %';
      break;
    case 'protein':
      copyVal = `Daily Protein: ${dailyProteinGrams} g/day`;
      copyLbl = 'Protein';
      break;
    case 'water-intake':
      copyVal = `Daily Water: ${totalWaterLiters.toFixed(2)} L (${totalWaterGlasses} glasses)`;
      copyLbl = 'Water Goal';
      break;
    case 'calorie-deficit':
      copyVal = `Daily Deficit Target: ${targetDeficitCalories} kcal (-${dailyDeficitNeeded} kcal/day)`;
      copyLbl = 'Deficit Target';
      break;
    case 'macro':
      copyVal = `Protein: ${macroProteinGrams}g, Carbs: ${macroCarbGrams}g, Fats: ${macroFatGrams}g`;
      copyLbl = 'Macros';
      break;
    case 'pregnancy':
      copyVal = `Due Date: ${dueDateObj.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}`;
      copyLbl = 'Due Date';
      break;
    case 'heart-rate':
      copyVal = `Max HR: ${maxHr} bpm, Zone 2 Aerobic: ${zone2[0]}-${zone2[1]} bpm`;
      copyLbl = 'Heart Rate Zones';
      break;
    default:
      copyVal = `${bmi.toFixed(1)}`;
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-6 bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
          {/* Unit Toggle & Gender */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-850 rounded-lg text-xs">
              <button
                onClick={() => setUnit('metric')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  unit === 'metric'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Metric (cm, kg)
              </button>
              <button
                onClick={() => setUnit('imperial')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  unit === 'imperial'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Imperial (ft, lbs)
              </button>
            </div>

            <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-850 rounded-lg text-xs">
              <button
                onClick={() => setGender('male')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  gender === 'male'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Male
              </button>
              <button
                onClick={() => setGender('female')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  gender === 'female'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Female
              </button>
            </div>
          </div>

          {/* Core Fields */}
          {meta.id !== 'pregnancy' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Age (years)
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-neutral-400"
                />
              </div>

              {unit === 'metric' ? (
                <>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="250"
                      value={heightCm}
                      onChange={(e) => setHeightCm(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-neutral-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      min="20"
                      max="350"
                      step="0.5"
                      value={weightKg}
                      onChange={(e) => setWeightKg(Math.max(1, parseFloat(e.target.value) || 0))}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-neutral-400"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Height (ft & in)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        min="2"
                        max="8"
                        value={heightFt}
                        onChange={(e) => setHeightFt(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm font-mono"
                        placeholder="ft"
                      />
                      <input
                        type="number"
                        min="0"
                        max="11"
                        value={heightIn}
                        onChange={(e) => setHeightIn(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm font-mono"
                        placeholder="in"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Weight (lbs)
                    </label>
                    <input
                      type="number"
                      min="40"
                      max="700"
                      value={weightLbs}
                      onChange={(e) => setWeightLbs(Math.max(1, parseFloat(e.target.value) || 0))}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm font-mono"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Specialized extra inputs based on tool */}
          {(meta.id === 'tdee' || meta.id === 'calories' || meta.id === 'macro' || meta.id === 'calorie-deficit') && (
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Activity Level
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(parseFloat(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs focus:outline-none"
              >
                <option value={1.2}>Sedentary (desk job, little to no exercise)</option>
                <option value={1.375}>Light Active (exercise 1-3 times / week)</option>
                <option value={1.55}>Moderately Active (exercise 3-5 times / week)</option>
                <option value={1.725}>Very Active (hard exercise 6-7 days / week)</option>
                <option value={1.9}>Extra Active (strenuous physical job or 2x/day training)</option>
              </select>
            </div>
          )}

          {meta.id === 'macro' && (
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Dietary Macro Protocol
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'balanced', label: 'Balanced (45/30/25)' },
                  { id: 'highprotein', label: 'High Protein (35/40/25)' },
                  { id: 'lowcarb', label: 'Low Carb (20/40/40)' },
                  { id: 'keto', label: 'Ketogenic (5/25/70)' },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDietType(d.id as any)}
                    className={`p-2 rounded-lg text-xs font-medium border text-center transition-colors ${
                      dietType === d.id
                        ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-950'
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {meta.id === 'body-fat' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Waist ({unit === 'metric' ? 'cm' : 'cm'})
                </label>
                <input
                  type="number"
                  value={waistCm}
                  onChange={(e) => setWaistCm(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Neck (cm)
                </label>
                <input
                  type="number"
                  value={neckCm}
                  onChange={(e) => setNeckCm(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-sm font-mono"
                />
              </div>
              {gender === 'female' && (
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Hip (cm)
                  </label>
                  <input
                    type="number"
                    value={hipCm}
                    onChange={(e) => setHipCm(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-sm font-mono"
                  />
                </div>
              )}
            </div>
          )}

          {meta.id === 'water-intake' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Daily Exercise (minutes)
                </label>
                <input
                  type="number"
                  value={exerciseMinutes}
                  onChange={(e) => setExerciseMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Climate Temperature
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setClimate('moderate')}
                    className={`py-2 rounded-xl text-xs font-medium border ${
                      climate === 'moderate'
                        ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-950'
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    Moderate / Cold
                  </button>
                  <button
                    onClick={() => setClimate('hot')}
                    className={`py-2 rounded-xl text-xs font-medium border ${
                      climate === 'hot'
                        ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-950'
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    Hot / Arid (+0.5L)
                  </button>
                </div>
              </div>
            </div>
          )}

          {meta.id === 'calorie-deficit' && (
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Target Weight Loss Rate
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { rate: 0.25, label: '0.25 kg / wk (Slow & Easy)' },
                  { rate: 0.5, label: '0.5 kg / wk (Recommended)' },
                  { rate: 1.0, label: '1.0 kg / wk (Aggressive)' },
                ].map((item) => (
                  <button
                    key={item.rate}
                    onClick={() => setLossRateKg(item.rate)}
                    className={`p-2.5 rounded-xl text-xs border text-center font-medium transition-colors ${
                      lossRateKg === item.rate
                        ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-950'
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {meta.id === 'heart-rate' && (
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Resting Heart Rate (BPM)
              </label>
              <input
                type="number"
                min="40"
                max="120"
                value={restingHr}
                onChange={(e) => setRestingHr(Math.max(30, parseInt(e.target.value) || 60))}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-sm font-mono"
              />
            </div>
          )}

          {meta.id === 'pregnancy' && (
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                First Day of Last Menstrual Period (LMP)
              </label>
              <input
                type="date"
                value={lmpDate}
                onChange={(e) => setLmpDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-sm font-mono text-neutral-900 dark:text-white"
              />
            </div>
          )}
        </div>

        {/* Results Visualizer Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-[#0c0d12] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
            <span className="text-[11px] font-semibold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase">
              Calculated Output
            </span>

            {/* BMI Specific Card */}
            {meta.id === 'bmi' && (
              <div className="mt-3 space-y-4">
                <div className="flex items-baseline justify-between">
                  <div className="text-4xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white tabular-nums">
                    {bmi.toFixed(1)}
                  </div>
                  <div className={`text-sm font-semibold ${bmiColor}`}>
                    {bmiCategory}
                  </div>
                </div>

                {/* Visual BMI Scale */}
                <div className="space-y-1.5 pt-2">
                  <div className="h-2.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden flex">
                    <div className="h-full bg-amber-400 w-[18.5%]" title="Underweight (<18.5)" />
                    <div className="h-full bg-emerald-500 w-[24.9%]" title="Normal (18.5-24.9)" />
                    <div className="h-full bg-amber-500 w-[20%]" title="Overweight (25-29.9)" />
                    <div className="h-full bg-red-500 flex-1" title="Obese (≥30)" />
                  </div>
                  <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                    <span>16</span>
                    <span>18.5</span>
                    <span>25</span>
                    <span>30</span>
                    <span>40</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-500">
                    <span>Healthy Weight Range:</span>
                    <span className="font-mono text-neutral-800 dark:text-neutral-200 font-medium">
                      {minHealthyWeight.toFixed(1)} - {maxHealthyWeight.toFixed(1)} kg
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>BMI Prime:</span>
                    <span className="font-mono text-neutral-800 dark:text-neutral-200 font-medium">
                      {(bmi / 25).toFixed(2)} (ratio to 25.0)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* BMR Specific Card */}
            {meta.id === 'bmr' && (
              <div className="mt-3 space-y-4">
                <div>
                  <div className="text-3xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white tabular-nums">
                    {Math.round(bmrMifflin)} <span className="text-base font-normal text-neutral-500">kcal/day</span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">Mifflin-St Jeor Standard</p>
                </div>

                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2.5 text-xs">
                  <div className="flex justify-between text-neutral-500">
                    <span>Harris-Benedict Formula:</span>
                    <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">
                      {Math.round(bmrHarris)} kcal/day
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Hourly Burn at Rest:</span>
                    <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">
                      {(bmrMifflin / 24).toFixed(1)} kcal/hr
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TDEE & Daily Calories */}
            {(meta.id === 'tdee' || meta.id === 'calories') && (
              <div className="mt-3 space-y-4">
                <div>
                  <div className="text-3xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white tabular-nums">
                    {tdee} <span className="text-base font-normal text-neutral-500">kcal/day</span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">Daily Maintenance Energy</p>
                </div>

                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs">
                  <div className="flex justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                    <span className="text-neutral-600 dark:text-neutral-400">Mild Weight Loss (-0.25kg/wk):</span>
                    <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">{caloriesMildDeficit} kcal</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                    <span className="text-neutral-600 dark:text-neutral-400">Standard Fat Loss (-0.5kg/wk):</span>
                    <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">{caloriesDeficit} kcal</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                    <span className="text-neutral-600 dark:text-neutral-400">Lean Muscle Gain (+0.25kg/wk):</span>
                    <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">{caloriesSurplus} kcal</span>
                  </div>
                </div>
              </div>
            )}

            {/* Ideal Weight Card */}
            {meta.id === 'ideal-weight' && (
              <div className="mt-3 space-y-3">
                <div className="text-3xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white tabular-nums">
                  {devineKg.toFixed(1)} <span className="text-base font-normal text-neutral-500">kg</span>
                </div>
                <p className="text-xs text-neutral-400">Devine Formula Target</p>
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-500">
                    <span>Robinson (1983):</span>
                    <span className="font-mono text-neutral-800 dark:text-neutral-200 font-medium">{robinsonKg.toFixed(1)} kg</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Miller (1983):</span>
                    <span className="font-mono text-neutral-800 dark:text-neutral-200 font-medium">{millerKg.toFixed(1)} kg</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Hamwi (1964):</span>
                    <span className="font-mono text-neutral-800 dark:text-neutral-200 font-medium">{hamwiKg.toFixed(1)} kg</span>
                  </div>
                </div>
              </div>
            )}

            {/* Body Fat Card */}
            {meta.id === 'body-fat' && (
              <div className="mt-3 space-y-3">
                <div className="text-3xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white tabular-nums">
                  {bodyFatPct.toFixed(1)}%
                </div>
                <p className="text-xs text-neutral-400">Estimated Body Fat (US Navy)</p>
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-500">
                    <span>Fat Mass:</span>
                    <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">{fatMassKg.toFixed(1)} kg</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Lean Body Mass:</span>
                    <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">{leanMassKg.toFixed(1)} kg</span>
                  </div>
                </div>
              </div>
            )}

            {/* Protein Card */}
            {meta.id === 'protein' && (
              <div className="mt-3 space-y-3">
                <div className="text-3xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white tabular-nums">
                  {dailyProteinGrams} <span className="text-base font-normal text-neutral-500">grams/day</span>
                </div>
                <p className="text-xs text-neutral-400">Target: {proteinMultiplier}g per kg bodyweight</p>
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-500">
                    <span>Per Meal (4 meals/day):</span>
                    <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">{Math.round(dailyProteinGrams / 4)}g</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Total Protein Calories:</span>
                    <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">{dailyProteinGrams * 4} kcal</span>
                  </div>
                </div>
              </div>
            )}

            {/* Water Intake Card */}
            {meta.id === 'water-intake' && (
              <div className="mt-3 space-y-3">
                <div className="text-3xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white tabular-nums">
                  {totalWaterLiters.toFixed(2)} <span className="text-base font-normal text-neutral-500">Liters</span>
                </div>
                <p className="text-xs text-neutral-400">Equivalent to ~{totalWaterGlasses} standard glasses (250ml)</p>
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-500">
                    <span>Baseline Need:</span>
                    <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">{(baseWaterMl / 1000).toFixed(2)} L</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Exercise Addition:</span>
                    <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">+{(exerciseWaterMl / 1000).toFixed(2)} L</span>
                  </div>
                </div>
              </div>
            )}

            {/* Calorie Deficit Card */}
            {meta.id === 'calorie-deficit' && (
              <div className="mt-3 space-y-3">
                <div className="text-3xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white tabular-nums">
                  {targetDeficitCalories} <span className="text-base font-normal text-neutral-500">kcal/day</span>
                </div>
                <p className="text-xs text-neutral-400">Daily deficit of {dailyDeficitNeeded} kcal from TDEE</p>
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-500">
                    <span>Weekly Weight Loss:</span>
                    <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">-{lossRateKg} kg / week</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Projected Time for 10kg Loss:</span>
                    <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">{projectedLoss10kgWeeks} weeks</span>
                  </div>
                </div>
              </div>
            )}

            {/* Macro Breakdown */}
            {meta.id === 'macro' && (
              <div className="mt-3 space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 uppercase font-semibold">Protein</span>
                    <div className="text-lg font-bold font-mono text-neutral-900 dark:text-white">{macroProteinGrams}g</div>
                    <span className="text-[10px] text-neutral-400">{proteinPct}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50">
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-semibold">Carbs</span>
                    <div className="text-lg font-bold font-mono text-neutral-900 dark:text-white">{macroCarbGrams}g</div>
                    <span className="text-[10px] text-neutral-400">{carbPct}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-semibold">Fats</span>
                    <div className="text-lg font-bold font-mono text-neutral-900 dark:text-white">{macroFatGrams}g</div>
                    <span className="text-[10px] text-neutral-400">{fatPct}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Pregnancy Card */}
            {meta.id === 'pregnancy' && (
              <div className="mt-3 space-y-4">
                <div>
                  <div className="text-2xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white">
                    {dueDateObj.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">Estimated Due Date (40 Weeks)</p>
                </div>
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-500">
                    <span>Current Gestational Age:</span>
                    <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">{gestationWeeks} weeks, {gestationDaysRemainder} days</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Days Remaining:</span>
                    <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">{daysRemaining} days</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Current Trimester:</span>
                    <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                      {gestationWeeks < 13 ? 'First Trimester' : gestationWeeks < 27 ? 'Second Trimester' : 'Third Trimester'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Heart Rate Zones */}
            {meta.id === 'heart-rate' && (
              <div className="mt-3 space-y-3">
                <div className="flex justify-between items-baseline">
                  <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white">
                    {maxHr} <span className="text-sm font-normal text-neutral-500">BPM</span>
                  </div>
                  <span className="text-xs text-neutral-400">Theoretical Max HR</span>
                </div>
                <div className="space-y-1.5 pt-2 text-xs">
                  <div className="flex justify-between p-1.5 rounded bg-neutral-50 dark:bg-neutral-900">
                    <span className="text-neutral-500">Zone 1 (Recovery 50-60%):</span>
                    <span className="font-mono font-medium">{zone1[0]} - {zone1[1]} bpm</span>
                  </div>
                  <div className="flex justify-between p-1.5 rounded bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300">
                    <span>Zone 2 (Aerobic Base 60-70%):</span>
                    <span className="font-mono font-semibold">{zone2[0]} - {zone2[1]} bpm</span>
                  </div>
                  <div className="flex justify-between p-1.5 rounded bg-neutral-50 dark:bg-neutral-900">
                    <span className="text-neutral-500">Zone 3 (Tempo 70-80%):</span>
                    <span className="font-mono font-medium">{zone3[0]} - {zone3[1]} bpm</span>
                  </div>
                  <div className="flex justify-between p-1.5 rounded bg-neutral-50 dark:bg-neutral-900">
                    <span className="text-neutral-500">Zone 4 (Threshold 80-90%):</span>
                    <span className="font-mono font-medium">{zone4[0]} - {zone4[1]} bpm</span>
                  </div>
                  <div className="flex justify-between p-1.5 rounded bg-red-50/50 dark:bg-red-950/20 text-red-700 dark:text-red-300">
                    <span>Zone 5 (VO2 Max 90-100%):</span>
                    <span className="font-mono font-semibold">{zone5[0]} - {zone5[1]} bpm</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
};
