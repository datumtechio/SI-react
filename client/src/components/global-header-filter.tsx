import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { FilterOptions } from "@/lib/types";
import { Globe, Building2 } from "lucide-react";

interface GlobalHeaderFilterProps {
  onFilterChange: (filters: { country?: string; sector?: string }) => void;
  initialFilters?: { country?: string; sector?: string };
}

export function GlobalHeaderFilter({ onFilterChange, initialFilters }: GlobalHeaderFilterProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>(initialFilters?.country || "");
  const [selectedSector, setSelectedSector] = useState<string>(initialFilters?.sector || "");

  const { data: filterOptions, isLoading } = useQuery<FilterOptions>({
    queryKey: ["/api/filter-options"],
  });

  useEffect(() => {
    // Load from localStorage on mount
    const savedCountry = localStorage.getItem("globalCountryFilter");
    const savedSector = localStorage.getItem("globalSectorFilter");
    
    if (savedCountry) {
      setSelectedCountry(savedCountry);
    }
    if (savedSector) {
      setSelectedSector(savedSector);
    }
  }, []);

  const handleCountryChange = (value: string) => {
    const country = value === "all" ? "" : value;
    setSelectedCountry(country);
    localStorage.setItem("globalCountryFilter", country);
    onFilterChange({ country, sector: selectedSector });
  };

  const handleSectorChange = (value: string) => {
    const sector = value === "all" ? "" : value;
    setSelectedSector(sector);
    localStorage.setItem("globalSectorFilter", sector);
    onFilterChange({ country: selectedCountry, sector });
  };

  if (isLoading) {
    return (
      <Card className="border-b border-slate-200 rounded-none">
        <CardContent className="py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center">
              <div className="animate-pulse text-slate-500">Loading filters...</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-b border-slate-200 rounded-none bg-gradient-to-r from-slate-50 to-blue-50">
      <CardContent className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="text-primary" size={20} />
              <h2 className="text-sm font-medium text-slate-700">Global Filters</h2>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Label htmlFor="global-country" className="text-sm font-medium text-slate-700 whitespace-nowrap">
                  Country:
                </Label>
                <Select value={selectedCountry || "all"} onValueChange={handleCountryChange}>
                  <SelectTrigger id="global-country" className="w-[200px]">
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {filterOptions?.countries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Label htmlFor="global-sector" className="text-sm font-medium text-slate-700 whitespace-nowrap">
                  Sector:
                </Label>
                <Select value={selectedSector || "all"} onValueChange={handleSectorChange}>
                  <SelectTrigger id="global-sector" className="w-[200px]">
                    <SelectValue placeholder="All Sectors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sectors</SelectItem>
                    {filterOptions?.sectors.map(sector => (
                      <SelectItem key={sector} value={sector}>
                        <div className="flex items-center space-x-2">
                          <Building2 size={14} />
                          <span>{sector}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}