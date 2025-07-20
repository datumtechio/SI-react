import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Filter, 
  X, 
  Download, 
  Bookmark, 
  TrendingUp, 
  MapPin, 
  DollarSign, 
  Calendar,
  BarChart3,
  Building2,
  Zap,
  Factory,
  Fuel
} from "lucide-react";
import { ProjectCard } from "@/components/project-card";
import { Project, InvestorFilters } from "@shared/schema";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Sector configuration with icons and sub-sectors
const SECTORS_CONFIG = {
  "Real Estate": {
    icon: Building2,
    color: "#0a1b3d",
    subSectors: ["Residential", "Commercial", "Hospitality", "Retail", "Mixed-use"]
  },
  "Infrastructure": {
    icon: BarChart3,
    color: "#00a7b2",
    subSectors: ["Roads", "Bridges", "Airports", "Ports", "Utilities Infrastructure"]
  },
  "Energy": {
    icon: Zap,
    color: "#f59e0b",
    subSectors: ["Renewable Energy (Solar, Wind)", "Power Plants", "Energy Storage"]
  },
  "Industry": {
    icon: Factory,
    color: "#10b981",
    subSectors: ["Industrial Parks", "Manufacturing Zones", "Logistics Hubs"]
  },
  "Oil & Gas": {
    icon: Fuel,
    color: "#ef4444",
    subSectors: ["Refineries", "Petrochemical Plants", "Distribution Facilities"]
  }
};

const COUNTRIES = ["Saudi Arabia", "United Arab Emirates", "Qatar", "Kuwait", "Bahrain", "Oman"];
const STATUSES = ["Planning", "Under Construction", "Nearing Completion", "Completed / Operational"];
const RISK_LEVELS = ["Low", "Medium", "High"];

export default function InvestorSearch() {
  const { toast } = useToast();
  const [filters, setFilters] = useState<InvestorFilters>({
    country: "Saudi Arabia"
  });
  const [savedSearches, setSavedSearches] = useState<string[]>([]);
  const [comparisonProjects, setComparisonProjects] = useState<Project[]>([]);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects", filters],
    enabled: true,
  });

  const { data: cities = [] } = useQuery<string[]>({
    queryKey: ["/api/cities", filters.country],
    enabled: !!filters.country,
  });

  const { data: districts = [] } = useQuery<string[]>({
    queryKey: ["/api/districts", filters.country, filters.city],
    enabled: !!filters.country && !!filters.city,
  });

  const handleFilterChange = (key: keyof InvestorFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    
    // Reset dependent filters
    if (key === "country") {
      newFilters.city = undefined;
      newFilters.district = undefined;
    } else if (key === "city") {
      newFilters.district = undefined;
    } else if (key === "sector") {
      newFilters.subSector = undefined;
    }
    
    setFilters(newFilters);
  };

  const removeFilter = (key: keyof InvestorFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({ country: "Saudi Arabia" });
  };

  const saveCurrentSearch = () => {
    const searchName = `Search ${new Date().toLocaleDateString()}`;
    setSavedSearches(prev => [...prev, searchName]);
    toast({
      title: "Search Saved",
      description: "Your investment search criteria has been saved.",
    });
  };

  const exportResults = () => {
    toast({
      title: "Export Started",
      description: "Your investment analysis report is being prepared.",
    });
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value !== undefined && value !== "").length;
  };

  const selectedSectorConfig = filters.sector ? SECTORS_CONFIG[filters.sector as keyof typeof SECTORS_CONFIG] : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading investment opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Investor Search Module</h1>
                <p className="text-slate-600 mt-1">
                  Discover and analyze investment opportunities across MENA region sectors
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" onClick={saveCurrentSearch}>
                  <Bookmark className="mr-2" size={16} />
                  Save Search
                </Button>
                <Button onClick={exportResults}>
                  <Download className="mr-2" size={16} />
                  Export Analysis
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Advanced Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Filter className="mr-2" size={18} />
                    Investment Filters
                  </span>
                  {getActiveFilterCount() > 1 && (
                    <Badge variant="secondary">{getActiveFilterCount() - 1}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Location Filters */}
                <div>
                  <Label className="text-sm font-medium text-slate-700">Location</Label>
                  <div className="space-y-3 mt-2">
                    <div>
                      <Label htmlFor="country" className="text-xs text-slate-500">Country</Label>
                      <Select 
                        value={filters.country || ""} 
                        onValueChange={(value) => handleFilterChange("country", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map(country => (
                            <SelectItem key={country} value={country}>{country}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {filters.country && (
                      <div>
                        <Label htmlFor="city" className="text-xs text-slate-500">City</Label>
                        <Select 
                          value={filters.city || ""} 
                          onValueChange={(value) => handleFilterChange("city", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All Cities</SelectItem>
                            {cities.map(city => (
                              <SelectItem key={city} value={city}>{city}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    {filters.city && (
                      <div>
                        <Label htmlFor="district" className="text-xs text-slate-500">District (Optional)</Label>
                        <Select 
                          value={filters.district || ""} 
                          onValueChange={(value) => handleFilterChange("district", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select district" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All Districts</SelectItem>
                            {districts.map(district => (
                              <SelectItem key={district} value={district}>{district}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Sector Selection */}
                <div>
                  <Label className="text-sm font-medium text-slate-700">Sector</Label>
                  <div className="space-y-3 mt-2">
                    <Select 
                      value={filters.sector || ""} 
                      onValueChange={(value) => handleFilterChange("sector", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select main sector" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Sectors</SelectItem>
                        {Object.entries(SECTORS_CONFIG).map(([sector, config]) => {
                          const Icon = config.icon;
                          return (
                            <SelectItem key={sector} value={sector}>
                              <div className="flex items-center">
                                <Icon size={16} className="mr-2" style={{ color: config.color }} />
                                {sector}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    
                    {selectedSectorConfig && (
                      <div>
                        <Label htmlFor="subSector" className="text-xs text-slate-500">Sub-Sector</Label>
                        <Select 
                          value={filters.subSector || ""} 
                          onValueChange={(value) => handleFilterChange("subSector", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select sub-sector" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All Sub-Sectors</SelectItem>
                            {selectedSectorConfig.subSectors.map(subSector => (
                              <SelectItem key={subSector} value={subSector}>{subSector}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Project Status */}
                <div>
                  <Label className="text-sm font-medium text-slate-700">Project Status</Label>
                  <div className="space-y-2 mt-2">
                    {STATUSES.map(status => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${status}`}
                          checked={filters.status === status}
                          onCheckedChange={(checked) => 
                            handleFilterChange("status", checked ? status : undefined)
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

                {/* Investment Range */}
                <div>
                  <Label className="text-sm font-medium text-slate-700">Investment Range (USD Millions)</Label>
                  <div className="space-y-3 mt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="minInvestment" className="text-xs text-slate-500">Min</Label>
                        <Input
                          id="minInvestment"
                          type="number"
                          placeholder="0"
                          value={filters.minInvestment || ""}
                          onChange={(e) => handleFilterChange("minInvestment", Number(e.target.value) || undefined)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxInvestment" className="text-xs text-slate-500">Max</Label>
                        <Input
                          id="maxInvestment"
                          type="number"
                          placeholder="1000"
                          value={filters.maxInvestment || ""}
                          onChange={(e) => handleFilterChange("maxInvestment", Number(e.target.value) || undefined)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* ROI Range */}
                <div>
                  <Label className="text-sm font-medium text-slate-700">Expected ROI (%)</Label>
                  <div className="space-y-3 mt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="minRoi" className="text-xs text-slate-500">Min</Label>
                        <Input
                          id="minRoi"
                          type="number"
                          placeholder="0"
                          value={filters.minRoi || ""}
                          onChange={(e) => handleFilterChange("minRoi", Number(e.target.value) || undefined)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxRoi" className="text-xs text-slate-500">Max</Label>
                        <Input
                          id="maxRoi"
                          type="number"
                          placeholder="50"
                          value={filters.maxRoi || ""}
                          onChange={(e) => handleFilterChange("maxRoi", Number(e.target.value) || undefined)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Risk Level */}
                <div>
                  <Label className="text-sm font-medium text-slate-700">Risk Assessment</Label>
                  <div className="space-y-2 mt-2">
                    {RISK_LEVELS.map(level => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox
                          id={`risk-${level}`}
                          checked={filters.riskLevel === level}
                          onCheckedChange={(checked) => 
                            handleFilterChange("riskLevel", checked ? level : undefined)
                          }
                        />
                        <label 
                          htmlFor={`risk-${level}`}
                          className="text-sm text-slate-600 cursor-pointer"
                        >
                          {level} Risk
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {getActiveFilterCount() > 1 && (
                  <Button 
                    variant="outline" 
                    onClick={clearAllFilters}
                    className="w-full"
                  >
                    <X className="mr-2" size={16} />
                    Clear All Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              
              {/* Results Summary */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">Investment Opportunities</h2>
                      <p className="text-slate-600">
                        Found <span className="font-medium">{projects.length} projects</span> matching your investment criteria
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="text-green-500" size={20} />
                      <span className="text-sm text-slate-600">Market confidence: High</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Active Filters Display */}
              {getActiveFilterCount() > 1 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Active Filters:</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearAllFilters}
                        className="text-slate-500 hover:text-slate-700"
                      >
                        Clear All
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Object.entries(filters).map(([key, value]) => {
                        if (!value || key === "country") return null;
                        return (
                          <Badge key={key} variant="secondary" className="flex items-center">
                            <span className="text-xs">{String(value)}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFilter(key as keyof InvestorFilters)}
                              className="ml-1 h-auto p-0 text-slate-500 hover:text-slate-700"
                            >
                              <X size={12} />
                            </Button>
                          </Badge>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Project Results */}
              <div className="grid md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onToggleFavorite={() => {}}
                    onViewDetails={() => {}}
                    isFavorite={false}
                  />
                ))}
              </div>

              {projects.length === 0 && (
                <Card className="text-center py-12">
                  <CardContent>
                    <Search className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No Investment Opportunities Found</h3>
                    <p className="text-slate-600 mb-4">
                      Try adjusting your search criteria or expanding your location filters.
                    </p>
                    <Button onClick={clearAllFilters}>
                      Clear Filters & Browse All
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}