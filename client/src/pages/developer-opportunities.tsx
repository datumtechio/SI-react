import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Presentation,
  TrendingUp, 
  BarChart3, 
  MapPin,
  Building2,
  Target,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Construction,
  DollarSign,
  Users,
  Clock,
  Zap
} from "lucide-react";

export default function DeveloperOpportunities() {
  const [, setLocation] = useLocation();
  const [selectedTimeframe, setSelectedTimeframe] = useState("12months");
  const [selectedDistrict, setSelectedDistrict] = useState("all");

  // Handle location click to navigate to relevant project
  const handleLocationClick = (locationName: string) => {
    // Map locations to relevant project IDs for developers
    const locationProjectMap: { [key: string]: number } = {
      "Dubai Marina": 1, // Dubai Marina Tower
      "Business Bay": 3, // Business Bay project
      "Dubai South": 4, // Al Maktoum Logistics Hub
      "Downtown Dubai": 2, // Azure Residences
      "Al Barsha": 2, // Azure Residences (closest match)
      "Mohammed Bin Rashid City": 4, // Al Maktoum Logistics Hub (closest match)
      "Jumeirah Village Circle": 1, // Dubai Marina Tower (closest match)
      "Dubai Hills Estate": 4 // Al Maktoum Logistics Hub (closest match)
    };

    const projectId = locationProjectMap[locationName] || 3;
    setLocation(`/project/${projectId}`);
  };

  // Mock data for development opportunities
  const opportunityStats = {
    totalLandPlots: "247",
    avgLandPrice: "$1,250/sqm",
    primePlotsAvailable: "89",
    avgDevCost: "$850/sqm"
  };

  const opportunityHeatmap = [
    { area: "Dubai Marina", landAvailable: 12, demandGap: "High", growthZone: "Mature", status: "Saturated" },
    { area: "Business Bay", landAvailable: 23, demandGap: "Medium", growthZone: "Growing", status: "Moderate" },
    { area: "Dubai South", landAvailable: 45, demandGap: "High", growthZone: "Emerging", status: "High Potential" },
    { area: "Al Barsha", landAvailable: 18, demandGap: "Low", growthZone: "Stable", status: "Limited" },
    { area: "Mohammed Bin Rashid City", landAvailable: 67, demandGap: "Very High", growthZone: "Emerging", status: "Prime" },
    { area: "Jumeirah Village Circle", landAvailable: 34, demandGap: "Medium", growthZone: "Growing", status: "Good" },
    { area: "Downtown Dubai", landAvailable: 8, demandGap: "Low", growthZone: "Mature", status: "Premium" },
    { area: "Dubai Hills Estate", landAvailable: 29, demandGap: "High", growthZone: "Growing", status: "High Potential" }
  ];

  const competitivePipeline = [
    { 
      project: "Emaar Beachfront Phase 3", 
      developer: "Emaar Properties", 
      stage: "Planning Phase", 
      size: "45 towers", 
      completion: "2027",
      type: "Luxury Residential",
      district: "Dubai Marina"
    },
    { 
      project: "Business Bay Central", 
      developer: "Damac Properties", 
      stage: "Under Construction", 
      size: "12 towers", 
      completion: "2026",
      type: "Mixed-Use",
      district: "Business Bay"
    },
    { 
      project: "Dubai South Logistics Hub", 
      developer: "Dubai World", 
      stage: "Land Available", 
      size: "2.5M sqm", 
      completion: "2028",
      type: "Industrial",
      district: "Dubai South"
    },
    { 
      project: "MBR City Residences", 
      developer: "Sobha Group", 
      stage: "Planning Phase", 
      size: "8 buildings", 
      completion: "2026",
      type: "Mid-Range Residential",
      district: "Mohammed Bin Rashid City"
    },
    { 
      project: "Al Barsha Medical Center", 
      developer: "Private Developer", 
      stage: "Under Construction", 
      size: "150,000 sqm", 
      completion: "2025",
      type: "Healthcare",
      district: "Al Barsha"
    }
  ];

  const marketGaps = [
    {
      district: "Dubai Marina",
      gap: "No nearby luxury retail",
      details: "High-income residential area with 45,000+ residents but nearest premium shopping is 8km away",
      opportunity: "Luxury Shopping Center",
      potential: "$180M",
      urgency: "High",
      competition: "Low"
    },
    {
      district: "Business Bay",
      gap: "Office workers with limited residential supply",
      details: "250+ office buildings with 150,000 workers but only 12% live within 5km radius",
      opportunity: "Mid-Range Residential Complex",
      potential: "$320M",
      urgency: "Very High",
      competition: "Medium"
    },
    {
      district: "Dubai South",
      gap: "Airport proximity logistics demand",
      details: "Major airport expansion creating cargo demand but insufficient warehouse facilities",
      opportunity: "Logistics & Warehouse Complex",
      potential: "$450M",
      urgency: "High",
      competition: "Low"
    },
    {
      district: "Mohammed Bin Rashid City",
      gap: "Entertainment & leisure facilities",
      details: "Growing residential community of 35,000+ with no major entertainment venues",
      opportunity: "Entertainment Complex",
      potential: "$220M",
      urgency: "Medium",
      competition: "Low"
    }
  ];

  const feasibilityData = [
    { district: "Dubai Marina", landPrice: "$1,850/sqm", constructionCost: "$950/sqm", avgSelling: "$3,200/sqm", margin: "14%" },
    { district: "Business Bay", landPrice: "$1,450/sqm", constructionCost: "$850/sqm", avgSelling: "$2,800/sqm", margin: "18%" },
    { district: "Dubai South", landPrice: "$680/sqm", constructionCost: "$750/sqm", avgSelling: "$1,950/sqm", margin: "26%" },
    { district: "Al Barsha", landPrice: "$1,200/sqm", constructionCost: "$800/sqm", avgSelling: "$2,400/sqm", margin: "17%" },
    { district: "Mohammed Bin Rashid City", landPrice: "$920/sqm", constructionCost: "$780/sqm", avgSelling: "$2,100/sqm", margin: "24%" },
    { district: "Downtown Dubai", landPrice: "$2,400/sqm", constructionCost: "$1,100/sqm", avgSelling: "$4,500/sqm", margin: "22%" }
  ];

  const underservedAlerts = [
    {
      zone: "Dubailand",
      alert: "No upcoming luxury hotel projects",
      description: "Tourism hub with 45+ attractions but zero luxury hospitality developments in pipeline",
      opportunity: "5-Star Resort Development",
      timeframe: "18-month window",
      risk: "Low"
    },
    {
      zone: "Al Qusais",
      alert: "Industrial zone with no worker accommodation",
      description: "Major industrial area employing 28,000+ workers with nearest housing 12km away",
      opportunity: "Worker Housing Complex",
      timeframe: "24-month window", 
      risk: "Very Low"
    },
    {
      zone: "Dubai Investment Park",
      alert: "No premium healthcare facilities",
      description: "Residential community of 85,000+ with only basic medical services available",
      opportunity: "Specialized Medical Center",
      timeframe: "12-month window",
      risk: "Low"
    }
  ];

  const handleDownload = (format: string) => {
    console.log(`Downloading ${format} development report...`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Prime": case "High Potential": return "bg-green-500";
      case "Good": case "Moderate": return "bg-blue-500";
      case "Premium": return "bg-purple-500";
      case "Limited": return "bg-orange-500";
      case "Saturated": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Very High": return "text-red-600 bg-red-50";
      case "High": return "text-orange-600 bg-orange-50";
      case "Medium": return "text-yellow-600 bg-yellow-50";
      case "Low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Land Available": return "text-green-600";
      case "Planning Phase": return "text-blue-600";
      case "Under Construction": return "text-orange-600";
      case "Recently Completed": return "text-purple-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => setLocation("/developer-dashboard")}
                className="text-gray-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Filters
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Development Opportunities</h1>
                  <p className="text-gray-600">Land availability and market gap analysis</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Result
              </Button>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6months">Next 6 Months</SelectItem>
                  <SelectItem value="12months">Next 12 Months</SelectItem>
                  <SelectItem value="24months">Next 24 Months</SelectItem>
                  <SelectItem value="5years">Next 5 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Opportunity Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available Land Plots</p>
                  <p className="text-2xl font-bold text-gray-900">{opportunityStats.totalLandPlots}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average Land Price</p>
                  <p className="text-2xl font-bold text-gray-900">{opportunityStats.avgLandPrice}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{opportunityStats.primePlotsAvailable}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Construction className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Development Cost</p>
                  <p className="text-2xl font-bold text-gray-900">{opportunityStats.avgDevCost}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>





        {/* Main Analysis Tabs */}
        <Tabs defaultValue="heatmap" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="heatmap">Opportunity Map</TabsTrigger>
            <TabsTrigger value="pipeline">Competitive Pipeline</TabsTrigger>
            <TabsTrigger value="gaps">Market Gaps</TabsTrigger>
            <TabsTrigger value="feasibility">Feasibility</TabsTrigger>
            <TabsTrigger value="benchmarks">Benchmarking</TabsTrigger>
            <TabsTrigger value="alerts">Underserved Zones</TabsTrigger>
          </TabsList>

          {/* Development Opportunity Heatmap */}
          <TabsContent value="heatmap">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <span>Development Opportunity Heatmap</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-sm font-medium text-gray-700">Opportunity Level:</span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span className="text-xs">Prime</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <span className="text-xs">Good</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-purple-500 rounded"></div>
                        <span className="text-xs">Premium</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-orange-500 rounded"></div>
                        <span className="text-xs">Limited</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span className="text-xs">Saturated</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {opportunityHeatmap.map((location) => (
                    <Card key={location.area} className="border-2 hover:bg-gray-50 transition-colors cursor-pointer">
                      <CardContent className="p-4" onClick={() => handleLocationClick(location.area)}>
                        <div className="flex items-center justify-between mb-2">
                          <button 
                            className="font-semibold text-gray-900 hover:text-purple-600 text-left transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLocationClick(location.area);
                            }}
                          >
                            {location.area}
                          </button>
                          <div className={`w-4 h-4 rounded ${getStatusColor(location.status)}`}></div>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-gray-600">Land Available:</span> {location.landAvailable} plots</p>
                          <p><span className="text-gray-600">Demand Gap:</span> {location.demandGap}</p>
                          <p><span className="text-gray-600">Growth Zone:</span> {location.growthZone}</p>
                          <p><span className="text-gray-600">Status:</span> {location.status}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Competitive Pipeline */}
          <TabsContent value="pipeline">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Construction className="w-5 h-5 text-purple-600" />
                  <span>Competitive Pipeline Dashboard</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Project</th>
                        <th className="text-left py-3 px-4">Developer</th>
                        <th className="text-left py-3 px-4">Stage</th>
                        <th className="text-left py-3 px-4">Size</th>
                        <th className="text-left py-3 px-4">Completion</th>
                        <th className="text-left py-3 px-4">Type</th>
                        <th className="text-left py-3 px-4">District</th>
                      </tr>
                    </thead>
                    <tbody>
                      {competitivePipeline.map((project, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{project.project}</td>
                          <td className="py-3 px-4">{project.developer}</td>
                          <td className="py-3 px-4">
                            <span className={`font-medium ${getStageColor(project.stage)}`}>
                              {project.stage}
                            </span>
                          </td>
                          <td className="py-3 px-4">{project.size}</td>
                          <td className="py-3 px-4">{project.completion}</td>
                          <td className="py-3 px-4">{project.type}</td>
                          <td className="py-3 px-4">{project.district}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Pipeline Insights:</h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• Dubai South showing highest development activity with major logistics projects</li>
                    <li>• Business Bay reaching saturation point with 12 major projects in pipeline</li>
                    <li>• Mohammed Bin Rashid City emerging as new residential growth hub</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Market Gaps */}
          <TabsContent value="gaps">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-purple-600" />
                  <span>Market Gaps & Demand Indicators</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {marketGaps.map((gap, index) => (
                    <div key={index} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{gap.gap}</h3>
                            <Badge className={getUrgencyColor(gap.urgency)}>
                              {gap.urgency} Urgency
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <span><MapPin className="w-4 h-4 inline mr-1" />{gap.district}</span>
                            <span><Users className="w-4 h-4 inline mr-1" />Competition: {gap.competition}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">{gap.potential}</p>
                          <p className="text-sm text-gray-500">Market Potential</p>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{gap.details}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-700">Recommended: {gap.opportunity}</span>
                        </div>
                        <Badge variant="outline">
                          {gap.competition} Competition
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feasibility Analysis */}
          <TabsContent value="feasibility">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  <span>Feasibility Snapshot</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">District</th>
                        <th className="text-left py-3 px-4">Land Price</th>
                        <th className="text-left py-3 px-4">Construction Cost</th>
                        <th className="text-left py-3 px-4">Avg Selling Price</th>
                        <th className="text-left py-3 px-4">Est. Margin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feasibilityData.map((district) => (
                        <tr key={district.district} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{district.district}</td>
                          <td className="py-3 px-4">{district.landPrice}</td>
                          <td className="py-3 px-4">{district.constructionCost}</td>
                          <td className="py-3 px-4">{district.avgSelling}</td>
                          <td className="py-3 px-4">
                            <span className="text-green-600 font-medium">{district.margin}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Feasibility Highlights:</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Dubai South offers highest margins (26%) with lower land costs</li>
                    <li>• Mohammed Bin Rashid City shows strong 24% margin potential</li>
                    <li>• Downtown Dubai commands premium pricing despite higher costs</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Project Benchmarking */}
          <TabsContent value="benchmarks">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  <span>Project Benchmarking Tool</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Target className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Compare Your Project</h3>
                  <p className="text-gray-600 mb-6">
                    Benchmark your intended project against existing developments in terms of 
                    size, price positioning, amenities, and delivery timeline.
                  </p>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Launch Benchmarking Tool
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Underserved Zone Alerts */}
          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <span>Underserved Zone Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {underservedAlerts.map((alert, index) => (
                    <div key={index} className="border rounded-lg p-6 bg-yellow-50 border-yellow-200">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            <h3 className="text-lg font-semibold text-gray-900">{alert.alert}</h3>
                            <Badge className="bg-yellow-100 text-yellow-800">
                              {alert.risk} Risk
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <span><MapPin className="w-4 h-4 inline mr-1" />{alert.zone}</span>
                            <span><Clock className="w-4 h-4 inline mr-1" />{alert.timeframe}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{alert.description}</p>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700 font-medium">Greenfield Opportunity: {alert.opportunity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}