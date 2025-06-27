import { create } from 'zustand';

interface AuthState {
    token: string | null;
    setToken: (token: string) => void;
    clearToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    setToken: (token: string) => {
        set({ token });
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
        }
    },
    clearToken: () => {
        set({ token: null });
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }
    },
})); 