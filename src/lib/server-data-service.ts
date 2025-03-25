import { Project, Ticket } from './types';
import { projectsApi, ticketsApi } from './api-client';

// For server-side data fetching
export async function getProjects(): Promise<Project[]> {
    return projectsApi.getAll();
}

export async function getProjectById(id: string): Promise<Project | undefined> {
    try {
        return await projectsApi.getById(id);
    } catch (error) {
        console.error(`Failed to fetch project with ID ${id}:`, error);
        return undefined;
    }
}

export async function getTickets(): Promise<Ticket[]> {
    return ticketsApi.getAll();
}

export async function getTicketById(id: string): Promise<Ticket | undefined> {
    try {
        return await ticketsApi.getById(id);
    } catch (error) {
        console.error(`Failed to fetch ticket with ID ${id}:`, error);
        return undefined;
    }
}

export async function getProjectTickets(projectId: string): Promise<Ticket[]> {
    try {
        return await ticketsApi.getByProjectId(projectId);
    } catch (error) {
        console.error(`Failed to fetch tickets for project ${projectId}:`, error);
        return [];
    }
}