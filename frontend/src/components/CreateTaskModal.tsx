import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi, type TaskStatus, type TaskPriority } from "@/lib/api";
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
import { Plus, Loader2 } from "lucide-react";

interface CreateTaskModalProps {
  projectId: string;
}

export default function CreateTaskModal({ projectId }: CreateTaskModalProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const queryClient = useQueryClient();

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
  };

  const mutation = useMutation({
    mutationFn: () => {
      const sanitizedId = projectId.replace(/\u2013|\u2014/g, "-").trim();
      return taskApi.create(sanitizedId, { 
        title, 
        description, 
        priority,
        status: "todo" as TaskStatus 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setOpen(false);
      resetForm();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      mutation.mutate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-slate-100 shadow-2xl shadow-slate-950">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-slate-50 tracking-tight">Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2 text-left">
            <Label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-slate-500">Task Title</Label>
            <Input
              id="title"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-slate-950/50 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-primary/20 h-11"
            />
          </div>
          <div className="space-y-2 text-left">
            <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-slate-500">Description</Label>
            <Textarea
              id="description"
              placeholder="Add some details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none bg-slate-950/50 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-primary/20 min-h-[100px]"
            />
          </div>
          <div className="space-y-2 text-left">
            <Label htmlFor="priority" className="text-xs font-bold uppercase tracking-widest text-slate-500">Priority Level</Label>
            <select
              id="priority"
              className="flex h-11 w-full rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 appearance-none transition-all hover:bg-slate-950"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
              <option value="low" className="bg-slate-900">Low Priority</option>
              <option value="medium" className="bg-slate-900">Medium Priority</option>
              <option value="high" className="bg-slate-900">High Priority</option>
            </select>
          </div>
          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              disabled={mutation.isPending || !title.trim()} 
              className="w-full h-12 bg-white hover:bg-slate-100 text-slate-900 font-extrabold shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] rounded-lg"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-4 animate-spin" />
                  Creating Task...
                </>
              ) : (
                "Create Task"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
