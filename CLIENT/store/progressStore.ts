import { create } from 'zustand';
import api from '@/lib/api';

interface ProgressData {
  completionPercentage: string;
  completedLessons: number;
  totalLessons: number;
  completedExams: number;
  totalExams: number;
}

interface ProgressState {
  progress: ProgressData | null;
  isLoading: boolean;
  fetchProgress: (userId: string) => Promise<void>;
  markLessonComplete: (lessonId: string) => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progress: null,
  isLoading: false,

  fetchProgress: async (userId: string) => {
    set({ isLoading: true });
    try {
      const res = await api.get(`/progress/${userId}`);
      if (res.success) {
        set({ progress: res.data });
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  markLessonComplete: async (lessonId: string) => {
    try {
      await api.post(`/lessons/${lessonId}/complete`);
      // Re-fetch logic should ideally be triggered by the component to update UI
    } catch (error) {
      console.error('Failed to mark lesson complete:', error);
    }
  },
}));
