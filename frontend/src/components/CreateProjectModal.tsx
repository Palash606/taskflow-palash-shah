import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectApi } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Loader2 } from "lucide-react";

export default function CreateProjectModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const queryClient = useQueryClient();

  const resetForm = () => {
    setName("");
    setDescription("");
  };

  const mutation = useMutation({
    mutationFn: () => projectApi.create({ name, description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setOpen(false);
      resetForm();
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
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-slate-100 shadow-2xl shadow-slate-950">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-slate-50 tracking-tight">Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2 text-left">
            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-slate-500">Project Name</Label>
            <Input
              id="name"
              placeholder="e.g. Website Redesign"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-slate-950/50 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-primary/20 h-11"
            />
          </div>
          <div className="space-y-2 text-left">
            <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-slate-500">Description</Label>
            <Textarea
              id="description"
              placeholder="Briefly describe what this project is about..."
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
                  Creating Project...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
