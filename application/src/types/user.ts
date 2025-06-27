export interface User {
    id: string; // ユーザーID
    email: string; // メールアドレス
    name: string; // 氏名
    role: 'admin' | 'member'; // 権限
    projects: string[]; // 参加プロジェクトID配列
    createdAt: Date;
    updatedAt: Date;
} 