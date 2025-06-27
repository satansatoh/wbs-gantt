import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';
import { getTask, updateTask, deleteTask } from '@/lib/database/task';
import { Task } from '@/types/task';

/**
 * タスク詳細取得API
 * @param {NextRequest} req - リクエストオブジェクト
 * @param {{ params: { id: string } }} params - パスパラメータ
 * @returns {Promise<NextResponse>} レスポンス
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const auth = await requireAuth(req);
    if (!('user' in auth)) return auth;
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    if (!projectId) {
        return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'projectIdは必須です' } }, { status: 400 });
    }
    const task = await getTask(params.id, projectId);
    if (!task) {
        return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'タスクが見つかりません' } }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: task });
}

/**
 * タスク更新API
 * @param {NextRequest} req - リクエストオブジェクト
 * @param {{ params: { id: string } }} params - パスパラメータ
 * @returns {Promise<NextResponse>} レスポンス
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const auth = await requireAuth(req);
    if (!('user' in auth)) return auth;
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    if (!projectId) {
        return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'projectIdは必須です' } }, { status: 400 });
    }
    try {
        const body = await req.json();
        const updated = await updateTask(params.id, projectId, { ...body, updatedAt: new Date() });
        if (!updated) {
            return NextResponse.json({ success: false, error: { code: 'DB_ERROR', message: 'タスク更新に失敗しました' } }, { status: 400 });
        }
        return NextResponse.json({ success: true, data: updated });
    } catch (e) {
        return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'サーバーエラー', details: e } }, { status: 500 });
    }
}

/**
 * タスク削除API
 * @param {NextRequest} req - リクエストオブジェクト
 * @param {{ params: { id: string } }} params - パスパラメータ
 * @returns {Promise<NextResponse>} レスポンス
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const auth = await requireAuth(req);
    if (!('user' in auth)) return auth;
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    if (!projectId) {
        return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'projectIdは必須です' } }, { status: 400 });
    }
    try {
        await deleteTask(params.id, projectId);
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'サーバーエラー', details: e } }, { status: 500 });
    }
} 