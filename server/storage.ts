import { projects, userPreferences, marketIndicators, type Project, type InsertProject, type UserPreferences, type InsertUserPreferences, type MarketIndicator, type InsertMarketIndicator, type SearchFilters } from "@shared/schema";

export interface IStorage {
  // Projects
  getProjects(filters?: SearchFilters): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  
  // User Preferences
  getUserPreferences(sessionId: string): Promise<UserPreferences | undefined>;
  createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  updateUserPreferences(sessionId: string, preferences: Partial<InsertUserPreferences>): Promise<UserPreferences | undefined>;
  
  // Market Indicators
  getMarketIndicators(): Promise<MarketIndicator[]>;
  createMarketIndicator(indicator: InsertMarketIndicator): Promise<MarketIndicator>;
}

export class MemStorage implements IStorage {
  private projects: Map<number, Project>;
  private userPreferences: Map<string, UserPreferences>;
  private marketIndicators: Map<number, MarketIndicator>;
  private currentProjectId: number;
  private currentUserPrefId: number;
  private currentIndicatorId: number;

  constructor() {
    this.projects = new Map();
    this.userPreferences = new Map();
    this.marketIndicators = new Map();
    this.currentProjectId = 1;
    this.currentUserPrefId = 1;
    this.currentIndicatorId = 1;
    
    this.seedData();
  }

  private seedData() {
    // Seed projects
    const sampleProjects: InsertProject[] = [
      {
        name: "Azure Residences",
        description: "Luxury residential tower with premium amenities",
        location: "Downtown Dubai",
        city: "Dubai",
        district: "Downtown Dubai",
        country: "United Arab Emirates",
        sector: "Real Estate",
        projectType: "Residential",
        status: "Under Construction",
        investment: 28,
        expectedRoi: 16.2,
        size: 850000,
        completionDate: "Q3 2025",
        imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        features: ["Luxury Finishes", "Gym", "Pool", "Concierge"],
        isLuxury: true,
        isWaterfront: false,
        isSustainable: false,
      },
      {
        name: "Tech Hub Central",
        description: "Modern commercial office complex for tech companies",
        location: "Business Bay",
        city: "Dubai",
        district: "Business Bay",
        country: "United Arab Emirates",
        sector: "Real Estate",
        projectType: "Commercial",
        status: "Planning",
        investment: 85,
        expectedRoi: 21.8,
        size: 1200000,
        completionDate: "Q1 2027",
        imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        features: ["Smart Building", "Co-working Spaces", "Tech Infrastructure", "Conference Centers"],
        isLuxury: false,
        isWaterfront: false,
        isSustainable: true,
      },
      {
        name: "Coastal Resort & Spa",
        description: "Luxury beachfront resort with world-class amenities",
        location: "Jumeirah Beach",
        city: "Dubai",
        district: "Jumeirah",
        country: "United Arab Emirates",
        sector: "Hospitality",
        projectType: "Resort",
        status: "Completed",
        investment: 125,
        currentRoi: 14.6,
        size: 2000000,
        completionDate: "2023",
        imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        features: ["Private Beach", "Spa", "Multiple Restaurants", "Golf Course"],
        isLuxury: true,
        isWaterfront: true,
        isSustainable: false,
      },
      {
        name: "Grand Shopping District",
        description: "Premier retail and entertainment destination",
        location: "Dubai Mall District",
        city: "Dubai",
        district: "Downtown Dubai",
        country: "United Arab Emirates",
        sector: "Retail",
        projectType: "Mixed Use",
        status: "Under Construction",
        investment: 95,
        expectedRoi: 19.4,
        size: 1500000,
        completionDate: "Q4 2025",
        imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        features: ["Retail Spaces", "Entertainment Zone", "Food Court", "Cinema"],
        isLuxury: false,
        isWaterfront: false,
        isSustainable: false,
      },
      {
        name: "Green Valley Communities",
        description: "Sustainable residential development with green spaces",
        location: "Dubai South",
        city: "Dubai",
        district: "Dubai South",
        country: "United Arab Emirates",
        sector: "Real Estate",
        projectType: "Residential",
        status: "Planning",
        investment: 52,
        expectedRoi: 17.9,
        size: 900000,
        completionDate: "Q2 2026",
        imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        features: ["Solar Panels", "Green Spaces", "Community Garden", "Energy Efficient"],
        isLuxury: false,
        isWaterfront: false,
        isSustainable: true,
      },
      {
        name: "Innovation Tower",
        description: "Premium office tower in the financial district",
        location: "DIFC",
        city: "Dubai",
        district: "DIFC",
        country: "United Arab Emirates",
        sector: "Real Estate",
        projectType: "Commercial",
        status: "Under Construction",
        investment: 135,
        expectedRoi: 23.1,
        size: 1800000,
        completionDate: "Q1 2026",
        imageUrl: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        features: ["Premium Office Spaces", "Sky Lobby", "Smart Systems", "Executive Facilities"],
        isLuxury: true,
        isWaterfront: false,
        isSustainable: true,
      }
    ];

    sampleProjects.forEach(project => {
      this.createProject(project);
    });

    // Seed market indicators
    const sampleIndicators: InsertMarketIndicator[] = [
      {
        title: "High Opportunity",
        description: "Retail gap in Business Bay",
        type: "opportunity",
        value: "+23%",
        valueLabel: "demand vs supply",
        location: "Business Bay",
        sector: "Retail",
        isActive: true,
      },
      {
        title: "Market Trend",
        description: "Mixed-use developments rising",
        type: "trend",
        value: "+15%",
        valueLabel: "new projects Q1",
        sector: "Mixed Use",
        isActive: true,
      },
      {
        title: "Market Alert",
        description: "Oversupply in luxury segment",
        type: "alert",
        value: "-8%",
        valueLabel: "price adjustment",
        sector: "Luxury",
        isActive: true,
      }
    ];

    sampleIndicators.forEach(indicator => {
      this.createMarketIndicator(indicator);
    });
  }

  async getProjects(filters?: SearchFilters): Promise<Project[]> {
    let projects = Array.from(this.projects.values());

    if (filters) {
      if (filters.country) {
        projects = projects.filter(p => p.country.toLowerCase().includes(filters.country!.toLowerCase()));
      }
      if (filters.sector && filters.sector !== "All Sectors") {
        projects = projects.filter(p => p.sector === filters.sector);
      }
      if (filters.projectType && filters.projectType !== "All Types") {
        projects = projects.filter(p => p.projectType === filters.projectType);
      }
      if (filters.city && filters.city !== "All Cities") {
        projects = projects.filter(p => p.city === filters.city);
      }
      if (filters.district && filters.district !== "All Districts") {
        projects = projects.filter(p => p.district === filters.district);
      }
      if (filters.status && filters.status !== "All Status") {
        projects = projects.filter(p => p.status === filters.status);
      }
      if (filters.minInvestment) {
        projects = projects.filter(p => p.investment >= filters.minInvestment!);
      }
      if (filters.maxInvestment) {
        projects = projects.filter(p => p.investment <= filters.maxInvestment!);
      }
      if (filters.isLuxury !== undefined) {
        projects = projects.filter(p => p.isLuxury === filters.isLuxury);
      }
      if (filters.isWaterfront !== undefined) {
        projects = projects.filter(p => p.isWaterfront === filters.isWaterfront);
      }
      if (filters.isSustainable !== undefined) {
        projects = projects.filter(p => p.isSustainable === filters.isSustainable);
      }
    }

    return projects;
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const project: Project = {
      ...insertProject,
      id,
      createdAt: new Date(),
      size: insertProject.size || null,
      description: insertProject.description || null,
      isLuxury: insertProject.isLuxury || null,
      isWaterfront: insertProject.isWaterfront || null,
      isSustainable: insertProject.isSustainable || null,
      expectedRoi: insertProject.expectedRoi || null,
      currentRoi: insertProject.currentRoi || null,
      completionDate: insertProject.completionDate || null,
      imageUrl: insertProject.imageUrl || null,
      features: insertProject.features || null,
    };
    this.projects.set(id, project);
    return project;
  }

  async getUserPreferences(sessionId: string): Promise<UserPreferences | undefined> {
    return this.userPreferences.get(sessionId);
  }

  async createUserPreferences(insertPreferences: InsertUserPreferences): Promise<UserPreferences> {
    const id = this.currentUserPrefId++;
    const preferences: UserPreferences = {
      ...insertPreferences,
      id,
      createdAt: new Date(),
      selectedRole: insertPreferences.selectedRole || null,
      savedSearches: insertPreferences.savedSearches || null,
      favoriteProjects: insertPreferences.favoriteProjects || null,
    };
    this.userPreferences.set(insertPreferences.sessionId, preferences);
    return preferences;
  }

  async updateUserPreferences(sessionId: string, updates: Partial<InsertUserPreferences>): Promise<UserPreferences | undefined> {
    const existing = this.userPreferences.get(sessionId);
    if (!existing) return undefined;

    const updated: UserPreferences = {
      ...existing,
      ...updates,
    };
    this.userPreferences.set(sessionId, updated);
    return updated;
  }

  async getMarketIndicators(): Promise<MarketIndicator[]> {
    return Array.from(this.marketIndicators.values()).filter(indicator => indicator.isActive);
  }

  async createMarketIndicator(insertIndicator: InsertMarketIndicator): Promise<MarketIndicator> {
    const id = this.currentIndicatorId++;
    const indicator: MarketIndicator = {
      ...insertIndicator,
      id,
      createdAt: new Date(),
      location: insertIndicator.location || null,
      sector: insertIndicator.sector || null,
      isActive: insertIndicator.isActive !== undefined ? insertIndicator.isActive : null,
    };
    this.marketIndicators.set(id, indicator);
    return indicator;
  }
}

export const storage = new MemStorage();
