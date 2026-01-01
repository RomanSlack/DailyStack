import { IconName } from '../components/Icon';

export interface RiskReduction {
  condition: string;
  icon: IconName;
  reductionWithProtocol: number; // percentage reduction
  annualCostIfDeveloped: number;
}

export interface LongevityFact {
  stat: string;
  label: string;
  source: string;
  icon: IconName;
}

export const RISK_REDUCTIONS: RiskReduction[] = [
  {
    condition: 'Type 2 Diabetes',
    icon: 'activity',
    reductionWithProtocol: 58,
    annualCostIfDeveloped: 9600,
  },
  {
    condition: 'Heart Disease',
    icon: 'heart',
    reductionWithProtocol: 50,
    annualCostIfDeveloped: 18000,
  },
  {
    condition: 'Certain Cancers',
    icon: 'shield',
    reductionWithProtocol: 30,
    annualCostIfDeveloped: 42000,
  },
  {
    condition: 'Cognitive Decline',
    icon: 'activity',
    reductionWithProtocol: 40,
    annualCostIfDeveloped: 65000,
  },
  {
    condition: 'Obesity-Related Issues',
    icon: 'trending-up',
    reductionWithProtocol: 65,
    annualCostIfDeveloped: 8000,
  },
];

export const LONGEVITY_FACTS: LongevityFact[] = [
  {
    stat: '7+ years',
    label: 'Life expectancy increase with healthy lifestyle',
    source: 'Harvard Study',
    icon: 'clock',
  },
  {
    stat: '80%',
    label: 'Of chronic diseases are preventable',
    source: 'WHO',
    icon: 'shield',
  },
  {
    stat: '$11,000',
    label: 'Average annual healthcare savings',
    source: 'Health Affairs',
    icon: 'piggy-bank',
  },
  {
    stat: '50%',
    label: 'Lower mortality with daily exercise',
    source: 'JAMA',
    icon: 'heart',
  },
];

export function calculateHealthcareSavings(age: number): {
  annual: number;
  tenYear: number;
  lifetime: number;
  preventedConditions: number;
} {
  // Base healthcare costs by age bracket
  const baseCosts: Record<number, number> = {
    20: 3000,
    30: 4500,
    40: 6000,
    50: 9000,
    60: 12000,
    70: 18000,
  };

  const bracket = Math.floor(age / 10) * 10;
  const baseAnnualCost = baseCosts[bracket] || baseCosts[30];

  // Estimated reduction with healthy lifestyle
  const reductionPercent = 0.35; // 35% reduction

  const annual = Math.round(baseAnnualCost * reductionPercent);
  const tenYear = annual * 10;
  const yearsRemaining = Math.max(10, 85 - age);
  const lifetime = annual * yearsRemaining;

  // Estimate conditions prevented based on risk reductions
  const preventedConditions = Math.round(
    RISK_REDUCTIONS.reduce((sum, r) => sum + r.reductionWithProtocol / 100, 0)
  );

  return {
    annual,
    tenYear,
    lifetime,
    preventedConditions,
  };
}

export function calculateROI(annualProtocolCost: number, age: number): {
  roi: number;
  breakEvenMonths: number;
  netSavings10Year: number;
} {
  const savings = calculateHealthcareSavings(age);

  const netAnnualSavings = savings.annual - annualProtocolCost;
  const roi = annualProtocolCost > 0
    ? Math.round((netAnnualSavings / annualProtocolCost) * 100)
    : 0;

  const breakEvenMonths = savings.annual > 0
    ? Math.ceil(annualProtocolCost / (savings.annual / 12))
    : 12;

  const netSavings10Year = savings.tenYear - annualProtocolCost * 10;

  return {
    roi,
    breakEvenMonths,
    netSavings10Year,
  };
}
