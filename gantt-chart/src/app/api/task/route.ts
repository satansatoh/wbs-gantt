import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';
import { listTasks, createTask } from '@/lib/database/task';
import { Task } from '@/types/task';
import { v4 as uuidv4 } from 'uuid';

/**
 * タスク一覧取得API
 * @param {NextRequest} req - リクエストオブジェクト
 * @returns {Promise<NextResponse>} レスポンス
 */
export async function GET(req: NextRequest) {
    const auth = await requireAuth(req);
    if (!('user' in auth)) return auth;
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    if (!projectId) {
        return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'projectIdは必須です' } }, { status: 400 });
    }
    const tasks = await listTasks(projectId);
    return NextResponse.json({ success: true, data: tasks });
}

/**
 * タスク新規作成API
 * @param {NextRequest} req - リクエストオブジェクト
 * @returns {Promise<NextResponse>} レスポンス
 */
export async function POST(req: NextRequest) {
    const auth = await requireAuth(req);
    if (!('user' in auth)) return auth;
    try {
        const body = await req.json();
        const { projectId, title, description, startDate, endDate, assignee, parentId, dependencies, attributes } = body;
        if (!projectId || !title || !startDate || !endDate) {
            return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'projectId, title, startDate, endDateは必須です' } }, { status: 400 });
        }
        const now = new Date();
        const task: Task = {
            id: uuidv4(),
            projectId,
            parentId: parentId ?? null,
            title,
            description: description ?? '',
            startDate,
            endDate,
            progress: 0,
            dependencies: dependencies ?? [],
            assignee: assignee ?? auth.user.userId,
            attributes: attributes ?? {},
            createdAt: now,
            updatedAt: now,
        };
        const created = await createTask(task);
        if (!created) {
            return NextResponse.json({ success: false, error: { code: 'DB_ERROR', message: 'タスク作成に失敗しました' } }, { status: 400 });
        }
        return NextResponse.json({ success: true, data: created });
    } catch (e) {
        return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'サーバーエラー', details: e } }, { status: 500 });
    }
} 