import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { MarketIndicator as MarketIndicatorType } from "@shared/schema";
import { cn } from "@/lib/utils";

interface MarketIndicatorProps {
  indicator: MarketIndicatorType;
}

export function MarketIndicator({ indicator }: MarketIndicatorProps) {
  const getIcon = () => {
    switch (indicator.type) {
      case "opportunity":
        return <TrendingUp className="text-green-600" size={20} />;
      case "trend":
        return <TrendingUp className="text-blue-600" size={20} />;
      case "alert":
        return <AlertTriangle className="text-orange-600" size={20} />;
      default:
        return null;
    }
  };

  const getValueColor = () => {
    switch (indicator.type) {
      case "opportunity":
        return "text-green-600";
      case "trend":
        return "text-blue-600";
      case "alert":
        return "text-orange-600";
      default:
        return "text-slate-600";
    }
  };

  return (
    <Card className={cn("market-indicator", indicator.type)}>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              indicator.type === "opportunity" && "bg-green-100",
              indicator.type === "trend" && "bg-blue-100",
              indicator.type === "alert" && "bg-orange-100"
            )}>
              {getIcon()}
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-slate-900">{indicator.title}</h3>
            <p className="text-xs text-slate-600 mt-1">{indicator.description}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className={cn("flex items-center text-xs", getValueColor())}>
            <span className="font-medium">{indicator.value}</span>
            <span className="ml-1">{indicator.valueLabel}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
