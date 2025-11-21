import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
    id: number;
    email: string;
    name: string;
    is_active: boolean;
    is_superuser: boolean;
    phone_number?: string;
    bio?: string;
    profession?: string;
    image_url?: string;
}

interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    setToken: (token: string) => void;
    setUser: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            isAuthenticated: false,
            setToken: (token) => set({ token, isAuthenticated: !!token }),
            setUser: (user) => set({ user }),
            logout: () => set({ token: null, user: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-storage',
        }
    )
);
