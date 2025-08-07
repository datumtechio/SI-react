import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Grid, List, Download, FileSpreadsheet, MapPin, DollarSign, TrendingUp, Building2, Target } from "lucide-react";
import { Project } from "@shared/schema";
import { cn } from "@/lib/utils";

export default function InvestorProjects() {
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("roi");
  const [filters, setFilters] = useState<any>({});

  useEffect(() => {
    const savedFilters = localStorage.getItem("investorFilters");
    if (savedFilters) {
      setFilters(JSON.parse(savedFilters));
    }
  }, []);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const filteredProjects = projects.filter(project => {
    if (filters.sector && filters.sector !== "all" && project.sector !== filters.sector) return false;
    if (filters.projectType && filters.projectType !== "all" && project.projectType !== filters.projectType) return false;
    if (filters.country && filters.country !== "all" && project.country !== filters.country) return false;
    if (filters.city && filters.city !== "all" && project.city !== filters.city) return false;
    if (filters.companyName && !project.name.toLowerCase().includes(filters.companyName.toLowerCase())) return false;
    if (filters.minValue && project.investment < filters.minValue) return false;
    if (filters.maxValue && project.investment > filters.maxValue) return false;
    return true;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case "roi":
        return (b.expectedRoi || 0) - (a.expectedRoi || 0);
      case "value":
        return (b.investment || 0) - (a.investment || 0);
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const analytics = {
    seekingInvestment: sortedProjects.filter(p => p.status === "Seeking Investment" || p.status === "Planning").length,
    activeProjects: sortedProjects.filter(p => p.status === "In Progress").length,
    avgRoi: sortedProjects.reduce((sum, p) => sum + (p.expectedRoi || 0), 0) / sortedProjects.length || 0,
    totalValue: sortedProjects.reduce((sum, p) => sum + p.investment, 0)
  };

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
                onClick={() => setLocation("/investor-dashboard")}
                className="text-gray-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Investment Opportunities</h1>
                  <p className="text-gray-600">Found {sortedProjects.length} matching opportunities</p>
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
                Investment Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sortedProjects.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No investment opportunities found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters to find more opportunities.</p>
              <Button variant="outline" onClick={() => setLocation("/investor-dashboard")}>
                Adjust Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Market Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Seeking Investment</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.seekingInvestment}</p>
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
                      <p className="text-sm font-medium text-gray-600">Active Projects</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.activeProjects}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Target className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Avg Expected ROI</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.avgRoi.toFixed(1)}%</p>
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
                      <p className="text-sm font-medium text-gray-600">Total Market Value</p>
                      <p className="text-2xl font-bold text-gray-900">${analytics.totalValue.toFixed(0)}M</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Investment Opportunities ({sortedProjects.length})
                </h3>
                <p className="text-gray-600">Available investment opportunities and ROI analysis</p>
              </div>
              <div className="flex items-center space-x-4">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="roi">Sort by Expected ROI</option>
                  <option value="value">Sort by Investment Value</option>
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
            <div className={cn(
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            )}>
              {sortedProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 
                        className="text-lg font-semibold text-gray-900 line-clamp-1 cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => {
                          localStorage.setItem("projectProfileReferrer", "/investor-projects");
                          setLocation(`/project/${project.id}`);
                        }}
                      >
                        {project.name}
                      </h3>
                      <Badge variant={
                        project.status === "Seeking Investment" ? "default" :
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
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Investment: ${project.investment.toLocaleString()}M
                      </div>
                      {project.expectedRoi && (
                        <div className="flex items-center text-sm text-green-600">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Expected ROI: {project.expectedRoi}%
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
                      <Button 
                        size="sm" 
                        className="flex-1" style={{backgroundColor: '#00a7b2'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#008a99'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00a7b2'}
                        onClick={() => {
                          localStorage.setItem("projectProfileReferrer", "/investor-projects");
                          setLocation(`/project/${project.id}`);
                        }}
                      >
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Compare
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}