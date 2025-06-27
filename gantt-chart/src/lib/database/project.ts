import { cosmosClient } from './client';
import { Project } from '../../types';
import { COSMOS_CONTAINER } from './container-constants';

const DATABASE_ID = 'gantt-wbs-app';

/**
 * プロジェクトを新規作成する
 * @param {Project} project - プロジェクトデータ
 * @returns {Promise<Project | null>} 作成されたプロジェクト
 */
export async function createProject(project: Project) {
    const database = cosmosClient.database(DATABASE_ID);
    const container = database.container(COSMOS_CONTAINER.PROJECT);
    const response = await container.items.create(project);
    return response.resource ?? null;
}

/**
 * プロジェクトをIDで取得する
 * @param {string} id - プロジェクトID
 * @returns {Promise<Project | null>} プロジェクトデータ
 */
export async function getProject(id: string) {
    const database = cosmosClient.database(DATABASE_ID);
    const container = database.container(COSMOS_CONTAINER.PROJECT);
    const response = await container.item(id, id).read<Project>();
    return response.resource ?? null;
}

/**
 * プロジェクト一覧を取得する
 * @returns {Promise<Project[]>} プロジェクト配列
 */
export async function listProjects() {
    const database = cosmosClient.database(DATABASE_ID);
    const container = database.container(COSMOS_CONTAINER.PROJECT);
    const { resources } = await container.items.readAll<Project>().fetchAll();
    return resources;
}

/**
 * プロジェクトを更新する
 * @param {string} id - プロジェクトID
 * @param {Partial<Project>} data - 更新データ
 * @returns {Promise<Project | null>} 更新後のプロジェクト
 */
export async function updateProject(id: string, data: Partial<Project>) {
    const database = cosmosClient.database(DATABASE_ID);
    const container = database.container(COSMOS_CONTAINER.PROJECT);
    const oldResponse = await container.item(id, id).read<Project>();
    const updated = { ...oldResponse.resource, ...data, updatedAt: new Date() };
    const response = await container.items.upsert(updated);
    return response.resource ?? null;
}

/**
 * プロジェクトを削除する
 * @param {string} id - プロジェクトID
 * @returns {Promise<void>} 削除結果
 */
export async function deleteProject(id: string) {
    const database = cosmosClient.database(DATABASE_ID);
    const container = database.container(COSMOS_CONTAINER.PROJECT);
    await container.item(id, id).delete();
} 