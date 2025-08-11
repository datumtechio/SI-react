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
  Briefcase,
  ChevronDown,
  ChevronUp,
  Flag,
  Edit,
  MessageSquare,
  History,
  Info,
  Home,
  Shield,
  Zap,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  owner: string;
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
    milestones: { name: string; date: string; status: string }[];
  };
  documents: {
    name: string;
    type: string;
    size: string;
    date: string;
  }[];
  landDetails?: {
    availablePlots: number;
    plotSizes: string;
    landPrice: string;
    developmentPotential: string;
    zoningStatus: string;
  };
  demandGap?: {
    level: string;
    officeSpace: string;
    residentialUnits: string;
    retailSpace: string;
    projectedDemand: string;
  };
  growthZone?: {
    status: string;
    growthRate: string;
    infrastructure: string;
    businessHub: string;
    futureProjects: string;
  };
}

export default function ProjectProfile() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/project/:id");
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);

  // State for expandable sections and priority tags
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    relationship: false,
    businessNotes: false,
    competitorAnalysis: false,
  });
  const [priorityTag, setPriorityTag] = useState<string>("Under Review");

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    // Get user role from localStorage
    const role = localStorage.getItem("selectedRole");
    setUserRole(role);

    // Build the proper navigation history based on role and referrer
    const buildNavigationHistory = (currentUserRole: string) => {
      const history = [];

      // Get role-specific paths
      const getRoleSpecificPaths = (role: string) => {
        switch (role) {
          case "investor":
            return {
              resultsPage: "/investor-projects",
              dashboard: "/investor-dashboard",
              homepage: "/",
            };
          case "contractor":
            return {
              resultsPage: "/contractor-projects",
              dashboard: "/contractor-dashboard",
              homepage: "/",
            };
          case "consultant":
            return {
              resultsPage: "/consultant-analysis",
              dashboard: "/consultant-dashboard",
              homepage: "/",
            };
          case "developer":
            return {
              resultsPage: "/developer-opportunities",
              dashboard: "/developer-dashboard",
              homepage: "/",
            };
          case "supplier":
            return {
              resultsPage: "/supplier-opportunities",
              dashboard: "/supplier-dashboard",
              homepage: "/",
            };
          default:
            return {
              resultsPage: "/search",
              dashboard: "/dashboard",
              homepage: "/",
            };
        }
      };

      // Check where user came from
      const previousPage =
        sessionStorage.getItem("previousPage") || document.referrer;

      if (currentUserRole) {
        const paths = getRoleSpecificPaths(currentUserRole);

        // Always build the full navigation path: results → dashboard → homepage
        // This ensures proper role-specific navigation regardless of entry point
        history.push(paths.resultsPage);
        history.push(paths.dashboard);
        history.push(paths.homepage);
      } else {
        // No role: default navigation
        history.push("/dashboard");
        history.push("/");
      }

      return history;
    };

    if (role) {
      const history = buildNavigationHistory(role);
      setNavigationHistory(history);
    }

    if (params?.id) {
      // Mock project data - different projects based on ID
      const projectId = parseInt(params.id);
      let mockProject: ProjectDetails;

      // Define different projects based on ID
      if (projectId === 1) {
        mockProject = {
          id: projectId,
          name: "Dubai Marina Tower",
          description:
            "A distinguished 45-story residential tower positioned at the heart of Dubai Marina, offering unobstructed waterfront views and direct access to the marina promenade. This architectural masterpiece combines luxury living with the vibrant marina lifestyle, featuring premium amenities and contemporary design tailored for discerning residents and investors.",
          sector: "Real Estate",
          subsector: "Luxury Residential",
          projectType: "Residential Tower",
          contractType: "Design-Build",
          status: "Under Construction",
          city: "Dubai",
          country: "United Arab Emirates",
          district: "Dubai Marina",
          investment: 285,
          expectedRoi: 18.5,
          capacity: "420 Units",
          residentialType: "High-End Apartments",
          residentialClass: "Ultra-Luxury",
          rating: "5-Star",
          category: "Premium Residential Development",
          value: "$285 Million",
          startDate: "2024-02-15",
          completionDate: "Q3 2025",
          briefBackground:
            "Strategically located in the prestigious Dubai Marina district, this tower represents a landmark addition to the waterfront skyline. The development capitalizes on the area's transformation into a world-class residential and leisure destination, with direct marina access, proximity to JBR Beach, and integration with the Marina Walk retail and dining precinct. The project targets high-net-worth individuals seeking luxury waterfront living with exceptional rental yields and capital appreciation potential in Dubai's most dynamic residential market.",
          owner: "Marina Holdings Limited",
          developer: "Emaar Properties",
          contractor: "Arabtec Construction",
          consultant: "AECOM Middle East",
          supplier: "Al Ghurair Iron & Steel",
          totalUnits: 420,
          builtUpArea: "95,000 sqm",
          landArea: "15,000 sqm",
          floors: 45,
          riskLevel: "Low",
          marketDemand: "Very High",
          competition: "High",
          permits: [
            "Building Permit",
            "Environmental Clearance",
            "Fire Safety",
            "Municipality Approval",
            "Marine Authority Clearance",
          ],
          amenities: [
            "Infinity Pool",
            "Premium Gym",
            "Spa & Wellness",
            "24/7 Concierge",
            "Valet Parking",
            "Marina Club",
            "Children's Play Area",
            "Private Beach Access",
          ],
          features: [
            "Marina Views",
            "Private Beach Access",
            "Smart Home Technology",
            "Yacht Club Access",
            "Private Balconies",
            "Floor-to-Ceiling Windows",
          ],
          contactInfo: {
            email: "info@dubaimarinatower.ae",
            phone: "+971-4-567-8900",
            website: "www.dubaimarinatower.ae",
          },
          financials: {
            totalBudget: "$285M",
            spentToDate: "$125M",
            remainingBudget: "$160M",
            fundingSources: [
              "Bank Financing (55%)",
              "Developer Equity (30%)",
              "Pre-sales (15%)",
            ],
          },
          timeline: {
            phase: "Construction Phase 2",
            progress: 45,
            milestones: [
              {
                name: "Foundation Complete",
                date: "2024-06-15",
                status: "Completed",
              },
              {
                name: "Structure Phase 1",
                date: "2024-12-20",
                status: "Completed",
              },
              {
                name: "Structure Phase 2",
                date: "2025-04-15",
                status: "In Progress",
              },
              {
                name: "MEP Installation",
                date: "2025-08-30",
                status: "Planned",
              },
              {
                name: "Interior Fit-out",
                date: "2026-02-15",
                status: "Planned",
              },
              {
                name: "Final Completion",
                date: "2026-08-30",
                status: "Planned",
              },
            ],
          },
          documents: [
            {
              name: "Project Master Plan",
              type: "PDF",
              size: "15.2 MB",
              date: "2024-01-10",
            },
            {
              name: "Financial Projections",
              type: "Excel",
              size: "2.8 MB",
              date: "2024-01-10",
            },
            {
              name: "Environmental Impact",
              type: "PDF",
              size: "8.5 MB",
              date: "2024-01-10",
            },
            {
              name: "Building Specifications",
              type: "PDF",
              size: "12.1 MB",
              date: "2024-01-10",
            },
          ],
        };
      } else if (projectId === 3) {
        // Business Bay Commercial Development
        mockProject = {
          id: projectId,
          name: "Business Bay",
          description:
            "Premium mixed-use development strategically positioned in Dubai's central business district, featuring luxury residential towers, Grade A office spaces, and retail facilities. This landmark project capitalizes on the area's rapid transformation into a world-class financial and commercial hub.",
          sector: "Real Estate",
          subsector: "Mixed-Use Development",
          projectType: "Mixed-Use Complex",
          contractType: "Design-Build-Finance",
          status: "Planning Phase",
          city: "Dubai",
          country: "United Arab Emirates",
          district: "Business Bay",
          investment: 520,
          expectedRoi: 19.8,
          capacity: "2.5M sqft",
          rating: "Grade A Development",
          category: "Commercial Mixed-Use Development",
          value: "$520 Million",
          startDate: "2025-06-01",
          completionDate: "Q4 2027",
          briefBackground:
            "Business Bay represents Dubai's next-generation commercial district with strategic positioning along Dubai Canal. The development addresses critical demand gaps in premium office space and luxury residential units while capitalizing on the area's designation as a growing financial zone. With 23 available land plots and medium demand gap levels, this location offers optimal development opportunities in an emerging growth zone with excellent connectivity to DIFC, Downtown Dubai, and Dubai International Airport.",
          owner: "Bay Commercial Investments LLC",
          developer: "Damac Properties",
          contractor: "Bidding Phase",
          consultant: "Arup Middle East",
          supplier: "Bidding Phase",
          totalUnits: 450,
          builtUpArea: "235,000 sqm",
          landArea: "28,500 sqm",
          floors: 55,
          riskLevel: "Medium",
          marketDemand: "Very High",
          competition: "High",
          permits: [
            "Planning Permission",
            "Environmental Impact",
            "Traffic Assessment",
            "Fire Safety",
            "DEWA Approval",
          ],
          amenities: [
            "Business Center",
            "Conference Facilities",
            "Retail Mall",
            "Restaurants",
            "Fitness Center",
            "Parking",
            "Canal Views",
          ],
          features: [
            "Canal Frontage",
            "Metro Connectivity",
            "Smart Building Technology",
            "LEED Gold Certified",
            "Mixed-Use Integration",
          ],
          landDetails: {
            availablePlots: 23,
            plotSizes: "2,000-8,500 sqm",
            landPrice: "$1,650/sqm",
            developmentPotential: "High-rise mixed-use",
            zoningStatus: "Commercial/Residential Mixed-Use",
          },
          demandGap: {
            level: "Medium",
            officeSpace: "45% undersupplied",
            residentialUnits: "30% undersupplied",
            retailSpace: "20% undersupplied",
            projectedDemand: "Growing 18% annually",
          },
          growthZone: {
            status: "Growing",
            growthRate: "22% over 3 years",
            infrastructure: "Metro Line 2 connection",
            businessHub: "Financial services cluster",
            futureProjects: "12 major developments planned",
          },
          contactInfo: {
            email: "development@businessbay.ae",
            phone: "+971-4-432-1000",
            website: "www.businessbaydubai.ae",
          },
          financials: {
            totalBudget: "$520M",
            spentToDate: "$25M",
            remainingBudget: "$495M",
            fundingSources: [
              "Developer Equity (40%)",
              "Bank Financing (45%)",
              "Investment Partners (15%)",
            ],
          },
          timeline: {
            phase: "Planning & Design",
            progress: 15,
            milestones: [
              {
                name: "Planning Approval",
                date: "2025-04-30",
                status: "In Progress",
              },
              {
                name: "Design Finalization",
                date: "2025-08-15",
                status: "Planned",
              },
              {
                name: "Construction Start",
                date: "2025-10-01",
                status: "Planned",
              },
              {
                name: "Structure Complete",
                date: "2026-12-31",
                status: "Planned",
              },
              { name: "Fit-out Phase", date: "2027-08-30", status: "Planned" },
              {
                name: "Project Completion",
                date: "2027-12-15",
                status: "Planned",
              },
            ],
          },
          documents: [
            {
              name: "Master Development Plan",
              type: "PDF",
              size: "35.2 MB",
              date: "2024-12-01",
            },
            {
              name: "Land Analysis Report",
              type: "PDF",
              size: "18.8 MB",
              date: "2024-11-15",
            },
            {
              name: "Market Demand Study",
              type: "PDF",
              size: "22.5 MB",
              date: "2024-11-20",
            },
            {
              name: "Growth Zone Assessment",
              type: "PDF",
              size: "15.1 MB",
              date: "2024-11-25",
            },
          ],
        };
      } else if (projectId === 7) {
        // Solar Power Plant project for contractors
        mockProject = {
          id: projectId,
          name: "Solar Power Plant",
          description:
            "Renewable energy facility with advanced solar technology providing clean energy to over 50,000 homes in Dubai.",
          sector: "Energy",
          subsector: "Renewable Energy",
          projectType: "Solar Power Plant",
          contractType: "EPC Contract",
          status: "Tender Open",
          city: "Dubai",
          country: "United Arab Emirates",
          district: "Dubai South",
          investment: 320,
          expectedRoi: 18.2,
          capacity: "200 MW",
          rating: "Grid-Connected",
          category: "Utility-Scale Solar Development",
          value: "$320 Million",
          startDate: "2025-01-15",
          completionDate: "Q1 2027",
          briefBackground:
            "This utility-scale solar power plant will provide clean energy to over 50,000 homes in Dubai. The project includes advanced photovoltaic technology, energy storage systems, and smart grid integration. Contractors will be responsible for the complete EPC delivery including foundation work, structural installation, electrical systems, and grid connection.",
          owner: "Green Energy Consortium",
          developer: "Dubai Electricity & Water Authority",
          contractor: "Bidding Open",
          consultant: "AECOM Energy",
          supplier: "Bidding Phase",
          totalUnits: 200000,
          builtUpArea: "500 hectares",
          landArea: "500 hectares",
          floors: 1,
          riskLevel: "Medium",
          marketDemand: "High",
          competition: "High",
          permits: [
            "Environmental Clearance",
            "Grid Connection Permit",
            "Construction License",
            "DEWA Approval",
          ],
          amenities: [
            "Control Room",
            "Maintenance Facility",
            "Security Systems",
            "Access Roads",
          ],
          features: [
            "Solar Panels",
            "Energy Storage",
            "Smart Grid",
            "Monitoring Systems",
            "Automated Cleaning",
          ],
          contactInfo: {
            email: "tenders@dewa.gov.ae",
            phone: "+971-4-601-9999",
            website: "www.dewa.gov.ae",
          },
          financials: {
            totalBudget: "$320M",
            spentToDate: "$0M",
            remainingBudget: "$320M",
            fundingSources: [
              "Government Funding (70%)",
              "Green Bonds (20%)",
              "International Financing (10%)",
            ],
          },
          timeline: {
            phase: "Tender Phase",
            progress: 5,
            milestones: [
              {
                name: "Tender Submission",
                date: "2025-02-15",
                status: "Planned",
              },
              { name: "Contract Award", date: "2025-04-01", status: "Planned" },
              {
                name: "Site Preparation",
                date: "2025-06-01",
                status: "Planned",
              },
              {
                name: "Foundation Work",
                date: "2025-09-01",
                status: "Planned",
              },
              {
                name: "Panel Installation",
                date: "2026-03-01",
                status: "Planned",
              },
              {
                name: "Grid Connection",
                date: "2026-12-01",
                status: "Planned",
              },
              {
                name: "Commercial Operation",
                date: "2027-01-15",
                status: "Planned",
              },
            ],
          },
          documents: [
            {
              name: "EPC Tender Documents",
              type: "PDF",
              size: "45.2 MB",
              date: "2024-12-01",
            },
            {
              name: "Technical Specifications",
              type: "PDF",
              size: "28.8 MB",
              date: "2024-12-01",
            },
            {
              name: "Environmental Assessment",
              type: "PDF",
              size: "18.5 MB",
              date: "2024-11-15",
            },
            {
              name: "Grid Connection Study",
              type: "PDF",
              size: "12.1 MB",
              date: "2024-11-20",
            },
          ],
        };
      } else if (projectId === 8) {
        // Metro Extension project for contractors
        mockProject = {
          id: projectId,
          name: "Metro Extension Phase 3",
          description:
            "Advanced metro rail construction project connecting airport to city center with 15 new stations and 25 km of track.",
          sector: "Infrastructure",
          subsector: "Mass Transit",
          projectType: "Metro Rail Construction",
          contractType: "Design-Build-Finance",
          status: "Under Construction",
          city: "Dubai",
          country: "United Arab Emirates",
          district: "Multi-District",
          investment: 680,
          expectedRoi: 16.8,
          capacity: "85 km Track Length",
          rating: "Fully Automated",
          category: "Heavy Rail Transit System",
          value: "$680 Million",
          startDate: "2024-03-01",
          completionDate: "Q4 2026",
          briefBackground:
            "Phase 3 of Dubai Metro extension includes 15 new stations and 25 km of elevated and underground track. This complex project requires expertise in tunnel boring, elevated construction, station architecture, and advanced rail systems. Contractors will handle civil works, structural steel, MEP systems, and track installation with strict safety and quality standards.",
          owner: "Dubai Metro Infrastructure Company",
          developer: "Roads and Transport Authority",
          contractor: "Consolidated Contractors Company",
          consultant: "Systra Engineering",
          supplier: "Alstom Transportation",
          totalUnits: 15,
          builtUpArea: "25 km track",
          landArea: "Various locations",
          floors: 0,
          riskLevel: "High",
          marketDemand: "Critical",
          competition: "Low",
          permits: [
            "Municipal Approvals",
            "Traffic Management",
            "Safety Clearances",
            "Environmental Permits",
          ],
          amenities: [
            "Station Facilities",
            "Park & Ride",
            "Retail Spaces",
            "Maintenance Depot",
          ],
          features: [
            "Underground Tunnels",
            "Elevated Tracks",
            "Modern Stations",
            "Automated Systems",
            "Platform Screen Doors",
          ],
          contactInfo: {
            email: "projects@rta.ae",
            phone: "+971-4-208-0808",
            website: "www.rta.ae",
          },
          financials: {
            totalBudget: "$680M",
            spentToDate: "$280M",
            remainingBudget: "$400M",
            fundingSources: [
              "Government Budget (80%)",
              "Development Bank (15%)",
              "PPP Financing (5%)",
            ],
          },
          timeline: {
            phase: "Main Construction",
            progress: 45,
            milestones: [
              {
                name: "Tunnel Boring Complete",
                date: "2024-08-15",
                status: "Completed",
              },
              {
                name: "Elevated Structure Phase 1",
                date: "2024-12-20",
                status: "Completed",
              },
              {
                name: "Station Construction",
                date: "2025-06-15",
                status: "In Progress",
              },
              {
                name: "Track Installation",
                date: "2025-10-30",
                status: "Planned",
              },
              {
                name: "Systems Testing",
                date: "2026-04-15",
                status: "Planned",
              },
              {
                name: "Commercial Operation",
                date: "2026-12-01",
                status: "Planned",
              },
            ],
          },
          documents: [
            {
              name: "Construction Specifications",
              type: "PDF",
              size: "65.2 MB",
              date: "2024-02-15",
            },
            {
              name: "Safety Management Plan",
              type: "PDF",
              size: "32.8 MB",
              date: "2024-03-01",
            },
            {
              name: "Traffic Management Study",
              type: "PDF",
              size: "24.5 MB",
              date: "2024-02-20",
            },
            {
              name: "Progress Reports",
              type: "PDF",
              size: "18.1 MB",
              date: "2024-12-01",
            },
          ],
        };
      } else if (projectId === 9) {
        // Highway Bridge Construction
        mockProject = {
          id: projectId,
          name: "Highway Bridge Construction",
          description:
            "Major bridge infrastructure project connecting two emirates with advanced engineering",
          sector: "Infrastructure",
          subsector: "Transportation",
          projectType: "Bridge Construction",
          contractType: "Design-Build-Maintain",
          status: "Under Construction",
          city: "Dubai",
          country: "United Arab Emirates",
          district: "Dubai Border",
          investment: 420,
          expectedRoi: 15.8,
          capacity: "8-Lane Bridge",
          rating: "Heavy Traffic",
          category: "Major Infrastructure Project",
          value: "$420 Million",
          startDate: "2024-06-01",
          completionDate: "Q2 2026",
          briefBackground:
            "This strategic bridge project will reduce traffic congestion between Dubai and Sharjah while providing a vital economic corridor. The 2.5km bridge features advanced seismic resistance, smart traffic management systems, and sustainable construction practices. Contractors must demonstrate expertise in marine construction, precast concrete, and complex logistics.",
          owner: "Emirates Bridge Authority",
          developer: "Roads and Transport Authority",
          contractor: "Samsung C&T Corporation",
          consultant: "AECOM Transportation",
          supplier: "China State Construction",
          totalUnits: 1,
          builtUpArea: "2.5 km bridge",
          landArea: "Marine environment",
          floors: 0,
          riskLevel: "High",
          marketDemand: "Critical",
          competition: "Low",
          permits: [
            "Marine Construction",
            "Environmental Impact",
            "Traffic Management",
            "Safety Clearances",
          ],
          amenities: [
            "Emergency Services",
            "Maintenance Access",
            "Traffic Control",
            "Lighting Systems",
          ],
          features: [
            "Seismic Resistant",
            "Smart Traffic Systems",
            "Marine Construction",
            "Precast Concrete",
          ],
          contactInfo: {
            email: "bridges@rta.ae",
            phone: "+971-4-208-0808",
            website: "www.rta.ae",
          },
          financials: {
            totalBudget: "$420M",
            spentToDate: "$180M",
            remainingBudget: "$240M",
            fundingSources: ["Government Budget (90%)", "Federal Grant (10%)"],
          },
          timeline: {
            phase: "Main Construction",
            progress: 40,
            milestones: [
              {
                name: "Foundation Complete",
                date: "2024-09-15",
                status: "Completed",
              },
              {
                name: "Pier Construction",
                date: "2025-02-28",
                status: "In Progress",
              },
              {
                name: "Deck Installation",
                date: "2025-08-30",
                status: "Planned",
              },
              {
                name: "System Integration",
                date: "2026-01-15",
                status: "Planned",
              },
              {
                name: "Traffic Opening",
                date: "2026-04-30",
                status: "Planned",
              },
            ],
          },
          documents: [
            {
              name: "Bridge Design Plans",
              type: "PDF",
              size: "85.2 MB",
              date: "2024-05-15",
            },
            {
              name: "Marine Construction Specs",
              type: "PDF",
              size: "45.8 MB",
              date: "2024-06-01",
            },
            {
              name: "Safety Management Plan",
              type: "PDF",
              size: "28.5 MB",
              date: "2024-06-01",
            },
            {
              name: "Environmental Compliance",
              type: "PDF",
              size: "22.1 MB",
              date: "2024-05-20",
            },
          ],
        };
      } else if (projectId === 10) {
        // Hospital Complex Al Khaleej
        mockProject = {
          id: projectId,
          name: "Hospital Complex Al Khaleej",
          description:
            "State-of-the-art medical facility with 500-bed capacity and specialized departments",
          sector: "Healthcare",
          subsector: "Medical Facilities",
          projectType: "Hospital Construction",
          contractType: "Traditional Contract",
          status: "Tender Open",
          city: "Dubai",
          country: "United Arab Emirates",
          district: "Healthcare City",
          investment: 280,
          expectedRoi: 12.5,
          capacity: "500 Beds",
          rating: "Tier 1 Medical",
          category: "Healthcare Infrastructure",
          value: "$280 Million",
          startDate: "2025-03-01",
          completionDate: "Q4 2026",
          briefBackground:
            "Al Khaleej Hospital will be a comprehensive medical center featuring emergency care, surgery suites, ICU facilities, and specialized departments. The project requires expertise in medical construction standards, clean room environments, advanced MEP systems, and healthcare-specific infrastructure. Contractors must comply with strict medical facility regulations and international healthcare standards.",
          owner: "Al Khaleej Medical Holdings",
          developer: "Dubai Health Authority",
          contractor: "Tender Phase",
          consultant: "HDR Architecture",
          supplier: "Tender Phase",
          totalUnits: 500,
          builtUpArea: "180,000 sqm",
          landArea: "25,000 sqm",
          floors: 12,
          riskLevel: "Medium",
          marketDemand: "High",
          competition: "Medium",
          permits: [
            "Healthcare License",
            "Building Permit",
            "Fire Safety",
            "Medical Equipment",
          ],
          amenities: [
            "Emergency Department",
            "Surgery Suites",
            "ICU",
            "Medical Imaging",
            "Pharmacy",
          ],
          features: [
            "Clean Room Construction",
            "Medical Gas Systems",
            "Emergency Power",
            "Specialized HVAC",
          ],
          contactInfo: {
            email: "projects@dha.gov.ae",
            phone: "+971-4-814-0000",
            website: "www.dha.gov.ae",
          },
          financials: {
            totalBudget: "$280M",
            spentToDate: "$0M",
            remainingBudget: "$280M",
            fundingSources: [
              "Government Funding (80%)",
              "Health Insurance (15%)",
              "Private Investment (5%)",
            ],
          },
          timeline: {
            phase: "Tender Phase",
            progress: 5,
            milestones: [
              {
                name: "Tender Submission",
                date: "2025-02-28",
                status: "Planned",
              },
              { name: "Contract Award", date: "2025-03-31", status: "Planned" },
              {
                name: "Site Preparation",
                date: "2025-05-01",
                status: "Planned",
              },
              {
                name: "Foundation Work",
                date: "2025-08-01",
                status: "Planned",
              },
              {
                name: "Structure Complete",
                date: "2026-04-30",
                status: "Planned",
              },
              {
                name: "MEP Installation",
                date: "2026-08-31",
                status: "Planned",
              },
              {
                name: "Medical Fit-out",
                date: "2026-11-30",
                status: "Planned",
              },
            ],
          },
          documents: [
            {
              name: "Tender Documents",
              type: "PDF",
              size: "125.2 MB",
              date: "2024-12-15",
            },
            {
              name: "Medical Standards",
              type: "PDF",
              size: "85.8 MB",
              date: "2024-12-15",
            },
            {
              name: "MEP Specifications",
              type: "PDF",
              size: "65.5 MB",
              date: "2024-12-15",
            },
            {
              name: "Healthcare Regulations",
              type: "PDF",
              size: "42.1 MB",
              date: "2024-12-10",
            },
          ],
        };
      } else if (projectId === 13) {
        // Dubai Creek Harbour Residences
        mockProject = {
          id: projectId,
          name: "Dubai Creek Harbour Residences",
          description:
            "Waterfront residential development in Dubai Creek Harbour with marina access and luxury amenities",
          sector: "Real Estate",
          subsector: "Luxury Residential",
          projectType: "Residential Complex",
          contractType: "Design-Build",
          status: "Pre-Construction",
          city: "Dubai",
          country: "United Arab Emirates",
          district: "Dubai Creek Harbour",
          investment: 320,
          expectedRoi: 19.2,
          capacity: "580 Units",
          residentialType: "Waterfront Apartments",
          residentialClass: "Premium",
          rating: "4-Star",
          category: "Mixed-Use Waterfront Development",
          value: "$320 Million",
          startDate: "2025-02-01",
          completionDate: "Q1 2026",
          briefBackground:
            "Dubai Creek Harbour Residences offers premium waterfront living with direct marina access and panoramic views of Dubai's skyline. The development features luxury amenities, sustainable design elements, and world-class facilities in one of Dubai's most prestigious waterfront communities.",
          owner: "Creek Harbour Properties Ltd",
          developer: "Dubai Creek Harbour Development Company",
          contractor: "Emaar Construction",
          consultant: "WSP Middle East",
          supplier: "Premium Materials LLC",
          totalUnits: 580,
          builtUpArea: "1,200,000 sq ft",
          landArea: "15 acres waterfront",
          floors: 42,
          riskLevel: "Medium",
          marketDemand: "High",
          competition: "Medium",
          permits: [
            "Marina Development Permit",
            "Environmental Clearance",
            "Construction License",
            "Waterfront Access Rights",
          ],
          features: [
            "Marina Access",
            "Waterfront Views",
            "Luxury Amenities",
            "Sustainable Design",
            "Premium Finishes",
            "Community Facilities",
          ],
          amenities: [
            "Private Marina",
            "Infinity Pool",
            "Spa & Wellness Center",
            "Fine Dining",
            "Retail Plaza",
            "Landscaped Gardens",
          ],
          contactInfo: {
            email: "info@dubaicreekharbour.ae",
            phone: "+971-4-567-9200",
            website: "www.dubaicreekharbour.ae",
          },
          financials: {
            totalBudget: "$320M",
            spentToDate: "$32M",
            remainingBudget: "$288M",
            fundingSources: [
              "Developer Equity: 40%",
              "Bank Financing: 45%",
              "Pre-sales: 15%",
            ],
          },
          timeline: {
            phase: "Pre-Construction",
            progress: 10,
            milestones: [
              {
                name: "Final Approvals",
                date: "2025-01-31",
                status: "In Progress",
              },
              {
                name: "Site Preparation",
                date: "2025-02-28",
                status: "Planned",
              },
              {
                name: "Foundation Work",
                date: "2025-05-01",
                status: "Planned",
              },
              {
                name: "Structure Phase 1",
                date: "2025-09-30",
                status: "Planned",
              },
              {
                name: "MEP Installation",
                date: "2025-12-31",
                status: "Planned",
              },
              {
                name: "Interior Fit-out",
                date: "2026-02-28",
                status: "Planned",
              },
              {
                name: "Project Completion",
                date: "2026-03-31",
                status: "Planned",
              },
            ],
          },
          documents: [
            {
              name: "Master Development Plan",
              type: "PDF",
              size: "95.2 MB",
              date: "2024-11-15",
            },
            {
              name: "Marina Access Guidelines",
              type: "PDF",
              size: "45.8 MB",
              date: "2024-12-01",
            },
            {
              name: "Sustainability Report",
              type: "PDF",
              size: "28.5 MB",
              date: "2024-11-20",
            },
            {
              name: "Amenities Specifications",
              type: "PDF",
              size: "22.1 MB",
              date: "2024-12-05",
            },
          ],
        };
      } else {
        // Default to Azure Residences for other IDs
        mockProject = {
          id: projectId,
          name: "Azure Residences",
          description:
            "Luxury residential development featuring modern amenities and sustainable design principles.",
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
          briefBackground:
            "Azure Residences represents the pinnacle of luxury living in Downtown Dubai, featuring state-of-the-art amenities and world-class architectural design.",
          owner: "Azure Residential Group",
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
          permits: [
            "Building Permit",
            "Environmental Clearance",
            "Fire Safety",
            "Municipality Approval",
          ],
          amenities: [
            "Swimming Pool",
            "Gym",
            "Spa",
            "Concierge",
            "Valet Parking",
            "Sky Lounge",
            "Children's Play Area",
          ],
          features: [
            "Smart Home Technology",
            "Energy Efficient",
            "LEED Certified",
            "Sea View",
            "Private Balconies",
          ],
          contactInfo: {
            email: "info@azureresidences.ae",
            phone: "+971-4-123-4567",
            website: "www.azureresidences.ae",
          },
          financials: {
            totalBudget: "$450M",
            spentToDate: "$240M",
            remainingBudget: "$210M",
            fundingSources: [
              "Bank Financing (60%)",
              "Developer Equity (25%)",
              "Pre-sales (15%)",
            ],
          },
          timeline: {
            phase: "Construction Phase 2",
            progress: 55,
            milestones: [
              {
                name: "Foundation Complete",
                date: "2024-06-15",
                status: "Completed",
              },
              {
                name: "Structure Phase 1",
                date: "2024-12-20",
                status: "Completed",
              },
              {
                name: "Structure Phase 2",
                date: "2025-04-15",
                status: "In Progress",
              },
              {
                name: "MEP Installation",
                date: "2025-08-30",
                status: "Planned",
              },
              {
                name: "Interior Fit-out",
                date: "2026-02-15",
                status: "Planned",
              },
              {
                name: "Final Completion",
                date: "2026-08-30",
                status: "Planned",
              },
            ],
          },
          documents: [
            {
              name: "Project Master Plan",
              type: "PDF",
              size: "15.2 MB",
              date: "2024-01-10",
            },
            {
              name: "Financial Projections",
              type: "Excel",
              size: "2.8 MB",
              date: "2024-01-10",
            },
            {
              name: "Environmental Impact",
              type: "PDF",
              size: "8.5 MB",
              date: "2024-01-10",
            },
            {
              name: "Building Specifications",
              type: "PDF",
              size: "12.1 MB",
              date: "2024-01-10",
            },
          ],
        };
      }

      setProject(mockProject);
      setLoading(false);
    }
  }, [params?.id]);

  const handleBack = () => {
    // Follow the navigation history: Results Page → Dashboard → Homepage
    if (navigationHistory.length > 0) {
      // Get the next page in the navigation sequence
      const nextPage = navigationHistory[0];
      setLocation(nextPage);
    } else {
      // Fallback: go to role-specific dashboard
      const currentRole = localStorage.getItem("selectedRole");
      const fallbackPage = currentRole
        ? `/${currentRole}-dashboard`
        : "/dashboard";
      setLocation(fallbackPage);
    }
  };

  const getRoleSpecificTabs = () => {
    const baseTabs = ["overview", "financials", "timeline"];

    switch (userRole) {
      case "investor":
        return [
          ...baseTabs,
          "analysis",
          "roi-projections",
          "market-comparison",
        ];
      case "contractor":
        return [...baseTabs, "construction", "procurement", "timeline-details"];
      case "consultant":
        return [
          ...baseTabs,
          "market-analysis",
          "feasibility",
          "recommendations",
        ];
      case "developer":
        return [...baseTabs, "development-plan", "zoning", "site-analysis"];
      case "supplier":
        return [
          ...baseTabs,
          "supply-opportunities",
          "material-specs",
          "procurement-schedule",
        ];
      default:
        return [...baseTabs, "stakeholders", "documents", "analysis"];
    }
  };

  const getRoleColor = () => {
    switch (userRole) {
      case "investor":
        return "text-green-600";
      case "contractor":
        return "text-orange-600";
      case "consultant":
        return "text-blue-600";
      case "developer":
        return "text-purple-600";
      case "supplier":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case "investor":
        return <TrendingUp className="w-5 h-5" />;
      case "contractor":
        return <Building className="w-5 h-5" />;
      case "consultant":
        return <BarChart3 className="w-5 h-5" />;
      case "developer":
        return <Target className="w-5 h-5" />;
      case "supplier":
        return <Briefcase className="w-5 h-5" />;
      default:
        return <Building className="w-5 h-5" />;
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
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Under Construction":
        return "bg-blue-100 text-blue-700";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700";
      case "Planned":
        return "bg-gray-100 text-gray-700";
      case "On Hold":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-green-600";
      case "Medium":
        return "text-yellow-600";
      case "High":
        return "text-red-600";
      default:
        return "text-gray-600";
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Project Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The requested project could not be found.
          </p>
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
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-900 px-3 py-2"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-4">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-sm ${
                    userRole === "investor"
                      ? "bg-green-100"
                      : userRole === "contractor"
                        ? "bg-orange-100"
                        : userRole === "consultant"
                          ? "bg-blue-100"
                          : userRole === "developer"
                            ? "bg-purple-100"
                            : userRole === "supplier"
                              ? "bg-orange-100"
                              : "bg-blue-100"
                  }`}
                >
                  <div className={getRoleColor()}>{getRoleIcon()}</div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {project.name}
                  </h1>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span className="font-medium">
                        {project.city}, {project.country}
                      </span>
                    </div>
                    <Badge
                      className={`${getStatusColor(project.status)} px-3 py-1`}
                    >
                      {project.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFavorite}
                className="px-4 py-2"
              >
                <Star
                  className={`w-4 h-4 mr-2 ${isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`}
                />
                {isFavorite ? "Favorited" : "Add to Favorites"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="px-4 py-2"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="px-4 py-2">
                <Download className="w-4 h-4 mr-2" />
                Export Details
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Key Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-8">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-xl">
                  <DollarSign className="w-7 h-7 text-green-600" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Investment
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${project.investment}M
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-8">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <TrendingUp className="w-7 h-7 text-blue-600" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Expected ROI
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {project.expectedRoi}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-8">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Clock className="w-7 h-7 text-purple-600" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Project Progress
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {project.timeline.progress}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-8">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <AlertTriangle
                    className={`w-7 h-7 ${getRiskColor(project.riskLevel)}`}
                  />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Risk Level
                  </p>
                  <p
                    className={`text-2xl font-bold ${getRiskColor(project.riskLevel)}`}
                  >
                    {project.riskLevel}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList
            className={`grid w-full grid-cols-${getRoleSpecificTabs().length} h-12 rounded-xl bg-gray-100 p-1`}
          >
            {getRoleSpecificTabs().map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-lg font-medium"
              >
                {tab
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Project Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-700 mb-8 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Brief Background */}
                  {project.briefBackground && (
                    <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Info className="w-5 h-5 mr-3 text-blue-600" />
                        Project Background
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {project.briefBackground}
                      </p>
                    </div>
                  )}

                  {/* Basic Information - Vertical Layout */}
                  <div className="mb-12">
                    <h4 className="font-semibold text-gray-900 mb-6 flex items-center">
                      <FileText className="w-5 h-5 mr-3 text-gray-600" />
                      Basic Information
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600 font-medium w-32">Status:</span>
                        <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600 font-medium w-32">Sector:</span>
                        <Badge variant="outline">{project.sector}</Badge>
                      </div>
                      {project.subsector && (
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-600 font-medium w-32">Subsector:</span>
                          <span className="font-semibold text-gray-900">{project.subsector}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600 font-medium w-32">Project Type:</span>
                        <span className="font-semibold text-gray-900">{project.projectType}</span>
                      </div>
                      {project.contractType && (
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-600 font-medium w-32">Contract Type:</span>
                          <span className="font-semibold text-gray-900">{project.contractType}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600 font-medium w-32">Completion Date:</span>
                        <span className="font-semibold text-gray-900">{project.completionDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Location & Scale with Map */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
                    {/* Location & Scale */}
                    <div className="space-y-6">
                      <h4 className="font-semibold text-gray-900 mb-6 flex items-center">
                        <MapPin className="w-5 h-5 mr-3 text-red-500" />
                        Location & Scale
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <span className="text-gray-600 font-medium w-32">Country:</span>
                          <span className="font-semibold text-gray-900">{project.country}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-600 font-medium w-32">City:</span>
                          <span className="font-semibold text-gray-900">{project.city}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-600 font-medium w-32">District:</span>
                          <span className="font-semibold text-gray-900">{project.district}</span>
                        </div>
                        {project.capacity && (
                          <div className="flex items-center">
                            <span className="text-gray-600 font-medium w-32">Capacity:</span>
                            <span className="font-semibold text-gray-900">{project.capacity}</span>
                          </div>
                        )}
                        {project.value && (
                          <div className="flex items-center">
                            <span className="text-gray-600 font-medium w-32">Total Value:</span>
                            <span className="font-semibold text-green-600">{project.value}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Satellite Map View */}
                    <div className="space-y-6">
                      <h4 className="font-semibold text-gray-900 mb-6 flex items-center">
                        <svg
                          className="w-5 h-5 mr-3 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                          />
                        </svg>
                        Satellite View
                      </h4>
                      <div className="bg-gray-100 rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm">
                        <div className="relative h-80 bg-gradient-to-br from-green-100 via-green-200 to-blue-200">
                          {/* Simulated satellite view */}
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-green-300/20 to-blue-300/30"></div>

                          {/* Map overlay elements */}
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg shadow-sm">
                            <p className="text-sm font-medium text-gray-800">
                              {project.city}, {project.country}
                            </p>
                          </div>

                          {/* Project location marker */}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="w-6 h-6 bg-red-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                          </div>

                          {/* Zoom controls */}
                          <div className="absolute top-4 right-4 flex flex-col bg-white/90 backdrop-blur rounded-lg shadow-sm">
                            <button className="p-2 hover:bg-gray-100 rounded-t-lg">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                            </button>
                            <div className="border-t border-gray-200"></div>
                            <button className="p-2 hover:bg-gray-100 rounded-b-lg">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M18 12H6"
                                />
                              </svg>
                            </button>
                          </div>

                          {/* Scale indicator */}
                          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg shadow-sm">
                            <div className="flex items-center space-x-2">
                              <div className="w-12 h-1 bg-gray-800"></div>
                              <span className="text-xs font-medium text-gray-800">
                                1 km
                              </span>
                            </div>
                          </div>

                          {/* Map type toggle */}
                          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg shadow-sm">
                            <button className="text-xs font-medium text-gray-800 hover:text-gray-600">
                              Satellite
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>



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

              <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Project Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <Zap className="w-5 h-5 mr-3 text-yellow-500" />
                        Key Features
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {project.features.map((feature, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-sm px-3 py-1"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <Star className="w-5 h-5 mr-3 text-purple-500" />
                        Amenities
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {project.amenities.map((amenity, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-sm px-3 py-1"
                          >
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <Shield className="w-5 h-5 mr-3 text-green-600" />
                        Permits & Approvals
                      </h4>
                      <div className="space-y-3">
                        {project.permits.map((permit, index) => (
                          <div key={index} className="flex items-center py-1">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                            <span className="text-sm text-gray-700 font-medium">
                              {permit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Residential Details */}
                    {(project.residentialType ||
                      project.residentialClass ||
                      project.rating) && (
                      <div className="mt-12">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <Home className="w-5 h-5 mr-3 text-green-600" />
                          Residential Details
                        </h4>
                        <div className="space-y-3">
                          {project.residentialType && (
                            <div className="flex items-center py-2">
                              <span className="text-gray-600 font-medium w-20">Type:</span>
                              <span className="font-semibold text-gray-900">{project.residentialType}</span>
                            </div>
                          )}
                          {project.residentialClass && (
                            <div className="flex items-center py-2">
                              <span className="text-gray-600 font-medium w-20">Class:</span>
                              <span className="font-semibold text-gray-900">{project.residentialClass}</span>
                            </div>
                          )}
                          {project.rating && (
                            <div className="flex items-center py-2">
                              <span className="text-gray-600 font-medium w-20">Rating:</span>
                              <span className="font-semibold text-gray-900 flex items-center">
                                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                                {project.rating}
                              </span>
                            </div>
                          )}
                          {project.category && (
                            <div className="flex items-center py-2">
                              <span className="text-gray-600 font-medium w-20">Category:</span>
                              <span className="font-semibold text-gray-900">{project.category}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Financials Tab */}
          <TabsContent value="financials" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Budget Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-600 font-medium">
                        Total Budget:
                      </span>
                      <span className="text-xl font-bold text-gray-900">
                        {project.financials.totalBudget}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-600 font-medium">
                        Spent to Date:
                      </span>
                      <span className="text-lg font-semibold text-blue-600">
                        {project.financials.spentToDate}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-600 font-medium">
                        Remaining Budget:
                      </span>
                      <span className="text-lg font-semibold text-green-600">
                        {project.financials.remainingBudget}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 mt-6">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full shadow-sm"
                        style={{ width: `${(180 / 350) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 text-center font-medium mt-3">
                      {Math.round((180 / 350) * 100)}% of budget utilized
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Funding Sources
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {project.financials.fundingSources.map((source, index) => (
                      <div
                        key={index}
                        className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <PieChart className="w-6 h-6 text-blue-600 mr-4" />
                        <span className="text-gray-700 font-medium">
                          {source}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-8">
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Project Timeline & Milestones
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-semibold text-gray-700">
                      Current Phase: {project.timeline.phase}
                    </span>
                    <span className="text-sm font-semibold text-gray-700">
                      {project.timeline.progress}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-sm"
                      style={{ width: `${project.timeline.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-5">
                  {project.timeline.milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className="flex items-center p-5 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="mr-5">
                        {milestone.status === "Completed" && (
                          <CheckCircle className="w-7 h-7 text-green-600" />
                        )}
                        {milestone.status === "In Progress" && (
                          <Clock className="w-7 h-7 text-blue-600" />
                        )}
                        {milestone.status === "Planned" && (
                          <Calendar className="w-7 h-7 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {milestone.name}
                        </h4>
                        <p className="text-sm text-gray-600 font-medium">
                          Target Date:{" "}
                          {new Date(milestone.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        className={`${getStatusColor(milestone.status)} px-3 py-1`}
                      >
                        {milestone.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stakeholders Tab */}
          <TabsContent value="stakeholders" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Key Stakeholders
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-5">
                    <div className="flex items-center p-5 border border-blue-200 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors duration-200">
                      <Users className="w-7 h-7 text-blue-700 mr-4" />
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">
                          Project Owner
                        </p>
                        <p className="text-sm text-gray-600 font-medium">
                          {project.owner}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center p-5 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all duration-200">
                      <Award className="w-7 h-7 text-blue-600 mr-4" />
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">
                          Developer
                        </p>
                        <p className="text-sm text-gray-600 font-medium">
                          {project.developer}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center p-5 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all duration-200">
                      <Briefcase className="w-7 h-7 text-orange-600 mr-4" />
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">
                          Main Contractor
                        </p>
                        <p className="text-sm text-gray-600 font-medium">
                          {project.contractor}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center p-5 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all duration-200">
                      <Target className="w-7 h-7 text-purple-600 mr-4" />
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">
                          Consultant
                        </p>
                        <p className="text-sm text-gray-600 font-medium">
                          {project.consultant}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center p-5 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all duration-200">
                      <Building className="w-7 h-7 text-green-600 mr-4" />
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">
                          Main Supplier
                        </p>
                        <p className="text-sm text-gray-600 font-medium">
                          {project.supplier}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-6">
                    <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                      <Mail className="w-6 h-6 text-gray-500 mr-4" />
                      <div>
                        <p className="text-sm text-gray-600 font-medium mb-1">
                          Email
                        </p>
                        <p className="font-semibold text-blue-600">
                          {project.contactInfo.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                      <Phone className="w-6 h-6 text-gray-500 mr-4" />
                      <div>
                        <p className="text-sm text-gray-600 font-medium mb-1">
                          Phone
                        </p>
                        <p className="font-semibold text-gray-900">
                          {project.contactInfo.phone}
                        </p>
                      </div>
                    </div>
                    {project.contactInfo.website && (
                      <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                        <Globe className="w-6 h-6 text-gray-500 mr-4" />
                        <div>
                          <p className="text-sm text-gray-600 font-medium mb-1">
                            Website
                          </p>
                          <p className="font-semibold text-blue-600">
                            {project.contactInfo.website}
                          </p>
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
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <FileText className="w-6 h-6 text-blue-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {doc.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {doc.type} • {doc.size} • {doc.date}
                          </p>
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
                      <Badge
                        variant={
                          project.marketDemand === "High"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {project.marketDemand}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Competition Level:</span>
                      <Badge
                        variant={
                          project.competition === "Low"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {project.competition}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location Rating:</span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
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
                      <span className="font-bold text-green-600">
                        {project.expectedRoi}%
                      </span>
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
                        <p className="text-3xl font-bold text-green-600">
                          {project.expectedRoi}%
                        </p>
                        <p className="text-sm text-gray-600">Expected ROI</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-blue-600">
                          5.4 yrs
                        </p>
                        <p className="text-sm text-gray-600">Payback Period</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-purple-600">
                          $85.2M
                        </p>
                        <p className="text-sm text-gray-600">
                          Net Present Value
                        </p>
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
                        <span className="text-gray-600">
                          vs Similar Projects:
                        </span>
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-700"
                        >
                          +15% ROI
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Market Position:</span>
                        <span className="font-medium text-green-600">
                          Top 10%
                        </span>
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
                    <CardTitle>Construction Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contract Type:</span>
                        <Badge variant="outline">{project.contractType}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Project Status:</span>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Built-up Area:</span>
                        <span className="font-medium">
                          {project.builtUpArea}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Start Date:</span>
                        <span className="font-medium">
                          {new Date(project.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Completion Date:</span>
                        <span className="font-medium">
                          {project.completionDate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contract Value:</span>
                        <span className="font-medium text-green-600">
                          ${project.investment}M
                        </span>
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
                        <p className="text-sm text-gray-600">
                          Q2 2025 - $45M procurement value
                        </p>
                      </div>
                      <div className="border-l-4 border-blue-500 pl-4">
                        <p className="font-medium">MEP Systems</p>
                        <p className="text-sm text-gray-600">
                          Q3 2025 - $28M procurement value
                        </p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4">
                        <p className="font-medium">Finishing Materials</p>
                        <p className="text-sm text-gray-600">
                          Q4 2025 - $32M procurement value
                        </p>
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
                          <div
                            className={`w-3 h-3 rounded-full ${
                              milestone.status === "Completed"
                                ? "bg-green-500"
                                : milestone.status === "In Progress"
                                  ? "bg-orange-500"
                                  : "bg-gray-300"
                            }`}
                          />
                          <div className="flex-1">
                            <p className="font-medium">{milestone.name}</p>
                            <p className="text-sm text-gray-600">
                              {milestone.date}
                            </p>
                          </div>
                          <Badge
                            variant={
                              milestone.status === "Completed"
                                ? "default"
                                : milestone.status === "In Progress"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
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

          {/* Developer specific tabs */}
          {userRole === "developer" && (
            <>
              <TabsContent value="development-plan" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      <span>Development Plan</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Project Type:</span>
                        <Badge variant="outline">{project.projectType}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Development Potential:
                        </span>
                        <span className="font-medium">
                          {project.landDetails?.developmentPotential ||
                            "Mixed-use development"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Zoning Status:</span>
                        <Badge variant="secondary">
                          {project.landDetails?.zoningStatus ||
                            "Commercial/Residential"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Built-up Area:</span>
                        <span className="font-medium">
                          {project.builtUpArea}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Land Area:</span>
                        <span className="font-medium">{project.landArea}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Floors:</span>
                        <span className="font-medium">{project.floors}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="zoning" className="space-y-6">
                {project.landDetails && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-purple-600" />
                        <span>Land & Zoning Analysis</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Available Plots:
                          </span>
                          <span className="font-bold text-purple-600">
                            {project.landDetails.availablePlots} plots
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Plot Sizes:</span>
                          <span className="font-medium">
                            {project.landDetails.plotSizes}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Land Price:</span>
                          <span className="font-medium text-green-600">
                            {project.landDetails.landPrice}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Zoning Classification:
                          </span>
                          <Badge variant="outline">
                            {project.landDetails.zoningStatus}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Development Rights:
                          </span>
                          <span className="font-medium">
                            {project.landDetails.developmentPotential}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="site-analysis" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {project.demandGap && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <BarChart3 className="w-5 h-5 text-purple-600" />
                          <span>Demand Gap Analysis</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Demand Gap Level:
                            </span>
                            <Badge
                              variant={
                                project.demandGap.level === "High"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {project.demandGap.level}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Office Space:</span>
                            <span className="font-medium text-orange-600">
                              {project.demandGap.officeSpace}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Residential Units:
                            </span>
                            <span className="font-medium text-blue-600">
                              {project.demandGap.residentialUnits}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Retail Space:</span>
                            <span className="font-medium text-green-600">
                              {project.demandGap.retailSpace}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Projected Growth:
                            </span>
                            <span className="font-bold text-purple-600">
                              {project.demandGap.projectedDemand}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {project.growthZone && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <TrendingUp className="w-5 h-5 text-purple-600" />
                          <span>Growth Zone Assessment</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Zone Status:</span>
                            <Badge
                              variant={
                                project.growthZone.status === "Growing"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {project.growthZone.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Growth Rate:</span>
                            <span className="font-bold text-green-600">
                              {project.growthZone.growthRate}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Infrastructure:
                            </span>
                            <span className="font-medium">
                              {project.growthZone.infrastructure}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Business Hub:</span>
                            <span className="font-medium">
                              {project.growthZone.businessHub}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Future Projects:
                            </span>
                            <span className="font-medium text-blue-600">
                              {project.growthZone.futureProjects}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </>
          )}

          {/* Default tabs for other roles */}
          {(!userRole ||
            !["investor", "contractor", "developer"].includes(userRole)) && (
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
                        <p className="font-medium text-gray-900">
                          {project.developer}
                        </p>
                      </div>
                      {project.contractor && (
                        <div>
                          <p className="text-sm text-gray-600">Contractor</p>
                          <p className="font-medium text-gray-900">
                            {project.contractor}
                          </p>
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
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center">
                            <FileText className="w-6 h-6 text-blue-600 mr-3" />
                            <div>
                              <p className="font-medium text-gray-900">
                                {doc.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {doc.type} • {doc.size} • {doc.date}
                              </p>
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
                          <Badge
                            variant={
                              project.marketDemand === "High"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {project.marketDemand}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Competition Level:
                          </span>
                          <Badge
                            variant={
                              project.competition === "Low"
                                ? "default"
                                : "secondary"
                            }
                          >
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
                          <span className="font-bold text-green-600">
                            {project.expectedRoi}%
                          </span>
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
