import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
 user: any | null;
 isLoading: boolean;
 setUser: (user: any | null) => void;
 setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
 persist(
 (set) => ({
 user: null,
 isLoading: false,
 setUser: (user) => set({ user }),
 setLoading: (isLoading) => set({ isLoading }),
 }),
 {
 name: 'auth-storage',
 }
 )
);
