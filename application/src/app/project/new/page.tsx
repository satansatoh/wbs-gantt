"use client";
import React, { useState, useRef } from 'react';
import type { JSX } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchWithAuth } from '@/lib/api/fetchWithAuth';

// 禁止文字（例: 絵文字や一部記号）
const FORBIDDEN_REGEX = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}<>$%]/u;

/**
 * 新規プロジェクト作成画面
 * @returns {JSX.Element} 新規プロジェクト作成UI
 */
export default function ProjectNewPage(): JSX.Element {
    useAuthGuard();
    const router = useRouter();
    const nameRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLTextAreaElement>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [nameError, setNameError] = useState('');
    const [descError, setDescError] = useState('');
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);

    /**
     * プロジェクト名バリデーション
     */
    const validateName = (value: string): string => {
        if (!value.trim()) return 'プロジェクト名は必須です';
        if (value.length < 1 || value.length > 50) return '1〜50文字で入力してください';
        if (FORBIDDEN_REGEX.test(value)) return '使用できない文字が含まれています';
        return '';
    };

    /**
     * 概要バリデーション
     */
    const validateDesc = (value: string): string => {
        if (value.length > 200) return '200文字以内で入力してください';
        if (FORBIDDEN_REGEX.test(value)) return '使用できない文字が含まれています';
        return '';
    };

    /**
     * 入力時バリデーション
     */
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        setNameError(validateName(e.target.value));
    };
    const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
        setDescError(validateDesc(e.target.value));
    };

    /**
     * フォーム送信ハンドラ
     * @param {React.FormEvent} e
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError('');
        const nErr = validateName(name);
        const dErr = validateDesc(description);
        setNameError(nErr);
        setDescError(dErr);
        if (nErr) {
            nameRef.current?.focus();
            return;
        }
        if (dErr) {
            descRef.current?.focus();
            return;
        }
        setLoading(true);
        try {
            const res = await fetchWithAuth('/api/project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description }),
            });
            const data = await res.json();
            if (!data.success) {
                setApiError(data.error?.message || '作成に失敗しました');
                toast.error(data.error?.message || '作成に失敗しました');
                if (data.error?.field === 'name') nameRef.current?.focus();
                if (data.error?.field === 'description') descRef.current?.focus();
            } else {
                toast.success('プロジェクトを作成しました');
                router.push('/dashboard');
            }
        } catch (e) {
            setApiError('サーバーエラーが発生しました');
            toast.error('サーバーエラーが発生しました');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
            <h1 className="text-2xl font-bold mb-6">新規プロジェクト作成</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-md" noValidate>
                <div className="mb-4">
                    <label htmlFor="name" className="block font-semibold mb-1">プロジェクト名<span className="text-red-500">*</span></label>
                    <Input
                        id="name"
                        type="text"
                        className={`w-full border rounded px-3 py-2 ${nameError ? 'border-red-500' : ''}`}
                        value={name}
                        onChange={handleNameChange}
                        required
                        maxLength={50}
                        ref={nameRef}
                        aria-invalid={nameError ? 'true' : 'false'}
                        aria-describedby="name-error"
                    />
                    {nameError && <div id="name-error" className="text-red-500 text-sm mt-1" role="alert">{nameError}</div>}
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block font-semibold mb-1">概要</label>
                    <textarea
                        id="description"
                        className={`w-full border rounded px-3 py-2 ${descError ? 'border-red-500' : ''}`}
                        value={description}
                        onChange={handleDescChange}
                        maxLength={200}
                        rows={4}
                        ref={descRef}
                        aria-invalid={descError ? 'true' : 'false'}
                        aria-describedby="desc-error"
                    />
                    {descError && <div id="desc-error" className="text-red-500 text-sm mt-1" role="alert">{descError}</div>}
                </div>
                {apiError && <div className="text-red-500 mb-4" role="alert">{apiError}</div>}
                <Button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full flex items-center justify-center"
                    disabled={loading}
                >
                    {loading ? <span className="animate-spin mr-2 border-2 border-white border-t-transparent rounded-full w-4 h-4"></span> : null}
                    {loading ? '作成中...' : '作成する'}
                </Button>
            </form>
        </div>
    );
} 