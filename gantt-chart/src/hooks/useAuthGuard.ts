import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * 認証ガード用カスタムフック
 * JWTトークンがなければ/loginへリダイレクトする
 */
export function useAuthGuard(): void {
    const router = useRouter();

    useEffect(() => {
        /**
         * JWTトークンをlocalStorageまたはcookieから取得
         * @returns {string | null} トークン
         */
        const getToken = (): string | null => {
            if (typeof window === 'undefined') return null;
            // localStorage優先、なければcookie
            const token = localStorage.getItem('token');
            if (token) return token;
            const match = document.cookie.match(/token=([^;]+)/);
            return match ? match[1] : null;
        };
        const token = getToken();
        if (!token) {
            router.push('/login');
        }
    }, [router]);
} 