import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  DollarSign, 
  Users, 
  AlertTriangle,
  Target,
  Activity,
  BarChart3
} from "lucide-react";
import { Project } from "@shared/schema";

interface InvestorInsightsProps {
  projects: Project[];
  selectedLocation?: string;
  selectedSector?: string;
  selectedSubSector?: string;
}

export function InvestorInsights({ projects, selectedLocation, selectedSector, selectedSubSector }: InvestorInsightsProps) {
  // Calculate market metrics
  const totalInvestment = projects.reduce((sum, project) => sum + project.investment, 0);
  const averageROI = projects.length > 0 
    ? projects.reduce((sum, project) => sum + (project.expectedRoi || 0), 0) / projects.length 
    : 0;
  
  const statusDistribution = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const investmentRanges = {
    small: projects.filter(p => p.investment < 100).length,
    medium: projects.filter(p => p.investment >= 100 && p.investment < 500).length,
    large: projects.filter(p => p.investment >= 500).length
  };

  // Market gap analysis (simulated based on project data)
  const getMarketGaps = () => {
    const gaps = [];
    
    if (selectedLocation && selectedSector) {
      if (projects.length < 3) {
        gaps.push({
          type: "opportunity",
          title: "Limited Competition",
          description: `Only ${projects.length} active projects in ${selectedLocation} ${selectedSector}`,
          confidence: "High",
          impact: "Major"
        });
      }
      
      if (selectedSubSector === "Regional Mall") {
        gaps.push({
          type: "gap",
          title: "Retail Infrastructure Gap",
          description: "Growing population but limited retail space per capita",
          confidence: "Medium",
          impact: "Significant"
        });
      }
      
      if (averageROI > 20) {
        gaps.push({
          type: "trend",
          title: "High ROI Market",
          description: `Average ROI of ${averageROI.toFixed(1)}% indicates strong market demand`,
          confidence: "High",
          impact: "Positive"
        });
      }
    }
    
    return gaps;
  };

  const marketGaps = getMarketGaps();

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No Data Available</h3>
          <p className="text-slate-600">
            Please select your investment criteria to view market insights and opportunities.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Market Overview Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Projects</p>
                <p className="text-2xl font-bold text-slate-900">{projects.length}</p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Investment</p>
                <p className="text-2xl font-bold text-slate-900">${totalInvestment.toFixed(0)}M</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg. ROI</p>
                <p className="text-2xl font-bold text-slate-900">{averageROI.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Market Confidence</p>
                <p className="text-2xl font-bold text-slate-900">High</p>
              </div>
              <Target className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* District-Level Insights */}
      {selectedLocation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2" size={18} />
              {selectedLocation} Market Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Project Status Distribution */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">Project Pipeline</h4>
                <div className="space-y-2">
                  {Object.entries(statusDistribution).map(([status, count]) => {
                    const percentage = (count / projects.length) * 100;
                    return (
                      <div key={status}>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">{status}</span>
                          <span className="font-medium">{count} projects</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Investment Size Distribution */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">Investment Distribution</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Small (&lt;$100M)</span>
                    <Badge variant="outline">{investmentRanges.small} projects</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Medium ($100M-$500M)</span>
                    <Badge variant="outline">{investmentRanges.medium} projects</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Large (&gt;$500M)</span>
                    <Badge variant="outline">{investmentRanges.large} projects</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Gap Indicators */}
      {marketGaps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2" size={18} />
              Market Gap Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketGaps.map((gap, index) => {
                const getIcon = () => {
                  switch (gap.type) {
                    case "opportunity": return <TrendingUp className="text-green-500" size={16} />;
                    case "gap": return <AlertTriangle className="text-orange-500" size={16} />;
                    case "trend": return <Activity className="text-blue-500" size={16} />;
                    default: return <Target className="text-slate-500" size={16} />;
                  }
                };

                const getBadgeColor = () => {
                  switch (gap.impact) {
                    case "Major": return "bg-green-100 text-green-800";
                    case "Significant": return "bg-orange-100 text-orange-800";
                    case "Positive": return "bg-blue-100 text-blue-800";
                    default: return "bg-slate-100 text-slate-800";
                  }
                };

                return (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
                    <div className="mt-0.5">{getIcon()}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-slate-900">{gap.title}</h4>
                        <div className="flex space-x-2">
                          <Badge variant="outline" className="text-xs">{gap.confidence} Confidence</Badge>
                          <Badge className={`text-xs ${getBadgeColor()}`}>{gap.impact} Impact</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">{gap.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Investment Recommendation */}
      {selectedSector && selectedLocation && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Target className="text-primary mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Investment Recommendation</h4>
                <p className="text-slate-700 mb-3">
                  Based on the current market data for {selectedSector} in {selectedLocation}, we recommend considering 
                  {selectedSubSector ? ` ${selectedSubSector} projects` : ' projects'} with the following criteria:
                </p>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Target ROI: {(averageROI * 0.9).toFixed(1)}% - {(averageROI * 1.1).toFixed(1)}%</li>
                  <li>• Investment range: $100M - $500M for optimal market positioning</li>
                  <li>• Project status: Planning phase for maximum appreciation potential</li>
                  <li>• Market timing: High confidence based on current indicators</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}