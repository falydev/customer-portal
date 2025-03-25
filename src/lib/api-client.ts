// This file manages all API calls to the Laravel backend

import {Project, Ticket} from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Base API request function with error handling
 */
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_URL}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options?.headers || {}),
        },
    });

    if (!response.ok) {
        // Parse error response
        try {
            const errorData = await response.json();
            throw new Error(errorData.error || `API error: ${response.status}`);
        } catch (e) {
            throw new Error(`API error: ${response.status}`);
        }
    }

    return response.json();
}

/**
 * Project-related API calls
 */
export const projectsApi = {
    getAll: () => apiRequest<Project[]>('/projects'),
    getById: (id: string) => apiRequest<Project>(`/projects/${id}`),
    create: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) =>
        apiRequest<Project>('/projects', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    update: (id: string, data: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>) =>
        apiRequest<Project>(`/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
    delete: (id: string) =>
        apiRequest<void>(`/projects/${id}`, {
            method: 'DELETE',
        }),
};

/**
 * Ticket-related API calls
 */
export const ticketsApi = {
    getAll: () => apiRequest<Ticket[]>('/tickets'),
    getById: (id: string) => apiRequest<Ticket>(`/tickets/${id}`),
    getByProjectId: (projectId: string) =>
        apiRequest<Ticket[]>(`/projects/${projectId}/tickets`),
    create: (data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) =>
        apiRequest<Ticket>('/tickets', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    update: (id: string, data: Partial<Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>>) =>
        apiRequest<Ticket>(`/tickets/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
    delete: (id: string) =>
        apiRequest<void>(`/tickets/${id}`, {
            method: 'DELETE',
        }),
};