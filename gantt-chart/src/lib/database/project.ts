import { cosmosClient } from './client';
import { Project } from '../../types';

const DATABASE_ID = 'gantt-wbs-app';
const CONTAINER_ID = 'projects';

/**
 * プロジェクトを新規作成する
 * @param {Project} project - プロジェクトデータ
 * @returns {Promise<Project>} 作成されたプロジェクト
 */
export async function createProject(project: Project) {
    const { database } = cosmosClient.database(DATABASE_ID);
    const { container } = database.container(CONTAINER_ID);
    const { resource } = await container.items.create(project);
    return resource as Project;
}

/**
 * プロジェクトをIDで取得する
 * @param {string} id - プロジェクトID
 * @returns {Promise<Project | undefined>} プロジェクトデータ
 */
export async function getProject(id: string) {
    const { database } = cosmosClient.database(DATABASE_ID);
    const { container } = database.container(CONTAINER_ID);
    const { resource } = await container.item(id, id).read<Project>();
    return resource;
}

/**
 * プロジェクト一覧を取得する
 * @returns {Promise<Project[]>} プロジェクト配列
 */
export async function listProjects() {
    const { database } = cosmosClient.database(DATABASE_ID);
    const { container } = database.container(CONTAINER_ID);
    const { resources } = await container.items.readAll<Project>().fetchAll();
    return resources;
}

/**
 * プロジェクトを更新する
 * @param {string} id - プロジェクトID
 * @param {Partial<Project>} data - 更新データ
 * @returns {Promise<Project>} 更新後のプロジェクト
 */
export async function updateProject(id: string, data: Partial<Project>) {
    const { database } = cosmosClient.database(DATABASE_ID);
    const { container } = database.container(CONTAINER_ID);
    const { resource: old } = await container.item(id, id).read<Project>();
    const updated = { ...old, ...data, updatedAt: new Date() };
    const { resource } = await container.items.upsert(updated);
    return resource as Project;
}

/**
 * プロジェクトを削除する
 * @param {string} id - プロジェクトID
 * @returns {Promise<void>} 削除結果
 */
export async function deleteProject(id: string) {
    const { database } = cosmosClient.database(DATABASE_ID);
    const { container } = database.container(CONTAINER_ID);
    await container.item(id, id).delete();
} 