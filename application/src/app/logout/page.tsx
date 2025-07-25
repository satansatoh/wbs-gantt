"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * ログアウトページ
 * JWTトークンのキャッシュとlocalStorageを破棄し、トップページへリダイレクトします。
 */
const LogoutPage = () => {
    const router = useRouter();

    useEffect(() => {
        // JWTトークンのキャッシュ削除（例: cookie, sessionStorage, localStorage）
        if (typeof window !== 'undefined') {
            localStorage.clear();
            sessionStorage.clear();
            // Cookie削除（必要に応じて）
            document.cookie = 'token=; Max-Age=0; path=/;';
        }
        // トップページへリダイレクト
        router.replace('/login');
    }, [router]);

    return null;
};

export default LogoutPage; 