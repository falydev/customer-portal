"use client";

import { Project, ProjectFormData } from "./types";
import { sampleProjects } from "./mock-data";

// In a real application, these would be API calls to a backend server
// For this demo, we'll store data in localStorage with initial sample data

const STORAGE_KEY = "customer_portal_projects";

// Helper to initialize localStorage with sample data
const initializeProjects = (): Project[] => {
  if (typeof window === "undefined") return sampleProjects;

  const storedProjects = localStorage.getItem(STORAGE_KEY);
  if (!storedProjects) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleProjects));
    return sampleProjects;
  }

  return JSON.parse(storedProjects);
};

// Get all projects
export const getProjects = (): Project[] => {
  if (typeof window === "undefined") return sampleProjects;

  const projects = localStorage.getItem(STORAGE_KEY);
  if (!projects) {
    return initializeProjects();
  }

  return JSON.parse(projects);
};

// Get a single project by ID
export const getProjectById = (id: string): Project | undefined => {
  const projects = getProjects();
  return projects.find(project => project.id === id);
};

// Create a new project
export const createProject = (projectData: ProjectFormData): Project => {
  const projects = getProjects();

  const newProject: Project = {
    ...projectData,
    id: Math.random().toString(36).substring(2, 9), // Simple ID generation
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updatedProjects = [...projects, newProject];

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
  }

  return newProject;
};

// Update an existing project
export const updateProject = (id: string, projectData: ProjectFormData): Project | null => {
  const projects = getProjects();
  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex === -1) return null;

  const updatedProject: Project = {
    ...projects[projectIndex],
    ...projectData,
    updatedAt: new Date().toISOString(),
  };

  const updatedProjects = [...projects];
  updatedProjects[projectIndex] = updatedProject;

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
  }

  return updatedProject;
};

// Delete a project
export const deleteProject = (id: string): boolean => {
  const projects = getProjects();
  const updatedProjects = projects.filter(project => project.id !== id);

  if (updatedProjects.length === projects.length) {
    return false; // Nothing was deleted
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
  }

  return true;
};
