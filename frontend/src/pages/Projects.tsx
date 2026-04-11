import { useQuery } from "@tanstack/react-query";
import { projectApi } from "@/lib/api";
import ProjectCard from "@/components/ProjectCard";
import CreateProjectModal from "@/components/CreateProjectModal";
import { Folder, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectApi.getAll(),
  });

  const filteredProjects = projects?.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Projects</h1>
          <p className="text-muted-foreground">
            Manage and organize all your active project workflows.
          </p>
        </div>
        <CreateProjectModal />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          className="pl-10 max-w-sm focus-visible:ring-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredProjects && filteredProjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-20 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/50 backdrop-blur-sm group hover:border-slate-700 transition-colors">
          <div className="h-20 w-20 rounded-full bg-slate-800 flex items-center justify-center mb-6 shadow-2xl shadow-slate-950/20 group-hover:scale-110 transition-transform duration-300">
            <Folder className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-100 tracking-tight">No projects found</h3>
          <p className="text-slate-400 max-w-sm mb-10 font-medium">
            {searchTerm 
              ? "We searched everywhere but couldn't find a match for that. Try a different search term?" 
              : "Every great journey starts with a single step. Create your first project and let's get building."
            }
          </p>
          {!searchTerm && <CreateProjectModal />}
        </div>
      )}
    </div>
  );
}
