import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, X, Download, FileSpreadsheet, Truck, Package, Calendar, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface FilterOptions {
  countries: string[];
  cities: string[];
  districts: string[];
  countryToCities: Record<string, string[]>;
  cityToDistricts: Record<string, string[]>;
}

export default function SupplierDashboard() {
  const [, setLocation] = useLocation();
  
  // Location filters
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  
  // Sector filters (multi-select)
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  
  // Product category (dynamic based on sector)
  const [selectedProductCategories, setSelectedProductCategories] = useState<string[]>([]);
  
  // Project stage
  const [selectedProjectStage, setSelectedProjectStage] = useState("");
  
  // Budget range
  const [budgetRange, setBudgetRange] = useState([0, 50000000]);
  
  // Material demand forecast
  const [materialDemandForecast, setMaterialDemandForecast] = useState(false);
  
  // Delivery lead time
  const [deliveryLeadTime, setDeliveryLeadTime] = useState("");
  
  // Bid deadline
  const [bidDeadline, setBidDeadline] = useState("");
  
  // Competitor presence
  const [competitorPresence, setCompetitorPresence] = useState("");

  const { data: filterOptions } = useQuery<FilterOptions>({
    queryKey: ["/api/filter-options"],
    queryFn: async () => {
      const response = await fetch("/api/filter-options");
      if (!response.ok) throw new Error("Failed to fetch filter options");
      return response.json();
    },
  });

  const sectors = [
    "Construction",
    "Energy", 
    "Oil & Gas",
    "Industry",
    "Infrastructure"
  ];

  const productCategories: Record<string, string[]> = {
    "Construction": [
      "Cement & Concrete",
      "Steel & Rebar", 
      "Scaffolding & Formwork",
      "Insulation Materials",
      "Roofing Materials",
      "Plumbing Supplies",
      "Electrical Components",
      "Heavy Machinery"
    ],
    "Energy": [
      "Solar Panels",
      "Wind Turbines", 
      "Power Cables",
      "Transformers",
      "Battery Storage",
      "Inverters",
      "Grid Infrastructure",
      "Monitoring Systems"
    ],
    "Oil & Gas": [
      "Drilling Equipment",
      "Pipeline Materials",
      "Pumps & Compressors", 
      "Safety Equipment",
      "Refinery Components",
      "Storage Tanks",
      "Valves & Controls",
      "Processing Equipment"
    ],
    "Industry": [
      "Manufacturing Equipment",
      "Automation Systems",
      "Quality Control Tools",
      "Material Handling",
      "Safety Systems",
      "HVAC Equipment",
      "IT Infrastructure",
      "Packaging Materials"
    ],
    "Infrastructure": [
      "Road Construction Materials",
      "Bridge Components",
      "Traffic Systems",
      "Water Treatment Equipment",
      "Telecommunications Equipment",
      "Public Transport Systems",
      "Lighting Systems",
      "Security Equipment"
    ]
  };

  const projectStages = [
    "Design",
    "Pre-Tender",
    "Tender", 
    "Execution",
    "Completion"
  ];

  const leadTimeOptions = [
    "Short-term (0-3 months)",
    "Medium-term (3-12 months)",
    "Long-term (12+ months)"
  ];

  const competitorLevels = [
    "High",
    "Medium", 
    "Low"
  ];

  const handleSectorToggle = (sector: string) => {
    setSelectedSectors(prev => {
      const newSectors = prev.includes(sector) 
        ? prev.filter(s => s !== sector)
        : [...prev, sector];
      
      // Clear product categories when sectors change
      setSelectedProductCategories([]);
      return newSectors;
    });
  };

  const handleProductCategoryToggle = (category: string) => {
    setSelectedProductCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
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
    setSelectedProductCategories([]);
    setSelectedProjectStage("");
    setBudgetRange([0, 50000000]);
    setMaterialDemandForecast(false);
    setDeliveryLeadTime("");
    setBidDeadline("");
    setCompetitorPresence("");
  };

  const handleFindOpportunities = () => {
    // Store filter settings for supply opportunities
    const supplyFilters = {
      location: { country: selectedCountry, city: selectedCity, district: selectedDistrict },
      sectors: selectedSectors,
      productCategories: selectedProductCategories,
      projectStage: selectedProjectStage,
      budgetRange: budgetRange,
      materialDemandForecast: materialDemandForecast,
      deliveryLeadTime: deliveryLeadTime,
      bidDeadline: bidDeadline,
      competitorPresence: competitorPresence
    };
    localStorage.setItem("supplierOpportunityFilters", JSON.stringify(supplyFilters));
    setLocation("/supplier-opportunities");
  };

  const activeFiltersCount = [
    selectedCountry,
    selectedCity, 
    selectedDistrict,
    ...selectedSectors,
    ...selectedProductCategories,
    selectedProjectStage,
    budgetRange[0] > 0 || budgetRange[1] < 50000000 ? "budget" : "",
    materialDemandForecast ? "forecast" : "",
    deliveryLeadTime,
    bidDeadline,
    competitorPresence
  ].filter(Boolean).length;

  // Get available product categories based on selected sectors
  const availableProductCategories = selectedSectors.length > 0 
    ? selectedSectors.flatMap(sector => productCategories[sector] || [])
    : [];

  return (
    <div className="bg-gray-50">
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
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Supplier Dashboard</h1>
                  <p className="text-gray-600">Find supply opportunities and procurement demands</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Result
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Supply Intelligence Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Tenders</p>
                  <p className="text-2xl font-bold text-gray-900">1,847</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Supply Opportunities</p>
                  <p className="text-2xl font-bold text-gray-900">623</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Upcoming Deadlines</p>
                  <p className="text-2xl font-bold text-gray-900">89</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Truck className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Procurement Value</p>
                  <p className="text-2xl font-bold text-gray-900">$3.2B</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Supply Opportunity Filters */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-orange-600" />
                <span>Supply Opportunity Filters</span>
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
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Target Market</h4>
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

            {/* Sector Selection (Multi-select) */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Supply Sectors</h4>
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

            {/* Product Categories (Dynamic based on selected sectors) */}
            {availableProductCategories.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Product Categories</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {availableProductCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedProductCategories.includes(category)}
                        onCheckedChange={() => handleProductCategoryToggle(category)}
                      />
                      <label htmlFor={category} className="text-sm text-gray-700 cursor-pointer">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Project Stage & Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Project Stage</h4>
                <Select value={selectedProjectStage} onValueChange={setSelectedProjectStage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    {projectStages.map((stage) => (
                      <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Delivery Lead Time</h4>
                <Select value={deliveryLeadTime} onValueChange={setDeliveryLeadTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select lead time requirement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Lead Times</SelectItem>
                    {leadTimeOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Budget Range */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Project Budget Range</h4>
              <div className="space-y-4">
                <div className="px-3">
                  <Slider
                    value={budgetRange}
                    onValueChange={setBudgetRange}
                    max={50000000}
                    min={0}
                    step={100000}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>${(budgetRange[0] / 1000000).toFixed(1)}M</span>
                  <span>${(budgetRange[1] / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            </div>

            {/* Additional Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Material Demand Forecast</h4>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="demand-forecast"
                    checked={materialDemandForecast}
                    onCheckedChange={(checked) => setMaterialDemandForecast(checked === true)}
                  />
                  <label htmlFor="demand-forecast" className="text-sm text-gray-700 cursor-pointer">
                    Show only projects with expected procurement needs
                  </label>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Bid Deadline</h4>
                <Input
                  type="date"
                  value={bidDeadline}
                  onChange={(e) => setBidDeadline(e.target.value)}
                  placeholder="Select deadline"
                />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Competitor Presence</h4>
                <Select value={competitorPresence} onValueChange={setCompetitorPresence}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select competition level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {competitorLevels.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Find Opportunities Button */}
            <div className="pt-4">
              <Button 
                onClick={handleFindOpportunities}
                className="w-full md:w-auto px-8 h-11 bg-blue-600 hover:bg-blue-700"
              >
                <Search className="w-4 h-4 mr-2" />
                Find Supply Opportunities
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Information Section */}
        <Card>
          <CardContent className="p-8 text-center">
            <Truck className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Discover Supply Opportunities?</h3>
            <p className="text-gray-600 mb-6">
              Configure your supply criteria above to identify procurement opportunities across multiple sectors. 
              Filter by location, product categories, project stages, budget ranges, and delivery requirements.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Multi-sector supply tracking</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Dynamic product categorization</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Lead time optimization</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Competitive intelligence</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}