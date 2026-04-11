import CreateProjectModal from "@/components/CreateProjectModal";
import ProjectCard from "@/components/ProjectCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projectApi, taskApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Layout, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectApi.getAll().then((res) => res.data),
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => taskApi.getAll().then((res) => res.data),
  });

  const stats = [
    {
      title: "Total Projects",
      value: projects?.length || 0,
      icon: Layout,
      color: "text-blue-600",
    },
    {
      title: "Active Tasks",
      value: tasks?.filter((t) => t.status !== "done").length || 0,
      icon: Clock,
      color: "text-amber-600",
    },
    {
      title: "Completed",
      value: tasks?.filter((t) => t.status === "done").length || 0,
      icon: CheckCircle2,
      color: "text-emerald-600",
    },
    {
      title: "High Priority",
      value: tasks?.filter((t) => t.priority === "high").length || 0,
      icon: AlertCircle,
      color: "text-rose-600",
    },
  ];

  if (projectsLoading || tasksLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening across your projects.
          </p>
        </div>
        <CreateProjectModal />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Projects</h2>
        {projects && projects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <Card className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 border-dashed">
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Layout className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium">No projects yet</h3>
            <p className="text-sm text-slate-500 max-w-xs mb-6">
              Get started by creating your first project to organize your tasks.
            </p>
            <CreateProjectModal />
          </Card>
        )}
      </div>
    </div>
  );
}
