import { NextRequest, NextResponse } from 'next/server';

/**
 * サインアップAPI（ユーザー新規登録）
 * @param {NextRequest} req - リクエストオブジェクト
 * @returns {NextResponse} レスポンス（雛形）
 */
export async function POST(req: NextRequest) {
    // TODO: バリデーション・ユーザー作成処理を実装
    return NextResponse.json({ success: true, message: 'signup endpoint (雛形)' });
} 