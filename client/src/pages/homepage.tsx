import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building, Search, MapPin, DollarSign, Calendar } from "lucide-react";

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

export default function Homepage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [, setLocation] = useLocation();

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Building className="text-white" size={16} />
                </div>
                <span className="text-xl font-bold text-gray-900">SECTOR INTELLIGENCE</span>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-primary font-medium">Home</Link>
              <Link href="/role-selection" className="text-gray-600 hover:text-gray-900">About Us</Link>
              <Link href="/search" className="text-gray-600 hover:text-gray-900">Project Intelligence</Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Contact Us</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Sector<br />
                  Intelligence
                </h1>
                <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                  Sector Intelligence is a next-generation market intelligence platform built to unlock business potential across the MENA region
                </p>
              </div>
              
              <Link href="/role-selection">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg rounded-full"
                >
                  Sign Up
                </Button>
              </Link>

              {/* Quick Search */}
              <form onSubmit={handleSearch} className="max-w-lg">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="text"
                    placeholder="Search projects, locations, or sectors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  {searchTerm.trim() && (
                    <Button 
                      type="submit" 
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      Search
                    </Button>
                  )}
                </div>
              </form>
            </div>

            {/* Right Visual */}
            <div className="flex justify-center">
              <div className="w-96 h-96 relative">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center">
                  <div className="w-80 h-80 border-4 border-primary/30 rounded-full flex items-center justify-center">
                    <div className="w-60 h-60 border-2 border-primary/50 rounded-full flex items-center justify-center">
                      <div className="w-40 h-40 bg-primary/20 rounded-full flex items-center justify-center">
                        <Building className="text-primary" size={48} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Trending Sectors */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Market Intelligence</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover trending sectors and investment opportunities across the MENA region
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

          {/* Featured Projects */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Projects</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore high-value investment opportunities and development projects
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <div key={project.id} className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{project.name}</h3>
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