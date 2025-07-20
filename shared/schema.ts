import { pgTable, text, serial, integer, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  location: text("location").notNull(),
  city: text("city").notNull(),
  district: text("district").notNull(),
  country: text("country").notNull(),
  sector: text("sector").notNull(), // Real Estate, Hospitality, Retail, etc.
  projectType: text("project_type").notNull(), // Residential, Commercial, Mixed Use, etc.
  status: text("status").notNull(), // Planning, Under Construction, Completed, On Hold
  investment: real("investment").notNull(), // in millions USD
  expectedRoi: real("expected_roi"), // percentage
  currentRoi: real("current_roi"), // percentage for completed projects
  size: real("size"), // square feet
  completionDate: text("completion_date"), // Q1 2025, Q2 2026, etc.
  imageUrl: text("image_url"),
  features: text("features").array(), // array of feature strings
  isLuxury: boolean("is_luxury").default(false),
  isWaterfront: boolean("is_waterfront").default(false),
  isSustainable: boolean("is_sustainable").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  selectedRole: text("selected_role"), // investor, contractor, consultant, developer
  savedSearches: text("saved_searches").array().default([]),
  favoriteProjects: integer("favorite_projects").array().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const marketIndicators = pgTable("market_indicators", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // opportunity, trend, alert
  value: text("value").notNull(), // +23%, -8%, etc.
  valueLabel: text("value_label").notNull(), // demand vs supply, new projects Q1, etc.
  location: text("location"),
  sector: text("sector"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
});

export const insertMarketIndicatorSchema = createInsertSchema(marketIndicators).omit({
  id: true,
  createdAt: true,
});

export const searchFiltersSchema = z.object({
  country: z.string().optional(),
  sector: z.string().optional(),
  subSector: z.string().optional(),
  projectType: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  status: z.string().optional(),
  minInvestment: z.number().optional(),
  maxInvestment: z.number().optional(),
  projectSize: z.string().optional(),
  completionTimeline: z.string().optional(),
  isLuxury: z.boolean().optional(),
  isWaterfront: z.boolean().optional(),
  isSustainable: z.boolean().optional(),
});

// Investor-specific search filters
export const investorFiltersSchema = z.object({
  country: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  sector: z.string().optional(),
  subSector: z.string().optional(),
  status: z.enum(["Planning", "Under Construction", "Nearing Completion", "Completed / Operational"]).optional(),
  minInvestment: z.number().optional(),
  maxInvestment: z.number().optional(),
  minRoi: z.number().optional(),
  maxRoi: z.number().optional(),
  completionTimeframe: z.string().optional(),
  riskLevel: z.enum(["Low", "Medium", "High"]).optional(),
  sustainabilityRating: z.string().optional(),
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertMarketIndicator = z.infer<typeof insertMarketIndicatorSchema>;
export type MarketIndicator = typeof marketIndicators.$inferSelect;
export type SearchFilters = z.infer<typeof searchFiltersSchema>;
export type InvestorFilters = z.infer<typeof investorFiltersSchema>;
