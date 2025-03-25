"use client";

import { ProjectForm } from "@/components/projects/project-form";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Project</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Add a new project to your portfolio
        </p>
      </div>

      <div className="border border-zinc-200 rounded-lg p-6 dark:border-zinc-800">
        <ProjectForm />
      </div>
    </div>
  );
}
