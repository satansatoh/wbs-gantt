import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUser } from '@/lib/database/user';
import { hashPassword } from '@/lib/auth/hash';
import { User } from '@/types/user';
import { v4 as uuidv4 } from 'uuid';

/**
 * サインアップAPI（ユーザー新規登録）
 * @param {NextRequest} req - リクエストオブジェクト
 * @returns {NextResponse} レスポンス
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, name, password } = body;

        // バリデーション
        if (!email || !name || !password) {
            return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'email, name, passwordは必須です' } }, { status: 400 });
        }

        // email重複チェック
        const existing = await getUserByEmail(email);
        if (existing) {
            return NextResponse.json({ success: false, error: { code: 'ALREADY_EXISTS', message: 'このメールアドレスは既に登録されています' } }, { status: 409 });
        }

        // パスワードハッシュ化
        const hashedPassword = await hashPassword(password);

        // Userデータ生成
        const now = new Date();
        const user: User = {
            id: uuidv4(),
            email,
            name,
            role: 'member',
            projects: [],
            createdAt: now,
            updatedAt: now,
        };
        // DB保存用にpasswordを一時的に付与
        const userWithPassword = { ...user, password: hashedPassword };

        // DB保存
        const created = await createUser(userWithPassword as User & { password: string });
        if (!created) {
            return NextResponse.json({ success: false, error: { code: 'DB_ERROR', message: 'ユーザー作成に失敗しました' } }, { status: 500 });
        }

        // レスポンス（パスワードは除外）
        const { password: _pw, ...userWithoutPassword } = created as unknown as User & { password: string };
        return NextResponse.json({ success: true, data: userWithoutPassword });
    } catch (e) {
        return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'サーバーエラー', details: e } }, { status: 500 });
    }
}

// emailでユーザーを取得するユーティリティ
async function getUserByEmail(email: string) {
    // ユーザー一覧からemail一致を探す（本番はインデックス/クエリ推奨）
    const users = await (await import('@/lib/database/user')).listUsers();
    return users.find(u => u.email === email) ?? null;
} 