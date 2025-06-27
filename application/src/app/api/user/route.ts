import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';
import { listUsers } from '@/lib/database/user';
import { User } from '@/types/user';

/**
 * ユーザーAPI（GET:一覧）
 */
export async function GET(req: NextRequest) {
    const auth = await requireAuth(req);
    if (!('user' in auth)) return auth;
    const users = await listUsers();
    // パスワードは除外
    const usersWithoutPassword = users.map(u => {
        const { password, ...rest } = u as unknown as User & { password?: string };
        return rest;
    });
    return NextResponse.json({ success: true, data: usersWithoutPassword });
} 