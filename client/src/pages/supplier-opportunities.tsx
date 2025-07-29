import { useState, useEffect } from "react";
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
  Truck, 
  Package,
  Calendar,
  DollarSign,
  ArrowLeft,
  Phone,
  Mail,
  Building,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  User
} from "lucide-react";

export default function SupplierOpportunities() {
  const [, setLocation] = useLocation();
  const [selectedTimeframe, setSelectedTimeframe] = useState("30days");
  const [selectedSector, setSelectedSector] = useState("all");
  const [appliedFilters, setAppliedFilters] = useState<any>(null);

  // Load applied filters from localStorage
  useEffect(() => {
    const storedFilters = localStorage.getItem("supplierOpportunityFilters");
    if (storedFilters) {
      setAppliedFilters(JSON.parse(storedFilters));
    }
  }, []);

  // Dynamic opportunity stats based on filtered results
  const getOpportunityStats = (filteredOps: any[]) => ({
    totalOpportunities: filteredOps.length.toString(),
    totalProcurementValue: `$${(filteredOps.reduce((sum, op) => {
      const budget = op.budget.split(' - ')[1] || op.budget.split(' - ')[0];
      const value = parseFloat(budget.replace(/[$M]/g, '')) || 0;
      return sum + value;
    }, 0) / 1000).toFixed(1)}B`,
    activeDeadlines: filteredOps.filter(op => {
      const deadline = new Date(op.bidDeadline);
      const today = new Date();
      return deadline > today;
    }).length.toString(),
    avgLeadTime: `${Math.round(filteredOps.reduce((sum, op) => {
      return sum + parseInt(op.leadTime.replace(' days', ''));
    }, 0) / filteredOps.length) || 45} days`
  });

  // Extended supply opportunities database with more specific Dubai construction projects
  const allSupplyOpportunities = [
    // Dubai Construction Projects
    {
      id: 1,
      projectName: "Dubai Marina Tower Complex",
      location: { country: "United Arab Emirates", city: "Dubai", district: "Dubai Marina" },
      sector: "Construction",
      stage: "Tender",
      productNeeds: [
        { product: "Steel & Rebar", quantity: "2,500 tons", priority: "High" },
        { product: "Cement & Concrete", quantity: "15,000 m³", priority: "High" },
        { product: "Electrical Components", quantity: "850 units", priority: "Medium" }
      ],
      procurementTimeline: "Q2 2024 - Q4 2024",
      budget: "$45M - $65M",
      contact: {
        name: "Ahmad Al-Rashid",
        role: "Procurement Manager",
        email: "ahmad.rashid@emaardevelopment.ae",
        phone: "+971 4 362 8888"
      },
      bidDeadline: "2024-03-15",
      competitionLevel: "High",
      leadTime: "60 days"
    },
    {
      id: 6,
      projectName: "Dubai Creek Harbour Residences",
      location: { country: "United Arab Emirates", city: "Dubai", district: "Dubai Creek Harbour" },
      sector: "Construction",
      stage: "Pre-Tender",
      productNeeds: [
        { product: "Cement & Concrete", quantity: "8,500 m³", priority: "High" },
        { product: "Steel & Rebar", quantity: "1,200 tons", priority: "High" },
        { product: "Roofing Materials", quantity: "15,000 sqm", priority: "Medium" }
      ],
      procurementTimeline: "Q3 2024 - Q1 2025",
      budget: "$28M - $35M",
      contact: {
        name: "Sarah Al-Mansouri",
        role: "Senior Procurement Officer",
        email: "s.mansouri@creekdevelopment.ae",
        phone: "+971 4 556 7890"
      },
      bidDeadline: "2024-04-05",
      competitionLevel: "Medium",
      leadTime: "45 days"
    },
    {
      id: 7,
      projectName: "Business Bay Commercial Tower",
      location: { country: "United Arab Emirates", city: "Dubai", district: "Business Bay" },
      sector: "Construction",
      stage: "Execution",
      productNeeds: [
        { product: "Cement & Concrete", quantity: "12,000 m³", priority: "High" },
        { product: "Scaffolding & Formwork", quantity: "450 tons", priority: "High" },
        { product: "Plumbing Supplies", quantity: "2,800 units", priority: "Medium" }
      ],
      procurementTimeline: "Q1 2024 - Q3 2024",
      budget: "$38M - $48M",
      contact: {
        name: "Omar Al-Zaabi",
        role: "Procurement Lead",
        email: "o.zaabi@businessbaytowers.ae",
        phone: "+971 4 445 6789"
      },
      bidDeadline: "2024-02-20",
      competitionLevel: "Low",
      leadTime: "30 days"
    },
    {
      id: 8,
      projectName: "Dubai Hills Estate Community Center",
      location: { country: "United Arab Emirates", city: "Dubai", district: "Dubai Hills Estate" },
      sector: "Construction",
      stage: "Design",
      productNeeds: [
        { product: "Cement & Concrete", quantity: "3,200 m³", priority: "Medium" },
        { product: "Insulation Materials", quantity: "850 sqm", priority: "High" },
        { product: "Heavy Machinery", quantity: "12 units", priority: "Low" }
      ],
      procurementTimeline: "Q4 2024 - Q2 2025",
      budget: "$15M - $22M",
      contact: {
        name: "Layla Al-Hashimi",
        role: "Procurement Coordinator",
        email: "l.hashimi@dubaihills.ae",
        phone: "+971 4 334 5678"
      },
      bidDeadline: "2024-06-15",
      competitionLevel: "Medium",
      leadTime: "90 days"
    },
    // Energy Projects
    {
      id: 2,
      projectName: "Abu Dhabi Solar Farm Phase 2",
      location: { country: "United Arab Emirates", city: "Abu Dhabi", district: "Al Dhafra" },
      sector: "Energy",
      stage: "Pre-Tender",
      productNeeds: [
        { product: "Solar Panels", quantity: "25,000 units", priority: "High" },
        { product: "Inverters", quantity: "150 units", priority: "High" },
        { product: "Power Cables", quantity: "45 km", priority: "Medium" }
      ],
      procurementTimeline: "Q3 2024 - Q1 2025",
      budget: "$180M - $220M",
      contact: {
        name: "Fatima Al-Zahra",
        role: "Senior Procurement Specialist",
        email: "f.alzahra@adwea.gov.ae",
        phone: "+971 2 691 4000"
      },
      bidDeadline: "2024-04-22",
      competitionLevel: "Medium",
      leadTime: "120 days"
    },
    // Oil & Gas Projects
    {
      id: 3,
      projectName: "Qatar Gas Processing Facility",
      location: { country: "Qatar", city: "Doha", district: "Ras Laffan" },
      sector: "Oil & Gas",
      stage: "Execution",
      productNeeds: [
        { product: "Pumps & Compressors", quantity: "45 units", priority: "High" },
        { product: "Valves & Controls", quantity: "350 units", priority: "High" },
        { product: "Safety Equipment", quantity: "1,200 units", priority: "Medium" }
      ],
      procurementTimeline: "Q1 2024 - Q3 2024",
      budget: "$95M - $125M",
      contact: {
        name: "Mohammed Al-Thani",
        role: "Lead Procurement Officer",
        email: "m.althani@qatargas.com.qa",
        phone: "+974 4013 2000"
      },
      bidDeadline: "2024-02-28",
      competitionLevel: "Low",
      leadTime: "90 days"
    },
    // Infrastructure Projects
    {
      id: 4,
      projectName: "Riyadh Metro Extension",
      location: { country: "Saudi Arabia", city: "Riyadh", district: "King Abdullah Financial District" },
      sector: "Infrastructure",
      stage: "Design",
      productNeeds: [
        { product: "Public Transport Systems", quantity: "25 units", priority: "High" },
        { product: "Traffic Systems", quantity: "180 units", priority: "Medium" },
        { product: "Security Equipment", quantity: "450 units", priority: "Medium" }
      ],
      procurementTimeline: "Q4 2024 - Q2 2025",
      budget: "$280M - $350M",
      contact: {
        name: "Abdullah Al-Saud",
        role: "Procurement Director",
        email: "a.alsaud@riyadhmetro.gov.sa",
        phone: "+966 11 289 3000"
      },
      bidDeadline: "2024-05-10",
      competitionLevel: "High",
      leadTime: "150 days"
    },
    // Industry Projects
    {
      id: 5,
      projectName: "Kuwait Manufacturing Hub",
      location: { country: "Kuwait", city: "Kuwait City", district: "Shuwaikh Industrial" },
      sector: "Industry",
      stage: "Tender",
      productNeeds: [
        { product: "Manufacturing Equipment", quantity: "65 units", priority: "High" },
        { product: "Automation Systems", quantity: "12 systems", priority: "High" },
        { product: "HVAC Equipment", quantity: "85 units", priority: "Low" }
      ],
      procurementTimeline: "Q2 2024 - Q4 2024",
      budget: "$75M - $95M",
      contact: {
        name: "Nasser Al-Mutairi",
        role: "Supply Chain Manager",
        email: "n.mutairi@kuwaitindustries.com.kw",
        phone: "+965 2481 7000"
      },
      bidDeadline: "2024-03-30",
      competitionLevel: "Medium",
      leadTime: "75 days"
    }
  ];



  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Design": return "text-blue-600 bg-blue-50";
      case "Pre-Tender": return "text-purple-600 bg-purple-50";
      case "Tender": return "text-orange-600 bg-orange-50";
      case "Execution": return "text-green-600 bg-green-50";
      case "Completion": return "text-gray-600 bg-gray-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case "High": return "text-red-600";
      case "Medium": return "text-orange-600";
      case "Low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "text-red-600 bg-red-50";
      case "Medium": return "text-orange-600 bg-orange-50";
      case "Low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Apply dynamic filtering based on stored filters
  const getFilteredOpportunities = () => {
    let filtered = [...allSupplyOpportunities];
    
    if (!appliedFilters) return filtered;
    
    // Filter by location
    if (appliedFilters.location?.country && appliedFilters.location.country !== "all") {
      filtered = filtered.filter(opp => opp.location.country === appliedFilters.location.country);
    }
    if (appliedFilters.location?.city && appliedFilters.location.city !== "all") {
      filtered = filtered.filter(opp => opp.location.city === appliedFilters.location.city);
    }
    if (appliedFilters.location?.district && appliedFilters.location.district !== "all") {
      filtered = filtered.filter(opp => opp.location.district === appliedFilters.location.district);
    }
    
    // Filter by sectors
    if (appliedFilters.sectors && appliedFilters.sectors.length > 0) {
      filtered = filtered.filter(opp => appliedFilters.sectors.includes(opp.sector));
    }
    
    // Filter by product categories
    if (appliedFilters.productCategories && appliedFilters.productCategories.length > 0) {
      filtered = filtered.filter(opp => 
        opp.productNeeds.some(product => 
          appliedFilters.productCategories.includes(product.product)
        )
      );
    }
    
    // Filter by project stage
    if (appliedFilters.projectStage && appliedFilters.projectStage !== "all") {
      filtered = filtered.filter(opp => opp.stage === appliedFilters.projectStage);
    }
    
    // Filter by budget range
    if (appliedFilters.budgetRange && (appliedFilters.budgetRange[0] > 0 || appliedFilters.budgetRange[1] < 50000000)) {
      filtered = filtered.filter(opp => {
        const budget = opp.budget.split(' - ')[1] || opp.budget.split(' - ')[0];
        const budgetValue = parseFloat(budget.replace(/[$M]/g, '')) * 1000000;
        return budgetValue >= appliedFilters.budgetRange[0] && budgetValue <= appliedFilters.budgetRange[1];
      });
    }
    
    // Filter by material demand forecast
    if (appliedFilters.materialDemandForecast) {
      // Only show projects with high priority product needs
      filtered = filtered.filter(opp => 
        opp.productNeeds.some(product => product.priority === "High")
      );
    }
    
    // Filter by delivery lead time
    if (appliedFilters.deliveryLeadTime && appliedFilters.deliveryLeadTime !== "all") {
      filtered = filtered.filter(opp => {
        const leadTimeDays = parseInt(opp.leadTime.replace(' days', ''));
        if (appliedFilters.deliveryLeadTime.includes("Short-term")) {
          return leadTimeDays <= 90;
        } else if (appliedFilters.deliveryLeadTime.includes("Medium-term")) {
          return leadTimeDays > 90 && leadTimeDays <= 365;
        } else if (appliedFilters.deliveryLeadTime.includes("Long-term")) {
          return leadTimeDays > 365;
        }
        return true;
      });
    }
    
    // Filter by competitor presence
    if (appliedFilters.competitorPresence && appliedFilters.competitorPresence !== "all") {
      filtered = filtered.filter(opp => opp.competitionLevel === appliedFilters.competitorPresence);
    }
    
    // Filter by bid deadline
    if (appliedFilters.bidDeadline) {
      const targetDate = new Date(appliedFilters.bidDeadline);
      filtered = filtered.filter(opp => {
        const oppDeadline = new Date(opp.bidDeadline);
        return oppDeadline <= targetDate;
      });
    }
    
    // Additional sector filter from dropdown
    if (selectedSector !== "all") {
      filtered = filtered.filter(opp => opp.sector === selectedSector);
    }
    
    return filtered;
  };

  const filteredOpportunities = getFilteredOpportunities();
  const opportunityStats = getOpportunityStats(filteredOpportunities);

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => setLocation("/supplier-dashboard")}
                className="text-gray-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Filters
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Supply Opportunities</h1>
                  <p className="text-gray-600">Matching procurement opportunities and project details</p>
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
                  <SelectItem value="30days">Next 30 Days</SelectItem>
                  <SelectItem value="60days">Next 60 Days</SelectItem>
                  <SelectItem value="90days">Next 90 Days</SelectItem>
                  <SelectItem value="6months">Next 6 Months</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  <SelectItem value="Construction">Construction</SelectItem>
                  <SelectItem value="Energy">Energy</SelectItem>
                  <SelectItem value="Oil & Gas">Oil & Gas</SelectItem>
                  <SelectItem value="Industry">Industry</SelectItem>
                  <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Supply Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Matching Opportunities</p>
                  <p className="text-2xl font-bold text-gray-900">{opportunityStats.totalOpportunities}</p>
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
                  <p className="text-sm font-medium text-gray-600">Total Procurement Value</p>
                  <p className="text-2xl font-bold text-gray-900">{opportunityStats.totalProcurementValue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Deadlines</p>
                  <p className="text-2xl font-bold text-gray-900">{opportunityStats.activeDeadlines}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average Lead Time</p>
                  <p className="text-2xl font-bold text-gray-900">{opportunityStats.avgLeadTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>



        {/* Applied Filters Display */}
        {appliedFilters && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-700">Applied Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {appliedFilters.location?.country && appliedFilters.location.country !== "all" && (
                  <Badge variant="outline">Country: {appliedFilters.location.country}</Badge>
                )}
                {appliedFilters.location?.city && appliedFilters.location.city !== "all" && (
                  <Badge variant="outline">City: {appliedFilters.location.city}</Badge>
                )}
                {appliedFilters.location?.district && appliedFilters.location.district !== "all" && (
                  <Badge variant="outline">District: {appliedFilters.location.district}</Badge>
                )}
                {appliedFilters.sectors?.map((sector: string) => (
                  <Badge key={sector} variant="outline">Sector: {sector}</Badge>
                ))}
                {appliedFilters.productCategories?.map((category: string) => (
                  <Badge key={category} variant="outline">Product: {category}</Badge>
                ))}
                {appliedFilters.projectStage && appliedFilters.projectStage !== "all" && (
                  <Badge variant="outline">Stage: {appliedFilters.projectStage}</Badge>
                )}
                {appliedFilters.deliveryLeadTime && appliedFilters.deliveryLeadTime !== "all" && (
                  <Badge variant="outline">Lead Time: {appliedFilters.deliveryLeadTime}</Badge>
                )}
                {appliedFilters.competitorPresence && appliedFilters.competitorPresence !== "all" && (
                  <Badge variant="outline">Competition: {appliedFilters.competitorPresence}</Badge>
                )}
                {appliedFilters.materialDemandForecast && (
                  <Badge variant="outline">High Demand Projects Only</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Matching Projects */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Matching Supply Opportunities ({filteredOpportunities.length})
            </h2>
          </div>

          {filteredOpportunities.map((opportunity) => {
            const daysUntilDeadline = getDaysUntilDeadline(opportunity.bidDeadline);
            const isUrgent = daysUntilDeadline <= 7;

            return (
              <Card key={opportunity.id} className={`${isUrgent ? 'border-red-200 bg-red-50' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 
                          className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                          onClick={() => {
                            // Map supplier opportunity IDs to project profile IDs
                            const projectMapping: Record<number, number> = {
                              1: 1, // Dubai Marina Tower Complex → Dubai Marina Tower
                              6: 13, // Dubai Creek Harbour Residences → Dubai Creek Harbour Residences
                              7: 3, // Business Bay Commercial Tower → Business Bay
                              // Add more mappings as needed
                            };
                            
                            const projectId = projectMapping[opportunity.id] || opportunity.id;
                            sessionStorage.setItem('previousPage', '/supplier-opportunities');
                            setLocation(`/project/${projectId}`);
                          }}
                        >
                          {opportunity.projectName}
                        </h3>
                        <Badge className={getStageColor(opportunity.stage)}>
                          {opportunity.stage}
                        </Badge>
                        {isUrgent && (
                          <Badge className="bg-red-100 text-red-800">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Urgent
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {opportunity.location.city}, {opportunity.location.district}
                        </span>
                        <span className="flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                          {opportunity.sector}
                        </span>
                        <span className={`flex items-center font-medium ${getCompetitionColor(opportunity.competitionLevel)}`}>
                          Competition: {opportunity.competitionLevel}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{opportunity.budget}</p>
                      <p className="text-sm text-gray-500">Procurement Budget</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="products" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="products">Product Needs</TabsTrigger>
                      <TabsTrigger value="timeline">Timeline & Budget</TabsTrigger>
                      <TabsTrigger value="contact">Contact Info</TabsTrigger>
                    </TabsList>

                    <TabsContent value="products">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">Expected Product Needs & Quantities</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {opportunity.productNeeds.map((product, index) => (
                            <div key={index} className="border rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-gray-900">{product.product}</h5>
                                <Badge className={getPriorityColor(product.priority)} variant="outline">
                                  {product.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="timeline">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Procurement Timeline</h4>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              <span className="text-sm text-gray-700">Timeline: {opportunity.procurementTimeline}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-orange-600" />
                              <span className="text-sm text-gray-700">Lead Time: {opportunity.leadTime}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className={`w-4 h-4 ${isUrgent ? 'text-red-600' : 'text-green-600'}`} />
                              <span className={`text-sm font-medium ${isUrgent ? 'text-red-700' : 'text-green-700'}`}>
                                Bid Deadline: {opportunity.bidDeadline} ({daysUntilDeadline} days remaining)
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Budget Information</h4>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-gray-700">Budget Range: {opportunity.budget}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-blue-600" />
                              <span className="text-sm text-gray-700">Stage: {opportunity.stage}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="contact">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Procurement Contact Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-gray-600" />
                              <span className="text-sm">
                                <strong>{opportunity.contact.name}</strong>
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Building className="w-4 h-4 text-gray-600" />
                              <span className="text-sm text-gray-700">{opportunity.contact.role}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4 text-blue-600" />
                              <a 
                                href={`mailto:${opportunity.contact.email}`}
                                className="text-sm text-blue-600 hover:underline"
                              >
                                {opportunity.contact.email}
                              </a>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4 text-green-600" />
                              <a 
                                href={`tel:${opportunity.contact.phone}`}
                                className="text-sm text-green-600 hover:underline"
                              >
                                {opportunity.contact.phone}
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <Button className="bg-orange-600 hover:bg-orange-700">
                            Contact Procurement Team
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredOpportunities.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Matching Opportunities</h3>
              <p className="text-gray-600 mb-6">
                No supply opportunities match your current filter criteria. 
                Try adjusting your sector or timeframe selections.
              </p>
              <Button 
                variant="outline"
                onClick={() => setLocation("/supplier-dashboard")}
              >
                Modify Search Criteria
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}