import type { Task, TaskStatus } from "../lib/api";
import { taskApi } from "../lib/api";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Trash2, 
  AlertTriangle,
  Loader2,
  GripVertical
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EditTaskModal from "./EditTaskModal";
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

interface TaskCardProps {
  task: Task;
  innerRef?: React.Ref<any>;
  draggableProps?: any;
  dragHandleProps?: any;
  isDragging?: boolean;
}

export default function TaskCard({ 
  task, 
  innerRef, 
  draggableProps, 
  dragHandleProps,
  isDragging 
}: TaskCardProps) {
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const statusMutation = useMutation({
    mutationFn: (newStatus: TaskStatus) => 
      taskApi.update(task.id, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => taskApi.delete(task.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setDeleteDialogOpen(false);
    },
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-rose-500/10 text-rose-500 border-rose-500/20 uppercase";
      case "medium": return "bg-amber-500/10 text-amber-500 border-amber-500/20 uppercase";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20 uppercase";
    }
  };

  const handleNextStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.status === "todo") statusMutation.mutate("in_progress");
    else if (task.status === "in_progress") statusMutation.mutate("done");
  };

  return (
    <div
      ref={innerRef}
      {...draggableProps}
      className={`${isDragging ? 'z-50' : 'z-0'} transition-transform duration-200 outline-none`}
    >
      <Card className={`group relative hover:shadow-2xl transition-all duration-500 border-slate-800 bg-slate-900/40 backdrop-blur-md hover:bg-slate-900/80 hover:border-slate-700 ${isDragging ? 'shadow-2xl shadow-primary/30 scale-[1.03] border-primary/60 bg-slate-900 rotate-[1deg]' : ''}`}>
      
      {/* Drag Handle Indicator */}
      <div 
        {...dragHandleProps}
        className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1 text-slate-600 hover:text-primary z-20"
      >
        <GripVertical className="h-5 w-5" />
      </div>

      <CardContent className="p-5 pl-8 space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2 flex-1">
            <h4 className="font-bold text-sm tracking-tight text-slate-100 group-hover:text-primary transition-colors leading-relaxed">
              {task.title}
            </h4>
            <Badge variant="outline" className={`text-[9px] px-2 h-5 font-black border shadow-lg tracking-wider ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </Badge>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            <EditTaskModal task={task} />
            
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all rounded-full"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px] bg-slate-950 border-slate-900 text-slate-100 shadow-3xl">
                <DialogHeader className="flex flex-col items-center text-center space-y-3">
                  <div className="h-14 w-14 rounded-full bg-rose-500/10 flex items-center justify-center mb-2 border border-rose-500/20">
                    <AlertTriangle className="h-7 w-7 text-rose-500" />
                  </div>
                  <DialogTitle className="text-2xl font-black tracking-tight">Delete Task</DialogTitle>
                  <DialogDescription className="text-slate-400 font-medium">
                    This will permanently remove <span className="text-slate-100 font-bold underline decoration-rose-500/30">"{task.title}"</span>. This action cannot be undone.
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
        
        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-semibold">
          {task.description || "No description provided."}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800/40">
          <div className="flex items-center text-[10px] text-slate-500 gap-1.5 font-black uppercase tracking-widest">
            <Clock className="h-3 w-3 text-slate-600" />
            <span>
              {task.due_date 
                ? `${new Date(task.due_date).toLocaleDateString()}` 
                : `${task.created_at ? new Date(task.created_at).toLocaleDateString() : 'recent'}`
              }
            </span>
          </div>

          {task.status !== "done" && (
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 px-4 text-[10px] gap-2 hover:bg-primary/10 hover:text-primary transition-all font-black uppercase tracking-widest text-slate-400 group/btn"
              onClick={handleNextStatus}
              disabled={statusMutation.isPending}
            >
              {task.status === "todo" ? (
                <>Start <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" /></>
              ) : (
                <>Finish <CheckCircle2 className="h-3 w-3 text-emerald-500 transition-scale group-hover/btn:scale-110" /></>
              )}
            </Button>
          )}

          {task.status === "done" && (
            <div className="flex items-center gap-1.5 text-emerald-500/90 font-black text-[10px] pr-1 uppercase tracking-widest">
              <CheckCircle2 className="h-4 w-4" />
              Finished
            </div>
          )}
        </div>
      </CardContent>
    </Card>
    </div>
  );
}
