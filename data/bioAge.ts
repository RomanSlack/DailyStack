import { IconName } from '../components/Icon';

export interface BioAgeFactor {
  name: string;
  score: number; // 0-100
  status: 'excellent' | 'good' | 'fair' | 'poor';
  impact: number; // years added/subtracted
  icon: IconName;
}

export interface BioAgeResult {
  biologicalAge: number;
  chronologicalAge: number;
  ageDifference: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  percentile: number;
  factors: BioAgeFactor[];
}

export const GRADE_COLORS: Record<string, string> = {
  'A+': '#10B981',
  'A': '#34D399',
  'B': '#6366F1',
  'C': '#F59E0B',
  'D': '#EF4444',
  'F': '#DC2626',
};

export const STATUS_COLORS: Record<string, string> = {
  excellent: '#10B981',
  good: '#34D399',
  fair: '#F59E0B',
  poor: '#EF4444',
};

interface BioAgeInput {
  chronologicalAge: number;
  exerciseScore: number; // 0-100
  sleepScore: number; // 0-100
  nutritionScore: number; // 0-100
  stressScore: number; // 0-100
  consistencyScore: number; // 0-100
  smokingStatus: 'never' | 'former' | 'current';
  alcoholFrequency: 'never' | 'occasional' | 'moderate' | 'heavy';
}

export function calculateBioAge(input: BioAgeInput): BioAgeResult {
  const {
    chronologicalAge,
    exerciseScore,
    sleepScore,
    nutritionScore,
    stressScore,
    consistencyScore,
    smokingStatus,
    alcoholFrequency,
  } = input;

  // Calculate impacts for each factor
  const exerciseImpact = ((exerciseScore - 50) / 50) * -3; // -3 to +3 years
  const sleepImpact = ((sleepScore - 50) / 50) * -2.5;
  const nutritionImpact = ((nutritionScore - 50) / 50) * -2;
  const stressImpact = ((100 - stressScore - 50) / 50) * -1.5; // Inverted
  const consistencyImpact = ((consistencyScore - 50) / 50) * -2;

  // Smoking impact
  let smokingImpact = 0;
  if (smokingStatus === 'current') smokingImpact = 5;
  else if (smokingStatus === 'former') smokingImpact = 2;

  // Alcohol impact
  let alcoholImpact = 0;
  if (alcoholFrequency === 'heavy') alcoholImpact = 3;
  else if (alcoholFrequency === 'moderate') alcoholImpact = 1;
  else if (alcoholFrequency === 'occasional') alcoholImpact = 0;
  else alcoholImpact = -0.5; // Never drinking slight benefit

  const totalImpact =
    exerciseImpact +
    sleepImpact +
    nutritionImpact +
    stressImpact +
    consistencyImpact +
    smokingImpact +
    alcoholImpact;

  const biologicalAge = chronologicalAge + totalImpact;
  const ageDifference = totalImpact;

  // Calculate grade
  let grade: BioAgeResult['grade'];
  if (ageDifference <= -5) grade = 'A+';
  else if (ageDifference <= -3) grade = 'A';
  else if (ageDifference <= 0) grade = 'B';
  else if (ageDifference <= 3) grade = 'C';
  else if (ageDifference <= 5) grade = 'D';
  else grade = 'F';

  // Calculate percentile
  const percentile = Math.max(1, Math.min(99, Math.round(50 - ageDifference * 8)));

  const getStatus = (score: number): BioAgeFactor['status'] => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
  };

  const factors: BioAgeFactor[] = [
    {
      name: 'Exercise',
      score: exerciseScore,
      status: getStatus(exerciseScore),
      impact: exerciseImpact,
      icon: 'dumbbell',
    },
    {
      name: 'Sleep',
      score: sleepScore,
      status: getStatus(sleepScore),
      impact: sleepImpact,
      icon: 'moon',
    },
    {
      name: 'Nutrition',
      score: nutritionScore,
      status: getStatus(nutritionScore),
      impact: nutritionImpact,
      icon: 'salad',
    },
    {
      name: 'Stress',
      score: 100 - stressScore, // Invert for display
      status: getStatus(100 - stressScore),
      impact: stressImpact,
      icon: 'activity',
    },
    {
      name: 'Consistency',
      score: consistencyScore,
      status: getStatus(consistencyScore),
      impact: consistencyImpact,
      icon: 'flame',
    },
    {
      name: 'Lifestyle',
      score: Math.max(0, 100 - smokingImpact * 10 - alcoholImpact * 10),
      status: getStatus(Math.max(0, 100 - smokingImpact * 10 - alcoholImpact * 10)),
      impact: smokingImpact + alcoholImpact,
      icon: 'heart',
    },
  ];

  return {
    biologicalAge,
    chronologicalAge,
    ageDifference,
    grade,
    percentile,
    factors,
  };
}

export function calculateFactorsFromAppData(
  completions: { taskId: string; date: string }[],
  currentStreak: number,
  longestStreak: number,
  daysSinceStart: number
): {
  exerciseScore: number;
  sleepScore: number;
  nutritionScore: number;
  stressScore: number;
  consistencyScore: number;
} {
  // Get last 7 days of completions
  const last7Days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    last7Days.push(date.toISOString().split('T')[0]);
  }

  const recentCompletions = completions.filter((c) =>
    last7Days.includes(c.date)
  );

  // Exercise score based on exercise task completions
  const exerciseTasks = recentCompletions.filter(
    (c) => c.taskId.includes('exercise') || c.taskId.includes('cardio')
  );
  const exerciseScore = Math.min(100, (exerciseTasks.length / 14) * 100);

  // Sleep score based on sleep-related tasks
  const sleepTasks = recentCompletions.filter(
    (c) => c.taskId.includes('sleep') || c.taskId.includes('wind-down')
  );
  const sleepScore = Math.min(100, (sleepTasks.length / 14) * 100);

  // Nutrition score based on meal tasks
  const nutritionTasks = recentCompletions.filter(
    (c) =>
      c.taskId.includes('veggie') ||
      c.taskId.includes('pudding') ||
      c.taskId.includes('supplement')
  );
  const nutritionScore = Math.min(100, (nutritionTasks.length / 28) * 100);

  // Stress score (lower is better, inverted in display)
  const stressScore = Math.max(0, 100 - currentStreak * 5);

  // Consistency score based on streak and overall completion rate
  const consistencyScore = Math.min(
    100,
    (currentStreak / 7) * 50 + (completions.length / (daysSinceStart * 13)) * 50
  );

  return {
    exerciseScore,
    sleepScore,
    nutritionScore,
    stressScore,
    consistencyScore,
  };
}

export function getBioAgeMessage(result: BioAgeResult): string {
  if (result.ageDifference <= -5) {
    return "Exceptional! You're aging slower than 99% of people your age.";
  } else if (result.ageDifference <= -3) {
    return "Excellent work! Your biological age is significantly younger than your actual age.";
  } else if (result.ageDifference <= 0) {
    return "Great job! You're maintaining or improving your biological age.";
  } else if (result.ageDifference <= 3) {
    return "Room for improvement. Focus on consistency to lower your bio-age.";
  } else {
    return "Let's work on this together. Small daily habits make a big difference.";
  }
}

export function xpToYearsSaved(xp: number): number {
  // Rough estimation: every 1000 XP = 0.1 years saved
  return (xp / 1000) * 0.1;
}
