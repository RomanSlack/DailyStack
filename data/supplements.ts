import { IconName } from '../components/Icon';

export type TierType = 'bryansChoice' | 'budget' | 'ultraBudget';

interface SupplementTier {
  brand: string;
  price: number; // monthly cost
  link?: string;
}

export interface Supplement {
  id: string;
  name: string;
  icon: IconName;
  bryansChoice: SupplementTier;
  budget: SupplementTier;
  ultraBudget: SupplementTier;
}

export const SUPPLEMENTS: Supplement[] = [
  {
    id: 'omega3',
    name: 'Omega-3 Fish Oil',
    icon: 'pill',
    bryansChoice: { brand: 'Nordic Naturals Ultimate', price: 45, link: 'https://amazon.com' },
    budget: { brand: 'NOW Foods Ultra Omega-3', price: 18, link: 'https://amazon.com' },
    ultraBudget: { brand: 'Kirkland Signature', price: 12, link: 'https://costco.com' },
  },
  {
    id: 'vitaminD',
    name: 'Vitamin D3 + K2',
    icon: 'pill',
    bryansChoice: { brand: 'Thorne D/K2', price: 30, link: 'https://amazon.com' },
    budget: { brand: 'NOW Foods D3/K2', price: 15, link: 'https://amazon.com' },
    ultraBudget: { brand: 'Nutricost D3/K2', price: 10, link: 'https://amazon.com' },
  },
  {
    id: 'magnesium',
    name: 'Magnesium Complex',
    icon: 'pill',
    bryansChoice: { brand: 'BiOptimizers Magnesium', price: 40, link: 'https://amazon.com' },
    budget: { brand: 'NOW Foods Magnesium', price: 12, link: 'https://amazon.com' },
    ultraBudget: { brand: 'Nature Made', price: 8, link: 'https://amazon.com' },
  },
  {
    id: 'creatine',
    name: 'Creatine Monohydrate',
    icon: 'dumbbell',
    bryansChoice: { brand: 'Thorne Creatine', price: 35, link: 'https://amazon.com' },
    budget: { brand: 'NOW Sports Creatine', price: 15, link: 'https://amazon.com' },
    ultraBudget: { brand: 'BulkSupplements', price: 10, link: 'https://amazon.com' },
  },
  {
    id: 'collagen',
    name: 'Collagen Peptides',
    icon: 'activity',
    bryansChoice: { brand: 'Vital Proteins', price: 45, link: 'https://amazon.com' },
    budget: { brand: 'Sports Research', price: 25, link: 'https://amazon.com' },
    ultraBudget: { brand: 'BulkSupplements', price: 18, link: 'https://amazon.com' },
  },
  {
    id: 'nmn',
    name: 'NMN (Longevity)',
    icon: 'clock',
    bryansChoice: { brand: 'ProHealth NMN Pro', price: 75, link: 'https://amazon.com' },
    budget: { brand: 'Double Wood NMN', price: 40, link: 'https://amazon.com' },
    ultraBudget: { brand: 'Skip (optional)', price: 0 },
  },
  {
    id: 'ashwagandha',
    name: 'Ashwagandha',
    icon: 'moon',
    bryansChoice: { brand: 'Nootropics Depot KSM-66', price: 25, link: 'https://amazon.com' },
    budget: { brand: 'NOW Foods Ashwagandha', price: 12, link: 'https://amazon.com' },
    ultraBudget: { brand: 'Nutricost', price: 8, link: 'https://amazon.com' },
  },
  {
    id: 'zinc',
    name: 'Zinc',
    icon: 'pill',
    bryansChoice: { brand: 'Thorne Zinc Picolinate', price: 15, link: 'https://amazon.com' },
    budget: { brand: 'NOW Foods Zinc', price: 8, link: 'https://amazon.com' },
    ultraBudget: { brand: 'Nature Made', price: 5, link: 'https://amazon.com' },
  },
  {
    id: 'probiotics',
    name: 'Probiotics',
    icon: 'salad',
    bryansChoice: { brand: 'Seed Daily Synbiotic', price: 50, link: 'https://seed.com' },
    budget: { brand: 'Garden of Life', price: 30, link: 'https://amazon.com' },
    ultraBudget: { brand: 'Culturelle', price: 20, link: 'https://amazon.com' },
  },
];

export const FULL_STACK_IDS = SUPPLEMENTS.map((s) => s.id);

export const TIER_INFO: Record<TierType, { label: string; color: string }> = {
  bryansChoice: { label: "Bryan's", color: '#6366F1' },
  budget: { label: 'Budget', color: '#10B981' },
  ultraBudget: { label: 'Ultra', color: '#F59E0B' },
};

export function calculateAllTierTotals(supplementIds: string[]): Record<TierType, number> {
  const supplements = SUPPLEMENTS.filter((s) => supplementIds.includes(s.id));

  return {
    bryansChoice: supplements.reduce((sum, s) => sum + s.bryansChoice.price, 0),
    budget: supplements.reduce((sum, s) => sum + s.budget.price, 0),
    ultraBudget: supplements.reduce((sum, s) => sum + s.ultraBudget.price, 0),
  };
}
