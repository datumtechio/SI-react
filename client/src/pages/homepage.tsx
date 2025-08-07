import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building, Search, MapPin, DollarSign, Calendar, Newspaper, TrendingUp, Star } from "lucide-react";
import logoPath from "@assets/Colored SI Logo_1752857295177.png";

interface Project {
  id: string;
  name: string;
  location: string;
  sector: string;
  status: string;
  investment: number;
  completionDate: string;
  description: string;
}

interface Sector {
  name: string;
  projectCount: number;
  growthRate: string;
  averageValue: number;
}

interface HomepageProps {
  userRole?: string;
}

export default function Homepage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [, setLocation] = useLocation();
  
  // Get user role from localStorage with explicit logging
  const userRole = localStorage.getItem("selectedRole") || "";
  console.log("Homepage - detected userRole:", userRole);

  // Fetch latest projects
  const { data: latestProjects = [] } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  // Fetch trending sectors
  const { data: trendingSectors = [] } = useQuery<Sector[]>({
    queryKey: ['/api/trending-sectors'],
  });

  // Featured projects (using first 3 from all projects)
  const featuredProjects = latestProjects.slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const getStartedPath = () => {
    switch (userRole) {
      case "contractor": return "/contractor-dashboard";
      case "investor": return "/investor-dashboard";
      case "consultant": return "/consultant-dashboard";
      case "developer": return "/developer-dashboard";
      case "supplier": return "/supplier-dashboard";
      default: return "/search";
    }
  };

  const getRoleWelcomeMessage = () => {
    const roleNames = {
      contractor: "Ahmed",
      investor: "Sarah",
      consultant: "Michael",
      developer: "Fatima",
      supplier: "Omar"
    };
    
    const name = roleNames[userRole as keyof typeof roleNames] || "User";
    
    switch (userRole) {
      case "contractor":
        return {
          title: `Welcome ${name}!`,
          subtitle: "Discover active projects and bidding opportunities",
          cta: "Find Projects"
        };
      case "investor":
        return {
          title: `Welcome ${name}!`,
          subtitle: "Explore investment opportunities and market trends",
          cta: "Analyze Investments"
        };
      case "consultant":
        return {
          title: `Welcome ${name}!`,
          subtitle: "Access market insights and advisory data",
          cta: "View Market Analysis"
        };
      case "developer":
        return {
          title: `Welcome ${name}!`,
          subtitle: "Find development sites and market gaps",
          cta: "Explore Opportunities"
        };
      case "supplier":
        return {
          title: `Welcome ${name}!`,
          subtitle: "Connect with material and equipment opportunities",
          cta: "Find Supply Opportunities"
        };
      default:
        return {
          title: "Welcome to Sector Intelligence",
          subtitle: "Professional project discovery and market intelligence",
          cta: "Get Started"
        };
    }
  };

  const welcomeData = getRoleWelcomeMessage();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              {welcomeData.title}
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
              {welcomeData.subtitle}
            </p>
            <Button 
              size="lg" 
              onClick={() => setLocation(getStartedPath())}
              className="px-8 py-3 text-lg"
            >
              {welcomeData.cta}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Content Sections */}
      <div className="py-20" style={{ backgroundColor: '#0a1b3d' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Latest Projects */}
          <section className="mb-20">
            <div className="flex items-center justify-between mb-12">
              <div className="text-center flex-1">
                <div className="flex items-center justify-center mb-4">
                  <Newspaper className="w-8 h-8 text-teal-400 mr-3" />
                  <h2 className="text-3xl font-bold text-white">Latest Projects</h2>
                </div>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  Discover the newest investment opportunities and development projects across the MENA region
                </p>
              </div>
              <Link href="/search">
                <Button variant="outline" className="ml-8">
                  View All Projects
                </Button>
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestProjects.slice(0, 6).map((project) => (
                <div key={project.id} className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 
                        className="text-lg font-semibold text-gray-900 line-clamp-1 cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => {
                          sessionStorage.setItem('previousPage', window.location.pathname);
                          setLocation(`/project/${project.id}`);
                        }}
                      >
                        {project.name}
                      </h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {project.status}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <MapPin size={14} className="mr-1" />
                      {project.location}
                    </div>
                    <p className="text-sm text-gray-600 mb-6 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div className="flex items-center">
                        <DollarSign size={14} className="mr-1 text-primary" />
                        <span className="font-medium text-gray-900">{formatCurrency(project.investment * 1000000)}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1 text-primary" />
                        <span className="text-gray-600">{project.completionDate}</span>
                      </div>
                    </div>
                    <span className="inline-block bg-primary/10 text-primary text-xs px-3 py-1 rounded-full">
                      {project.sector}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Trending Sectors */}
          <section className="mb-20 py-16 px-8 rounded-2xl" style={{ backgroundColor: '#00a7b2' }}>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-white mr-3" />
                <h2 className="text-3xl font-bold text-white">Trending Sectors</h2>
              </div>
              <p className="text-lg text-gray-100 max-w-2xl mx-auto">
                Browse the most active investment sectors with growth opportunities
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {trendingSectors.slice(0, 4).map((sector, index) => (
                <div key={index} className="bg-white border border-gray-100 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-gray-900">{sector.name}</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {sector.growthRate}
                    </span>
                  </div>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Projects:</span>
                      <span className="font-medium text-gray-900">{sector.projectCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg. Value:</span>
                      <span className="font-medium text-gray-900">{formatCurrency(sector.averageValue)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Featured Project Profiles */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-yellow-400 mr-3" />
                <h2 className="text-3xl font-bold text-[#ffffff]">Featured Project Profiles</h2>
              </div>
              <p className="text-lg max-w-2xl mx-auto text-[#ffffff]">
                Explore detailed profiles of high-value investment opportunities
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <div key={project.id} className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 
                        className="text-lg font-semibold text-gray-900 line-clamp-1 cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => {
                          sessionStorage.setItem('previousPage', window.location.pathname);
                          setLocation(`/project/${project.id}`);
                        }}
                      >
                        {project.name}
                      </h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {project.status}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <MapPin size={14} className="mr-1" />
                      {project.location}
                    </div>
                    <p className="text-sm text-gray-600 mb-6 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div className="flex items-center">
                        <DollarSign size={14} className="mr-1 text-primary" />
                        <span className="font-medium text-gray-900">{formatCurrency(project.investment * 1000000)}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1 text-primary" />
                        <span className="text-gray-600">{project.completionDate}</span>
                      </div>
                    </div>
                    <span className="inline-block bg-primary/10 text-primary text-xs px-3 py-1 rounded-full">
                      {project.sector}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      {/* Call to Action */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Unlock Market Intelligence?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals accessing real-time market data and investment opportunities across the MENA region.
          </p>
          <Link href="/role-selection">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg rounded-full"
            >
              Get Started Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}