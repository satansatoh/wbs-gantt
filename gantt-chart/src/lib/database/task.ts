import { cosmosClient } from './client';
import { Task } from '../../types';

const DATABASE_ID = 'gantt-wbs-app';
const CONTAINER_ID = 'tasks';

export async function createTask(task: Task) {
    const { database } = cosmosClient.database(DATABASE_ID);
    const { container } = database.container(CONTAINER_ID);
    const { resource } = await container.items.create(task);
    return resource as Task;
}

export async function getTask(id: string, projectId: string) {
    const { database } = cosmosClient.database(DATABASE_ID);
    const { container } = database.container(CONTAINER_ID);
    const { resource } = await container.item(id, projectId).read<Task>();
    return resource;
}

export async function listTasks(projectId: string) {
    const { database } = cosmosClient.database(DATABASE_ID);
    const { container } = database.container(CONTAINER_ID);
    const query = {
        query: 'SELECT * FROM c WHERE c.projectId = @projectId',
        parameters: [{ name: '@projectId', value: projectId }],
    };
    const { resources } = await container.items.query<Task>(query).fetchAll();
    return resources;
}

export async function updateTask(id: string, projectId: string, data: Partial<Task>) {
    const { database } = cosmosClient.database(DATABASE_ID);
    const { container } = database.container(CONTAINER_ID);
    const { resource: old } = await container.item(id, projectId).read<Task>();
    const updated = { ...old, ...data, updatedAt: new Date() };
    const { resource } = await container.items.upsert(updated);
    return resource as Task;
}

export async function deleteTask(id: string, projectId: string) {
    const { database } = cosmosClient.database(DATABASE_ID);
    const { container } = database.container(CONTAINER_ID);
    await container.item(id, projectId).delete();
} 