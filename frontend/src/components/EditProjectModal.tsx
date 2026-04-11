import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectApi, type Project } from "../lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Pencil, Loader2 } from "lucide-react";

interface EditProjectModalProps {
  project: Project;
}

export default function EditProjectModal({ project }: EditProjectModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return projectApi.update(project.id, { 
        name, 
        description 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setOpen(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      mutation.mutate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800 transition-all rounded-full"
          onClick={(e) => e.stopPropagation()}
        >
          <Pencil className="h-3.5 w-3.5" />
          <span className="sr-only">Edit project</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-slate-100 shadow-2xl shadow-slate-950">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-slate-50 tracking-tight">Edit Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2 text-left">
            <Label htmlFor="edit-project-name" className="text-xs font-bold uppercase tracking-widest text-slate-500">Project Name</Label>
            <Input
              id="edit-project-name"
              placeholder="e.g. Website Redesign"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-slate-950/50 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-primary/20 h-11"
            />
          </div>
          <div className="space-y-2 text-left">
            <Label htmlFor="edit-project-description" className="text-xs font-bold uppercase tracking-widest text-slate-500">Description</Label>
            <Textarea
              id="edit-project-description"
              placeholder="Add some context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none bg-slate-950/50 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-primary/20 min-h-[100px]"
            />
          </div>
          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              disabled={mutation.isPending || !name.trim()} 
              className="w-full h-12 bg-white hover:bg-slate-100 text-slate-900 font-extrabold shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] rounded-lg"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
