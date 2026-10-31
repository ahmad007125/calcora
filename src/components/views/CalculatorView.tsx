import React from 'react';
import { CALCULATORS } from '../../data/registry';
import { CategoryId } from '../../types';
import { HealthCalculators } from '../calculators/health/HealthCalculators';
import { UniversalUnitConverter } from '../calculators/converters/UniversalUnitConverter';
import { FinanceCalculators } from '../calculators/finance/FinanceCalculators';
import { CreativeCalculators } from '../calculators/creative/CreativeCalculators';
import { DateTimeCalculators } from '../calculators/datetime/DateTimeCalculators';
import { TextDataCalculators } from '../calculators/textdata/TextDataCalculators';

interface CalculatorViewProps {
  calculatorId: string;
  onNavigateHome: () => void;
  onNavigateCategory: (cat: CategoryId) => void;
  onNavigateCalculator: (id: string) => void;
}

export const CalculatorView: React.FC<CalculatorViewProps> = ({
  calculatorId,
  onNavigateHome,
  onNavigateCategory,
  onNavigateCalculator,
}) => {
  const meta = CALCULATORS.find(c => c.id === calculatorId) || CALCULATORS[0];

  switch (meta.category) {
    case 'health':
      return (
        <HealthCalculators
          meta={meta}
          onNavigateHome={onNavigateHome}
          onNavigateCategory={onNavigateCategory}
          onNavigateCalculator={onNavigateCalculator}
        />
      );
    case 'converters':
      return (
        <UniversalUnitConverter
          meta={meta}
          onNavigateHome={onNavigateHome}
          onNavigateCategory={onNavigateCategory}
          onNavigateCalculator={onNavigateCalculator}
        />
      );
    case 'finance':
      return (
        <FinanceCalculators
          meta={meta}
          onNavigateHome={onNavigateHome}
          onNavigateCategory={onNavigateCategory}
          onNavigateCalculator={onNavigateCalculator}
        />
      );
    case 'creative':
      return (
        <CreativeCalculators
          meta={meta}
          onNavigateHome={onNavigateHome}
          onNavigateCategory={onNavigateCategory}
          onNavigateCalculator={onNavigateCalculator}
        />
      );
    case 'datetime':
      return (
        <DateTimeCalculators
          meta={meta}
          onNavigateHome={onNavigateHome}
          onNavigateCategory={onNavigateCategory}
          onNavigateCalculator={onNavigateCalculator}
        />
      );
    case 'textdata':
      return (
        <TextDataCalculators
          meta={meta}
          onNavigateHome={onNavigateHome}
          onNavigateCategory={onNavigateCategory}
          onNavigateCalculator={onNavigateCalculator}
        />
      );
    default:
      return (
        <UniversalUnitConverter
          meta={meta}
          onNavigateHome={onNavigateHome}
          onNavigateCategory={onNavigateCategory}
          onNavigateCalculator={onNavigateCalculator}
        />
      );
  }
};
