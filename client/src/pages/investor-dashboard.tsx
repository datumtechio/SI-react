import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Download, FileSpreadsheet, Filter, X, TrendingUp } from "lucide-react";
import { Project, SearchFilters } from "@shared/schema";
import { FilterOptions } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Sector-specific project types
const sectorProjectTypes: Record<string, string[]> = {
  "Real Estate": ["Residential", "Commercial", "Mixed-Use", "Hospitality"],
  "Infrastructure": ["Transportation", "Utilities", "Public Buildings"],
  "Healthcare": ["Hospitals", "Clinics", "Medical Centers"],
  "Oil & Gas": ["Refineries", "Pipelines"],
  "Industry": ["Factories", "Warehousing"]
};

export default function InvestorDashboard() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [selectedProjectType, setSelectedProjectType] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [investmentRange, setInvestmentRange] = useState<string>("");

  // Available project types based on selected sector
  const availableProjectTypes = selectedSector ? sectorProjectTypes[selectedSector] || [] : [];

  // Reset project type when sector changes, and city/district when country changes
  useEffect(() => {
    setSelectedProjectType("");
  }, [selectedSector]);

  useEffect(() => {
    setSelectedCity("");
    setSelectedDistrict("");
  }, [selectedCountry]);

  const handleFindInvestments = () => {
    // Get investment range
    let minValue, maxValue;
    switch (investmentRange) {
      case "small":
        minValue = 0;
        maxValue = 100; // $100M
        break;
      case "medium":
        minValue = 100;
        maxValue = 1000; // $100M - $1B
        break;
      case "mega":
        minValue = 1000;
        maxValue = undefined; // $1B+
        break;
      default:
        minValue = undefined;
        maxValue = undefined;
    }

    const investorFilters = {
      sector: selectedSector || undefined,
      projectType: selectedProjectType || undefined,
      country: selectedCountry || undefined,
      city: selectedCity || undefined,
      district: selectedDistrict || undefined,
      status: selectedStatus || undefined,
      companyName: companyName || undefined,
      minValue,
      maxValue
    };

    // Save filters to localStorage for the results page
    localStorage.setItem("investorFilters", JSON.stringify(investorFilters));
    
    // Navigate to results page
    setLocation("/investor-projects");
  };

  const { data: filterOptions } = useQuery<FilterOptions>({
    queryKey: ["/api/filter-options"],
  });

  const handleClearFilters = () => {
    setSelectedSector("");
    setSelectedProjectType("");
    setSelectedCountry("");
    setSelectedCity("");
    setSelectedDistrict("");
    setSelectedStatus("");
    setCompanyName("");
    setInvestmentRange("");
  };

  const activeFiltersCount = [
    selectedSector, 
    selectedProjectType, 
    selectedCountry, 
    selectedCity, 
    selectedDistrict, 
    selectedStatus, 
    companyName, 
    investmentRange
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9fafc' }}>
      {/* Header */}
      <div className="bg-white border-b" style={{ borderColor: '#f9fafc' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => setLocation("/role-selection")}
                className="hover:bg-gray-100"
                style={{ color: '#2f3a45' }}
              >
                ← Back to Role Selection
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#00a7b2' }}>
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold" style={{ color: '#0a1b3d' }}>Investor Dashboard</h1>
                  <p style={{ color: '#2f3a45' }}>Discover investment opportunities and analyze market potential</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Investment Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg" style={{ backgroundColor: '#00a7b220' }}>
                  <TrendingUp className="w-6 h-6" style={{ color: '#00a7b2' }} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium" style={{ color: '#2f3a45' }}>High ROI Projects</p>
                  <p className="text-2xl font-bold" style={{ color: '#0a1b3d' }}>247</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg" style={{ backgroundColor: '#0a1b3d20' }}>
                  <Search className="w-6 h-6" style={{ color: '#0a1b3d' }} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium" style={{ color: '#2f3a45' }}>Available Opportunities</p>
                  <p className="text-2xl font-bold" style={{ color: '#0a1b3d' }}>89</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg" style={{ backgroundColor: '#2f3a4520' }}>
                  <Filter className="w-6 h-6" style={{ color: '#2f3a45' }} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium" style={{ color: '#2f3a45' }}>Total Market Value</p>
                  <p className="text-2xl font-bold" style={{ color: '#0a1b3d' }}>$12.4B</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg" style={{ backgroundColor: '#00a7b220' }}>
                  <TrendingUp className="w-6 h-6" style={{ color: '#00a7b2' }} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium" style={{ color: '#2f3a45' }}>Avg. Expected ROI</p>
                  <p className="text-2xl font-bold" style={{ color: '#0a1b3d' }}>14.2%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investment Opportunity Filters */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold" style={{ color: '#0a1b3d' }}>
                Investment Opportunity Filters
              </CardTitle>
              {activeFiltersCount > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearFilters}
                  style={{ color: '#2f3a45' }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear All ({activeFiltersCount})
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Sector Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: '#0a1b3d' }}>Sector</label>
                <Select value={selectedSector} onValueChange={setSelectedSector}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sectors</SelectItem>
                    <SelectItem value="Real Estate">Real Estate</SelectItem>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Oil & Gas">Oil & Gas</SelectItem>
                    <SelectItem value="Industry">Industry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Project Type Filter - Dynamic based on sector */}
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: '#0a1b3d' }}>Project Type</label>
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

              {/* Country Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: '#0a1b3d' }}>Country</label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {filterOptions?.countries?.map((country) => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: '#0a1b3d' }}>Project Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Seeking Investment">Seeking Investment</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="Pre-Construction">Pre-Construction</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Second Row of Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
              {/* City Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: '#0a1b3d' }}>City</label>
                <Select 
                  value={selectedCity} 
                  onValueChange={setSelectedCity}
                  disabled={!selectedCountry || selectedCountry === "all"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      !selectedCountry || selectedCountry === "all" 
                        ? "Select country first" 
                        : "Select city"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {(selectedCountry && selectedCountry !== "all" && filterOptions?.countryToCities?.[selectedCountry] 
                      ? filterOptions.countryToCities[selectedCountry]
                      : filterOptions?.cities || []
                    ).filter(city => city && city.trim() !== "").map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* District Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: '#0a1b3d' }}>District</label>
                <Select 
                  value={selectedDistrict} 
                  onValueChange={setSelectedDistrict}
                  disabled={!selectedCity || selectedCity === "all"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      !selectedCity || selectedCity === "all" 
                        ? "Select city first" 
                        : "Select district"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Districts</SelectItem>
                    {(selectedCity && selectedCity !== "all" && filterOptions?.cityToDistricts?.[selectedCity] 
                      ? filterOptions.cityToDistricts[selectedCity]
                      : filterOptions?.districts || []
                    ).filter(district => district && district.trim() !== "").map((district) => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Company Name Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: '#0a1b3d' }}>Developer/Company</label>
                <Input
                  type="text"
                  placeholder="Search developer..."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">Search by developer name</p>
              </div>

              {/* Investment Range Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: '#0a1b3d' }}>Investment Range</label>
                <Select value={investmentRange} onValueChange={setInvestmentRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ranges</SelectItem>
                    <SelectItem value="small">Small Projects (Under $100M)</SelectItem>
                    <SelectItem value="medium">Medium Projects ($100M - $1B)</SelectItem>
                    <SelectItem value="mega">Mega Projects ($1B+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Find Investments Button */}
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: '#0a1b3d' }}>&nbsp;</label>
                <Button 
                  onClick={handleFindInvestments}
                  className="w-full h-10 text-white hover:opacity-90"
                  style={{ backgroundColor: '#00a7b2' }}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Find Investments
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information Section */}
        <Card>
          <CardContent className="p-8 text-center">
            <TrendingUp className="w-16 h-16 mx-auto mb-4" style={{ color: '#00a7b2' }} />
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#0a1b3d' }}>Ready to Discover Investment Opportunities?</h3>
            <p className="mb-6" style={{ color: '#2f3a45' }}>
              Use the filters above to search for investment opportunities and analyze market potential. 
              You can filter by sector, project type, location, developer, and investment range.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm" style={{ color: '#2f3a45' }}>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00a7b2' }}></div>
                <span>ROI analysis and market comparisons</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00a7b2' }}></div>
                <span>Location-based investment insights</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00a7b2' }}></div>
                <span>Investment range filtering and analysis</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}