import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/database/user';
import { verifyPassword } from '@/lib/auth/hash';
import { signJwt } from '@/lib/auth/jwt';
import { User } from '@/types/user';

/**
 * ログインAPI（認証・JWT発行）
 * @param {NextRequest} req - リクエストオブジェクト
 * @returns {NextResponse} レスポンス
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        // バリデーション
        if (!email || !password) {
            return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'email, passwordは必須です' } }, { status: 400 });
        }

        // ユーザー取得
        const user = await getUserByEmail(email);
        if (!user) {
            return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'ユーザーが見つかりません' } }, { status: 404 });
        }

        // パスワード検証
        // @ts-ignore: passwordはDB保存用プロパティ
        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
            return NextResponse.json({ success: false, error: { code: 'AUTH_FAILED', message: 'パスワードが正しくありません' } }, { status: 401 });
        }

        // JWT発行
        const token = await signJwt({ userId: user.id, email: user.email, role: user.role });

        // レスポンス（パスワードは除外）
        const { password: _pw, ...userWithoutPassword } = user as unknown as User & { password: string };
        return NextResponse.json({ success: true, data: { token, user: userWithoutPassword } });
    } catch (e) {
        return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'サーバーエラー', details: e } }, { status: 500 });
    }
} 