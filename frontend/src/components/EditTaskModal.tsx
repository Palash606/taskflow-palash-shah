import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi, type Task, type TaskPriority } from "../lib/api";
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

interface EditTaskModalProps {
  task: Task;
}

export default function EditTaskModal({ task }: EditTaskModalProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return taskApi.update(task.id, { 
        title, 
        description, 
        priority 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setOpen(false);
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
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800 transition-all rounded-full"
        >
          <Pencil className="h-3.5 w-3.5" />
          <span className="sr-only">Edit task</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-slate-100 shadow-2xl shadow-slate-950">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-slate-50 tracking-tight">Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2 text-left">
            <Label htmlFor="edit-title" className="text-xs font-bold uppercase tracking-widest text-slate-500">Task Title</Label>
            <Input
              id="edit-title"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-slate-950/50 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-primary/20 h-11"
            />
          </div>
          <div className="space-y-2 text-left">
            <Label htmlFor="edit-description" className="text-xs font-bold uppercase tracking-widest text-slate-500">Description</Label>
            <Textarea
              id="edit-description"
              placeholder="Add some details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none bg-slate-950/50 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-primary/20 min-h-[100px]"
            />
          </div>
          <div className="space-y-2 text-left">
            <Label htmlFor="edit-priority" className="text-xs font-bold uppercase tracking-widest text-slate-500">Priority Level</Label>
            <select
              id="edit-priority"
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
