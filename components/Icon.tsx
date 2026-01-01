import React from 'react';
import {
  Flame,
  BarChart2,
  User,
  Check,
  Circle,
  Zap,
  Clock,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  PiggyBank,
  Trophy,
  Star,
  Award,
  Shield,
  Crown,
  Snowflake,
  Gem,
  ExternalLink,
  Trash,
  Pill,
  Salad,
  TrendingUp,
  Heart,
  Info,
  Dumbbell,
  Moon,
  Activity,
  LucideProps,
} from 'lucide-react-native';

export type IconName =
  | 'flame'
  | 'bar-chart'
  | 'user'
  | 'check'
  | 'circle'
  | 'zap'
  | 'clock'
  | 'chevron-right'
  | 'chevron-up'
  | 'chevron-down'
  | 'piggy-bank'
  | 'trophy'
  | 'star'
  | 'award'
  | 'shield'
  | 'crown'
  | 'snowflake'
  | 'gem'
  | 'external-link'
  | 'trash'
  | 'pill'
  | 'salad'
  | 'trending-up'
  | 'heart'
  | 'info'
  | 'dumbbell'
  | 'moon'
  | 'activity';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const iconMap: Record<IconName, React.ComponentType<LucideProps>> = {
  'flame': Flame,
  'bar-chart': BarChart2,
  'user': User,
  'check': Check,
  'circle': Circle,
  'zap': Zap,
  'clock': Clock,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,
  'piggy-bank': PiggyBank,
  'trophy': Trophy,
  'star': Star,
  'award': Award,
  'shield': Shield,
  'crown': Crown,
  'snowflake': Snowflake,
  'gem': Gem,
  'external-link': ExternalLink,
  'trash': Trash,
  'pill': Pill,
  'salad': Salad,
  'trending-up': TrendingUp,
  'heart': Heart,
  'info': Info,
  'dumbbell': Dumbbell,
  'moon': Moon,
  'activity': Activity,
};

export function Icon({ name, size = 24, color = '#FFFFFF', strokeWidth = 2 }: IconProps) {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent size={size} color={color} strokeWidth={strokeWidth} />;
}
