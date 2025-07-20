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
import ContractorDashboard from "@/pages/contractor-dashboard";
import ContractorProjects from "@/pages/contractor-projects";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Homepage} />
      <Route path="/role-selection" component={RoleSelection} />
      <Route path="/search" component={SearchFilter} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/investor-search" component={InvestorSearch} />
      <Route path="/contractor-dashboard" component={ContractorDashboard} />
      <Route path="/contractor-projects" component={ContractorProjects} />
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
