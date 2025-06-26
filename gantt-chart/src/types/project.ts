export interface Project {
    id: string; // プロジェクトID
    name: string; // プロジェクト名
    description: string; // プロジェクト概要
    members: string[]; // 参加ユーザーID配列
    createdAt: Date;
    updatedAt: Date;
} 