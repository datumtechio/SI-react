import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Share, Info, MapPin, Building } from "lucide-react";
import { Project } from "@shared/schema";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  onToggleFavorite?: (projectId: number) => void;
  onShare?: (project: Project) => void;
  onViewDetails?: (project: Project) => void;
  isFavorite?: boolean;
}

export function ProjectCard({ 
  project, 
  onToggleFavorite, 
  onShare, 
  onViewDetails,
  isFavorite = false 
}: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "under construction":
        return "bg-green-100 text-green-800";
      case "planning":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-orange-100 text-orange-800";
      case "on hold":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount}M`;
  };

  const formatSize = (size: number) => {
    return `${(size / 1000).toFixed(0)}K sq ft`;
  };

  const getRoi = () => {
    if (project.status === "Completed" && project.currentRoi) {
      return project.currentRoi;
    }
    return project.expectedRoi;
  };

  return (
    <Card className="project-card">
      {project.imageUrl && (
        <img 
          src={project.imageUrl} 
          alt={project.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      )}
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-900 truncate">{project.name}</h3>
          <Badge className={cn("text-xs", getStatusColor(project.status))}>
            {project.status}
          </Badge>
        </div>

        <div className="text-sm text-slate-600 mb-4 space-y-1">
          <div className="flex items-center">
            <MapPin className="mr-2 text-slate-400" size={14} />
            <span>{project.location}</span>
          </div>
          <div className="flex items-center">
            <Building className="mr-2 text-slate-400" size={14} />
            <span>{project.projectType} • {project.sector}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <span className="text-slate-500">Investment:</span>
            <div className="font-semibold text-slate-900">{formatCurrency(project.investment)}</div>
          </div>
          <div>
            <span className="text-slate-500">
              {project.status === "Completed" ? "Current ROI:" : "Expected ROI:"}
            </span>
            <div className="font-semibold text-green-600">
              {getRoi() ? `${getRoi()?.toFixed(1)}%` : "N/A"}
            </div>
          </div>
        </div>

        {project.size && (
          <div className="text-sm text-slate-500 mb-4">
            Size: {formatSize(project.size)}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {project.status === "Completed" ? `Completed: ${project.completionDate}` : `Completion: ${project.completionDate}`}
          </span>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleFavorite?.(project.id)}
              className={cn(
                "text-primary hover:text-primary",
                isFavorite && "text-red-500 hover:text-red-600"
              )}
            >
              <Heart size={16} className={isFavorite ? "fill-current" : ""} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare?.(project)}
              className="text-primary hover:text-primary"
            >
              <Share size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails?.(project)}
              className="text-primary hover:text-primary"
            >
              <Info size={16} />
            </Button>
          </div>
        </div>

        {/* Project Features */}
        {project.features && project.features.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex flex-wrap gap-1">
              {project.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {project.features.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{project.features.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
