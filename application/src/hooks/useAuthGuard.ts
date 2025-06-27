import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

/**
 * 認証ガード用カスタムフック
 * JWTトークンがなければ/loginへリダイレクトする
 */
export function useAuthGuard(): void {
    const router = useRouter();
    const token = useAuthStore((state) => state.token);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!token) {
            router.replace('/login');
        }
    }, [router, token]);
} 