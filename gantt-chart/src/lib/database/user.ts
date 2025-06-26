import { cosmosClient } from './client';
import { User } from '../../types';

const DATABASE_ID = 'gantt-wbs-app';
const CONTAINER_ID = 'users';

export async function createUser(user: User) {
    const { database } = cosmosClient.database(DATABASE_ID);
    const { container } = database.container(CONTAINER_ID);
    const { resource } = await container.items.create(user);
    return resource as User;
}

export async function getUser(id: string) {
    const { database } = cosmosClient.database(DATABASE_ID);
    const { container } = database.container(CONTAINER_ID);
    const { resource } = await container.item(id, id).read<User>();
    return resource;
}

export async function listUsers() {
    const { database } = cosmosClient.database(DATABASE_ID);
    const { container } = database.container(CONTAINER_ID);
    const { resources } = await container.items.readAll<User>().fetchAll();
    return resources;
}

export async function updateUser(id: string, data: Partial<User>) {
    const { database } = cosmosClient.database(DATABASE_ID);
    const { container } = database.container(CONTAINER_ID);
    const { resource: old } = await container.item(id, id).read<User>();
    const updated = { ...old, ...data, updatedAt: new Date() };
    const { resource } = await container.items.upsert(updated);
    return resource as User;
}

export async function deleteUser(id: string) {
    const { database } = cosmosClient.database(DATABASE_ID);
    const { container } = database.container(CONTAINER_ID);
    await container.item(id, id).delete();
} 