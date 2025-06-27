'use client';
import { useInitializeAuth } from '@/hooks/useInitializeAuth';

/**
 * アプリ起動時にローカルストレージのトークンをストアへ反映するクライアント専用コンポーネント
 */
export default function ClientAuthInitializer() {
    useInitializeAuth();
    return null;
} 