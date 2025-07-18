import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building, Search, MapPin, DollarSign, Calendar } from "lucide-react";
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
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="flex items-center gap-3">
                <img 
                  src={logoPath} 
                  alt="Sector Intelligence Logo" 
                  className="object-contain"
                  style={{ width: '238px', height: '67.51px' }}
                />
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

            
          </div>
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