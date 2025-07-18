import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Building, Search, TrendingUp, MapPin, DollarSign, Calendar, ArrowRight, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  name: string;
  location: string;
  sector: string;
  status: string;
  investmentValue: number;
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

  // Fetch featured projects (using first 3 from all projects)
  const { data: allProjects = [] } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });
  
  const featuredProjects = allProjects.slice(0, 3);

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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Section */}
      <div className="pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Building className="text-primary" size={48} />
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                Sector Intelligence
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover investment opportunities, market trends, and project insights across real estate and development sectors
            </p>
            
            {/* Quick Search */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  type="text"
                  placeholder="Search projects, locations, or sectors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 text-lg border-2 border-border focus:border-primary"
                />
                <Button 
                  type="submit" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  disabled={!searchTerm.trim()}
                >
                  Search
                </Button>
              </div>
            </form>

            {/* CTA Button */}
            <Link href="/role-selection">
              <Button size="lg" className="px-8 py-3 text-lg">
                <ArrowRight className="mr-2" size={20} />
                Get Started - Select Your Role
              </Button>
            </Link>
          </div>

          {/* Trending Sectors */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-primary" size={24} />
                <h2 className="text-2xl font-bold text-foreground">Trending Sectors</h2>
              </div>
              <Link href="/search">
                <Button variant="outline">View All Sectors</Button>
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingSectors.slice(0, 4).map((sector, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-foreground">{sector.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {sector.growthRate}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Projects:</span>
                        <span className="font-medium">{sector.projectCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg. Value:</span>
                        <span className="font-medium">{formatCurrency(sector.averageValue)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Featured Projects */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Eye className="text-primary" size={24} />
                <h2 className="text-2xl font-bold text-foreground">Featured Projects</h2>
              </div>
              <Link href="/search">
                <Button variant="outline">View All Projects</Button>
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg line-clamp-1">{project.name}</CardTitle>
                      <Badge variant="outline">{project.status}</Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin size={14} className="mr-1" />
                      {project.location}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <DollarSign size={14} className="mr-1 text-primary" />
                        <span className="font-medium">{formatCurrency(project.investmentValue)}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1 text-primary" />
                        <span>{project.completionDate}</span>
                      </div>
                    </div>
                    <Badge className="mt-4" variant="secondary">
                      {project.sector}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Latest Projects */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Building className="text-primary" size={24} />
                <h2 className="text-2xl font-bold text-foreground">Latest Projects</h2>
              </div>
              <Link href="/search">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-foreground line-clamp-1">{project.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {project.status}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MapPin size={14} className="mr-1" />
                      {project.location}
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary">{project.sector}</Badge>
                      <span className="text-sm font-medium text-primary">
                        {formatCurrency(project.investmentValue)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}