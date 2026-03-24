import { create } from 'zustand';
import api from '@/lib/api';

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  videoUrl: string;
  orderIndex: number;
}

export interface Exam {
  id: string;
  courseId: string;
  title: string;
  orderIndex: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  exams: Exam[];
}

interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  isLoading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
  fetchCourseById: (id: string) => Promise<void>;
}

export const useCourseStore = create<CourseState>((set) => ({
  courses: [],
  currentCourse: null,
  isLoading: false,
  error: null,

  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/courses');
      if (res.success) {
        set({ courses: res.data });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch courses' });
      console.error('Failed to fetch courses:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCourseById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get(`/courses/${id}`);
      if (res.success) {
        set({ currentCourse: res.data });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch course' });
      console.error('Failed to fetch course:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
