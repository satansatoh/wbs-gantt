export interface Task {
    id: string; // タスクID
    projectId: string; // プロジェクトID
    parentId: string | null; // 親タスクID（ルートはnull）
    title: string; // タスク名
    description: string; // 概要（Markdown対応）
    startDate: string; // 開始日（ISO8601）
    endDate: string; // 終了日（ISO8601）
    progress: number; // 進捗率（0-100）
    dependencies: string[]; // 依存タスクID配列
    assignee: string; // 担当者ユーザーID
    attributes: Record<string, any>; // 任意属性（グルーピング等）
    createdAt: Date;
    updatedAt: Date;
} 