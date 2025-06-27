import { useAuthStore } from '@/stores/authStore';

/**
 * JWT認証付きfetchラッパー
 * localStorageの'token'をAuthorizationヘッダーに自動付与
 * @param input fetchの第1引数
 * @param init fetchの第2引数
 * @returns fetchのレスポンス
 */
export async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}) {
    // クライアント側のみstoreからtoken取得
    const token = typeof window !== 'undefined' ? useAuthStore.getState().token : null;
    return fetch(input, {
        ...init,
        headers: {
            ...(init.headers || {}),
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
    });
} 