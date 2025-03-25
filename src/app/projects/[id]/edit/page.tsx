"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Project } from "@/lib/types";
import { ProjectForm } from "@/components/projects/project-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {getProjectById} from "@/lib/server-data-service";

export default function EditProjectPage({
  params
}: {
  params: { id: string }
}) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const foundProject = getProjectById(params.id);
    if (foundProject) {
      setProject(foundProject);
    }
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-4">
          The project you're trying to edit doesn't exist or has been removed.
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
      <div>
        <Link href={`/projects/${project.id}`} className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Project Details
        </Link>
        <h1 className="text-3xl font-bold mt-2">Edit Project</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Update the details for {project.name}
        </p>
      </div>

      <div className="border border-zinc-200 rounded-lg p-6 dark:border-zinc-800">
        <ProjectForm project={project} isEditing={true} />
      </div>
    </div>
  );
}
