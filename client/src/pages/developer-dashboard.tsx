import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, X, Download, FileSpreadsheet, Building2, MapPin, Zap, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface FilterOptions {
  countries: string[];
  cities: string[];
  districts: string[];
  countryToCities: Record<string, string[]>;
  cityToDistricts: Record<string, string[]>;
}

export default function DeveloperDashboard() {
  const [, setLocation] = useLocation();
  
  // Location filters
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  
  // Sector and sub-sector filters
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedSubSectors, setSelectedSubSectors] = useState<string[]>([]);
  
  // Development stage focus
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  
  // Land use zoning (optional)
  const [selectedZoning, setSelectedZoning] = useState<string[]>([]);
  
  // Price range filters
  const [landCostMin, setLandCostMin] = useState("");
  const [landCostMax, setLandCostMax] = useState("");
  const [devCostMin, setDevCostMin] = useState("");
  const [devCostMax, setDevCostMax] = useState("");

  const { data: filterOptions } = useQuery<FilterOptions>({
    queryKey: ["/api/filter-options"],
    queryFn: async () => {
      const response = await fetch("/api/filter-options");
      if (!response.ok) throw new Error("Failed to fetch filter options");
      return response.json();
    },
  });

  const sectors = [
    { 
      name: "Residential", 
      subSectors: ["Luxury Villas", "Mid-Range Apartments", "Affordable Housing", "Mixed Residential", "Gated Communities"] 
    },
    { 
      name: "Retail", 
      subSectors: ["Shopping Malls", "Strip Centers", "Standalone Stores", "Mixed-Use Retail", "Outlet Centers"] 
    },
    { 
      name: "Hospitality", 
      subSectors: ["Luxury Hotels", "Business Hotels", "Resort Properties", "Serviced Apartments", "Entertainment Venues"] 
    },
    { 
      name: "Industrial", 
      subSectors: ["Manufacturing Facilities", "Warehouses", "Logistics Centers", "Tech Parks", "Industrial Complexes"] 
    },
    { 
      name: "Healthcare", 
      subSectors: ["Hospitals", "Medical Centers", "Specialized Clinics", "Wellness Centers", "Senior Living"] 
    },
    { 
      name: "Infrastructure", 
      subSectors: ["Transportation", "Utilities", "Public Facilities", "Smart City Projects", "Telecommunications"] 
    },
    { 
      name: "Energy", 
      subSectors: ["Solar Projects", "Wind Farms", "Power Plants", "Energy Storage", "Green Buildings"] 
    },
    { 
      name: "Oil & Gas", 
      subSectors: ["Refineries", "Storage Facilities", "Distribution Centers", "Processing Plants", "Support Infrastructure"] 
    }
  ];

  const developmentStages = [
    "Land Available",
    "Planning Phase", 
    "Under Construction",
    "Recently Completed"
  ];

  const zoningTypes = [
    "Residential Use",
    "Commercial Use",
    "Mixed-Use",
    "Industrial Use",
    "Institutional Use",
    "Special Economic Zone"
  ];

  const handleSectorChange = (sector: string) => {
    setSelectedSector(sector);
    setSelectedSubSectors([]);
  };

  const handleSubSectorToggle = (subSector: string) => {
    setSelectedSubSectors(prev => 
      prev.includes(subSector) 
        ? prev.filter(s => s !== subSector)
        : [...prev, subSector]
    );
  };

  const handleStageToggle = (stage: string) => {
    setSelectedStages(prev => 
      prev.includes(stage)
        ? prev.filter(s => s !== stage)
        : [...prev, stage]
    );
  };

  const handleZoningToggle = (zoning: string) => {
    setSelectedZoning(prev => 
      prev.includes(zoning)
        ? prev.filter(z => z !== zoning)
        : [...prev, zoning]
    );
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedCity("");
    setSelectedDistrict("");
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSelectedDistrict("");
  };

  const handleClearFilters = () => {
    setSelectedCountry("");
    setSelectedCity("");
    setSelectedDistrict("");
    setSelectedSector("");
    setSelectedSubSectors([]);
    setSelectedStages([]);
    setSelectedZoning([]);
    setLandCostMin("");
    setLandCostMax("");
    setDevCostMin("");
    setDevCostMax("");
  };

  const handleFindOpportunities = () => {
    // Store filter settings for analysis
    const opportunityFilters = {
      location: { country: selectedCountry, city: selectedCity, district: selectedDistrict },
      sector: selectedSector,
      subSectors: selectedSubSectors,
      stages: selectedStages,
      zoning: selectedZoning,
      priceRange: {
        landCost: { min: landCostMin, max: landCostMax },
        devCost: { min: devCostMin, max: devCostMax }
      }
    };
    localStorage.setItem("developerOpportunityFilters", JSON.stringify(opportunityFilters));
    setLocation("/developer-opportunities");
  };

  const activeFiltersCount = [
    selectedCountry,
    selectedCity, 
    selectedDistrict,
    selectedSector,
    ...selectedSubSectors,
    ...selectedStages,
    ...selectedZoning,
    landCostMin,
    landCostMax,
    devCostMin,
    devCostMax
  ].filter(Boolean).length;

  const selectedSectorData = sectors.find(s => s.name === selectedSector);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => setLocation("/role-selection")}
                className="text-gray-600"
              >
                ← Back to Role Selection
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Developer Dashboard</h1>
                  <p className="text-gray-600">Identify development opportunities and land availability</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Opportunities
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
        {/* Development Intelligence Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available Land Plots</p>
                  <p className="text-2xl font-bold text-gray-900">1,248</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Building2 className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Development Projects</p>
                  <p className="text-2xl font-bold text-gray-900">456</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Prime Opportunities</p>
                  <p className="text-2xl font-bold text-gray-900">89</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Fast-Track Projects</p>
                  <p className="text-2xl font-bold text-gray-900">23</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Development Opportunity Filters */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-purple-600" />
                <span>Development Opportunity Filters</span>
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
          <CardContent className="space-y-6">
            {/* Location Filters */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Target Location</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Country</label>
                  <Select value={selectedCountry} onValueChange={handleCountryChange}>
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

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">City</label>
                  <Select 
                    value={selectedCity} 
                    onValueChange={handleCityChange}
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
                      {(selectedCity && selectedCity !== "all" && filterOptions?.cityToDistricts?.[selectedCity] 
                        ? filterOptions.cityToDistricts[selectedCity]
                        : filterOptions?.districts || []
                      ).filter(district => district && district.trim() !== "").map((district) => (
                        <SelectItem key={district} value={district}>{district}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Sector & Sub-sector */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Development Sector</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Primary Sector</label>
                  <Select value={selectedSector} onValueChange={handleSectorChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select development sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map((sector) => (
                        <SelectItem key={sector.name} value={sector.name}>{sector.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedSectorData && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Sub-sectors (Optional)</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {selectedSectorData.subSectors.map((subSector) => (
                        <div key={subSector} className="flex items-center space-x-2">
                          <Checkbox
                            id={subSector}
                            checked={selectedSubSectors.includes(subSector)}
                            onCheckedChange={() => handleSubSectorToggle(subSector)}
                          />
                          <label htmlFor={subSector} className="text-sm text-gray-700 cursor-pointer">
                            {subSector}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Development Stage Focus */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Development Stage Focus</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {developmentStages.map((stage) => (
                  <div key={stage} className="flex items-center space-x-2">
                    <Checkbox
                      id={stage}
                      checked={selectedStages.includes(stage)}
                      onCheckedChange={() => handleStageToggle(stage)}
                    />
                    <label htmlFor={stage} className="text-sm text-gray-700 cursor-pointer">
                      {stage}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Land Use Zoning (Optional) */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Land Use Zoning <span className="text-gray-500 font-normal">(Optional)</span></h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {zoningTypes.map((zoning) => (
                  <div key={zoning} className="flex items-center space-x-2">
                    <Checkbox
                      id={zoning}
                      checked={selectedZoning.includes(zoning)}
                      onCheckedChange={() => handleZoningToggle(zoning)}
                    />
                    <label htmlFor={zoning} className="text-sm text-gray-700 cursor-pointer">
                      {zoning}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range Filters */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Budget Range (USD per sqm)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Land Cost Range</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Input
                        type="number"
                        placeholder="Min cost"
                        value={landCostMin}
                        onChange={(e) => setLandCostMin(e.target.value)}
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        placeholder="Max cost"
                        value={landCostMax}
                        onChange={(e) => setLandCostMax(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Development Cost Range</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Input
                        type="number"
                        placeholder="Min cost"
                        value={devCostMin}
                        onChange={(e) => setDevCostMin(e.target.value)}
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        placeholder="Max cost"
                        value={devCostMax}
                        onChange={(e) => setDevCostMax(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Find Opportunities Button */}
            <div className="pt-4">
              <Button 
                onClick={handleFindOpportunities}
                className="w-full md:w-auto px-8 h-11 bg-purple-600 hover:bg-purple-700"
              >
                <Search className="w-4 h-4 mr-2" />
                Find Development Opportunities
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Information Section */}
        <Card>
          <CardContent className="p-8 text-center">
            <Building2 className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Discover Opportunities?</h3>
            <p className="text-gray-600 mb-6">
              Configure your development criteria above to identify prime development opportunities. 
              Filter by location, sector preferences, development stages, zoning, and budget constraints.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span>Land availability tracking</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span>Zoning compliance analysis</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span>Budget-based filtering</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span>Development stage tracking</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}