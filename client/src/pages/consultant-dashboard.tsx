import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, X, Download, FileSpreadsheet, TrendingUp, BarChart3, PieChart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface FilterOptions {
  countries: string[];
  cities: string[];
  districts: string[];
  countryToCities: Record<string, string[]>;
  cityToDistricts: Record<string, string[]>;
}

export default function ConsultantDashboard() {
  const [, setLocation] = useLocation();
  
  // Location filters
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  
  // Sector filters (multi-select)
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  
  // Time range filters
  const [projectLaunchYear, setProjectLaunchYear] = useState("");
  const [projectCompletionYear, setProjectCompletionYear] = useState("");
  const [includeHistoricalData, setIncludeHistoricalData] = useState(false);
  
  // Market metrics focus (multi-select)
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);

  const { data: filterOptions } = useQuery<FilterOptions>({
    queryKey: ["/api/filter-options"],
    queryFn: async () => {
      const response = await fetch("/api/filter-options");
      if (!response.ok) throw new Error("Failed to fetch filter options");
      return response.json();
    },
  });

  const sectors = [
    "Real Estate",
    "Infrastructure", 
    "Energy",
    "Industry",
    "Oil & Gas"
  ];

  const marketMetrics = [
    "Supply Pipeline Overview",
    "Demand Gap Analysis", 
    "Developer Activity Tracker",
    "Contractor Performance Benchmark",
    "Construction & Operation Cost Benchmarks"
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  const handleSectorToggle = (sector: string) => {
    setSelectedSectors(prev => 
      prev.includes(sector) 
        ? prev.filter(s => s !== sector)
        : [...prev, sector]
    );
  };

  const handleMetricToggle = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
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
    setSelectedSectors([]);
    setProjectLaunchYear("");
    setProjectCompletionYear("");
    setIncludeHistoricalData(false);
    setSelectedMetrics([]);
  };

  const handleGenerateAnalysis = () => {
    // Store filter settings for analysis
    const analysisFilters = {
      location: { country: selectedCountry, city: selectedCity, district: selectedDistrict },
      sectors: selectedSectors,
      timeRange: { launch: projectLaunchYear, completion: projectCompletionYear, historical: includeHistoricalData },
      metrics: selectedMetrics
    };
    localStorage.setItem("consultantAnalysisFilters", JSON.stringify(analysisFilters));
    setLocation("/consultant-analysis");
  };

  const activeFiltersCount = [
    selectedCountry,
    selectedCity, 
    selectedDistrict,
    ...selectedSectors,
    projectLaunchYear,
    projectCompletionYear,
    includeHistoricalData ? "historical" : "",
    ...selectedMetrics
  ].filter(Boolean).length;

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
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Consultant Dashboard</h1>
                  <p className="text-gray-600">Market analysis and feasibility studies</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Analysis
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
        {/* Market Intelligence Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Market Opportunities</p>
                  <p className="text-2xl font-bold text-gray-900">342</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <PieChart className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Market Coverage</p>
                  <p className="text-2xl font-bold text-gray-900">23 Cities</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Market Value</p>
                  <p className="text-2xl font-bold text-gray-900">$8.7B</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Filters */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-blue-600" />
                <span>Market Analysis Filters</span>
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
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Location Analysis</h4>
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

            {/* Sector Selection */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Sector Analysis</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {sectors.map((sector) => (
                  <div key={sector} className="flex items-center space-x-2">
                    <Checkbox
                      id={sector}
                      checked={selectedSectors.includes(sector)}
                      onCheckedChange={() => handleSectorToggle(sector)}
                    />
                    <label htmlFor={sector} className="text-sm text-gray-700 cursor-pointer">
                      {sector}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Range Filters */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Time Range Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Project Launch Year</label>
                  <Select value={projectLaunchYear} onValueChange={setProjectLaunchYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select launch year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      <SelectItem value="past">Past Projects</SelectItem>
                      <SelectItem value="present">Current Year ({currentYear})</SelectItem>
                      <SelectItem value="future">Future Pipeline</SelectItem>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Project Completion Year</label>
                  <Select value={projectCompletionYear} onValueChange={setProjectCompletionYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select completion year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      <SelectItem value="ongoing">Ongoing Projects</SelectItem>
                      <SelectItem value="next-2-years">Next 2 Years</SelectItem>
                      <SelectItem value="next-5-years">Next 5 Years</SelectItem>
                      {years.slice(5).map((year) => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 mt-6">
                  <Checkbox
                    id="historical"
                    checked={includeHistoricalData}
                    onCheckedChange={(checked) => setIncludeHistoricalData(checked === true)}
                  />
                  <label htmlFor="historical" className="text-sm text-gray-700 cursor-pointer">
                    Include historical data for trend analysis
                  </label>
                </div>
              </div>
            </div>

            {/* Market Metrics Focus */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Market Metrics Focus</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {marketMetrics.map((metric) => (
                  <div key={metric} className="flex items-center space-x-2">
                    <Checkbox
                      id={metric}
                      checked={selectedMetrics.includes(metric)}
                      onCheckedChange={() => handleMetricToggle(metric)}
                    />
                    <label htmlFor={metric} className="text-sm text-gray-700 cursor-pointer">
                      {metric}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate Analysis Button */}
            <div className="pt-4">
              <Button 
                onClick={handleGenerateAnalysis}
                className="w-full md:w-auto px-8 h-11 bg-blue-600 hover:bg-blue-700"
              >
                <Search className="w-4 h-4 mr-2" />
                Generate Market Analysis
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Information Section */}
        <Card>
          <CardContent className="p-8 text-center">
            <BarChart3 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready for Market Analysis?</h3>
            <p className="text-gray-600 mb-6">
              Configure your analysis parameters above to generate comprehensive market intelligence reports. 
              Filter by location, sectors, time ranges, and focus metrics to get targeted insights.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Multi-sector analysis capabilities</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Historical trend analysis</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Comprehensive market metrics</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}