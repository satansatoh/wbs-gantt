import { cosmosClient } from './client';
import { Project } from '../../types';

const DATABASE_ID = 'gantt-wbs-app';
const CONTAINER_ID = 'projects';

export async function createProject(project: Project) {
    const { database } = cosmosClient.database(DATABASE_ID);
    const { container } = database.container(CONTAINER_ID);
    const { resource } = await container.items.create(project);
    return resource as Project;
}

export async function getProject(id: string) {
    const { database } = cosmosClient.database(DATABASE_ID);
    const { container } = database.container(CONTAINER_ID);
    const { resource } = await container.item(id, id).read<Project>();
    return resource;
}

export async function listProjects() {
    const { database } = cosmosClient.database(DATABASE_ID);
    const { container } = database.container(CONTAINER_ID);
    const { resources } = await container.items.readAll<Project>().fetchAll();
    return resources;
}

export async function updateProject(id: string, data: Partial<Project>) {
    const { database } = cosmosClient.database(DATABASE_ID);
    const { container } = database.container(CONTAINER_ID);
    const { resource: old } = await container.item(id, id).read<Project>();
    const updated = { ...old, ...data, updatedAt: new Date() };
    const { resource } = await container.items.upsert(updated);
    return resource as Project;
}

export async function deleteProject(id: string) {
    const { database } = cosmosClient.database(DATABASE_ID);
    const { container } = database.container(CONTAINER_ID);
    await container.item(id, id).delete();
} 