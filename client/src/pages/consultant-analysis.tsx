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
  PieChart,
  MapPin,
  Building,
  Target,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Eye
} from "lucide-react";

export default function ConsultantAnalysis() {
  const [, setLocation] = useLocation();
  const [selectedTimeframe, setSelectedTimeframe] = useState("12months");
  const [showProjectDetails, setShowProjectDetails] = useState(false);

  // Mock data for analysis results
  const marketStats = {
    totalProjectValue: "$12.4B",
    projectCount: 342,
    avgProjectSize: "$36.2M",
    marketGrowthRate: "14.2%"
  };

  const sectorData = [
    { sector: "Real Estate", projects: 156, value: "$5.2B", growth: "+18%", trend: "High" },
    { sector: "Infrastructure", projects: 89, value: "$3.8B", growth: "+12%", trend: "Medium" },
    { sector: "Energy", projects: 45, value: "$2.1B", growth: "+22%", trend: "High" },
    { sector: "Industry", projects: 32, value: "$0.9B", growth: "+8%", trend: "Low" },
    { sector: "Oil & Gas", projects: 20, value: "$0.4B", growth: "+5%", trend: "Low" }
  ];

  const topDevelopers = [
    { name: "Emaar Properties", projects: 23, avgDelivery: "18 months", performance: "Excellent", complexity: "High" },
    { name: "Dubai Properties", projects: 18, avgDelivery: "16 months", performance: "Good", complexity: "Medium" },
    { name: "Damac Properties", projects: 15, avgDelivery: "20 months", performance: "Good", complexity: "High" },
    { name: "Sobha Group", projects: 12, avgDelivery: "22 months", performance: "Average", complexity: "Medium" },
    { name: "Nakheel", projects: 10, avgDelivery: "24 months", performance: "Average", complexity: "High" }
  ];

  const topContractors = [
    { name: "Arabtec Construction", projects: 45, avgDelivery: "14 months", performance: "Excellent", complexity: "High" },
    { name: "Al Habtoor Group", projects: 38, avgDelivery: "16 months", performance: "Good", complexity: "High" },
    { name: "Dubai Contracting Company", projects: 32, avgDelivery: "18 months", performance: "Good", complexity: "Medium" },
    { name: "Al Futtaim Carillion", projects: 28, avgDelivery: "15 months", performance: "Good", complexity: "Medium" },
    { name: "Six Construct", projects: 25, avgDelivery: "17 months", performance: "Average", complexity: "High" }
  ];

  const marketGaps = [
    {
      type: "Supply Gap",
      location: "Dubai Marina",
      sector: "Luxury Residential",
      severity: "High",
      opportunity: "$450M",
      description: "Significant undersupply in luxury residential units with 40% demand-supply gap"
    },
    {
      type: "Emerging Opportunity", 
      location: "Mohammed Bin Rashid City",
      sector: "Mixed-Use Development",
      severity: "Medium",
      opportunity: "$280M",
      description: "Growing demand for integrated live-work spaces with limited current supply"
    },
    {
      type: "Unmet Demand",
      location: "Dubai South",
      sector: "Industrial",
      severity: "High", 
      opportunity: "$320M",
      description: "Airport proximity creating logistics hub demand but insufficient industrial development"
    }
  ];

  const locationHeatmap = [
    { area: "Dubai Marina", projects: 45, density: "Very High", supplyLevel: "Saturated" },
    { area: "Downtown Dubai", projects: 38, density: "High", supplyLevel: "High" },
    { area: "Business Bay", projects: 32, density: "High", supplyLevel: "Medium" },
    { area: "DIFC", projects: 28, density: "Medium", supplyLevel: "Low" },
    { area: "Dubai South", projects: 15, density: "Low", supplyLevel: "Very Low" },
    { area: "Al Barsha", projects: 22, density: "Medium", supplyLevel: "Medium" },
    { area: "JBR", projects: 18, density: "Medium", supplyLevel: "High" },
    { area: "Palm Jumeirah", projects: 12, density: "Low", supplyLevel: "Low" }
  ];



  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "text-red-600 bg-red-50";
      case "Medium": return "text-orange-600 bg-orange-50";
      case "Low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getSupplyLevelColor = (level: string) => {
    switch (level) {
      case "Very Low": return "bg-red-500";
      case "Low": return "bg-orange-500";
      case "Medium": return "bg-yellow-500";
      case "High": return "bg-blue-500";
      case "Saturated": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "Excellent": return "text-green-600";
      case "Good": return "text-blue-600";
      case "Average": return "text-orange-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => setLocation("/consultant-dashboard")}
                className="text-gray-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Filters
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Market Analysis Results</h1>
                  <p className="text-gray-600">Comprehensive market intelligence and insights</p>
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
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="12months">Last 12 Months</SelectItem>
                  <SelectItem value="24months">Last 24 Months</SelectItem>
                  <SelectItem value="5years">Last 5 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Market Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Market Value</p>
                  <p className="text-2xl font-bold text-gray-900">{marketStats.totalProjectValue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Building className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{marketStats.projectCount}</p>
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
                  <p className="text-sm font-medium text-gray-600">Average Project Size</p>
                  <p className="text-2xl font-bold text-gray-900">{marketStats.avgProjectSize}</p>
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
                  <p className="text-sm font-medium text-gray-600">Market Growth Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{marketStats.marketGrowthRate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>





        {/* Main Analysis Tabs */}
        <Tabs defaultValue="heatmap" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="heatmap">Market Heatmap</TabsTrigger>
            <TabsTrigger value="trends">Growth Trends</TabsTrigger>
            <TabsTrigger value="benchmarks">Competitive Analysis</TabsTrigger>
            <TabsTrigger value="gaps">Market Gaps</TabsTrigger>
            <TabsTrigger value="projects">Project Database</TabsTrigger>
          </TabsList>

          {/* Market Heatmap */}
          <TabsContent value="heatmap">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>Project Concentration Heatmap</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-sm font-medium text-gray-700">Supply Level Legend:</span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span className="text-xs">Very Low</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-orange-500 rounded"></div>
                        <span className="text-xs">Low</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                        <span className="text-xs">Medium</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <span className="text-xs">High</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-purple-500 rounded"></div>
                        <span className="text-xs">Saturated</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {locationHeatmap.map((location) => (
                    <Card key={location.area} className="border-2">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{location.area}</h4>
                          <div className={`w-4 h-4 rounded ${getSupplyLevelColor(location.supplyLevel)}`}></div>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-gray-600">Projects:</span> {location.projects}</p>
                          <p><span className="text-gray-600">Density:</span> {location.density}</p>
                          <p><span className="text-gray-600">Supply:</span> {location.supplyLevel}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Growth Trends */}
          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>Sector Growth Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Sector</th>
                        <th className="text-left py-3 px-4">Active Projects</th>
                        <th className="text-left py-3 px-4">Total Value</th>
                        <th className="text-left py-3 px-4">Growth Rate</th>
                        <th className="text-left py-3 px-4">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sectorData.map((sector) => (
                        <tr key={sector.sector} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{sector.sector}</td>
                          <td className="py-3 px-4">{sector.projects}</td>
                          <td className="py-3 px-4">{sector.value}</td>
                          <td className="py-3 px-4 text-green-600 font-medium">{sector.growth}</td>
                          <td className="py-3 px-4">
                            <Badge variant={sector.trend === "High" ? "default" : sector.trend === "Medium" ? "secondary" : "outline"}>
                              {sector.trend}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Key Insights:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Energy sector showing strongest growth at 22% driven by renewable initiatives</li>
                    <li>• Real Estate maintains largest market share with steady 18% growth</li>
                    <li>• Oil & Gas sector growth slowing due to diversification efforts</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Competitive Benchmarks */}
          <TabsContent value="benchmarks">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="w-5 h-5 text-blue-600" />
                    <span>Top Developers</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topDevelopers.map((developer, index) => (
                      <div key={developer.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                            <h4 className="font-semibold">{developer.name}</h4>
                          </div>
                          <p className="text-sm text-gray-600">{developer.projects} projects • {developer.avgDelivery} avg delivery</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${getPerformanceColor(developer.performance)}`}>
                            {developer.performance}
                          </p>
                          <p className="text-xs text-gray-500">{developer.complexity} Complexity</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span>Top Contractors</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topContractors.map((contractor, index) => (
                      <div key={contractor.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                            <h4 className="font-semibold">{contractor.name}</h4>
                          </div>
                          <p className="text-sm text-gray-600">{contractor.projects} projects • {contractor.avgDelivery} avg delivery</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${getPerformanceColor(contractor.performance)}`}>
                            {contractor.performance}
                          </p>
                          <p className="text-xs text-gray-500">{contractor.complexity} Complexity</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Market Gaps */}
          <TabsContent value="gaps">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-blue-600" />
                  <span>Market Gap Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {marketGaps.map((gap, index) => (
                    <div key={index} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{gap.type}</h3>
                            <Badge className={getSeverityColor(gap.severity)}>
                              {gap.severity} Priority
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span><MapPin className="w-4 h-4 inline mr-1" />{gap.location}</span>
                            <span><Building className="w-4 h-4 inline mr-1" />{gap.sector}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">{gap.opportunity}</p>
                          <p className="text-sm text-gray-500">Market Opportunity</p>
                        </div>
                      </div>
                      <p className="text-gray-700">{gap.description}</p>
                      <div className="mt-4 flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700">Recommended for immediate attention</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Project Database */}
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <span>Individual Project Analysis</span>
                  </CardTitle>
                  <Button 
                    variant="outline"
                    onClick={() => setShowProjectDetails(!showProjectDetails)}
                  >
                    {showProjectDetails ? "Hide Details" : "View Project Details"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showProjectDetails ? (
                  <div className="text-center py-12">
                    <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Database Access</h3>
                    <p className="text-gray-600 mb-6">
                      Access detailed information about individual projects including specifications, 
                      timelines, stakeholders, and financial details.
                    </p>
                    <Button 
                      onClick={() => setLocation("/contractor-projects")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Access Project Database
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600">
                      Click "View Project Details" to access the comprehensive project database 
                      for deep-dive analysis of individual projects.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}