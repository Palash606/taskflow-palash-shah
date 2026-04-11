import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import type { Project } from "@/lib/api";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2 text-left">
        <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
          <Folder className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <CardTitle className="text-xl truncate">{project.name}</CardTitle>
          <CardDescription className="line-clamp-1">{project.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-4 text-left">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Link to={`/tasks?projectId=${project.id}`} className="w-full">
          <Button variant="outline" className="w-full justify-between group">
            View Project Tasks
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
