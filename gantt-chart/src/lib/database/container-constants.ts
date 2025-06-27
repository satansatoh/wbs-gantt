/**
 * Cosmos DBコンテナ名定数
 * 各エンティティごとにコンテナ名を一元管理
 */
export const COSMOS_CONTAINER = {
    PROJECT: 'projects',
    TASK: 'tasks',
    USER: 'users',
} as const;

export type CosmosContainerKey = keyof typeof COSMOS_CONTAINER; 