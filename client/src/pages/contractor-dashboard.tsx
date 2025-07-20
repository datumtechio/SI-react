import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Download, FileSpreadsheet, Filter, X, HardHat } from "lucide-react";
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
  const [, setLocation] = useLocation();
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [selectedProjectType, setSelectedProjectType] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [contractValueRange, setContractValueRange] = useState<string>("");

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

  const handleFindProjects = () => {
    // Get contract value range
    let minValue, maxValue;
    switch (contractValueRange) {
      case "small":
        minValue = 0;
        maxValue = 50; // $50M
        break;
      case "medium":
        minValue = 50;
        maxValue = 500; // $50M - $500M
        break;
      case "mega":
        minValue = 500;
        maxValue = undefined; // $500M+
        break;
      default:
        minValue = undefined;
        maxValue = undefined;
    }

    const contractorFilters = {
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
    localStorage.setItem("contractorFilters", JSON.stringify(contractorFilters));
    
    // Navigate to results page
    setLocation("/contractor-projects");
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
    setContractValueRange("");
  };

  const activeFiltersCount = [
    selectedSector, 
    selectedProjectType, 
    selectedCountry, 
    selectedCity, 
    selectedDistrict, 
    selectedStatus, 
    companyName, 
    contractValueRange
  ].filter(Boolean).length;

  // Remove this section since we're moving to results page

  // Remove this section since we're moving to results page

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

              {/* Country Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Country</label>
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
            </div>

            {/* Second Row of Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
              {/* City Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">City</label>
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
                    {filterOptions?.cities?.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* District Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">District</label>
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
                    {filterOptions?.districts?.map((district) => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Company Name Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Company Name</label>
                <Input
                  type="text"
                  placeholder="Search company..."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">View competitor or own activity</p>
              </div>

              {/* Contract Value Range Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Contract Value Range</label>
                <Select value={contractValueRange} onValueChange={setContractValueRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ranges</SelectItem>
                    <SelectItem value="small">Small Projects (Under $50M)</SelectItem>
                    <SelectItem value="medium">Medium Projects ($50M - $500M)</SelectItem>
                    <SelectItem value="mega">Mega Projects ($500M+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Find Projects Button */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">&nbsp;</label>
                <Button 
                  onClick={handleFindProjects}
                  className="w-full h-10 bg-orange-600 hover:bg-orange-700"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Find Projects
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information Section */}
        <Card>
          <CardContent className="p-8 text-center">
            <HardHat className="w-16 h-16 text-orange-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Find Projects?</h3>
            <p className="text-gray-600 mb-6">
              Use the filters above to search for construction projects and bidding opportunities. 
              You can filter by sector, project type, location, company, and contract value range.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span>Dynamic project types based on sector</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span>Location filtering with city and district</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span>Contract value range filtering</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}