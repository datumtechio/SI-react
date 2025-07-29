import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  MapPin,
  DollarSign,
  Calendar,
  Building,
  TrendingUp,
  Users,
  Phone,
  Mail,
  Globe,
  FileText,
  Download,
  Share2,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Target,
  Award,
  Briefcase
} from "lucide-react";

interface ProjectDetails {
  id: number;
  name: string;
  description: string;
  sector: string;
  subsector?: string;
  projectType: string;
  contractType?: string;
  status: string;
  city: string;
  country: string;
  district?: string;
  investment: number;
  expectedRoi?: number;
  startDate: string;
  completionDate: string;
  capacity?: string;
  residentialType?: string;
  residentialClass?: string;
  rating?: string;
  category?: string;
  value?: string;
  briefBackground?: string;
  developer: string;
  contractor?: string;
  consultant?: string;
  supplier?: string;
  totalUnits?: number;
  builtUpArea?: string;
  landArea?: string;
  floors?: number;
  riskLevel: string;
  marketDemand: string;
  competition: string;
  permits: string[];
  amenities: string[];
  features: string[];
  contactInfo: {
    email: string;
    phone: string;
    website?: string;
  };
  financials: {
    totalBudget: string;
    spentToDate: string;
    remainingBudget: string;
    fundingSources: string[];
  };
  timeline: {
    phase: string;
    progress: number;
    milestones: { name: string; date: string; status: string; }[];
  };
  documents: {
    name: string;
    type: string;
    size: string;
    date: string;
  }[];
}

export default function ProjectProfile() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/project/:id");
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Get user role from localStorage
    const role = localStorage.getItem("selectedRole");
    setUserRole(role);
    
    if (params?.id) {
      // Mock project data - in real implementation, this would fetch from API
      const mockProject: ProjectDetails = {
        id: parseInt(params.id),
        name: "Azure Residences",
        description: "Luxury residential development featuring modern amenities and sustainable design principles. Located in the heart of Downtown Dubai with panoramic views of the Burj Khalifa and Dubai skyline.",
        sector: "Real Estate",
        subsector: "Luxury Residential",
        projectType: "Residential Tower",
        contractType: "Design-Build",
        status: "Under Construction",
        city: "Dubai",
        country: "United Arab Emirates",
        district: "Downtown Dubai",
        investment: 450,
        expectedRoi: 16.2,
        capacity: "320 Units",
        residentialType: "High-End Apartments",
        residentialClass: "Ultra-Luxury",
        rating: "5-Star",
        category: "Premium Residential Development",
        value: "$450 Million",
        startDate: "2024-01-15",
        completionDate: "Q3 2025",
        briefBackground: "Azure Residences represents the pinnacle of luxury living in Downtown Dubai, featuring state-of-the-art amenities and world-class architectural design. The project caters to discerning investors and residents seeking premium lifestyle experiences in one of Dubai's most prestigious locations.",
        developer: "Emaar Properties",
        contractor: "Arabtec Construction",
        consultant: "AECOM Middle East",
        supplier: "Al Ghurair Iron & Steel",
        totalUnits: 240,
        builtUpArea: "85,000 sqm",
        landArea: "12,500 sqm",
        floors: 32,
        riskLevel: "Low",
        marketDemand: "High",
        competition: "Medium",
        permits: ["Building Permit", "Environmental Clearance", "Fire Safety", "Municipality Approval"],
        amenities: ["Swimming Pool", "Gym", "Spa", "Concierge", "Valet Parking", "Sky Lounge", "Children's Play Area"],
        features: ["Smart Home Technology", "Energy Efficient", "LEED Certified", "Sea View", "Private Balconies"],
        contactInfo: {
          email: "info@azureresidences.ae",
          phone: "+971-4-123-4567",
          website: "www.azureresidences.ae"
        },
        financials: {
          totalBudget: "$350M",
          spentToDate: "$180M",
          remainingBudget: "$170M",
          fundingSources: ["Bank Financing (60%)", "Developer Equity (25%)", "Pre-sales (15%)"]
        },
        timeline: {
          phase: "Construction Phase 2",
          progress: 45,
          milestones: [
            { name: "Foundation Complete", date: "2024-06-15", status: "Completed" },
            { name: "Structure Phase 1", date: "2024-12-20", status: "Completed" },
            { name: "Structure Phase 2", date: "2025-04-15", status: "In Progress" },
            { name: "MEP Installation", date: "2025-08-30", status: "Planned" },
            { name: "Interior Fit-out", date: "2026-02-15", status: "Planned" },
            { name: "Final Completion", date: "2026-08-30", status: "Planned" }
          ]
        },
        documents: [
          { name: "Project Master Plan", type: "PDF", size: "15.2 MB", date: "2024-01-10" },
          { name: "Financial Projections", type: "Excel", size: "2.8 MB", date: "2024-01-10" },
          { name: "Environmental Impact", type: "PDF", size: "8.5 MB", date: "2024-01-10" },
          { name: "Building Specifications", type: "PDF", size: "12.1 MB", date: "2024-01-10" }
        ]
      };
      
      setProject(mockProject);
      setLoading(false);
    }
  }, [params?.id]);

  const handleBack = () => {
    // Navigate back to the previous page based on referrer
    const referrer = localStorage.getItem("projectProfileReferrer") || "/dashboard";
    setLocation(referrer);
  };

  const getRoleSpecificTabs = () => {
    const baseTabs = ["overview", "financials", "timeline"];
    
    switch(userRole) {
      case "investor":
        return [...baseTabs, "analysis", "roi-projections", "market-comparison"];
      case "contractor":
        return [...baseTabs, "construction", "procurement", "timeline-details"];
      case "consultant":
        return [...baseTabs, "market-analysis", "feasibility", "recommendations"];
      case "developer":
        return [...baseTabs, "development-plan", "zoning", "site-analysis"];
      case "supplier":
        return [...baseTabs, "supply-opportunities", "material-specs", "procurement-schedule"];
      default:
        return [...baseTabs, "stakeholders", "documents", "analysis"];
    }
  };

  const getRoleColor = () => {
    switch(userRole) {
      case "investor": return "text-green-600";
      case "contractor": return "text-orange-600";
      case "consultant": return "text-blue-600";
      case "developer": return "text-purple-600";
      case "supplier": return "text-orange-600";
      default: return "text-gray-600";
    }
  };

  const getRoleIcon = () => {
    switch(userRole) {
      case "investor": return <TrendingUp className="w-5 h-5" />;
      case "contractor": return <Building className="w-5 h-5" />;
      case "consultant": return <BarChart3 className="w-5 h-5" />;
      case "developer": return <Target className="w-5 h-5" />;
      case "supplier": return <Briefcase className="w-5 h-5" />;
      default: return <Building className="w-5 h-5" />;
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    // In real app, show toast notification
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-700";
      case "Under Construction": return "bg-blue-100 text-blue-700";
      case "In Progress": return "bg-yellow-100 text-yellow-700";
      case "Planned": return "bg-gray-100 text-gray-700";
      case "On Hold": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-green-600";
      case "Medium": return "text-yellow-600";
      case "High": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-4">The requested project could not be found.</p>
          <Button onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={handleBack} className="text-gray-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  userRole === "investor" ? "bg-green-100" :
                  userRole === "contractor" ? "bg-orange-100" :
                  userRole === "consultant" ? "bg-blue-100" :
                  userRole === "developer" ? "bg-purple-100" :
                  userRole === "supplier" ? "bg-orange-100" : "bg-blue-100"
                }`}>
                  <div className={getRoleColor()}>
                    {getRoleIcon()}
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {project.city}, {project.country}
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={toggleFavorite}>
                <Star className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                {isFavorite ? 'Favorited' : 'Add to Favorites'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Details
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Investment</p>
                  <p className="text-2xl font-bold text-gray-900">${project.investment}M</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Expected ROI</p>
                  <p className="text-2xl font-bold text-gray-900">{project.expectedRoi}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Project Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{project.timeline.progress}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertTriangle className={`w-6 h-6 ${getRiskColor(project.riskLevel)}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Risk Level</p>
                  <p className={`text-2xl font-bold ${getRiskColor(project.riskLevel)}`}>{project.riskLevel}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className={`grid w-full grid-cols-${getRoleSpecificTabs().length}`}>
            {getRoleSpecificTabs().map(tab => (
              <TabsTrigger key={tab} value={tab}>
                {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-6">{project.description}</p>
                  
                  {/* Brief Background */}
                  {project.briefBackground && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Project Background</h4>
                      <p className="text-sm text-gray-700">{project.briefBackground}</p>
                    </div>
                  )}
                  
                  {/* Project Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Basic Information */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 mb-3">Basic Information</h4>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sector:</span>
                        <Badge variant="outline">{project.sector}</Badge>
                      </div>
                      {project.subsector && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subsector:</span>
                          <span className="font-medium">{project.subsector}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Project Type:</span>
                        <span className="font-medium">{project.projectType}</span>
                      </div>
                      {project.contractType && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Contract Type:</span>
                          <span className="font-medium">{project.contractType}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Completion Date:</span>
                        <span className="font-medium">{project.completionDate}</span>
                      </div>
                    </div>
                    
                    {/* Location & Scale */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 mb-3">Location & Scale</h4>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Country:</span>
                        <span className="font-medium">{project.country}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">City:</span>
                        <span className="font-medium">{project.city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">District:</span>
                        <span className="font-medium">{project.district}</span>
                      </div>
                      {project.capacity && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Capacity:</span>
                          <span className="font-medium">{project.capacity}</span>
                        </div>
                      )}
                      {project.value && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Value:</span>
                          <span className="font-medium text-green-600">{project.value}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Residential-specific Information */}
                  {(project.residentialType || project.residentialClass || project.rating) && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Residential Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {project.residentialType && (
                          <div>
                            <span className="text-sm text-gray-600">Type:</span>
                            <p className="font-medium">{project.residentialType}</p>
                          </div>
                        )}
                        {project.residentialClass && (
                          <div>
                            <span className="text-sm text-gray-600">Class:</span>
                            <p className="font-medium">{project.residentialClass}</p>
                          </div>
                        )}
                        {project.rating && (
                          <div>
                            <span className="text-sm text-gray-600">Rating:</span>
                            <p className="font-medium flex items-center">
                              <Star className="w-4 h-4 mr-1 text-yellow-500" />
                              {project.rating}
                            </p>
                          </div>
                        )}
                      </div>
                      {project.category && (
                        <div className="mt-3">
                          <span className="text-sm text-gray-600">Category:</span>
                          <p className="font-medium">{project.category}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Additional Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Units:</span>
                      <span className="font-medium">{project.totalUnits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Built-up Area:</span>
                      <span className="font-medium">{project.builtUpArea}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Floors:</span>
                      <span className="font-medium">{project.floors}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Key Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.amenities.map((amenity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Permits & Approvals</h4>
                      <div className="space-y-2">
                        {project.permits.map((permit, index) => (
                          <div key={index} className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                            <span className="text-sm text-gray-700">{permit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Financials Tab */}
          <TabsContent value="financials" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Budget Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Budget:</span>
                      <span className="text-xl font-bold text-gray-900">{project.financials.totalBudget}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Spent to Date:</span>
                      <span className="text-lg font-semibold text-blue-600">{project.financials.spentToDate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Remaining Budget:</span>
                      <span className="text-lg font-semibold text-green-600">{project.financials.remainingBudget}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                      <div 
                        className="bg-blue-600 h-3 rounded-full" 
                        style={{ width: `${(180/350) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      {Math.round((180/350) * 100)}% of budget utilized
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Funding Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.financials.fundingSources.map((source, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <PieChart className="w-5 h-5 text-blue-600 mr-3" />
                        <span className="text-gray-700">{source}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Timeline & Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Current Phase: {project.timeline.phase}</span>
                    <span className="text-sm font-medium text-gray-700">{project.timeline.progress}% Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${project.timeline.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-4">
                  {project.timeline.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center p-4 border rounded-lg">
                      <div className="mr-4">
                        {milestone.status === 'Completed' && <CheckCircle className="w-6 h-6 text-green-600" />}
                        {milestone.status === 'In Progress' && <Clock className="w-6 h-6 text-blue-600" />}
                        {milestone.status === 'Planned' && <Calendar className="w-6 h-6 text-gray-400" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{milestone.name}</h4>
                        <p className="text-sm text-gray-600">Target Date: {new Date(milestone.date).toLocaleDateString()}</p>
                      </div>
                      <Badge className={getStatusColor(milestone.status)}>
                        {milestone.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stakeholders Tab */}
          <TabsContent value="stakeholders" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Key Stakeholders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center p-3 border rounded-lg">
                      <Award className="w-6 h-6 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Developer</p>
                        <p className="text-sm text-gray-600">{project.developer}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 border rounded-lg">
                      <Briefcase className="w-6 h-6 text-orange-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Main Contractor</p>
                        <p className="text-sm text-gray-600">{project.contractor}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 border rounded-lg">
                      <Target className="w-6 h-6 text-purple-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Consultant</p>
                        <p className="text-sm text-gray-600">{project.consultant}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 border rounded-lg">
                      <Building className="w-6 h-6 text-green-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Main Supplier</p>
                        <p className="text-sm text-gray-600">{project.supplier}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-blue-600">{project.contactInfo.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium text-gray-900">{project.contactInfo.phone}</p>
                      </div>
                    </div>
                    {project.contactInfo.website && (
                      <div className="flex items-center">
                        <Globe className="w-5 h-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Website</p>
                          <p className="font-medium text-blue-600">{project.contactInfo.website}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center">
                        <FileText className="w-6 h-6 text-blue-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-600">{doc.type} • {doc.size} • {doc.date}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Market Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Market Demand:</span>
                      <Badge variant={project.marketDemand === 'High' ? 'default' : 'secondary'}>
                        {project.marketDemand}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Competition Level:</span>
                      <Badge variant={project.competition === 'Low' ? 'default' : 'secondary'}>
                        {project.competition}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location Rating:</span>
                      <div className="flex items-center">
                        {[1,2,3,4,5].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Investment Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ROI Projection:</span>
                      <span className="font-bold text-green-600">{project.expectedRoi}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payback Period:</span>
                      <span className="font-medium">5.4 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">IRR:</span>
                      <span className="font-medium">22.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">NPV:</span>
                      <span className="font-bold text-green-600">$85.2M</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Role-Specific Tabs */}
          {userRole === "investor" && (
            <>
              <TabsContent value="roi-projections" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                      ROI Projections & Investment Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-green-600">{project.expectedRoi}%</p>
                        <p className="text-sm text-gray-600">Expected ROI</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-blue-600">5.4 yrs</p>
                        <p className="text-sm text-gray-600">Payback Period</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-purple-600">$85.2M</p>
                        <p className="text-sm text-gray-600">Net Present Value</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="market-comparison" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Market Comparison Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">vs Similar Projects:</span>
                        <Badge variant="default" className="bg-green-100 text-green-700">+15% ROI</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Market Position:</span>
                        <span className="font-medium text-green-600">Top 10%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}

          {userRole === "contractor" && (
            <>
              <TabsContent value="construction" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Construction Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Construction Method:</span>
                        <span className="font-medium">Cast-in-place Concrete</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Main Contractor:</span>
                        <span className="font-medium">{project.contractor}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="procurement" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Procurement Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-l-4 border-orange-500 pl-4">
                        <p className="font-medium">Steel & Concrete</p>
                        <p className="text-sm text-gray-600">Q2 2025 - $45M procurement value</p>
                      </div>
                      <div className="border-l-4 border-blue-500 pl-4">
                        <p className="font-medium">MEP Systems</p>
                        <p className="text-sm text-gray-600">Q3 2025 - $28M procurement value</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline-details" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Construction Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.timeline.milestones.map((milestone, idx) => (
                        <div key={idx} className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${
                            milestone.status === 'Completed' ? 'bg-green-500' :
                            milestone.status === 'In Progress' ? 'bg-orange-500' : 'bg-gray-300'
                          }`} />
                          <div className="flex-1">
                            <p className="font-medium">{milestone.name}</p>
                            <p className="text-sm text-gray-600">{milestone.date}</p>
                          </div>
                          <Badge variant={
                            milestone.status === 'Completed' ? 'default' :
                            milestone.status === 'In Progress' ? 'secondary' : 'outline'
                          }>
                            {milestone.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}

          {/* Default tabs for other roles */}
          {(!userRole || !["investor", "contractor"].includes(userRole)) && (
            <>
              <TabsContent value="stakeholders" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Stakeholders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Developer</p>
                        <p className="font-medium text-gray-900">{project.developer}</p>
                      </div>
                      {project.contractor && (
                        <div>
                          <p className="text-sm text-gray-600">Contractor</p>
                          <p className="font-medium text-gray-900">{project.contractor}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {project.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center">
                            <FileText className="w-6 h-6 text-blue-600 mr-3" />
                            <div>
                              <p className="font-medium text-gray-900">{doc.name}</p>
                              <p className="text-sm text-gray-600">{doc.type} • {doc.size} • {doc.date}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Market Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Market Demand:</span>
                          <Badge variant={project.marketDemand === 'High' ? 'default' : 'secondary'}>
                            {project.marketDemand}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Competition Level:</span>
                          <Badge variant={project.competition === 'Low' ? 'default' : 'secondary'}>
                            {project.competition}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Investment Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">ROI Projection:</span>
                          <span className="font-bold text-green-600">{project.expectedRoi}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payback Period:</span>
                          <span className="font-medium">5.4 years</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}

