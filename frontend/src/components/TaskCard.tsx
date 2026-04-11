import type { Task, TaskStatus } from "@/lib/api";
import { taskApi } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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

  const mutation = useMutation({
    mutationFn: (newStatus: TaskStatus) => 
      taskApi.update(task.id, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-rose-100 text-rose-700 hover:bg-rose-100 border-rose-200";
      case "medium": return "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200";
      default: return "bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200";
    }
  };

  const handleNextStatus = () => {
    if (task.status === "todo") mutation.mutate("in_progress");
    else if (task.status === "in_progress") mutation.mutate("done");
  };

  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      className={`${isDragging ? 'z-50' : 'z-0'} transition-transform duration-200`}
    >
      <Card className={`group hover:shadow-lg transition-all duration-300 border-slate-800 bg-slate-900/40 backdrop-blur-sm hover:bg-slate-900 hover:border-slate-700 ${isDragging ? 'shadow-2xl shadow-primary/20 scale-[1.02] border-primary/50 bg-slate-900' : ''}`}>
      <CardContent className="p-5 space-y-4">
        <div className="flex justify-between items-start gap-4">
          <h4 className="font-bold text-sm line-clamp-2 text-slate-100 group-hover:text-primary transition-colors leading-snug">
            {task.title}
          </h4>
          <Badge variant="outline" className={`capitalize text-[10px] px-2 h-5 font-bold border-0 shadow-sm ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </Badge>
        </div>
        
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-medium">
          {task.description || "No description provided."}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
          <div className="flex items-center text-[10px] text-slate-500 gap-1.5 font-semibold">
            <Clock className="h-3 w-3 text-slate-600" />
            <span>
              {task.due_date 
                ? `Due ${new Date(task.due_date).toLocaleDateString()}` 
                : `Created ${task.created_at ? new Date(task.created_at).toLocaleDateString() : 'recent'}`
              }
            </span>
          </div>

          {task.status !== "done" && (
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 px-3 text-xs gap-1.5 hover:bg-primary/10 hover:text-primary transition-all font-bold text-slate-400"
              onClick={handleNextStatus}
              disabled={mutation.isPending}
            >
              {task.status === "todo" ? (
                <>Start <ArrowRight className="h-3 w-3" /></>
              ) : (
                <>Finish <CheckCircle2 className="h-3 w-3 text-emerald-500" /></>
              )}
            </Button>
          )}

          {task.status === "done" && (
            <div className="flex items-center gap-1.5 text-emerald-500/80 font-bold text-[10px] pr-1 uppercase tracking-wider">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Finished
            </div>
          )}
        </div>
      </CardContent>
    </Card>
    </div>
  );
}
