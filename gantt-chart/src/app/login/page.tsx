"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * ログイン画面
 * @returns {JSX.Element} ログインフォームUI
 */
export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!email || !password) {
            setError("メールアドレスとパスワードは必須です");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!data.success) {
                setError(data.error?.message || "ログインに失敗しました");
            } else {
                // TODO: トークン保存・状態管理
                router.push("/dashboard");
            }
        } catch (e) {
            setError("サーバーエラーが発生しました");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-6"
            >
                <h1 className="text-2xl font-bold text-center">ログイン</h1>
                {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                <div>
                    <label htmlFor="login-email" className="block text-sm font-medium mb-1">メールアドレス</label>
                    <Input
                        id="login-email"
                        type="email"
                        className="w-full border rounded px-3 py-2"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="login-password" className="block text-sm font-medium mb-1">パスワード</label>
                    <Input
                        id="login-password"
                        type="password"
                        className="w-full border rounded px-3 py-2"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                    />
                </div>
                <Button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? "ログイン中..." : "ログイン"}
                </Button>
            </form>
        </div>
    );
} 