import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';
import { listProjects, createProject } from '@/lib/database/project';
import { Project } from '@/types/project';
import { v4 as uuidv4 } from 'uuid';

/**
 * プロジェクトAPI（GET:一覧, POST:新規作成）
 */
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!('user' in auth)) return auth;
  const projects = await listProjects();
  return NextResponse.json({ success: true, data: projects });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!('user' in auth)) return auth;
  try {
    const body = await req.json();
    const { name, description, members } = body;
    if (!name || !description) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'name, descriptionは必須です' } }, { status: 400 });
    }
    const now = new Date();
    const project: Project = {
      id: uuidv4(),
      name,
      description,
      members: members ?? [auth.user.userId],
      createdAt: now,
      updatedAt: now,
    };
    const created = await createProject(project);
    if (!created) {
      return NextResponse.json({ success: false, error: { code: 'DB_ERROR', message: 'プロジェクト作成に失敗しました' } }, { status: 500 });
    }
    return NextResponse.json({ success: true, data: created });
  } catch (e) {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'サーバーエラー', details: e } }, { status: 500 });
  }
} 