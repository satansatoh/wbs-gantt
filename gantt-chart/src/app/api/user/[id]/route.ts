import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';
import { getUser, updateUser, deleteUser } from '@/lib/database/user';
import { User } from '@/types/user';

/**
 * ユーザー詳細取得API
 * @param {NextRequest} req - リクエストオブジェクト
 * @param {{ params: { id: string } }} params - パスパラメータ
 * @returns {Promise<NextResponse>} レスポンス
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const auth = await requireAuth(req);
    if (!('user' in auth)) return auth;
    const user = await getUser(params.id);
    if (!user) {
        return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'ユーザーが見つかりません' } }, { status: 404 });
    }
    // パスワードは除外
    const { password, ...userWithoutPassword } = user as unknown as User & { password?: string };
    return NextResponse.json({ success: true, data: userWithoutPassword });
}

/**
 * ユーザー更新API
 * @param {NextRequest} req - リクエストオブジェクト
 * @param {{ params: { id: string } }} params - パスパラメータ
 * @returns {Promise<NextResponse>} レスポンス
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const auth = await requireAuth(req);
    if (!('user' in auth)) return auth;
    try {
        const body = await req.json();
        const updated = await updateUser(params.id, { ...body, updatedAt: new Date() });
        if (!updated) {
            return NextResponse.json({ success: false, error: { code: 'DB_ERROR', message: 'ユーザー更新に失敗しました' } }, { status: 400 });
        }
        const { password, ...userWithoutPassword } = updated as unknown as User & { password?: string };
        return NextResponse.json({ success: true, data: userWithoutPassword });
    } catch (e) {
        return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'サーバーエラー', details: e } }, { status: 500 });
    }
}

/**
 * ユーザー削除API
 * @param {NextRequest} req - リクエストオブジェクト
 * @param {{ params: { id: string } }} params - パスパラメータ
 * @returns {Promise<NextResponse>} レスポンス
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const auth = await requireAuth(req);
    if (!('user' in auth)) return auth;
    try {
        await deleteUser(params.id);
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'サーバーエラー', details: e } }, { status: 500 });
    }
} 