import { cosmosClient } from './client';
import { User } from '../../types';

const DATABASE_ID = 'gantt-wbs-app';
const CONTAINER_ID = 'users';

/**
 * ユーザーを新規作成する
 * @param {User} user - ユーザーデータ
 * @returns {Promise<User | null>} 作成されたユーザー
 */
export async function createUser(user: User) {
    const database = cosmosClient.database(DATABASE_ID);
    const container = database.container(CONTAINER_ID);
    const response = await container.items.create(user);
    return response.resource ?? null;
}

/**
 * ユーザーをIDで取得する
 * @param {string} id - ユーザーID
 * @returns {Promise<User | null>} ユーザーデータ
 */
export async function getUser(id: string) {
    const database = cosmosClient.database(DATABASE_ID);
    const container = database.container(CONTAINER_ID);
    const response = await container.item(id, id).read<User>();
    return response.resource ?? null;
}

/**
 * ユーザー一覧を取得する
 * @returns {Promise<User[]>} ユーザー配列
 */
export async function listUsers() {
    const database = cosmosClient.database(DATABASE_ID);
    const container = database.container(CONTAINER_ID);
    const { resources } = await container.items.readAll<User>().fetchAll();
    return resources;
}

/**
 * ユーザーを更新する
 * @param {string} id - ユーザーID
 * @param {Partial<User>} data - 更新データ
 * @returns {Promise<User | null>} 更新後のユーザー
 */
export async function updateUser(id: string, data: Partial<User>) {
    const database = cosmosClient.database(DATABASE_ID);
    const container = database.container(CONTAINER_ID);
    const oldResponse = await container.item(id, id).read<User>();
    const updated = { ...oldResponse.resource, ...data, updatedAt: new Date() };
    const response = await container.items.upsert(updated);
    return response.resource ?? null;
}

/**
 * ユーザーを削除する
 * @param {string} id - ユーザーID
 * @returns {Promise<void>} 削除結果
 */
export async function deleteUser(id: string) {
    const database = cosmosClient.database(DATABASE_ID);
    const container = database.container(CONTAINER_ID);
    await container.item(id, id).delete();
}

/**
 * emailでユーザーを取得する
 * @param {string} email - メールアドレス
 * @returns {Promise<User & { password: string } | null>} ユーザー情報
 */
export async function getUserByEmail(email: string) {
    const users = await listUsers();
    // @ts-ignore: passwordはDB保存用プロパティ
    return users.find(u => u.email === email) ?? null;
} 