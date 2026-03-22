import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'ADMIN';
  approved: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (token, user) => {
        Cookies.set('lms_token', token, { expires: 7 }); // 7 days
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        Cookies.remove('lms_token');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
