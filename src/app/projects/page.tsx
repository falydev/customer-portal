"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Project } from "@/lib/types";
import { projectsApi } from "@/lib/api-client";
import {
  ArrowUpDown,
  Check,
  Clock,
  DollarSign,
  MoreHorizontal,
  PlusCircle,
  Search,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        const data = await projectsApi.getAll();

        // Ensure data is an array before setting it
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          console.error("API returned non-array data:", data);
          setError("Invalid data format received from server.");
          setProjects([]);
        }
      } catch (err) {
        console.error("Failed to load projects:", err);
        setError("Failed to load projects. Please try again.");
        setProjects([]); // Ensure projects is an empty array on error
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const handleDeleteProject = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await projectsApi.delete(id);
        setProjects((prev) => prev.filter((project) => project.id !== id));
      } catch (err) {
        console.error("Failed to delete project:", err);
        // Show error message to user
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "on-hold":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Check className="h-4 w-4 mr-1" />;
      case "completed":
        return <Check className="h-4 w-4 mr-1" />;
      case "on-hold":
        return <Clock className="h-4 w-4 mr-1" />;
      case "cancelled":
        return <X className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  // Safely filter projects - ensure projects is an array before filtering
  const filteredProjects = Array.isArray(projects)
      ? projects.filter((project) => {
        const matchesSearch = project.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            project.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

        const matchesStatus = !statusFilter || project.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      : [];

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-800">
          {error}
          <Button
              variant="outline"
              className="ml-4"
              onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Manage and track your projects
            </p>
          </div>
          <Link href="/projects/new">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </Link>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
                placeholder="Search projects..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
                variant={statusFilter === null ? "secondary" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(null)}
            >
              All
            </Button>
            <Button
                variant={statusFilter === "active" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("active")}
            >
              Active
            </Button>
            <Button
                variant={statusFilter === "completed" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("completed")}
            >
              Completed
            </Button>
            <Button
                variant={statusFilter === "on-hold" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("on-hold")}
            >
              On Hold
            </Button>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-60">
                <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400 mb-4">
                  No projects found
                </p>
                <Link href="/projects/new">
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create your first project
                  </Button>
                </Link>
              </CardContent>
            </Card>
        ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="line-clamp-1">{project.name}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {project.description}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Link href={`/projects/${project.id}`}>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                            </Link>
                            <Link href={`/projects/${project.id}/edit`}>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem
                                className="text-red-500 focus:text-red-500"
                                onClick={() => handleDeleteProject(project.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className={`flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                              {getStatusIcon(project.status)}
                              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                            </div>
                          </div>
                          {project.budget && (
                              <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400">
                                <DollarSign className="h-4 w-4 mr-1" />
                                {project.budget.toLocaleString()}
                              </div>
                          )}
                        </div>
                        <div className="pt-2">
                          <div className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
                            <div>
                              <span className="font-medium text-zinc-700 dark:text-zinc-300">Started:</span>{" "}
                              {new Date(project.startDate).toLocaleDateString()}
                            </div>
                            {project.endDate && (
                                <div>
                                  <span className="font-medium text-zinc-700 dark:text-zinc-300">Due:</span>{" "}
                                  {new Date(project.endDate).toLocaleDateString()}
                                </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </div>
        )}
      </div>
  );
}