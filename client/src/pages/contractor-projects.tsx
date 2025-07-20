import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Grid, List, Download, FileSpreadsheet, MapPin, Calendar, DollarSign, Building2, HardHat } from "lucide-react";
import { Project } from "@shared/schema";
import { cn } from "@/lib/utils";

export default function ContractorProjects() {
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("deadline");

  // Get filters from localStorage (passed from contractor dashboard)
  const [filters, setFilters] = useState<any>({});

  useEffect(() => {
    const savedFilters = localStorage.getItem("contractorFilters");
    if (savedFilters) {
      setFilters(JSON.parse(savedFilters));
    }
  }, []);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects", filters],
    enabled: true,
  });

  const filteredProjects = projects.filter(project => {
    if (filters.sector && filters.sector !== "all" && project.sector !== filters.sector) return false;
    if (filters.projectType && filters.projectType !== "all" && project.projectType !== filters.projectType) return false;
    if (filters.country && filters.country !== "all" && project.country !== filters.country) return false;
    if (filters.city && filters.city !== "all" && project.city !== filters.city) return false;
    if (filters.district && filters.district !== "all" && project.district !== filters.district) return false;
    if (filters.status && filters.status !== "all" && project.status !== filters.status) return false;
    if (filters.companyName && !project.name.toLowerCase().includes(filters.companyName.toLowerCase())) return false;
    if (filters.minValue && project.investment < filters.minValue) return false;
    if (filters.maxValue && project.investment > filters.maxValue) return false;
    return true;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case "deadline":
        return new Date(a.createdAt || "").getTime() - new Date(b.createdAt || "").getTime();
      case "value":
        return (b.investment || 0) - (a.investment || 0);
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => setLocation("/contractor-dashboard")}
                className="text-gray-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <HardHat className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Project Results</h1>
                  <p className="text-gray-600">Found {sortedProjects.length} matching projects</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Results
              </Button>
              <Button variant="outline" size="sm">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Active Filters Summary */}
        {Object.keys(filters).length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Active Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {filters.sector && filters.sector !== "all" && (
                  <Badge variant="secondary">Sector: {filters.sector}</Badge>
                )}
                {filters.projectType && filters.projectType !== "all" && (
                  <Badge variant="secondary">Type: {filters.projectType}</Badge>
                )}
                {filters.country && filters.country !== "all" && (
                  <Badge variant="secondary">Country: {filters.country}</Badge>
                )}
                {filters.city && filters.city !== "all" && (
                  <Badge variant="secondary">City: {filters.city}</Badge>
                )}
                {filters.district && filters.district !== "all" && (
                  <Badge variant="secondary">District: {filters.district}</Badge>
                )}
                {filters.status && filters.status !== "all" && (
                  <Badge variant="secondary">Status: {filters.status}</Badge>
                )}
                {filters.companyName && (
                  <Badge variant="secondary">Company: {filters.companyName}</Badge>
                )}
                {(filters.minValue || filters.maxValue) && (
                  <Badge variant="secondary">
                    Value: ${filters.minValue || 0}M - ${filters.maxValue || "∞"}M
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Project Opportunities
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="deadline">Sort by Deadline</option>
              <option value="value">Sort by Value</option>
              <option value="name">Sort by Name</option>
            </select>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="px-3"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Projects Grid/List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedProjects.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <HardHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters to find more projects.
              </p>
              <Button variant="outline" onClick={() => setLocation("/contractor-dashboard")}>
                Modify Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={cn(
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          )}>
            {sortedProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {project.name}
                    </h3>
                    <Badge variant={
                      project.status === "Tender Open" ? "default" :
                      project.status === "In Progress" ? "secondary" : "outline"
                    }>
                      {project.status}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {project.city}, {project.district}, {project.country}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Investment: ${project.investment}M
                    </div>
                    {project.size && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Building2 className="w-4 h-4 mr-2" />
                        Size: {project.size.toLocaleString()} sq ft
                      </div>
                    )}
                    {project.createdAt && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        Created: {new Date(project.createdAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="text-xs">
                      {project.sector}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {project.projectType}
                    </Badge>
                    {project.isLuxury && (
                      <Badge variant="outline" className="text-xs">
                        Luxury
                      </Badge>
                    )}
                    {project.isSustainable && (
                      <Badge variant="outline" className="text-xs">
                        Sustainable
                      </Badge>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Save Project
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}