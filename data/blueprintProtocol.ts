import { IconName } from '../components/Icon';

export interface BlueprintTask {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  xp: number;
  category: 'morning' | 'nutrition' | 'exercise' | 'evening' | 'mindset';
}

export const BLUEPRINT_TASKS: BlueprintTask[] = [
  {
    id: 'wake-early',
    title: 'Wake by 5:30 AM',
    description: 'Start your day early for optimal productivity',
    icon: 'clock',
    xp: 15,
    category: 'morning',
  },
  {
    id: 'morning-light',
    title: 'Morning Light Exposure',
    description: '10+ minutes of natural light within 30 min of waking',
    icon: 'activity',
    xp: 10,
    category: 'morning',
  },
  {
    id: 'super-veggie',
    title: 'Super Veggie Meal',
    description: 'Eat your nutrient-dense veggie blend',
    icon: 'salad',
    xp: 20,
    category: 'nutrition',
  },
  {
    id: 'nutty-pudding',
    title: 'Nutty Pudding',
    description: 'Have your protein-rich nut pudding',
    icon: 'salad',
    xp: 15,
    category: 'nutrition',
  },
  {
    id: 'supplements-am',
    title: 'Morning Supplements',
    description: 'Take your morning supplement stack',
    icon: 'pill',
    xp: 10,
    category: 'nutrition',
  },
  {
    id: 'hydration',
    title: 'Hydration Goal',
    description: 'Drink 2+ liters of water throughout the day',
    icon: 'activity',
    xp: 10,
    category: 'nutrition',
  },
  {
    id: 'exercise-cardio',
    title: 'Cardio Exercise',
    description: '30+ minutes of cardiovascular exercise',
    icon: 'heart',
    xp: 25,
    category: 'exercise',
  },
  {
    id: 'exercise-strength',
    title: 'Strength Training',
    description: 'Complete your strength training routine',
    icon: 'dumbbell',
    xp: 25,
    category: 'exercise',
  },
  {
    id: 'no-eating-after',
    title: 'Stop Eating by 11 AM',
    description: 'Practice time-restricted eating',
    icon: 'clock',
    xp: 15,
    category: 'nutrition',
  },
  {
    id: 'supplements-pm',
    title: 'Evening Supplements',
    description: 'Take your evening supplement stack',
    icon: 'pill',
    xp: 10,
    category: 'evening',
  },
  {
    id: 'wind-down',
    title: 'Wind Down Routine',
    description: 'Begin relaxation 2 hours before bed',
    icon: 'moon',
    xp: 15,
    category: 'evening',
  },
  {
    id: 'sleep-early',
    title: 'Sleep by 8:30 PM',
    description: 'Get to bed early for optimal recovery',
    icon: 'moon',
    xp: 20,
    category: 'evening',
  },
  {
    id: 'gratitude',
    title: 'Gratitude Practice',
    description: 'Write down 3 things you are grateful for',
    icon: 'star',
    xp: 10,
    category: 'mindset',
  },
];

export const LEVEL_TITLES = [
  'Novice',
  'Apprentice',
  'Initiate',
  'Student',
  'Practitioner',
  'Adept',
  'Expert',
  'Master',
  'Sage',
  'Legend',
  'Immortal',
];

export function getLevelFromXP(xp: number): number {
  // XP thresholds for each level
  const thresholds = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500, 7500];

  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (xp >= thresholds[i]) {
      return i + 1;
    }
  }
  return 1;
}

export function getXPForNextLevel(currentXP: number): { current: number; needed: number; progress: number } {
  const thresholds = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500, 7500];
  const currentLevel = getLevelFromXP(currentXP);

  if (currentLevel >= thresholds.length) {
    return { current: currentXP, needed: currentXP, progress: 100 };
  }

  const currentThreshold = thresholds[currentLevel - 1];
  const nextThreshold = thresholds[currentLevel];
  const xpInLevel = currentXP - currentThreshold;
  const xpNeeded = nextThreshold - currentThreshold;

  return {
    current: xpInLevel,
    needed: xpNeeded,
    progress: (xpInLevel / xpNeeded) * 100,
  };
}
