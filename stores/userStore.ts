import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LEVEL_TITLES, getLevelFromXP } from '../data/blueprintProtocol';

interface UserState {
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  streakFreezes: number;
  isPremium: boolean;
  hasBudgetAccess: boolean;
  createdAt: string;

  // Actions
  addXP: (xp: number) => void;
  getLevel: () => number;
  getLevelTitle: () => string;
  updateStreak: (completedToday: boolean) => void;
  addStreakFreeze: (count: number) => void;
  useStreakFreeze: () => boolean;
  setPremium: (value: boolean) => void;
  unlockBudget: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      totalXP: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null,
      streakFreezes: 1,
      isPremium: false,
      hasBudgetAccess: false,
      createdAt: new Date().toISOString(),

      addXP: (xp: number) => {
        set((state) => ({
          totalXP: state.totalXP + xp,
        }));
      },

      getLevel: () => {
        return getLevelFromXP(get().totalXP);
      },

      getLevelTitle: () => {
        const level = get().getLevel();
        return LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length) - 1] || 'Novice';
      },

      updateStreak: (completedToday: boolean) => {
        const today = new Date().toISOString().split('T')[0];
        const { lastCompletedDate, currentStreak, longestStreak, streakFreezes } = get();

        if (completedToday) {
          if (lastCompletedDate === today) {
            // Already completed today, no change
            return;
          }

          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          let newStreak = currentStreak;
          if (lastCompletedDate === yesterdayStr) {
            // Continuing streak
            newStreak = currentStreak + 1;
          } else if (lastCompletedDate === null) {
            // First day
            newStreak = 1;
          } else {
            // Streak broken, start new
            newStreak = 1;
          }

          set({
            currentStreak: newStreak,
            longestStreak: Math.max(longestStreak, newStreak),
            lastCompletedDate: today,
          });
        }
      },

      addStreakFreeze: (count: number) => {
        set((state) => ({
          streakFreezes: state.streakFreezes + count,
        }));
      },

      useStreakFreeze: () => {
        const { streakFreezes } = get();
        if (streakFreezes > 0) {
          set({ streakFreezes: streakFreezes - 1 });
          return true;
        }
        return false;
      },

      setPremium: (value: boolean) => {
        set({ isPremium: value });
      },

      unlockBudget: () => {
        set({ hasBudgetAccess: true });
      },
    }),
    {
      name: 'blueprint-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
