import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Grid, List, Download, FileSpreadsheet, Filter, X, HardHat, MapPin, Calendar, DollarSign } from "lucide-react";
import { ProjectCard } from "@/components/project-card";
import { Project, SearchFilters } from "@shared/schema";
import { FilterOptions } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Sector-specific project types
const sectorProjectTypes: Record<string, string[]> = {
  "Real Estate": ["Residential", "Commercial", "Hospitality"],
  "Infrastructure": ["Roads", "Bridges", "Airports"],
  "Energy": ["Solar plants", "Power grids"],
  "Oil & Gas": ["Refineries", "Pipelines"],
  "Industry": ["Factories", "Warehousing"]
};

export default function ContractorDashboard() {
  const { toast } = useToast();
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [selectedProjectType, setSelectedProjectType] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("deadline");

  // Available project types based on selected sector
  const availableProjectTypes = selectedSector ? sectorProjectTypes[selectedSector] || [] : [];

  // Reset project type when sector changes
  useEffect(() => {
    setSelectedProjectType("");
  }, [selectedSector]);

  const contractorFilters: SearchFilters = {
    sector: selectedSector || undefined,
    projectType: selectedProjectType || undefined,
    country: selectedLocation || undefined,
    status: selectedStatus || undefined
  };

  const { data: projects = [], isLoading: isLoadingProjects } = useQuery<Project[]>({
    queryKey: ["/api/projects", contractorFilters],
    enabled: true,
  });

  const { data: filterOptions } = useQuery<FilterOptions>({
    queryKey: ["/api/filter-options"],
  });

  const handleClearFilters = () => {
    setSelectedSector("");
    setSelectedProjectType("");
    setSelectedLocation("");
    setSelectedStatus("");
  };

  const activeFiltersCount = [selectedSector, selectedProjectType, selectedLocation, selectedStatus].filter(Boolean).length;

  const filteredProjects = projects.filter(project => {
    if (selectedSector && project.sector !== selectedSector) return false;
    if (selectedProjectType && project.projectType !== selectedProjectType) return false;
    if (selectedLocation && project.country !== selectedLocation) return false;
    if (selectedStatus && project.status !== selectedStatus) return false;
    return true;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case "deadline":
        // Use createdAt as a proxy for deadline since timeline doesn't exist
        return new Date(a.createdAt || "").getTime() - new Date(b.createdAt || "").getTime();
      case "value":
        // Use size as a proxy for project value since budget doesn't exist
        return (b.size || 0) - (a.size || 0);
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
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <HardHat className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Contractor Dashboard</h1>
                <p className="text-gray-600">Find active projects and bidding opportunities</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Projects
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
        {/* Filters Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Project Filters</span>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary">{activeFiltersCount} active</Badge>
                )}
              </CardTitle>
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Sector Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sector</label>
                <Select value={selectedSector} onValueChange={setSelectedSector}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sectors</SelectItem>
                    {Object.keys(sectorProjectTypes).map((sector) => (
                      <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Project Type Filter - Dynamic based on sector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Project Type</label>
                <Select 
                  value={selectedProjectType} 
                  onValueChange={setSelectedProjectType}
                  disabled={!selectedSector || selectedSector === "all"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      !selectedSector || selectedSector === "all" 
                        ? "Select sector first" 
                        : "Select type"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {availableProjectTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Location</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {filterOptions?.countries?.map((country) => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Project Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Tender Open">Tender Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="Pre-Construction">Pre-Construction</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deadline">Deadline</SelectItem>
                    <SelectItem value="value">Project Value</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Available Projects ({sortedProjects.length})
            </h2>
            <p className="text-gray-600">
              {selectedSector && selectedSector !== "all" && (
                <span>Showing {selectedSector} projects</span>
              )}
              {selectedProjectType && selectedProjectType !== "all" && (
                <span> • {selectedProjectType} type</span>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-4">
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
        {isLoadingProjects ? (
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
              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
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
                      {project.city}, {project.country}
                    </div>
                    {project.size && (
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2" />
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
                    {project.projectType && (
                      <Badge variant="outline" className="text-xs">
                        {project.projectType}
                      </Badge>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Save
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