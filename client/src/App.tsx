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


function Router() {
  const [location] = useLocation();
  const { user, isLoading } = useAuth();
  
  const [userRole, setUserRole] = useState<string>("");
  const [userName, setUserName] = useState<string>("User");
  
  // Clear old localStorage data on first load to reset state
  useEffect(() => {
    // Only clear if there's stale data
    const stored = localStorage.getItem("selectedRole");
    if (stored === "consultant" && location === "/role-selection") {
      localStorage.removeItem("selectedRole");
      localStorage.removeItem("userName");
      setUserRole("");
      setUserName("User");
    }
  }, []);

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
      // Read directly from localStorage
      const storedRole = localStorage.getItem("selectedRole");
      const storedUserName = localStorage.getItem("userName");
      
      console.log("Debug - reading from localStorage:", { storedRole, storedUserName, setTo: storedRole || "empty" });
      
      if (storedRole) {
        console.log("Initial load - setting userRole to:", storedRole);
        setUserRole(storedRole);
      } else {
        console.log("Initial load - no stored role");
        setUserRole(""); // Clear role if nothing stored
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
      } else {
        setUserName("User");
      }
    }
  }, [user, location]); // Include location to trigger updates on navigation

  // Listen for localStorage changes and custom role change events
  useEffect(() => {
    const handleStorageChange = () => {
      if (!user) {
        const storedRole = localStorage.getItem("selectedRole");
        const storedUserName = localStorage.getItem("userName");
        
        console.log("Storage changed:", { storedRole, storedUserName, currentUserRole: userRole });
        
        if (storedRole) {
          console.log("Setting userRole to:", storedRole);
          setUserRole(storedRole);
        } else {
          console.log("No stored role, clearing userRole");
          setUserRole("");
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
        } else {
          setUserName("User");
        }
      }
    };

    // Listen for custom role change event from role selection page
    const handleRoleChanged = () => {
      console.log("Role changed event triggered");
      // Add a small delay to ensure localStorage has been updated
      setTimeout(handleStorageChange, 50);
    };

    // Check every 300ms for changes
    const interval = setInterval(handleStorageChange, 300);
    
    // Listen for custom role change events for immediate updates
    window.addEventListener("roleChanged", handleRoleChanged);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("roleChanged", handleRoleChanged);
    };
  }, [user]);

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
