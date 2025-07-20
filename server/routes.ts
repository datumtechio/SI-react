import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { searchFiltersSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
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
      
      res.json({
        countries,
        sectors,
        projectTypes,
        cities,
        districts,
        statuses,
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

  const httpServer = createServer(app);
  return httpServer;
}
