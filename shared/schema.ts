import { pgTable, text, serial, integer, real, timestamp, boolean, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  location: text("location").notNull(),
  city: text("city").notNull(),
  district: text("district").notNull(),
  country: text("country").notNull(),
  sector: text("sector").notNull(), // Real Estate, Hospitality, Retail, etc.
  subsector: text("subsector"), // Luxury Residential, Office Space, etc.
  projectType: text("project_type").notNull(), // Residential, Commercial, Mixed Use, etc.
  contractType: text("contract_type"), // Design-Build, Traditional, etc.
  status: text("status").notNull(), // Planning, Under Construction, Completed, On Hold
  investment: real("investment").notNull(), // in millions USD
  expectedRoi: real("expected_roi"), // percentage
  currentRoi: real("current_roi"), // percentage for completed projects
  size: real("size"), // square feet
  capacity: text("capacity"), // 320 Units, 50,000 sqft, etc.
  residentialType: text("residential_type"), // High-End Apartments, Villas, etc.
  residentialClass: text("residential_class"), // Ultra-Luxury, Premium, etc.
  rating: text("rating"), // 5-Star, A-Grade, etc.
  category: text("category"), // Premium Residential Development, etc.
  value: text("value"), // $450 Million, etc.
  completionDate: text("completion_date"), // Q1 2025, Q2 2026, etc.
  briefBackground: text("brief_background"), // Project background description
  owner: text("owner"), // Project owner/proprietor
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

// Users table for authentication and account management
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  phoneNumber: varchar("phone_number"),
  profileImageUrl: varchar("profile_image_url"),
  passwordHash: varchar("password_hash").notNull(),
  selectedRole: varchar("selected_role"), // investor, contractor, consultant, developer, supplier
  emailNotifications: boolean("email_notifications").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Session storage table for authentication
export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
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

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  createdAt: true,
});

// User profile update schema (excludes password and sensitive fields)
export const updateUserProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().optional(),
  selectedRole: z.enum(["investor", "contractor", "consultant", "developer", "supplier"]).optional(),
  emailNotifications: z.boolean().optional(),
});

// Password change schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Registration schema
export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
  selectedRole: z.enum(["investor", "contractor", "consultant", "developer", "supplier"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
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
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;
export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>;
export type ChangePassword = z.infer<typeof changePasswordSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
