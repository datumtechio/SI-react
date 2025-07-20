import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Grid, List, Download, FileSpreadsheet, Bookmark, Filter, X } from "lucide-react";
import { ProjectCard } from "@/components/project-card";
import { MarketIndicator } from "@/components/market-indicator";
import { ProjectComparison } from "@/components/project-comparison";
import { GlobalHeaderFilter } from "@/components/global-header-filter";
import { InvestorFiltersComponent } from "@/components/investor-filters";
import { InvestorInsights } from "@/components/investor-insights";
import { Project, MarketIndicator as MarketIndicatorType, SearchFilters, InvestorFilters } from "@shared/schema";
import { UserRole, FilterOptions } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({});
  const [comparisonProjects, setComparisonProjects] = useState<Project[]>([]);
  const [favoriteProjects, setFavoriteProjects] = useState<number[]>([]);
  const [globalFilters, setGlobalFilters] = useState<{ country?: string; sector?: string }>({});
  const [investorFilters, setInvestorFilters] = useState<InvestorFilters>({ country: "Saudi Arabia" });
  const [showInsights, setShowInsights] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("selectedRole") as UserRole;
    const filters = localStorage.getItem("searchFilters");
    
    if (role) {
      setSelectedRole(role);
    }
    
    if (filters) {
      const parsedFilters = JSON.parse(filters);
      setSearchFilters(parsedFilters);
      setActiveFilters(parsedFilters);
    }
    
    // Load global filters from localStorage
    const savedCountry = localStorage.getItem("globalCountryFilter");
    const savedSector = localStorage.getItem("globalSectorFilter");
    
    if (savedCountry || savedSector) {
      setGlobalFilters({
        country: savedCountry || undefined,
        sector: savedSector || undefined,
      });
    }

    // Set default country to Saudi Arabia for investors
    if (role === "investor" && !savedCountry) {
      setGlobalFilters(prev => ({ ...prev, country: "Saudi Arabia" }));
      setInvestorFilters(prev => ({ ...prev, country: "Saudi Arabia" }));
    }
  }, []);

  // Use investor filters for investor role, otherwise use regular filters
  const queryFilters = selectedRole === "investor" ? investorFilters : { ...activeFilters, ...globalFilters };
  
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery<Project[]>({
    queryKey: ["/api/projects", queryFilters],
    enabled: true,
  });

  const { data: marketIndicators = [], isLoading: isLoadingIndicators } = useQuery<MarketIndicatorType[]>({
    queryKey: ["/api/market-indicators"],
  });

  const { data: filterOptions } = useQuery<FilterOptions>({
    queryKey: ["/api/filter-options"],
  });

  const handleFilterChange = (key: keyof SearchFilters, value: string | number | boolean | null) => {
    const newFilters = {
      ...activeFilters,
      [key]: value === null || value === "" || value === "All" ? undefined : value
    };
    setActiveFilters(newFilters);
  };

  const handleGlobalFilterChange = (newGlobalFilters: { country?: string; sector?: string }) => {
    setGlobalFilters(newGlobalFilters);
  };

  const removeFilter = (key: keyof SearchFilters) => {
    const newFilters = { ...activeFilters };
    delete newFilters[key];
    setActiveFilters(newFilters);
  };

  const handleToggleFavorite = (projectId: number) => {
    setFavoriteProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleAddToComparison = (project: Project) => {
    if (comparisonProjects.length >= 4) {
      toast({
        title: "Comparison Limit",
        description: "You can compare up to 4 projects at a time.",
        variant: "destructive",
      });
      return;
    }
    
    if (comparisonProjects.find(p => p.id === project.id)) {
      toast({
        title: "Already Added",
        description: "This project is already in your comparison.",
        variant: "destructive",
      });
      return;
    }

    setComparisonProjects(prev => [...prev, project]);
    toast({
      title: "Added to Comparison",
      description: `${project.name} has been added to comparison.`,
    });
  };

  const handleRemoveFromComparison = (projectId: number) => {
    setComparisonProjects(prev => prev.filter(p => p.id !== projectId));
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Your project data is being prepared for download.",
    });
  };

  const handleSaveSearch = () => {
    toast({
      title: "Search Saved",
      description: "Your search criteria has been saved to your profile.",
    });
  };

  const handleInvestorFiltersChange = (filters: InvestorFilters) => {
    setInvestorFilters(filters);
  };

  const handleGetInsights = () => {
    setShowInsights(true);
    toast({
      title: "Market Analysis Generated",
      description: "District-level insights and market gap indicators are now available.",
    });
  };

  const getActiveFilterEntries = () => {
    return Object.entries(activeFilters).filter(([, value]) => value !== undefined);
  };

  if (isLoadingProjects || isLoadingIndicators) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Global Header Filter */}
      <GlobalHeaderFilter 
        onFilterChange={handleGlobalFilterChange}
        initialFilters={globalFilters}
      />
      
      <div className="flex">
        {/* Sidebar Filters */}
        <div className="filter-sidebar">
          <div className="p-6">
            {selectedRole === "investor" ? (
              <InvestorFiltersComponent 
                filters={investorFilters}
                onFiltersChange={handleInvestorFiltersChange}
                onGetInsights={handleGetInsights}
              />
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
                  <Filter size={18} className="text-slate-400" />
                </div>

            {/* Active Filters */}
            {getActiveFilterEntries().length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-700 mb-3">Active Filters</h3>
                <div className="space-y-2">
                  {getActiveFilterEntries().map(([key, value]) => (
                    <Badge key={key} variant="secondary" className="flex items-center justify-between">
                      <span className="text-xs">{String(value)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFilter(key as keyof SearchFilters)}
                        className="ml-1 h-auto p-0 text-slate-500 hover:text-slate-700"
                      >
                        <X size={12} />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Filter Sections */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-3">Project Type</h3>
                <div className="space-y-2">
                  {filterOptions?.projectTypes.map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={activeFilters.projectType === type}
                        onCheckedChange={(checked) => 
                          handleFilterChange("projectType", checked ? type : null)
                        }
                      />
                      <label 
                        htmlFor={`type-${type}`}
                        className="text-sm text-slate-600 cursor-pointer"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-3">Status</h3>
                <div className="space-y-2">
                  {filterOptions?.statuses.map(status => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={activeFilters.status === status}
                        onCheckedChange={(checked) => 
                          handleFilterChange("status", checked ? status : null)
                        }
                      />
                      <label 
                        htmlFor={`status-${status}`}
                        className="text-sm text-slate-600 cursor-pointer"
                      >
                        {status}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-3">Special Features</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="luxury"
                      checked={activeFilters.isLuxury === true}
                      onCheckedChange={(checked) => 
                        handleFilterChange("isLuxury", checked ? true : null)
                      }
                    />
                    <label htmlFor="luxury" className="text-sm text-slate-600 cursor-pointer">
                      Luxury Projects
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="waterfront"
                      checked={activeFilters.isWaterfront === true}
                      onCheckedChange={(checked) => 
                        handleFilterChange("isWaterfront", checked ? true : null)
                      }
                    />
                    <label htmlFor="waterfront" className="text-sm text-slate-600 cursor-pointer">
                      Waterfront Properties
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sustainable"
                      checked={activeFilters.isSustainable === true}
                      onCheckedChange={(checked) => 
                        handleFilterChange("isSustainable", checked ? true : null)
                      }
                    />
                    <label htmlFor="sustainable" className="text-sm text-slate-600 cursor-pointer">
                      Sustainable Development
                    </label>
                  </div>
                </div>
              </div>
            </div>
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-80">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Project Dashboard</h1>
                <p className="text-slate-600 mt-1">
                  Found <span className="font-medium">{projects.length} projects</span> matching your criteria
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600">View:</span>
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid size={16} />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List size={16} />
                  </Button>
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Sort by: Relevance</SelectItem>
                    <SelectItem value="investment">Investment Size</SelectItem>
                    <SelectItem value="completion">Completion Date</SelectItem>
                    <SelectItem value="roi">ROI Potential</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Investor Insights or Market Indicators */}
            {selectedRole === "investor" && showInsights ? (
              <div className="mb-8">
                <InvestorInsights 
                  projects={projects}
                  selectedLocation={`${investorFilters.city || investorFilters.country || ""}${investorFilters.district ? ` → ${investorFilters.district}` : ""}`}
                  selectedSector={investorFilters.sector}
                  selectedSubSector={investorFilters.subSector}
                />
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-6 mb-8">
                {marketIndicators.map((indicator) => (
                  <MarketIndicator key={indicator.id} indicator={indicator} />
                ))}
              </div>
            )}

            {/* Project Comparison Module */}
            <div className="mb-8">
              <ProjectComparison
                projects={comparisonProjects}
                onAddProject={() => {
                  toast({
                    title: "Add Project",
                    description: "Click the info button on any project card to add it to comparison.",
                  });
                }}
                onRemoveProject={handleRemoveFromComparison}
              />
            </div>

            {/* Project Grid */}
            <div className={cn(
              "grid gap-6 mb-8",
              viewMode === "grid" ? "lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
            )}>
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onToggleFavorite={handleToggleFavorite}
                  onViewDetails={handleAddToComparison}
                  isFavorite={favoriteProjects.includes(project.id)}
                />
              ))}
            </div>

            {projects.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No Projects Found</h3>
                  <p className="text-slate-600">
                    Try adjusting your search criteria or removing some filters.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Export & Save Options */}
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={handleExportData}>
                  <Download className="mr-2" size={16} />
                  Export Report
                </Button>
                <Button variant="outline" onClick={handleExportData}>
                  <FileSpreadsheet className="mr-2" size={16} />
                  Export Data
                </Button>
                <Button onClick={handleSaveSearch}>
                  <Bookmark className="mr-2" size={16} />
                  Save Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
