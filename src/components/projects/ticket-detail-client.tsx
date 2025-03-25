"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProjectById } from "@/lib/project-service";
import { getTicketById, deleteTicket, updateTicket } from "@/lib/ticket-service";
import { Project, Ticket, TICKET_STATUS_OPTIONS, TICKET_PRIORITY_OPTIONS } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Clock,
  Calendar,
  BadgeAlert,
  CheckCircle2,
  AlertCircle,
  UserCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import TicketForm from "@/components/projects/ticket-form";

interface TicketDetailClientProps {
  projectId: string;
  ticketId: string;
  initialProject?: Project;
  initialTicket?: Ticket;
}

export default function TicketDetailClient({
  projectId,
  ticketId,
  initialProject,
  initialTicket
}: TicketDetailClientProps) {
  const [project, setProject] = useState<Project | null>(initialProject || null);
  const [ticket, setTicket] = useState<Ticket | null>(initialTicket || null);
  const [loading, setLoading] = useState(!initialProject || !initialTicket);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      // Only fetch what we don't have
      if (!project) {
        const foundProject = getProjectById(projectId);
        if (foundProject) {
          setProject(foundProject);
        }
      }

      if (!ticket) {
        const foundTicket = getTicketById(ticketId);
        if (foundTicket) {
          setTicket(foundTicket);
        }
      }

      setLoading(false);
    };

    if (loading) {
      fetchData();
    }
  }, [projectId, ticketId, project, ticket, loading]);

  const handleDeleteTicket = () => {
    if (!ticket) return;

    if (window.confirm("Are you sure you want to delete this ticket?")) {
      deleteTicket(ticket.id);
      router.push(`/projects/${projectId}`);
    }
  };

  const handleStatusChange = (status: string) => {
    if (!ticket) return;

    const updatedTicket = updateTicket(ticket.id, { status: status as Ticket["status"] });
    if (updatedTicket) {
      setTicket(updatedTicket);
    }
  };

  const handlePriorityChange = (priority: string) => {
    if (!ticket) return;

    const updatedTicket = updateTicket(ticket.id, { priority: priority as Ticket["priority"] });
    if (updatedTicket) {
      setTicket(updatedTicket);
    }
  };

  const openEditForm = () => {
    setIsEditFormOpen(true);
  };

  const closeEditForm = () => {
    setIsEditFormOpen(false);
  };

  const handleEditSuccess = () => {
    closeEditForm();
    // Refresh ticket data
    const updatedTicket = getTicketById(ticketId);
    if (updatedTicket) {
      setTicket(updatedTicket);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-500';
      case 'high':
        return 'text-orange-500';
      case 'medium':
        return 'text-blue-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-zinc-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-purple-500" />;
      case 'review':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'closed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (!project || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-2xl font-bold mb-2">Not Found</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-4">
          The ticket or project you're looking for doesn't exist or has been removed.
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

  // Check if the ticket belongs to the current project
  if (ticket.projectId !== project.id) {
    router.push(`/projects/${projectId}`);
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link
            href={`/projects/${project.id}`}
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to {project.name}
          </Link>
          <h1 className="text-2xl font-bold">{ticket.title}</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              {getStatusIcon(ticket.status)}
              <span className="ml-1.5 text-sm font-medium">
                {ticket.status === 'in-progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
              </span>
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              Updated {new Date(ticket.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={openEditForm}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDeleteTicket}>
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
            <p className="whitespace-pre-line mb-8">{ticket.description}</p>

            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Project</h3>
              <Link
                href={`/projects/${project.id}`}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {project.name}
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Ticket Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select
                  value={ticket.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TICKET_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Priority</label>
                <Select
                  value={ticket.priority}
                  onValueChange={handlePriorityChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TICKET_PRIORITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2">
                <Separator className="mb-4" />

                <div className="flex items-start mb-3">
                  <UserCircle2 className="h-5 w-5 text-zinc-500 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Assigned To</p>
                    <p className="text-zinc-700 dark:text-zinc-300">
                      {ticket.assignedTo || "Unassigned"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start mb-3">
                  <Calendar className="h-5 w-5 text-zinc-500 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Created</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-zinc-500 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Last Updated</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {new Date(ticket.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Ticket Form Sheet */}
      <Sheet open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
        <SheetContent className="w-full sm:max-w-lg p-0 overflow-y-auto">
          <TicketForm
            projectId={project.id}
            ticket={ticket}
            onSuccess={handleEditSuccess}
            onCancel={closeEditForm}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
