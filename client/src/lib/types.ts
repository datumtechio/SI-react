export type UserRole = "investor" | "contractor" | "consultant" | "developer" | "supplier";

export interface FilterOptions {
  countries: string[];
  sectors: string[];
  projectTypes: string[];
  cities: string[];
  districts: string[];
  statuses: string[];
  countryToCities?: Record<string, string[]>;
  cityToDistricts?: Record<string, string[]>;
}

export interface ComparisonProject {
  id: number;
  name: string;
  status: string;
  investment: number;
  expectedRoi?: number;
  currentRoi?: number;
  completionDate: string;
  size: number;
}

export const roleColors = {
  investor: "hsl(142, 76%, 36%)", // green
  contractor: "hsl(45, 93%, 47%)", // orange
  consultant: "hsl(262, 83%, 58%)", // purple
  developer: "hsl(0, 84%, 60%)", // red
  supplier: "hsl(220, 91%, 54%)", // blue
} as const;

export const roleIcons = {
  investor: "chart-line",
  contractor: "hard-hat",
  consultant: "lightbulb",
  developer: "drafting-compass",
  supplier: "truck",
} as const;
