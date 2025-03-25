import { getProjects, getProjectById } from "@/lib/project-service";
import { getTickets, getTicketById } from "@/lib/ticket-service";
import TicketDetailClient from "@/components/projects/ticket-detail-client";

// Generate static params for all project/ticket combinations
export function generateStaticParams() {
  const projects = getProjects();
  const tickets = getTickets();

  const params = [];

  for (const project of projects) {
    const projectTickets = tickets.filter(ticket => ticket.projectId === project.id);

    for (const ticket of projectTickets) {
      params.push({
        id: project.id,
        ticketId: ticket.id
      });
    }
  }

  return params;
}

export default function TicketDetailPage({
  params
}: {
  params: { id: string; ticketId: string }
}) {
  const project = getProjectById(params.id);
  const ticket = getTicketById(params.ticketId);

  return (
    <TicketDetailClient
      projectId={params.id}
      ticketId={params.ticketId}
      initialProject={project}
      initialTicket={ticket}
    />
  );
}
