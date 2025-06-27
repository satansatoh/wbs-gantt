import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from './jwt';

/**
 * JWT認可ミドルウェア（API Route用）
 * @param {NextRequest} req - リクエスト
 * @returns {Promise<{user: any} | Response>} 検証成功時はuser情報、失敗時は401レスポンス
 */
export async function requireAuth(req: NextRequest): Promise<{ user: any } | NextResponse> {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: '認証トークンがありません' } }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '').trim();
    const payload = await verifyJwt(token);
    if (!payload) {
        return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'トークンが無効です' } }, { status: 401 });
    }
    return { user: payload };
}

/**
 * 利用例（API Route内で）
 *
 * const auth = await requireAuth(req);
 * if ('user' in auth) {
 *   // 認証OK: auth.user にデコード済みユーザー情報
 * } else {
 *   return auth; // 401レスポンス
 * }
 */ 