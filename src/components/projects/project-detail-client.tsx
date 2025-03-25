"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getTicketsByProjectId, deleteTicket } from "@/lib/ticket-service";
import { Project, Ticket } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Calendar,
  DollarSign,
  Pencil,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  BadgeAlert,
  MoreHorizontal
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import TicketForm from "@/components/projects/ticket-form";
import {getProjectById} from "@/lib/server-data-service";

interface ProjectDetailClientProps {
  projectId: string;
  initialProject?: Project | undefined;
}

export default function ProjectDetailClient({
  projectId,
  initialProject
}: ProjectDetailClientProps) {
  const [project, setProject] = useState<Project | null>(initialProject || null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(!initialProject);
  const [isTicketFormOpen, setIsTicketFormOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<Ticket | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const loadProjectData = async () => {
      if (!project) {
        const foundProject = await getProjectById(projectId);
        if (foundProject) {
          setProject(foundProject);
        }
      }

      const projectTickets = getTicketsByProjectId(projectId);
      setTickets(projectTickets);
      setLoading(false);
    };

    loadProjectData();
  }, [projectId, project]);

  const handleDeleteProject = () => {
    if (!project) return;

    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProject(project.id);
      router.push("/projects");
    }
  };

  const handleDeleteTicket = (ticketId: string) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      deleteTicket(ticketId);
      setTickets(tickets.filter(ticket => ticket.id !== ticketId));
    }
  };

  const refreshTickets = () => {
    if (project) {
      const updatedTickets = getTicketsByProjectId(project.id);
      setTickets(updatedTickets);
    }
  };

  const openCreateTicketForm = () => {
    setCurrentTicket(undefined);
    setIsTicketFormOpen(true);
  };

  const openEditTicketForm = (ticket: Ticket) => {
    setCurrentTicket(ticket);
    setIsTicketFormOpen(true);
  };

  const closeTicketForm = () => {
    setIsTicketFormOpen(false);
    setCurrentTicket(undefined);
  };

  const handleTicketFormSuccess = () => {
    closeTicketForm();
    refreshTickets();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-blue-500" />;
      case "on-hold":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getTicketStatusBadge = (status: string) => {
    let bgColor = '';
    let textColor = '';

    switch (status) {
      case 'open':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        break;
      case 'in-progress':
        bgColor = 'bg-purple-100';
        textColor = 'text-purple-800';
        break;
      case 'review':
        bgColor = 'bg-amber-100';
        textColor = 'text-amber-800';
        break;
      case 'closed':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
    }

    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${bgColor} ${textColor}`}>
        {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTicketPriorityBadge = (priority: string) => {
    let bgColor = '';
    let textColor = '';
    let icon = null;

    switch (priority) {
      case 'urgent':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        icon = <BadgeAlert className="h-3 w-3 mr-1" />;
        break;
      case 'high':
        bgColor = 'bg-orange-100';
        textColor = 'text-orange-800';
        break;
      case 'medium':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        break;
      case 'low':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
    }

    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${bgColor} ${textColor}`}>
        {icon}
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-4">
          The project you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/projects">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link href="/projects" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Projects
          </Link>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              {getStatusIcon(project.status)}
              <span className="ml-1.5 text-sm font-medium">
                {getStatusText(project.status)}
              </span>
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              Updated {new Date(project.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/projects/${project.id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button variant="destructive" size="sm" onClick={handleDeleteProject}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{project.description}</p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-zinc-500 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Timeline</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Start: {new Date(project.startDate).toLocaleDateString()}
                    </p>
                    {project.endDate && (
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        End: {new Date(project.endDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {project.budget && (
                  <div className="flex items-start">
                    <DollarSign className="h-5 w-5 text-zinc-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Budget</p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        ${project.budget.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-zinc-500 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Created</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tickets Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Tickets</h2>
          <Button size="sm" onClick={openCreateTicketForm}>
            <Plus className="h-4 w-4 mr-2" />
            Add Ticket
          </Button>
        </div>

        {tickets.length === 0 ? (
          <Card>
            <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-zinc-100 p-3 mb-3">
                <TicketIcon className="h-6 w-6 text-zinc-500" />
              </div>
              <h3 className="font-medium mb-1">No tickets found</h3>
              <p className="text-sm text-zinc-500 mb-4 max-w-md">
                This project doesn't have any tickets yet. Create a ticket to track tasks, issues, or features.
              </p>
              <Button size="sm" onClick={openCreateTicketForm}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Ticket
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <Link href={`/projects/${project.id}/tickets/${ticket.id}`}>
                  <CardContent className="p-0">
                    <div className="p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-medium">{ticket.title}</h3>
                        <div className="z-10" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => {
                                e.preventDefault();
                                openEditTicketForm(ticket);
                              }}>
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {
                                e.preventDefault();
                                handleDeleteTicket(ticket.id);
                              }}>
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                        {ticket.description.length > 150
                          ? `${ticket.description.substring(0, 150)}...`
                          : ticket.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {getTicketStatusBadge(ticket.status)}
                        {getTicketPriorityBadge(ticket.priority)}
                      </div>
                    </div>
                    <Separator />
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-between text-sm">
                      <div className="text-zinc-500 dark:text-zinc-400">
                        Assigned to: <span className="font-medium text-zinc-900 dark:text-zinc-50">{ticket.assignedTo || "Unassigned"}</span>
                      </div>
                      <div className="text-zinc-500 dark:text-zinc-400">
                        Updated {new Date(ticket.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Ticket Form Sheet */}
      <Sheet open={isTicketFormOpen} onOpenChange={setIsTicketFormOpen}>
        <SheetContent className="w-full sm:max-w-lg p-0 overflow-y-auto">
          <TicketForm
            projectId={project.id}
            ticket={currentTicket}
            onSuccess={handleTicketFormSuccess}
            onCancel={closeTicketForm}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

// Simple ticket icon component
const TicketIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  );
};
