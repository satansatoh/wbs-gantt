"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import type { JSX } from 'react';
import { useRouter } from 'next/navigation';
import type { Project } from '@/types/project';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { fetchWithAuth } from '@/lib/api/fetchWithAuth';

/**
 * ダッシュボード画面
 * @returns {JSX.Element} ダッシュボードUI
 */
export default function DashboardPage(): JSX.Element {
    useAuthGuard();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const router = useRouter();

    // プロジェクト一覧取得
    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await fetchWithAuth('/api/project', { method: 'GET' });
                const data = await res.json();
                if (!data.success) {
                    setError(data.error?.message || "プロジェクト取得に失敗しました");
                } else {
                    setProjects(data.data as Project[]);
                }
            } catch (e) {
                setError("サーバーエラーが発生しました");
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
            <h1 className="text-3xl font-bold mb-6">ダッシュボード</h1>
            <div className="bg-white p-6 rounded shadow w-full max-w-2xl">
                <p className="mb-4">ようこそ！ここにプロジェクト一覧や各種情報が表示されます。</p>
                <div className="border-t pt-4 mt-4">
                    <h2 className="text-xl font-semibold mb-2">プロジェクト一覧</h2>
                    {loading ? (
                        <div className="text-gray-500">読み込み中...</div>
                    ) : error ? (
                        <div className="text-red-500">{error}</div>
                    ) : projects.length === 0 ? (
                        <div className="text-gray-500">プロジェクトがありません</div>
                    ) : (
                        <ul className="space-y-2">
                            {projects.map((p) => (
                                <li key={p.id} className="border rounded px-4 py-2 bg-gray-100 flex justify-between items-center">
                                    <Link href={`/project/${p.id}`} className="text-blue-600 hover:underline font-semibold">{p.name}</Link>
                                    <Link href={`/project/${p.id}`} className="text-blue-600 hover:underline text-sm">詳細</Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="mt-8 text-right">
                    <Link href="/project/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">新規プロジェクト作成</Link>
                </div>
            </div>
        </div>
    );
} 