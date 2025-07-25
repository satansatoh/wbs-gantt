import { cosmosClient } from './client';
import { Task } from '../../types';
import { COSMOS_CONTAINER } from './container-constants';

const DATABASE_ID = process.env.COSMOS_DB_DATABASE as string;

/**
 * タスクを新規作成する
 * @param {Task} task - タスクデータ
 * @returns {Promise<Task>} 作成されたタスク
 */
export async function createTask(task: Task) {
    const database = cosmosClient.database(DATABASE_ID);
    const container = database.container(COSMOS_CONTAINER.TASK);
    const response = await container.items.create(task);
    return response.resource ?? null;
}

/**
 * タスクをID・プロジェクトIDで取得する
 * @param {string} id - タスクID
 * @param {string} projectId - プロジェクトID
 * @returns {Promise<Task | undefined>} タスクデータ
 */
export async function getTask(id: string, projectId: string) {
    const database = cosmosClient.database(DATABASE_ID);
    const container = database.container(COSMOS_CONTAINER.TASK);
    const resource = await container.item(id, projectId).read<Task>();
    return resource.resource as Task;
}

/**
 * プロジェクト内のタスク一覧を取得する
 * @param {string} projectId - プロジェクトID
 * @returns {Promise<Task[]>} タスク配列
 */
export async function listTasks(projectId: string) {
    const database = cosmosClient.database(DATABASE_ID);
    const container = database.container(COSMOS_CONTAINER.TASK);
    const query = {
        query: 'SELECT * FROM c WHERE c.projectId = @projectId',
        parameters: [{ name: '@projectId', value: projectId }],
    };
    const { resources } = await container.items.query<Task>(query).fetchAll();
    return resources;
}

/**
 * タスクを更新する
 * @param {string} id - タスクID
 * @param {string} projectId - プロジェクトID
 * @param {Partial<Task>} data - 更新データ
 * @returns {Promise<Task>} 更新後のタスク
 */
export async function updateTask(id: string, projectId: string, data: Partial<Task>) {
    const database = cosmosClient.database(DATABASE_ID);
    const container = database.container(COSMOS_CONTAINER.TASK);
    const oldResponse = await container.item(id, projectId).read<Task>();
    const updated = { ...oldResponse.resource, ...data, updatedAt: new Date() };
    const response = await container.items.upsert(updated);
    return response.resource ?? null;
}

/**
 * タスクを削除する
 * @param {string} id - タスクID
 * @param {string} projectId - プロジェクトID
 * @returns {Promise<void>} 削除結果
 */
export async function deleteTask(id: string, projectId: string) {
    const database = cosmosClient.database(DATABASE_ID);
    const container = database.container(COSMOS_CONTAINER.TASK);
    await container.item(id, projectId).delete();
} 