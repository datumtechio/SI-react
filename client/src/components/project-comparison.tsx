import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { Project } from "@shared/schema";
import { cn } from "@/lib/utils";

interface ProjectComparisonProps {
  projects: Project[];
  onAddProject: () => void;
  onRemoveProject: (projectId: number) => void;
}

export function ProjectComparison({ projects, onAddProject, onRemoveProject }: ProjectComparisonProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "under construction":
        return "bg-green-100 text-green-800";
      case "planning":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount}M`;
  };

  const formatSize = (size: number | null) => {
    if (!size) return "N/A";
    return `${(size / 1000).toFixed(0)}K sq ft`;
  };

  const getRoi = (project: Project) => {
    if (project.status === "Completed" && project.currentRoi) {
      return `${project.currentRoi.toFixed(1)}%`;
    }
    if (project.expectedRoi) {
      return `${project.expectedRoi.toFixed(1)}%`;
    }
    return "N/A";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Project Comparison</CardTitle>
          <Button variant="outline" size="sm" onClick={onAddProject}>
            <Plus className="mr-1" size={16} />
            Add Project
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p>No projects selected for comparison</p>
            <p className="text-sm mt-1">Add projects to compare side-by-side</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-slate-900">{project.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge className={cn("text-xs", getStatusColor(project.status))}>
                      {project.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveProject(project.id)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Investment:</span>
                    <span className="font-medium">{formatCurrency(project.investment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">
                      {project.status === "Completed" ? "Current ROI:" : "Expected ROI:"}
                    </span>
                    <span className="font-medium text-green-600">{getRoi(project)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Completion:</span>
                    <span className="font-medium">{project.completionDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Size:</span>
                    <span className="font-medium">{formatSize(project.size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Location:</span>
                    <span className="font-medium">{project.district}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Type:</span>
                    <span className="font-medium">{project.projectType}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
