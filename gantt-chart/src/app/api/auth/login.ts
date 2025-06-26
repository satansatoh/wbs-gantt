import { NextRequest, NextResponse } from 'next/server';

/**
 * ログインAPI（認証・JWT発行）
 * @param {NextRequest} req - リクエストオブジェクト
 * @returns {NextResponse} レスポンス（雛形）
 */
export async function POST(req: NextRequest) {
    // TODO: バリデーション・認証処理を実装
    return NextResponse.json({ success: true, message: 'login endpoint (雛形)' });
} 