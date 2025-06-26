import { cosmosClient } from './client';
import { User } from '../../types';

const DATABASE_ID = 'gantt-wbs-app';
const CONTAINER_ID = 'users';

/**
 * ユーザーを新規作成する
 * @param {User} user - ユーザーデータ
 * @returns {Promise<User>} 作成されたユーザー
 */
export async function createUser(user: User) {
    const { database } = cosmosClient.database(DATABASE_ID);
    const { container } = database.container(CONTAINER_ID);
    const { resource } = await container.items.create(user);
    return resource as User;
}

/**
 * ユーザーをIDで取得する
 * @param {string} id - ユーザーID
 * @returns {Promise<User | undefined>} ユーザーデータ
 */
export async function getUser(id: string) {
    const { database } = cosmosClient.database(DATABASE_ID);
    const { container } = database.container(CONTAINER_ID);
    const { resource } = await container.item(id, id).read<User>();
    return resource;
}

/**
 * ユーザー一覧を取得する
 * @returns {Promise<User[]>} ユーザー配列
 */
export async function listUsers() {
    const { database } = cosmosClient.database(DATABASE_ID);
    const { container } = database.container(CONTAINER_ID);
    const { resources } = await container.items.readAll<User>().fetchAll();
    return resources;
}

/**
 * ユーザーを更新する
 * @param {string} id - ユーザーID
 * @param {Partial<User>} data - 更新データ
 * @returns {Promise<User>} 更新後のユーザー
 */
export async function updateUser(id: string, data: Partial<User>) {
    const { database } = cosmosClient.database(DATABASE_ID);
    const { container } = database.container(CONTAINER_ID);
    const { resource: old } = await container.item(id, id).read<User>();
    const updated = { ...old, ...data, updatedAt: new Date() };
    const { resource } = await container.items.upsert(updated);
    return resource as User;
}

/**
 * ユーザーを削除する
 * @param {string} id - ユーザーID
 * @returns {Promise<void>} 削除結果
 */
export async function deleteUser(id: string) {
    const { database } = cosmosClient.database(DATABASE_ID);
    const { container } = database.container(CONTAINER_ID);
    await container.item(id, id).delete();
} 