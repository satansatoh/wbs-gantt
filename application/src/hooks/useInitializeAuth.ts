'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export const useInitializeAuth = () => {
    const initializeToken = useAuthStore((state) => state.initializeToken);
    useEffect(() => {
        initializeToken();
    }, [initializeToken]);
}; 