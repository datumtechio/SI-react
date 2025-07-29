import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/ui/header";
import Homepage from "@/pages/homepage";
import RoleSelection from "@/pages/role-selection";
import SearchFilter from "@/pages/search-filter";
import Dashboard from "@/pages/dashboard";
import InvestorSearch from "@/pages/investor-search";
import InvestorDashboard from "@/pages/investor-dashboard";
import InvestorProjects from "@/pages/investor-projects";
import ContractorDashboard from "@/pages/contractor-dashboard";
import ContractorProjects from "@/pages/contractor-projects";
import ConsultantDashboard from "@/pages/consultant-dashboard";
import ConsultantAnalysis from "@/pages/consultant-analysis";
import DeveloperDashboard from "@/pages/developer-dashboard";
import DeveloperOpportunities from "@/pages/developer-opportunities";
import SupplierDashboard from "@/pages/supplier-dashboard";
import SupplierOpportunities from "@/pages/supplier-opportunities";
import ProjectProfile from "@/pages/project-profile";
import AccountSettings from "@/pages/account-settings";
import LoginPage from "@/pages/login";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/useAuth";
import { useLocalStorage } from "@/hooks/useLocalStorage";

function Router() {
  const [location] = useLocation();
  const { user, isLoading } = useAuth();
  const [storedRole] = useLocalStorage("selectedRole", "");
  const [storedUserName] = useLocalStorage("userName", "");
  
  const [userRole, setUserRole] = useState<string>("");
  const [userName, setUserName] = useState<string>("User");

  useEffect(() => {
    // If user is authenticated, use their data
    if (user) {
      setUserRole(user.selectedRole || "");
      setUserName(`${user.firstName} ${user.lastName}`.trim() || "User");
      // Sync with localStorage for compatibility with existing components
      if (user.selectedRole) {
        localStorage.setItem("selectedRole", user.selectedRole);
      }
    } else {
      // Use localStorage values with reactive updates
      if (storedRole) {
        setUserRole(storedRole);
      }

      if (storedUserName) {
        setUserName(storedUserName);
      } else if (storedRole) {
        const roleNames = {
          contractor: "Ahmed",
          investor: "Sarah",
          consultant: "Michael",
          developer: "Fatima",
          supplier: "Omar"
        };
        setUserName(roleNames[storedRole as keyof typeof roleNames] || "User");
      }
    }
  }, [user, storedRole, storedUserName]);

  const showHeaderRole = location !== "/role-selection";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole={showHeaderRole ? userRole : ""} userName={userName} />
      <Switch>
        <Route path="/" component={Homepage} />
        <Route path="/role-selection" component={RoleSelection} />
        <Route path="/search" component={SearchFilter} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/investor-search" component={InvestorSearch} />
        <Route path="/investor-dashboard" component={InvestorDashboard} />
        <Route path="/investor-projects" component={InvestorProjects} />
        <Route path="/contractor-dashboard" component={ContractorDashboard} />
        <Route path="/contractor-projects" component={ContractorProjects} />
        <Route path="/consultant-dashboard" component={ConsultantDashboard} />
        <Route path="/consultant-analysis" component={ConsultantAnalysis} />
        <Route path="/developer-dashboard" component={DeveloperDashboard} />
        <Route path="/developer-opportunities" component={DeveloperOpportunities} />
        <Route path="/supplier-dashboard" component={SupplierDashboard} />
        <Route path="/supplier-opportunities" component={SupplierOpportunities} />
        
        <Route path="/project/:id" component={ProjectProfile} />
        <Route path="/account-settings" component={AccountSettings} />
        <Route path="/login" component={LoginPage} />
        
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
