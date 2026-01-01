import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BLUEPRINT_TASKS } from '../data/blueprintProtocol';
import { useUserStore } from './userStore';

interface TaskCompletion {
  taskId: string;
  date: string;
  xp: number;
}

interface TaskState {
  completions: TaskCompletion[];

  // Actions
  completeTask: (taskId: string) => void;
  uncompleteTask: (taskId: string) => void;
  isTaskCompleted: (taskId: string) => boolean;
  isTaskCompletedOnDate: (taskId: string, date: string) => boolean;
  getCompletionPercentage: () => number;
  getTodayXP: () => number;
  getTodayCompletions: () => TaskCompletion[];
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      completions: [],

      completeTask: (taskId: string) => {
        const today = new Date().toISOString().split('T')[0];
        const { completions } = get();

        // Check if already completed today
        const alreadyCompleted = completions.some(
          (c) => c.taskId === taskId && c.date === today
        );

        if (alreadyCompleted) return;

        const task = BLUEPRINT_TASKS.find((t) => t.id === taskId);
        const xp = task?.xp || 10;

        set({
          completions: [...completions, { taskId, date: today, xp }],
        });

        // Add XP to user store
        useUserStore.getState().addXP(xp);

        // Check if all tasks completed today
        const todayCompletions = get().getTodayCompletions();
        if (todayCompletions.length === BLUEPRINT_TASKS.length) {
          useUserStore.getState().updateStreak(true);
        }
      },

      uncompleteTask: (taskId: string) => {
        const today = new Date().toISOString().split('T')[0];
        const { completions } = get();

        const completion = completions.find(
          (c) => c.taskId === taskId && c.date === today
        );

        if (completion) {
          set({
            completions: completions.filter(
              (c) => !(c.taskId === taskId && c.date === today)
            ),
          });

          // Remove XP
          useUserStore.getState().addXP(-completion.xp);
        }
      },

      isTaskCompleted: (taskId: string) => {
        const today = new Date().toISOString().split('T')[0];
        return get().completions.some(
          (c) => c.taskId === taskId && c.date === today
        );
      },

      isTaskCompletedOnDate: (taskId: string, date: string) => {
        return get().completions.some(
          (c) => c.taskId === taskId && c.date === date
        );
      },

      getCompletionPercentage: () => {
        const todayCompletions = get().getTodayCompletions();
        return (todayCompletions.length / BLUEPRINT_TASKS.length) * 100;
      },

      getTodayXP: () => {
        const todayCompletions = get().getTodayCompletions();
        return todayCompletions.reduce((sum, c) => sum + c.xp, 0);
      },

      getTodayCompletions: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().completions.filter((c) => c.date === today);
      },
    }),
    {
      name: 'blueprint-task-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
