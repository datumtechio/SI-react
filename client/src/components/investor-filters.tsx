import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Filter, 
  X, 
  MapPin, 
  Building2, 
  BarChart3, 
  Zap, 
  Factory, 
  Fuel,
  TrendingUp,
  AlertTriangle,
  Target
} from "lucide-react";
import { InvestorFilters } from "@shared/schema";

// Sector configuration
const SECTORS_CONFIG = {
  "Real Estate": {
    icon: Building2,
    color: "#0a1b3d",
    subSectors: ["Residential", "Commercial", "Hospitality", "Retail", "Mixed-use", "Regional Mall"]
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

const STATUSES = ["Planning", "Under Construction", "Nearing Completion", "Completed / Operational"];

interface InvestorFiltersProps {
  filters: InvestorFilters;
  onFiltersChange: (filters: InvestorFilters) => void;
  onGetInsights: () => void;
}

export function InvestorFiltersComponent({ filters, onFiltersChange, onGetInsights }: InvestorFiltersProps) {
  const [selectedCountry, setSelectedCountry] = useState(filters.country || "Saudi Arabia");
  const [selectedCity, setSelectedCity] = useState(filters.city || "");
  const [selectedDistrict, setSelectedDistrict] = useState(filters.district || "");
  const [selectedSector, setSelectedSector] = useState(filters.sector || "");
  const [selectedSubSector, setSelectedSubSector] = useState(filters.subSector || "");
  const [selectedStatus, setSelectedStatus] = useState(filters.status || "");

  // Query for cities based on selected country
  const { data: cities = [] } = useQuery<string[]>({
    queryKey: ["/api/cities", selectedCountry],
    enabled: !!selectedCountry,
  });

  // Query for districts based on selected country and city
  const { data: districts = [] } = useQuery<string[]>({
    queryKey: ["/api/districts", selectedCountry, selectedCity],
    enabled: !!selectedCountry && !!selectedCity,
  });

  // Update filters when selections change
  useEffect(() => {
    const newFilters: InvestorFilters = {
      country: selectedCountry || undefined,
      city: selectedCity || undefined,
      district: selectedDistrict || undefined,
      sector: selectedSector || undefined,
      subSector: selectedSubSector || undefined,
      status: selectedStatus as any || undefined,
    };
    onFiltersChange(newFilters);
  }, [selectedCountry, selectedCity, selectedDistrict, selectedSector, selectedSubSector, selectedStatus, onFiltersChange]);

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    setSelectedCity("");
    setSelectedDistrict("");
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    setSelectedDistrict("");
  };

  const handleSectorChange = (value: string) => {
    setSelectedSector(value);
    setSelectedSubSector("");
  };

  const clearAllFilters = () => {
    setSelectedCountry("Saudi Arabia");
    setSelectedCity("");
    setSelectedDistrict("");
    setSelectedSector("");
    setSelectedSubSector("");
    setSelectedStatus("");
  };

  const getActiveFilterCount = () => {
    return [selectedCity, selectedDistrict, selectedSector, selectedSubSector, selectedStatus]
      .filter(filter => filter && filter !== "").length;
  };

  const selectedSectorConfig = selectedSector ? SECTORS_CONFIG[selectedSector as keyof typeof SECTORS_CONFIG] : null;

  return (
    <Card className="investor-filters">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Filter className="mr-2" size={18} />
            Investment Criteria
          </span>
          <div className="flex items-center space-x-2">
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {getActiveFilterCount()} filters
              </Badge>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onGetInsights}
              className="bg-primary text-white hover:bg-primary/90"
            >
              <TrendingUp className="mr-1" size={14} />
              Get Insights
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Location Selection */}
        <div>
          <div className="flex items-center mb-3">
            <MapPin className="mr-2 text-primary" size={16} />
            <span className="text-sm font-medium text-slate-700">Location Targeting</span>
          </div>
          
          <div className="space-y-3">
            {/* Country (Fixed to Saudi Arabia) */}
            <div>
              <span className="text-xs text-slate-500 block mb-1">Country</span>
              <Select value={selectedCountry} onValueChange={handleCountryChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Saudi Arabia">🇸🇦 Saudi Arabia</SelectItem>
                  <SelectItem value="United Arab Emirates">🇦🇪 United Arab Emirates</SelectItem>
                  <SelectItem value="Qatar">🇶🇦 Qatar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* City */}
            <div>
              <span className="text-xs text-slate-500 block mb-1">City</span>
              <Select value={selectedCity} onValueChange={handleCityChange}>
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

            {/* District */}
            {selectedCity && (
              <div>
                <span className="text-xs text-slate-500 block mb-1">District</span>
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
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
          <div className="flex items-center mb-3">
            <Target className="mr-2 text-primary" size={16} />
            <span className="text-sm font-medium text-slate-700">Sector Focus</span>
          </div>
          
          <div className="space-y-3">
            {/* Main Sector */}
            <div>
              <span className="text-xs text-slate-500 block mb-1">Primary Sector</span>
              <Select value={selectedSector} onValueChange={handleSectorChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sector" />
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
            </div>

            {/* Sub-Sector */}
            {selectedSectorConfig && (
              <div>
                <span className="text-xs text-slate-500 block mb-1">Sub-Sector</span>
                <Select value={selectedSubSector} onValueChange={setSelectedSubSector}>
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
          <div className="flex items-center mb-3">
            <AlertTriangle className="mr-2 text-primary" size={16} />
            <span className="text-sm font-medium text-slate-700">Project Phase</span>
          </div>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select project status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              {STATUSES.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters Display */}
        {getActiveFilterCount() > 0 && (
          <>
            <Separator />
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500">Active Filters</span>
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedCity && (
                  <Badge variant="outline" className="text-xs">
                    📍 {selectedCity}
                    <X size={10} className="ml-1 cursor-pointer" onClick={() => setSelectedCity("")} />
                  </Badge>
                )}
                {selectedDistrict && (
                  <Badge variant="outline" className="text-xs">
                    🏘️ {selectedDistrict}
                    <X size={10} className="ml-1 cursor-pointer" onClick={() => setSelectedDistrict("")} />
                  </Badge>
                )}
                {selectedSector && (
                  <Badge variant="outline" className="text-xs">
                    🏢 {selectedSector}
                    <X size={10} className="ml-1 cursor-pointer" onClick={() => setSelectedSector("")} />
                  </Badge>
                )}
                {selectedSubSector && (
                  <Badge variant="outline" className="text-xs">
                    🎯 {selectedSubSector}
                    <X size={10} className="ml-1 cursor-pointer" onClick={() => setSelectedSubSector("")} />
                  </Badge>
                )}
                {selectedStatus && (
                  <Badge variant="outline" className="text-xs">
                    ⏱️ {selectedStatus}
                    <X size={10} className="ml-1 cursor-pointer" onClick={() => setSelectedStatus("")} />
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}