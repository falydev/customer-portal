import ProjectDetailClient from "@/components/projects/project-detail-client";
import {getProjectById, getProjects} from "@/lib/server-data-service";

// Generate static params for all projects
export async function generateStaticParams() {
  const projects = await getProjects();

  return projects.map((project) => ({
    id: project.id,
  }));
}

export default async function ProjectDetailPage({
  params
}: {
  params: { id: string }
}) {
  const project = await getProjectById(params.id);

  return <ProjectDetailClient projectId={params.id} initialProject={project} />;
}
