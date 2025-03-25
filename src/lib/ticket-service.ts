"use client";

import { Ticket, TicketFormData } from "./types";
import { sampleTickets } from "./mock-data";

// In a real application, these would be API calls to a backend server
// For this demo, we'll store data in localStorage with initial sample data

const STORAGE_KEY = "customer_portal_tickets";

// Helper to initialize localStorage with sample data
const initializeTickets = (): Ticket[] => {
  if (typeof window === "undefined") return sampleTickets;

  const storedTickets = localStorage.getItem(STORAGE_KEY);
  if (!storedTickets) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleTickets));
    return sampleTickets;
  }

  return JSON.parse(storedTickets);
};

// Get all tickets
export const getTickets = (): Ticket[] => {
  if (typeof window === "undefined") return sampleTickets;

  const tickets = localStorage.getItem(STORAGE_KEY);
  if (!tickets) {
    return initializeTickets();
  }

  return JSON.parse(tickets);
};

// Get tickets for a specific project
export const getTicketsByProjectId = (projectId: string): Ticket[] => {
  const tickets = getTickets();
  return tickets.filter(ticket => ticket.projectId === projectId);
};

// Get a single ticket by ID
export const getTicketById = (id: string): Ticket | undefined => {
  const tickets = getTickets();
  return tickets.find(ticket => ticket.id === id);
};

// Create a new ticket
export const createTicket = (ticketData: TicketFormData): Ticket => {
  const tickets = getTickets();

  const newTicket: Ticket = {
    ...ticketData,
    id: Math.random().toString(36).substring(2, 9), // Simple ID generation
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updatedTickets = [...tickets, newTicket];

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTickets));
  }

  return newTicket;
};

// Update an existing ticket
export const updateTicket = (id: string, ticketData: Partial<TicketFormData>): Ticket | null => {
  const tickets = getTickets();
  const ticketIndex = tickets.findIndex(ticket => ticket.id === id);

  if (ticketIndex === -1) return null;

  const updatedTicket: Ticket = {
    ...tickets[ticketIndex],
    ...ticketData,
    updatedAt: new Date().toISOString(),
  };

  const updatedTickets = [...tickets];
  updatedTickets[ticketIndex] = updatedTicket;

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTickets));
  }

  return updatedTicket;
};

// Delete a ticket
export const deleteTicket = (id: string): boolean => {
  const tickets = getTickets();
  const updatedTickets = tickets.filter(ticket => ticket.id !== id);

  if (updatedTickets.length === tickets.length) {
    return false; // Nothing was deleted
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTickets));
  }

  return true;
};
