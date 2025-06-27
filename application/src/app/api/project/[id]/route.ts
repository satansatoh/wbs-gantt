import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';
import { getProject, updateProject, deleteProject } from '@/lib/database/project';
import { Project } from '@/types/project';

/**
 * プロジェクト詳細取得API
 * @param {NextRequest} req - リクエストオブジェクト
 * @param {{ params: { id: string } }} params - パスパラメータ
 * @returns {Promise<NextResponse>} レスポンス
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const auth = await requireAuth(req);
    if (!('user' in auth)) return auth;
    const project = await getProject(params.id);
    if (!project) {
        return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'プロジェクトが見つかりません' } }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: project });
}

/**
 * プロジェクト更新API
 * @param {NextRequest} req - リクエストオブジェクト
 * @param {{ params: { id: string } }} params - パスパラメータ
 * @returns {Promise<NextResponse>} レスポンス
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const auth = await requireAuth(req);
    if (!('user' in auth)) return auth;
    try {
        const body = await req.json();
        const updated = await updateProject(params.id, { ...body, updatedAt: new Date() });
        if (!updated) {
            return NextResponse.json({ success: false, error: { code: 'DB_ERROR', message: 'プロジェクト更新に失敗しました' } }, { status: 400 });
        }
        return NextResponse.json({ success: true, data: updated });
    } catch (e) {
        return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'サーバーエラー', details: e } }, { status: 500 });
    }
}

/**
 * プロジェクト削除API
 * @param {NextRequest} req - リクエストオブジェクト
 * @param {{ params: { id: string } }} params - パスパラメータ
 * @returns {Promise<NextResponse>} レスポンス
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const auth = await requireAuth(req);
    if (!('user' in auth)) return auth;
    try {
        await deleteProject(params.id);
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'サーバーエラー', details: e } }, { status: 500 });
    }
} 