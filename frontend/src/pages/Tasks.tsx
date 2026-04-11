import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { projectApi, taskApi, type Task, type TaskStatus } from "../lib/api";
import TaskCard from "../components/TaskCard";
import { Button } from "../components/ui/button";
import {
  Layout as LayoutIcon,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  CircleDot,
  Loader2,
  ChevronDown,
  AlertCircle
} from "lucide-react";
import { Input } from "../components/ui/input";
import CreateTaskModal from "../components/CreateTaskModal";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";

export default function Tasks() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  // Robustly sanitize projectId to avoid 400 errors from invalid UUID strings
  const sanitizeUUID = (uuid: string | null) => {
    if (!uuid) return null;
    return uuid.replace(/\u2013|\u2014/g, "-").trim();
  };

  const urlProjectId = sanitizeUUID(searchParams.get("projectId"));

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(urlProjectId);
  const [searchTerm, setSearchTerm] = useState("");

  // Sync state with URL
  useEffect(() => {
    const sanitized = sanitizeUUID(urlProjectId);
    if (sanitized !== selectedProjectId) {
      setSelectedProjectId(sanitized);
    }
  }, [urlProjectId]);

  const { data: projectsPage, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectApi.getAll(),
  });

  const projects = projectsPage?.items;

  const { data: allTasks, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => taskApi.getAll(),
  });

  const { data: projectPage, isLoading: projectTasksLoading } = useQuery({
    queryKey: ["tasks", selectedProjectId],
    queryFn: () => selectedProjectId
      ? taskApi.getByProject(selectedProjectId)
      : Promise.resolve({ items: [], total: 0, page: 1, limit: 100 }),
    enabled: !!selectedProjectId,
  });

  const { data: projectStats, isLoading: statsLoading } = useQuery({
    queryKey: ["stats", selectedProjectId],
    queryFn: () => selectedProjectId ? projectApi.getStats(selectedProjectId) : null,
    enabled: !!selectedProjectId,
  });

  const EMPTY_ARRAY = useMemo(() => [], []);

  // Decide which tasks to show
  const displayTasks = selectedProjectId ? projectPage?.items || EMPTY_ARRAY : allTasks || EMPTY_ARRAY;

  const [boardTasks, setBoardTasks] = useState<Task[]>([]);

  // Sync boardTasks with query data
  useEffect(() => {
    if (displayTasks) {
      setBoardTasks(displayTasks);
    }
  }, [displayTasks]);

  const filteredTasks = useMemo(() => {
    return boardTasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [boardTasks, searchTerm]);

  const mutation = useMutation({
    mutationFn: ({ taskId, newStatus }: { taskId: string; newStatus: TaskStatus }) =>
      taskApi.update(taskId, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const taskId = draggableId;
    const newStatus = destination.droppableId as TaskStatus;

    // Optimistically update local state
    setBoardTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    // Call API
    mutation.mutate({ taskId, newStatus });
  };

  const columns: { status: TaskStatus; label: string; icon: any; color: string }[] = [
    { status: "todo", label: "Created", icon: CircleDot, color: "text-blue-400" },
    { status: "in_progress", label: "In-progress", icon: Clock, color: "text-amber-400" },
    { status: "done", label: "Finished", icon: CheckCircle2, color: "text-emerald-400" },
  ];

  const handleProjectChange = (id: string) => {
    const newId = id === "all" ? null : id;
    const sanitized = sanitizeUUID(newId);
    setSelectedProjectId(sanitized);
    if (sanitized) {
      setSearchParams({ projectId: sanitized });
    } else {
      setSearchParams({});
    }
  };

  const isLoading = projectsLoading || tasksLoading || (selectedProjectId && projectTasksLoading);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl shadow-slate-950/20">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-50">Task Board</h1>
          <p className="text-slate-400 flex items-center gap-2 font-medium">
            <LayoutIcon className="h-5 w-5 text-primary" />
            {selectedProjectId
              ? `Managing tasks for ${projects?.find(p => p.id === selectedProjectId)?.name}`
              : "Overview of all your tasks across projects"
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedProjectId && <CreateTaskModal projectId={selectedProjectId} />}
        </div>
      </div>

      {/* Stats Section (Bonus) */}
      {selectedProjectId && projectStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
          {columns.map((col) => {
            const count = projectStats.tasksByStatus[col.status.toUpperCase()] || 0;
            return (
              <div key={col.status} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-slate-800 ${col.color}`}>
                    <col.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{col.label}</p>
                    <p className="text-xl font-black text-slate-100">{count}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-800 text-primary">
                <AlertCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total</p>
                <p className="text-xl font-black text-slate-100">{projectPage?.total || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between px-2">
        <div className="flex flex-1 items-center gap-4 max-w-2xl">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 bg-slate-900/50 border-slate-800 text-slate-100 placeholder:text-slate-500 shadow-inner focus-visible:ring-primary/20 backdrop-blur-sm"
            />
          </div>
          <div className="relative min-w-[200px]">
            <select
              className="w-full h-11 rounded-md border border-slate-800 bg-slate-900/50 text-slate-100 px-3 py-2 text-sm shadow-inner transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 appearance-none pr-10 backdrop-blur-sm hover:bg-slate-900"
              value={selectedProjectId || "all"}
              onChange={(e) => handleProjectChange(e.target.value)}
            >
              <option value="all" className="bg-slate-900">All Projects</option>
              {projects?.map((project) => (
                <option key={project.id} value={project.id} className="bg-slate-900">
                  {project.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-slate-500 font-medium italic text-sm">Synchronizing your board...</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid gap-8 md:grid-cols-3">
            {columns.map((column) => (
              <div key={column.status} className="flex flex-col gap-6 h-full">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 px-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${column.status === 'todo' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : column.status === 'in_progress' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'}`} />
                    <h3 className="font-bold text-slate-200 tracking-widest uppercase text-[11px]">{column.label}</h3>
                    <span className="flex items-center justify-center px-1.5 h-4.5 rounded bg-slate-800 text-[10px] font-bold text-slate-400 border border-slate-700">
                      {filteredTasks.filter((t) => t.status === column.status).length}
                    </span>
                  </div>
                </div>

                <Droppable droppableId={column.status}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex flex-1 flex-col gap-5 min-h-[500px] rounded-2xl p-4 border transition-colors duration-200 ${snapshot.isDraggingOver
                          ? 'bg-slate-800/40 border-primary/20 shadow-lg shadow-primary/5'
                          : 'bg-slate-900/30 border-slate-800/50 shadow-inner'
                        } backdrop-blur-sm`}
                    >
                      {filteredTasks
                        .filter((task) => task.status === column.status)
                        .map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <TaskCard
                                task={task}
                                innerRef={provided.innerRef}
                                draggableProps={provided.draggableProps}
                                dragHandleProps={provided.dragHandleProps}
                                isDragging={snapshot.isDragging}
                              />
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}

                      {filteredTasks.filter((t) => t.status === column.status).length === 0 && (
                        <div className="flex flex-1 flex-col items-center justify-center text-center opacity-40">
                          <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-3">
                            <column.icon className="h-5 w-5 text-slate-600" />
                          </div>
                          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">No tasks {column.label.toLowerCase()}</p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
}
