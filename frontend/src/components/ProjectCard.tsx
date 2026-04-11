import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { 
  Folder, 
  ArrowRight, 
  Calendar, 
  Trash2, 
  AlertTriangle,
  Loader2 
} from "lucide-react";
import { Link } from "react-router-dom";
import type { Project } from "../lib/api";
import { projectApi } from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "./ui/dialog";
import EditProjectModal from "./EditProjectModal";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => projectApi.delete(project.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setDeleteDialogOpen(false);
    },
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  return (
    <Card className="group relative hover:shadow-2xl transition-all duration-500 border-slate-800 bg-slate-900/40 backdrop-blur-md hover:bg-slate-900/80 hover:border-slate-700">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2 text-left">
        <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0 group-hover:scale-110 transition-transform duration-300">
          <Folder className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold tracking-tight truncate text-slate-100 group-hover:text-primary transition-colors">
              {project.name}
            </CardTitle>
            
            {/* Project Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
              <EditProjectModal project={project} />
              
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all rounded-full"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px] bg-slate-950 border-slate-900 text-slate-100 shadow-3xl">
                  <DialogHeader className="flex flex-col items-center text-center space-y-3">
                    <div className="h-14 w-14 rounded-full bg-rose-500/10 flex items-center justify-center mb-2 border border-rose-500/20">
                      <AlertTriangle className="h-7 w-7 text-rose-500" />
                    </div>
                    <DialogTitle className="text-2xl font-black tracking-tight">Delete Project</DialogTitle>
                    <DialogDescription className="text-slate-400 font-medium">
                      This will permanently remove <span className="text-slate-100 font-bold underline decoration-rose-500/30">"{project.name}"</span> and all its associated tasks. This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="gap-3 sm:gap-0 mt-6 pt-6 border-t border-slate-900">
                    <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)} className="flex-1 border-slate-800 hover:bg-slate-900 text-slate-400 font-bold uppercase text-[11px] tracking-widest">
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => deleteMutation.mutate()} 
                      disabled={deleteMutation.isPending}
                      className="flex-1 bg-rose-600 hover:bg-rose-700 font-black uppercase text-[11px] tracking-widest shadow-lg shadow-rose-900/20"
                    >
                      {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Delete"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <CardDescription className="line-clamp-1 text-slate-400 font-medium">{project.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-4 text-left">
        <div className="flex items-center text-[11px] text-slate-500 font-black uppercase tracking-widest">
          <Calendar className="h-3.5 w-3.5 mr-2 text-slate-600" />
          <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Link to={`/tasks?projectId=${project.id}`} className="w-full">
          <Button variant="ghost" className="w-full justify-between group/btn bg-slate-950/50 hover:bg-primary/10 hover:text-primary transition-all border border-slate-800 font-black uppercase text-[11px] tracking-widest py-6">
            View Project Tasks
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
