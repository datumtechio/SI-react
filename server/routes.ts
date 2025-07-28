import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { searchFiltersSchema, loginSchema, registerSchema, updateUserProfileSchema, changePasswordSchema } from "@shared/schema";
import cookieParser from 'cookie-parser';
import { getSessionFromRequest } from "./auth";

// Middleware to authenticate user
async function authenticateUser(req: any, res: any, next: any) {
  try {
    const sessionId = getSessionFromRequest(req);
    if (!sessionId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const authData = await storage.getValidSession(sessionId);
    if (!authData) {
      return res.status(401).json({ message: "Invalid or expired session" });
    }

    req.user = authData.user;
    req.session = authData.session;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(cookieParser());
  // Get all projects with optional filtering
  app.get("/api/projects", async (req, res) => {
    try {
      const filters = req.query;
      const validatedFilters = searchFiltersSchema.partial().parse(filters);
      const projects = await storage.getProjects(validatedFilters);
      res.json(projects);
    } catch (error) {
      res.status(400).json({ message: "Invalid filter parameters" });
    }
  });

  // Get single project
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project ID" });
    }
  });

  // Get market indicators
  app.get("/api/market-indicators", async (req, res) => {
    try {
      const indicators = await storage.getMarketIndicators();
      res.json(indicators);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch market indicators" });
    }
  });

  // Get user preferences
  app.get("/api/preferences/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const preferences = await storage.getUserPreferences(sessionId);
      if (!preferences) {
        return res.status(404).json({ message: "Preferences not found" });
      }
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch preferences" });
    }
  });

  // Create or update user preferences
  app.post("/api/preferences", async (req, res) => {
    try {
      const { sessionId, ...preferences } = req.body;
      
      const existing = await storage.getUserPreferences(sessionId);
      let result;
      
      if (existing) {
        result = await storage.updateUserPreferences(sessionId, preferences);
      } else {
        result = await storage.createUserPreferences({ sessionId, ...preferences });
      }
      
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Invalid preferences data" });
    }
  });

  // Get filter options (for dropdowns)
  app.get("/api/filter-options", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      
      const countries = Array.from(new Set(projects.map(p => p.country)));
      const sectors = Array.from(new Set(projects.map(p => p.sector)));
      const projectTypes = Array.from(new Set(projects.map(p => p.projectType)));
      const cities = Array.from(new Set(projects.map(p => p.city)));
      const districts = Array.from(new Set(projects.map(p => p.district)));
      const statuses = Array.from(new Set(projects.map(p => p.status)));
      
      // Country-specific city mappings
      const countryToCities: Record<string, string[]> = {
        "United Arab Emirates": [
          "Dubai",
          "Abu Dhabi", 
          "Sharjah",
          "Ajman",
          "Ras Al Khaimah",
          "Fujairah"
        ],
        "Saudi Arabia": [
          "Riyadh",
          "Jeddah",
          "Mecca",
          "Medina",
          "Dammam",
          "Khobar",
          "Tabuk",
          "Buraidah",
          "Khamis Mushait",
          "Hail"
        ]
      };

      // City to district mappings
      const cityToDistricts: Record<string, string[]> = {
        "Dubai": [
          "Downtown Dubai",
          "Dubai Marina",
          "Jumeirah",
          "Business Bay",
          "DIFC",
          "Dubai Hills",
          "Arabian Ranches",
          "Palm Jumeirah"
        ],
        "Abu Dhabi": [
          "Abu Dhabi Island",
          "Al Reem Island",
          "Yas Island",
          "Saadiyat Island",
          "Al Raha",
          "Khalifa City",
          "Mohammed Bin Zayed City"
        ],
        "Riyadh": [
          "King Fahd District",
          "Olaya District",
          "Al Malaz",
          "Diplomatic Quarter",
          "King Abdul Aziz District",
          "Al Worood",
          "Al Nakheel"
        ]
      };
      
      res.json({
        countries,
        sectors,
        projectTypes,
        cities,
        districts,
        statuses,
        countryToCities,
        cityToDistricts
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch filter options" });
    }
  });

  // Get trending sectors
  app.get("/api/trending-sectors", async (req, res) => {
    try {
      const sectors = await storage.getTrendingSectors();
      res.json(sectors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trending sectors" });
    }
  });

  // Investor-specific endpoints
  app.get("/api/cities/:country", async (req, res) => {
    try {
      const { country } = req.params;
      const projects = await storage.getProjects();
      const cities = Array.from(new Set(projects
        .filter(p => p.country === country)
        .map(p => p.city)
      )).sort();
      res.json(cities);
    } catch (error) {
      console.error("Error fetching cities:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/districts/:country/:city", async (req, res) => {
    try {
      const { country, city } = req.params;
      const projects = await storage.getProjects();
      const districts = Array.from(new Set(projects
        .filter(p => p.country === country && p.city === city)
        .map(p => p.district)
      )).sort();
      res.json(districts);
    } catch (error) {
      console.error("Error fetching districts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Authentication Routes
  
  // Register new user
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      // Create new user
      const user = await storage.createUser({
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: userData.password,
        selectedRole: userData.selectedRole,
      });
      
      // Create session
      const session = await storage.createSession(user.id);
      
      // Set cookie
      res.cookie('session', session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
      
      // Return user data (excluding password)
      const { passwordHash, ...userResponse } = user;
      res.status(201).json({ user: userResponse });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid registration data", errors: error.errors });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  // Login user
  app.post("/api/auth/login", async (req, res) => {
    try {
      const loginData = loginSchema.parse(req.body);
      
      // Find user by email
      const user = await storage.getUserByEmail(loginData.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Verify password
      const { verifyPassword } = await import('./auth');
      const isValidPassword = await verifyPassword(loginData.password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Create session
      const session = await storage.createSession(user.id);
      
      // Set cookie
      res.cookie('session', session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
      
      // Return user data (excluding password)
      const { passwordHash, ...userResponse } = user;
      res.json({ user: userResponse });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid login data" });
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Logout user
  app.post("/api/auth/logout", authenticateUser, async (req: any, res) => {
    try {
      const sessionId = getSessionFromRequest(req);
      if (sessionId) {
        await storage.deleteSession(sessionId);
      }
      
      res.clearCookie('session');
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Logout failed" });
    }
  });

  // Get current user
  app.get("/api/auth/me", authenticateUser, async (req: any, res) => {
    try {
      const { passwordHash, ...userResponse } = req.user;
      res.json(userResponse);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user data" });
    }
  });

  // Account Settings Routes
  
  // Update user profile
  app.put("/api/account/profile", authenticateUser, async (req: any, res) => {
    try {
      const updates = updateUserProfileSchema.parse(req.body);
      const updatedUser = await storage.updateUserProfile(req.user.id, updates);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { passwordHash, ...userResponse } = updatedUser;
      res.json(userResponse);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      }
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Change password
  app.put("/api/account/password", authenticateUser, async (req: any, res) => {
    try {
      const passwordData = changePasswordSchema.parse(req.body);
      const success = await storage.changeUserPassword(
        req.user.id,
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      if (!success) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      
      res.json({ message: "Password changed successfully" });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid password data", errors: error.errors });
      }
      console.error("Password change error:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
