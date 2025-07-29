import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  Home, 
  LayoutDashboard, 
  Building2, 
  LogOut,
  User,
  Settings
} from "lucide-react";

interface HeaderProps {
  userRole?: string;
  userName?: string;
}

export default function Header({ userRole, userName = "User" }: HeaderProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getRoleBadgeStyles = (role: string) => {
    switch (role) {
      case "investor":
        return "text-green-700 bg-green-100 border border-green-200";
      case "contractor":
        return "text-orange-700 bg-orange-100 border border-orange-200";
      case "consultant":
        return "text-blue-700 bg-blue-100 border border-blue-200";
      case "developer":
        return "text-purple-700 bg-purple-100 border border-purple-200";
      case "supplier":
        return "text-blue-700 bg-blue-100 border border-blue-200";
      default:
        return "text-gray-700 bg-gray-100 border border-gray-200";
    }
  };

  const handleLogout = () => {
    // For now, just clear localStorage and stay on current page
    // In a full auth system, this would call the logout API
    localStorage.removeItem("selectedRole");
    localStorage.removeItem("supplierOpportunityFilters");
    localStorage.removeItem("userName");
    window.location.href = "/role-selection";
  };

  // Get role-specific navigation paths
  const getRoleBasedPaths = () => {
    switch (userRole) {
      case "investor":
        return {
          home: "/",
          dashboard: "/investor-dashboard",
          projects: "/investor-projects"
        };
      case "contractor":
        return {
          home: "/",
          dashboard: "/contractor-dashboard", 
          projects: "/contractor-projects"
        };
      case "consultant":
        return {
          home: "/",
          dashboard: "/consultant-dashboard",
          projects: "/consultant-analysis"
        };
      case "developer":
        return {
          home: "/",
          dashboard: "/developer-dashboard",
          projects: "/developer-opportunities"
        };
      case "supplier":
        return {
          home: "/",
          dashboard: "/supplier-dashboard",
          projects: "/supplier-opportunities"
        };
      default:
        return {
          home: "/",
          dashboard: "/dashboard",
          projects: "/search"
        };
    }
  };

  const rolePaths = getRoleBasedPaths();



  const isActivePath = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const navigationLinks = [
    {
      label: "Home",
      path: rolePaths.home,
      icon: Home
    },
    {
      label: "Dashboard",
      path: rolePaths.dashboard,
      icon: LayoutDashboard
    },
    {
      label: "Projects",
      path: rolePaths.projects,
      icon: Building2
    },
    {
      label: "Account",
      path: "/account-settings",
      icon: Settings
    }
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="hidden sm:block text-xl font-bold text-gray-900">
                Sector Intelligence
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => {
              const Icon = link.icon;
              const isActive = isActivePath(link.path);
              
              return (
                <Link key={link.path} href={link.path}>
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}>
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* User Account Section */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <User className="w-4 h-4" />
                <span>Welcome, {userName}</span>
              </div>
              {userRole && (
                <div className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getRoleBadgeStyles(userRole)}`}>
                  {userRole}
                </div>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
              {/* Mobile User Info */}
              <div className="px-3 py-2 border-b border-gray-100 mb-2">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <User className="w-4 h-4" />
                  <span>Welcome, {userName}</span>
                </div>
                {userRole && (
                  <div className="mt-1">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getRoleBadgeStyles(userRole)}`}>
                      {userRole}
                    </span>
                  </div>
                )}
              </div>

              {/* Mobile Navigation Links */}
              {navigationLinks.map((link) => {
                const Icon = link.icon;
                const isActive = isActivePath(link.path);
                
                return (
                  <Link key={link.path} href={link.path}>
                    <div 
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium ${
                        isActive 
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{link.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}