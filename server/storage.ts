import { projects, userPreferences, marketIndicators, users, sessions, type Project, type InsertProject, type UserPreferences, type InsertUserPreferences, type MarketIndicator, type InsertMarketIndicator, type SearchFilters, type User, type InsertUser, type Session, type InsertSession, type UpdateUserProfile } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, generateSessionId, getSessionExpiry } from "./auth";

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
  
  // Trending Sectors
  getTrendingSectors(): Promise<any[]>;
  
  // User Management
  createUser(userData: { email: string; firstName: string; lastName: string; password: string; selectedRole?: string }): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  updateUserProfile(id: string, updates: UpdateUserProfile): Promise<User | undefined>;
  changeUserPassword(id: string, currentPassword: string, newPassword: string): Promise<boolean>;
  
  // Session Management
  createSession(userId: string): Promise<Session>;
  getSession(sessionId: string): Promise<Session | undefined>;
  deleteSession(sessionId: string): Promise<void>;
  getValidSession(sessionId: string): Promise<{ user: User; session: Session } | null>;
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
        subsector: "Luxury Residential",
        projectType: "Residential Tower",
        contractType: "Design-Build",
        status: "Under Construction",
        investment: 28,
        expectedRoi: 16.2,
        size: 850000,
        capacity: "320 Units",
        residentialType: "High-End Apartments",
        residentialClass: "Ultra-Luxury",
        rating: "5-Star",
        category: "Premium Residential Development",
        value: "$450 Million",
        completionDate: "Q3 2025",
        briefBackground: "Azure Residences represents the pinnacle of luxury living in Downtown Dubai, featuring state-of-the-art amenities and world-class architectural design. The project caters to discerning investors and residents seeking premium lifestyle experiences in one of Dubai's most prestigious locations.",
        imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        features: ["Luxury Finishes", "Infinity Pool", "Premium Gym", "24/7 Concierge", "Valet Parking", "Private Gardens"],
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
      },
      {
        name: "Metro Extension Phase 2",
        description: "Mass transit infrastructure expansion connecting major districts",
        location: "Dubai Metro",
        city: "Dubai",
        district: "Multi-District",
        country: "United Arab Emirates",
        sector: "Infrastructure",
        projectType: "Transportation",
        status: "Under Construction",
        investment: 245,
        expectedRoi: 14.5,
        size: 2500000,
        completionDate: "Q4 2026",
        imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        features: ["Metro Stations", "Rail Lines", "Transit Hubs", "Smart Ticketing"],
        isLuxury: false,
        isWaterfront: false,
        isSustainable: true,
      },
      {
        name: "Solar Power Plant",
        description: "Renewable energy facility with advanced solar technology",
        location: "Dubai South",
        city: "Dubai",
        district: "Dubai South",
        country: "United Arab Emirates",
        sector: "Energy",
        subsector: "Renewable Energy",
        projectType: "Solar Power Plant",
        contractType: "EPC Contract",
        status: "Tender Open",
        investment: 320,
        expectedRoi: 18.2,
        size: 3200000,
        capacity: "200 MW",
        rating: "Grid-Connected",
        category: "Utility-Scale Solar Development",
        value: "$320 Million",
        completionDate: "Q1 2027",
        briefBackground: "This utility-scale solar power plant will provide clean energy to over 50,000 homes in Dubai. The project includes advanced photovoltaic technology, energy storage systems, and smart grid integration. Contractors will be responsible for the complete EPC delivery including foundation work, structural installation, electrical systems, and grid connection.",
        imageUrl: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        features: ["Solar Panels", "Energy Storage", "Smart Grid", "Monitoring Systems"],
        isLuxury: false,
        isWaterfront: false,
        isSustainable: true,
      },
      {
        name: "Metro Extension Phase 3",
        description: "Advanced metro rail construction project connecting airport to city center",
        location: "Dubai Metro Line",
        city: "Dubai",
        district: "Multi-District",
        country: "United Arab Emirates",
        sector: "Infrastructure",
        subsector: "Mass Transit",
        projectType: "Metro Rail Construction",
        contractType: "Design-Build-Finance",
        status: "Under Construction",
        investment: 680,
        expectedRoi: 16.8,
        size: 8500000,
        capacity: "85 km Track Length",
        rating: "Fully Automated",
        category: "Heavy Rail Transit System",
        value: "$680 Million",
        completionDate: "Q4 2026",
        briefBackground: "Phase 3 of Dubai Metro extension includes 15 new stations and 25 km of elevated and underground track. This complex project requires expertise in tunnel boring, elevated construction, station architecture, and advanced rail systems. Contractors will handle civil works, structural steel, MEP systems, and track installation with strict safety and quality standards.",
        imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        features: ["Underground Tunnels", "Elevated Tracks", "Modern Stations", "Automated Systems"],
        isLuxury: false,
        isWaterfront: false,
        isSustainable: true,
      },
      {
        name: "Residential Complex Al Noor",
        description: "Large-scale affordable housing development with modern amenities",
        location: "Al Qusais",
        city: "Dubai",
        district: "Al Qusais",
        country: "United Arab Emirates",
        sector: "Real Estate",
        subsector: "Affordable Housing",
        projectType: "Multi-Family Residential",
        contractType: "Traditional Contract",
        status: "Under Construction",
        investment: 180,
        expectedRoi: 14.2,
        size: 1500000,
        capacity: "800 Units",
        residentialType: "Affordable Apartments",
        residentialClass: "Mid-Range",
        rating: "3-Star",
        category: "Community Housing Development",
        value: "$180 Million",
        completionDate: "Q2 2025",
        briefBackground: "Al Noor Residential Complex is a government-backed affordable housing initiative providing quality homes for middle-income families. The project spans 15 hectares and includes schools, healthcare facilities, and recreational areas. Construction involves 12 residential blocks, parking structures, and community facilities with emphasis on cost-effective building methods and sustainable construction practices.",
        imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        features: ["Community Facilities", "Children's Play Areas", "Sports Courts", "Green Landscaping"],
        isLuxury: false,
        isWaterfront: false,
        isSustainable: true,
      },
      {
        name: "Industrial Warehouse Complex",
        description: "Modern logistics and distribution center with automated systems",
        location: "Dubai South Logistics District",
        city: "Dubai",
        district: "Dubai South",
        country: "United Arab Emirates",
        sector: "Industry",
        subsector: "Logistics & Warehousing",
        projectType: "Industrial Complex",
        contractType: "Fast-Track Construction",
        status: "Tender Open",
        investment: 95,
        expectedRoi: 22.5,
        size: 750000,
        capacity: "500,000 sqft",
        rating: "Grade A",
        category: "Automated Distribution Center",
        value: "$95 Million",
        completionDate: "Q3 2025",
        briefBackground: "State-of-the-art logistics facility designed for e-commerce and distribution operations. Features include automated storage systems, loading docks, temperature-controlled zones, and advanced fire safety systems. The construction requires specialized industrial building techniques, heavy-duty foundations, and integration of automated material handling equipment.",
        imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        features: ["Automated Storage", "Loading Docks", "Climate Control", "Fire Safety Systems"],
        isLuxury: false,
        isWaterfront: false,
        isSustainable: true,
      },
      {
        name: "Manufacturing Hub",
        description: "Advanced manufacturing facility for automotive and aerospace",
        location: "Dubai Industrial City",
        city: "Dubai",
        district: "Dubai Industrial City",
        country: "United Arab Emirates",
        sector: "Industry",
        projectType: "Manufacturing",
        status: "Under Construction",
        investment: 180,
        expectedRoi: 20.1,
        size: 1500000,
        completionDate: "Q2 2026",
        imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        features: ["Production Lines", "Quality Control", "Research Labs", "Logistics Center"],
        isLuxury: false,
        isWaterfront: false,
        isSustainable: true,
      },
      {
        name: "Petrochemical Complex",
        description: "Advanced petrochemical processing facility for refined products",
        location: "Jubail Industrial City",
        city: "Jubail",
        district: "Jubail Industrial City",
        country: "Saudi Arabia",
        sector: "Oil & Gas",
        projectType: "Petrochemical Plants",
        status: "Under Construction",
        investment: 420,
        expectedRoi: 22.5,
        size: 5000000,
        completionDate: "Q3 2027",
        imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        features: ["Processing Units", "Storage Tanks", "Quality Labs", "Safety Systems"],
        isLuxury: false,
        isWaterfront: false,
        isSustainable: false,
      },
      {
        name: "Riyadh Metro Project",
        description: "Comprehensive metro system connecting all major districts in Riyadh",
        location: "Riyadh Metro Network",
        city: "Riyadh",
        district: "Multi-District",
        country: "Saudi Arabia",
        sector: "Infrastructure",
        projectType: "Transportation",
        status: "Nearing Completion",
        investment: 680,
        expectedRoi: 16.8,
        size: 8500000,
        completionDate: "Q2 2025",
        imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        features: ["Metro Lines", "Stations", "Depot Facilities", "Control Systems"],
        isLuxury: false,
        isWaterfront: false,
        isSustainable: true,
      },
      {
        name: "NEOM Smart City Phase 1",
        description: "Futuristic smart city development with renewable energy focus",
        location: "NEOM",
        city: "NEOM",
        district: "The Line",
        country: "Saudi Arabia",
        sector: "Real Estate",
        projectType: "Mixed-use",
        status: "Planning",
        investment: 1200,
        expectedRoi: 28.5,
        size: 12000000,
        completionDate: "Q4 2028",
        imageUrl: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        features: ["Smart Infrastructure", "Renewable Energy", "AI Integration", "Sustainable Design"],
        isLuxury: true,
        isWaterfront: true,
        isSustainable: true,
      },
      {
        id: 9,
        name: "Highway Bridge Construction",
        description: "Major bridge infrastructure project connecting two emirates with advanced engineering",
        location: "Dubai-Sharjah Border",
        city: "Dubai",
        district: "Dubai Border",
        country: "United Arab Emirates",
        sector: "Infrastructure",
        subsector: "Transportation",
        projectType: "Bridge Construction",
        contractType: "Design-Build-Maintain",
        status: "Under Construction",
        investment: 420,
        expectedRoi: 15.8,
        size: 2500000,
        capacity: "8-Lane Bridge",
        rating: "Heavy Traffic",
        category: "Major Infrastructure Project",
        value: "$420 Million",
        completionDate: "Q2 2026",
        briefBackground: "This strategic bridge project will reduce traffic congestion between Dubai and Sharjah while providing a vital economic corridor. The 2.5km bridge features advanced seismic resistance, smart traffic management systems, and sustainable construction practices. Contractors must demonstrate expertise in marine construction, precast concrete, and complex logistics.",
        imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        features: ["Seismic Resistant", "Smart Traffic Systems", "Marine Construction", "Precast Concrete"],
        isLuxury: false,
        isWaterfront: true,
        isSustainable: true,
      },
      {
        id: 10,
        name: "Hospital Complex Al Khaleej",
        description: "State-of-the-art medical facility with 500-bed capacity and specialized departments",
        location: "Dubai Healthcare City",
        city: "Dubai",
        district: "Healthcare City",
        country: "United Arab Emirates",
        sector: "Healthcare",
        subsector: "Medical Facilities",
        projectType: "Hospital Construction",
        contractType: "Traditional Contract",
        status: "Tender Open",
        investment: 280,
        expectedRoi: 12.5,
        size: 1800000,
        capacity: "500 Beds",
        rating: "Tier 1 Medical",
        category: "Healthcare Infrastructure",
        value: "$280 Million",
        completionDate: "Q4 2026",
        briefBackground: "Al Khaleej Hospital will be a comprehensive medical center featuring emergency care, surgery suites, ICU facilities, and specialized departments. The project requires expertise in medical construction standards, clean room environments, advanced MEP systems, and healthcare-specific infrastructure. Contractors must comply with strict medical facility regulations and international healthcare standards.",
        imageUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8eaf8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        features: ["Clean Room Construction", "Medical Gas Systems", "Emergency Power", "Specialized HVAC"],
        isLuxury: false,
        isWaterfront: false,
        isSustainable: true,
      },
      {
        id: 11,
        name: "Shopping Mall Emirates Central", 
        description: "Large-scale retail and entertainment complex with modern architecture",
        location: "Al Barsha",
        city: "Dubai",
        district: "Al Barsha",
        country: "United Arab Emirates",
        sector: "Retail",
        subsector: "Shopping Centers",
        projectType: "Commercial Complex",
        contractType: "Fast-Track Construction",
        status: "Planning",
        investment: 350,
        expectedRoi: 18.9,
        size: 2200000,
        capacity: "300 Retail Units",
        rating: "Regional Mall",
        category: "Commercial Development",
        value: "$350 Million",
        completionDate: "Q1 2027",
        briefBackground: "Emirates Central Mall will feature over 300 retail outlets, entertainment zones, food courts, and a multiplex cinema. The project emphasizes sustainable construction, energy efficiency, and advanced building management systems. Contractors will handle complex retail construction including specialized store fit-outs, large span structures, and integrated parking systems.",
        imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        features: ["Large Span Construction", "Retail Fit-outs", "Entertainment Zones", "Smart Building Systems"],
        isLuxury: false,
        isWaterfront: false,
        isSustainable: true,
      },
      {
        id: 12,
        name: "Data Center Dubai South",
        description: "Tier 3 data center facility with advanced cooling and security systems",
        location: "Dubai South Free Zone",
        city: "Dubai",
        district: "Dubai South",
        country: "United Arab Emirates",
        sector: "Technology",
        subsector: "Data Centers",
        projectType: "Data Center Construction",
        contractType: "EPC Contract",
        status: "Under Construction",
        investment: 150,
        expectedRoi: 22.1,
        size: 500000,
        capacity: "10 MW",
        rating: "Tier 3",
        category: "Critical Infrastructure",
        value: "$150 Million",
        completionDate: "Q3 2025",
        briefBackground: "This mission-critical data center will provide cloud services and enterprise hosting with 99.98% uptime guarantee. The facility features redundant power systems, advanced cooling technology, and military-grade security. Construction requires expertise in raised floor systems, precision cooling, electrical infrastructure, and security installations.",
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240",
        features: ["Raised Floor Systems", "Precision Cooling", "Redundant Power", "Security Systems"],
        isLuxury: false,
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

  async getTrendingSectors(): Promise<any[]> {
    const projects = Array.from(this.projects.values());
    const sectorStats = new Map<string, { projectCount: number; totalValue: number; }>();
    
    // Calculate sector statistics
    projects.forEach(project => {
      const current = sectorStats.get(project.sector) || { projectCount: 0, totalValue: 0 };
      current.projectCount++;
      current.totalValue += project.investment;
      sectorStats.set(project.sector, current);
    });

    // Convert to trending sectors format
    const trendingSectors = Array.from(sectorStats.entries()).map(([name, stats]) => ({
      name,
      projectCount: stats.projectCount,
      growthRate: `+${Math.floor(Math.random() * 25 + 5)}%`, // Simulated growth rate
      averageValue: stats.totalValue / stats.projectCount * 1000000, // Convert to actual currency
    }));

    // Sort by project count descending
    return trendingSectors.sort((a, b) => b.projectCount - a.projectCount);
  }

  // User Management Methods - In-memory implementation for development
  async createUser(userData: { email: string; firstName: string; lastName: string; password: string; selectedRole?: string }): Promise<User> {
    // For development, we'll simulate database behavior
    throw new Error("User creation not available in memory storage - use database storage");
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    throw new Error("User management not available in memory storage - use database storage");
  }

  async getUserById(id: string): Promise<User | undefined> {
    throw new Error("User management not available in memory storage - use database storage");
  }

  async updateUserProfile(id: string, updates: UpdateUserProfile): Promise<User | undefined> {
    throw new Error("User management not available in memory storage - use database storage");
  }

  async changeUserPassword(id: string, currentPassword: string, newPassword: string): Promise<boolean> {
    throw new Error("User management not available in memory storage - use database storage");
  }

  // Session Management Methods - In-memory implementation for development
  async createSession(userId: string): Promise<Session> {
    throw new Error("Session management not available in memory storage - use database storage");
  }

  async getSession(sessionId: string): Promise<Session | undefined> {
    throw new Error("Session management not available in memory storage - use database storage");
  }

  async deleteSession(sessionId: string): Promise<void> {
    throw new Error("Session management not available in memory storage - use database storage");
  }

  async getValidSession(sessionId: string): Promise<{ user: User; session: Session } | null> {
    throw new Error("Session management not available in memory storage - use database storage");
  }
}

// Database Storage Implementation
class DatabaseStorage implements IStorage {
  // Projects
  async getProjects(filters?: SearchFilters): Promise<Project[]> {
    let query = db.select().from(projects);
    // Add filtering logic similar to MemStorage if needed
    return await query;
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  // User Preferences
  async getUserPreferences(sessionId: string): Promise<UserPreferences | undefined> {
    const [prefs] = await db.select().from(userPreferences).where(eq(userPreferences.sessionId, sessionId));
    return prefs;
  }

  async createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const [newPrefs] = await db.insert(userPreferences).values(preferences).returning();
    return newPrefs;
  }

  async updateUserPreferences(sessionId: string, updates: Partial<InsertUserPreferences>): Promise<UserPreferences | undefined> {
    const [updated] = await db
      .update(userPreferences)
      .set(updates)
      .where(eq(userPreferences.sessionId, sessionId))
      .returning();
    return updated;
  }

  // Market Indicators
  async getMarketIndicators(): Promise<MarketIndicator[]> {
    return await db.select().from(marketIndicators).where(eq(marketIndicators.isActive, true));
  }

  async createMarketIndicator(indicator: InsertMarketIndicator): Promise<MarketIndicator> {
    const [newIndicator] = await db.insert(marketIndicators).values(indicator).returning();
    return newIndicator;
  }

  // Trending Sectors
  async getTrendingSectors(): Promise<any[]> {
    const sectors = ["Real Estate", "Infrastructure", "Hospitality", "Energy"];
    return sectors.map(sector => ({
      name: sector,
      projectCount: Math.floor(Math.random() * 10) + 5,
      growth: Math.floor(Math.random() * 30) + 10,
      averageRoi: Math.floor(Math.random() * 15) + 15
    }));
  }

  // User Management Methods
  async createUser(userData: { email: string; firstName: string; lastName: string; password: string; selectedRole?: string }): Promise<User> {
    const passwordHash = await hashPassword(userData.password);
    const newUser: InsertUser = {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      passwordHash,
      selectedRole: userData.selectedRole || null,
      phoneNumber: null,
      profileImageUrl: null,
      emailNotifications: true,
    };
    
    const [user] = await db.insert(users).values(newUser).returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async updateUserProfile(id: string, updates: UpdateUserProfile): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async changeUserPassword(id: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = await this.getUserById(id);
    if (!user) return false;

    const isValidPassword = await verifyPassword(currentPassword, user.passwordHash);
    if (!isValidPassword) return false;

    const newPasswordHash = await hashPassword(newPassword);
    await db
      .update(users)
      .set({ passwordHash: newPasswordHash, updatedAt: new Date() })
      .where(eq(users.id, id));
    
    return true;
  }

  // Session Management Methods
  async createSession(userId: string): Promise<Session> {
    const sessionData: InsertSession = {
      id: generateSessionId(),
      userId,
      expiresAt: getSessionExpiry(),
    };
    
    const [session] = await db.insert(sessions).values(sessionData).returning();
    return session;
  }

  async getSession(sessionId: string): Promise<Session | undefined> {
    const [session] = await db.select().from(sessions).where(eq(sessions.id, sessionId));
    return session;
  }

  async deleteSession(sessionId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
  }

  async getValidSession(sessionId: string): Promise<{ user: User; session: Session } | null> {
    const session = await this.getSession(sessionId);
    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await this.deleteSession(sessionId);
      }
      return null;
    }

    const user = await this.getUserById(session.userId);
    if (!user) {
      await this.deleteSession(sessionId);
      return null;
    }

    return { user, session };
  }
}

// Use MemStorage for demo with sample projects, but extend it with database user features
class HybridStorage extends MemStorage {
  private dbStorage = new DatabaseStorage();

  // Use database for user management
  async createUser(userData: { email: string; firstName: string; lastName: string; password: string; selectedRole?: string }): Promise<User> {
    return this.dbStorage.createUser(userData);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.dbStorage.getUserByEmail(email);
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.dbStorage.getUserById(id);
  }

  async updateUserProfile(id: string, updates: UpdateUserProfile): Promise<User | undefined> {
    return this.dbStorage.updateUserProfile(id, updates);
  }

  async changeUserPassword(id: string, currentPassword: string, newPassword: string): Promise<boolean> {
    return this.dbStorage.changeUserPassword(id, currentPassword, newPassword);
  }

  async createSession(userId: string): Promise<Session> {
    return this.dbStorage.createSession(userId);
  }

  async getSession(sessionId: string): Promise<Session | undefined> {
    return this.dbStorage.getSession(sessionId);
  }

  async deleteSession(sessionId: string): Promise<void> {
    return this.dbStorage.deleteSession(sessionId);
  }

  async getValidSession(sessionId: string): Promise<{ user: User; session: Session } | null> {
    return this.dbStorage.getValidSession(sessionId);
  }
}

export const storage = new HybridStorage();
