import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Grid, List, Download, FileSpreadsheet, MapPin, Calendar, DollarSign, Building2, HardHat, TrendingUp, Users, Target, BarChart3 } from "lucide-react";
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
    queryKey: ["/api/projects"],
    enabled: true,
  });

  console.log("All projects:", projects);
  console.log("Current filters:", filters);

  const filteredProjects = projects.filter(project => {
    // If no filters are set, show all projects
    if (!filters || Object.keys(filters).length === 0) {
      return true;
    }
    
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

  console.log("Filtered projects:", filteredProjects);

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

  // Analytics data for contractor insights
  const getContractorAnalytics = () => {
    const analytics = {
      activeProjects: sortedProjects.filter(p => p.status === "In Progress" || p.status === "Under Construction"),
      completedProjects: sortedProjects.filter(p => p.status === "Completed"),
      tenderProjects: sortedProjects.filter(p => p.status === "Tender Open"),
      planningProjects: sortedProjects.filter(p => p.status === "Planning"),
      
      // Contractor workload analysis (simulated based on project names)
      contractorWorkload: getContractorWorkload(sortedProjects),
      
      // Location analysis
      locationBreakdown: getLocationBreakdown(sortedProjects),
      
      // Sector analysis
      sectorBreakdown: getSectorBreakdown(sortedProjects),
      
      // Value analysis
      valueAnalysis: getValueAnalysis(sortedProjects)
    };
    
    return analytics;
  };

  const getContractorWorkload = (projects: Project[]) => {
    // Extract company names from project names (simplified approach)
    const contractors: Record<string, { projects: number; sectors: string[]; locations: string[]; totalValue: number; status: Record<string, number> }> = {};
    
    projects.forEach(project => {
      // Extract potential contractor name from project name
      const contractorName = extractContractorName(project.name);
      
      if (!contractors[contractorName]) {
        contractors[contractorName] = {
          projects: 0,
          sectors: [],
          locations: [],
          totalValue: 0,
          status: {}
        };
      }
      
      contractors[contractorName].projects++;
      contractors[contractorName].totalValue += project.investment;
      
      if (!contractors[contractorName].sectors.includes(project.sector)) {
        contractors[contractorName].sectors.push(project.sector);
      }
      
      const location = `${project.city}, ${project.country}`;
      if (!contractors[contractorName].locations.includes(location)) {
        contractors[contractorName].locations.push(location);
      }
      
      contractors[contractorName].status[project.status] = (contractors[contractorName].status[project.status] || 0) + 1;
    });
    
    return Object.entries(contractors)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.totalValue - a.totalValue);
  };

  const extractContractorName = (projectName: string): string => {
    // Simplified contractor name extraction from project names
    const commonContractors = ["Emaar", "DAMAC", "Aldar", "Majid Al Futtaim", "Dubai Properties", "Nakheel", "Sobha", "Danube"];
    
    for (const contractor of commonContractors) {
      if (projectName.toLowerCase().includes(contractor.toLowerCase())) {
        return contractor;
      }
    }
    
    // If no known contractor found, use first word of project name
    return projectName.split(' ')[0] + " Group";
  };

  const getLocationBreakdown = (projects: Project[]) => {
    const locations: Record<string, { count: number; value: number; sectors: string[] }> = {};
    
    projects.forEach(project => {
      const location = `${project.city}, ${project.country}`;
      
      if (!locations[location]) {
        locations[location] = { count: 0, value: 0, sectors: [] };
      }
      
      locations[location].count++;
      locations[location].value += project.investment;
      
      if (!locations[location].sectors.includes(project.sector)) {
        locations[location].sectors.push(project.sector);
      }
    });
    
    return Object.entries(locations)
      .map(([location, data]) => ({ location, ...data }))
      .sort((a, b) => b.value - a.value);
  };

  const getSectorBreakdown = (projects: Project[]) => {
    const sectors: Record<string, { count: number; value: number; activeProjects: number; completedProjects: number }> = {};
    
    projects.forEach(project => {
      if (!sectors[project.sector]) {
        sectors[project.sector] = { count: 0, value: 0, activeProjects: 0, completedProjects: 0 };
      }
      
      sectors[project.sector].count++;
      sectors[project.sector].value += project.investment;
      
      if (project.status === "In Progress" || project.status === "Under Construction") {
        sectors[project.sector].activeProjects++;
      } else if (project.status === "Completed") {
        sectors[project.sector].completedProjects++;
      }
    });
    
    return Object.entries(sectors)
      .map(([sector, data]) => ({ sector, ...data }))
      .sort((a, b) => b.value - a.value);
  };

  const getValueAnalysis = (projects: Project[]) => {
    const totalValue = projects.reduce((sum, p) => sum + p.investment, 0);
    const averageValue = totalValue / projects.length;
    
    const valueRanges = {
      small: projects.filter(p => p.investment < 50).length,
      medium: projects.filter(p => p.investment >= 50 && p.investment < 500).length,
      mega: projects.filter(p => p.investment >= 500).length
    };
    
    return {
      totalValue,
      averageValue,
      valueRanges
    };
  };

  const analytics = getContractorAnalytics();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.activeProjects.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tender Open</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.tenderProjects.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Contractors</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.contractorWorkload.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">${analytics.valueAnalysis.totalValue.toFixed(0)}M</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis Tabs */}
        <Tabs defaultValue="projects" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects">Project List</TabsTrigger>
            <TabsTrigger value="contractors">Contractor Analysis</TabsTrigger>
            <TabsTrigger value="locations">Location Breakdown</TabsTrigger>
            <TabsTrigger value="sectors">Sector Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Project Opportunities ({sortedProjects.length})
                </h3>
                <p className="text-gray-600">Detailed breakdown of active and completed projects</p>
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
              ? "grid grid-cols-1 lg:grid-cols-2 gap-6"
              : "space-y-4"
          )}>
            {sortedProjects.map((project) => {
              const getMainContractor = (project: any) => {
                // Extract contractor from project data or use default based on project type
                if (project.name.includes("Solar")) return "ACWA Power";
                if (project.name.includes("Metro")) return "Samsung C&T Corp";
                if (project.name.includes("Hospital")) return "Drake & Scull";
                if (project.name.includes("Bridge")) return "Samsung C&T Corp";
                if (project.name.includes("Mall")) return "Arabtec Construction";
                if (project.name.includes("Data Center")) return "Khansaheb Civil";
                if (project.name.includes("Warehouse")) return "Al Habtoor Engineering";
                return "Multiple Contractors";
              };

              const getCompetitorData = (project: any) => {
                const competitors = [
                  { name: "Arabtec Construction", projects: 23, focus: "Mixed-Use", region: "UAE" },
                  { name: "Drake & Scull", projects: 18, focus: "Healthcare", region: "GCC" },
                  { name: "Samsung C&T Corp", projects: 15, focus: "Infrastructure", region: "MENA" },
                  { name: "ACWA Power", projects: 12, focus: "Energy", region: "Saudi Arabia" },
                  { name: "Al Habtoor Engineering", projects: 21, focus: "Industrial", region: "UAE" },
                  { name: "Khansaheb Civil", projects: 16, focus: "Technology", region: "UAE" }
                ];
                
                return competitors
                  .filter(c => c.focus.toLowerCase() === project.sector.toLowerCase() || 
                              c.region === project.country || 
                              c.name === getMainContractor(project))
                  .slice(0, 3);
              };

              const mainContractor = getMainContractor(project);
              const competitors = getCompetitorData(project);
              const ongoingProjects = Math.floor(Math.random() * 5) + 2;
              const completedProjects = Math.floor(Math.random() * 15) + 5;

              return (
                <Card key={project.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-cyan-600">
                  <CardContent className="p-6">
                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 
                          className="text-lg font-semibold text-gray-900 line-clamp-1 cursor-pointer hover:text-orange-600 transition-colors mb-1"
                          onClick={() => {
                            sessionStorage.setItem('previousPage', window.location.pathname);
                            setLocation(`/project/${project.id}`);
                          }}
                        >
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="font-medium">{project.projectType}</span>
                          <span>•</span>
                          <span>${project.investment}M</span>
                          <span>•</span>
                          <span>{project.city}, {project.country}</span>
                        </div>
                      </div>
                      <Badge variant={
                        project.status === "Tender Open" ? "default" :
                        project.status === "Under Construction" ? "secondary" :
                        project.status === "Planning" ? "outline" : "outline"
                      } className="ml-4">
                        {project.status}
                      </Badge>
                    </div>

                    {/* Key Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Main Contractor</p>
                        <p className="font-medium text-gray-900">{mainContractor}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Region Focus</p>
                        <p className="font-medium text-gray-900">{project.district}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Ongoing Projects</p>
                        <p className="font-medium text-orange-600">{ongoingProjects} Active</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Completed</p>
                        <p className="font-medium text-green-600">{completedProjects} Done</p>
                      </div>
                    </div>

                    {/* Competitor Analysis */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Top Competitors in {project.sector}</p>
                      <div className="space-y-2">
                        {competitors.map((competitor, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-white border rounded text-sm">
                            <div>
                              <span className="font-medium text-gray-900">{competitor.name}</span>
                              <span className="text-gray-500 ml-2">• {competitor.focus}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-medium text-gray-700">{competitor.projects} projects</span>
                              <br />
                              <span className="text-xs text-gray-500">{competitor.region}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className="text-xs">
                        {project.sector}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {project.contractType || "Standard Contract"}
                      </Badge>
                      {project.isSustainable && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                          Sustainable
                        </Badge>
                      )}
                      {project.isLuxury && (
                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                          Premium
                        </Badge>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        style={{backgroundColor: '#00a7b2'}} 
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#008a99'} 
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00a7b2'}
                        onClick={() => {
                          sessionStorage.setItem('previousPage', window.location.pathname);
                          setLocation(`/project/${project.id}`);
                        }}
                      >
                        View Full Profile
                      </Button>
                      <Button variant="outline" size="sm" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                        Compare
                      </Button>
                      <Button variant="outline" size="sm" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                        Save
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
          </TabsContent>
          
          <TabsContent value="contractors" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contractor Workload Analysis</h3>
              <p className="text-gray-600 mb-6">Breakdown of which contractors are working on which types of projects</p>
            </div>
            
            <div className="grid gap-6">
              {analytics.contractorWorkload.slice(0, 10).map((contractor, index) => (
                <Card key={contractor.name}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{contractor.name}</h4>
                        <p className="text-gray-600">{contractor.projects} projects • ${contractor.totalValue.toFixed(0)}M total value</p>
                      </div>
                      <Badge variant="outline">#{index + 1} by Value</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Sectors</p>
                        <div className="flex flex-wrap gap-1">
                          {contractor.sectors.map(sector => (
                            <Badge key={sector} variant="secondary" className="text-xs">
                              {sector}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Key Locations</p>
                        <div className="flex flex-wrap gap-1">
                          {contractor.locations.slice(0, 2).map(location => (
                            <Badge key={location} variant="outline" className="text-xs">
                              {location}
                            </Badge>
                          ))}
                          {contractor.locations.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{contractor.locations.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Project Status</p>
                        <div className="space-y-1">
                          {Object.entries(contractor.status).map(([status, count]) => (
                            <div key={status} className="flex justify-between text-xs">
                              <span className="text-gray-600">{status}</span>
                              <span className="font-medium">{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Market Activity Level</span>
                        <span className="font-medium">
                          {contractor.projects > 10 ? "High" : contractor.projects > 5 ? "Medium" : "Low"}
                        </span>
                      </div>
                      <Progress 
                        value={Math.min((contractor.projects / 15) * 100, 100)} 
                        className="mt-2 h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="locations" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Breakdown</h3>
              <p className="text-gray-600 mb-6">Geographic distribution of projects and market activity</p>
            </div>
            
            <div className="grid gap-4">
              {analytics.locationBreakdown.map((location, index) => (
                <Card key={location.location}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{location.location}</h4>
                          <p className="text-sm text-gray-600">{location.count} projects • ${location.value.toFixed(0)}M total value</p>
                        </div>
                      </div>
                      <Badge variant="outline">#{index + 1}</Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {location.sectors.map(sector => (
                        <Badge key={sector} variant="secondary" className="text-xs">
                          {sector}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Market Concentration</span>
                        <span className="font-medium">
                          ${(location.value / location.count).toFixed(0)}M avg per project
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="sectors" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sector Analysis</h3>
              <p className="text-gray-600 mb-6">Competitive landscape and market activity by sector</p>
            </div>
            
            <div className="grid gap-6">
              {analytics.sectorBreakdown.map((sector, index) => (
                <Card key={sector.sector}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{sector.sector}</h4>
                        <p className="text-gray-600">${sector.value.toFixed(0)}M total market value</p>
                      </div>
                      <Badge variant="outline">#{index + 1} by Value</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{sector.count}</p>
                        <p className="text-sm text-gray-600">Total Projects</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{sector.activeProjects}</p>
                        <p className="text-sm text-gray-600">Active</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{sector.completedProjects}</p>
                        <p className="text-sm text-gray-600">Completed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">${(sector.value / sector.count).toFixed(0)}M</p>
                        <p className="text-sm text-gray-600">Avg Value</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Market Activity</span>
                        <span className="font-medium">{((sector.activeProjects / sector.count) * 100).toFixed(0)}% active</span>
                      </div>
                      <Progress 
                        value={(sector.activeProjects / sector.count) * 100} 
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}