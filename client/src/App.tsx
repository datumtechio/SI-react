import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import NotFound from "@/pages/not-found";

function Router() {
  return (
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
      <Route component={NotFound} />
    </Switch>
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
