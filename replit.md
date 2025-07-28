# Real Estate Investment Platform

## Overview

This is a full-stack real estate investment platform built with React, TypeScript, Express.js, and PostgreSQL. The application provides role-based dashboards for investors, contractors, consultants, and developers to discover, analyze, and manage real estate projects.

## Recent Changes (July 28, 2025)

- **Project Profile Page**: Created comprehensive project detail page with full project information, stakeholder details, financial data, timeline milestones, and documents
- **Universal Project Linking**: Made project names clickable throughout the platform, linking to detailed project profiles from all modules
- **Clickable Project Names**: Implemented hover effects and navigation for project names in homepage, dashboard widgets, search results, and filtered views
- **Smart Navigation Context**: Added referrer tracking so users can return to their previous page after viewing project details
- **Export Button Standardization**: Unified export button positioning across all dashboards and results pages in page headers
- **Simplified Export Interface**: Replaced multiple download format options with single "Export Result" button for consistent user experience
- **Enhanced Project Details**: Six-tab interface covering overview, financials, timeline, stakeholders, documents, and analysis
- **Interactive Project Features**: Added favorite functionality, sharing capabilities, and comprehensive project metrics display

## User Preferences

Preferred communication style: Simple, everyday language.
Typography: Raleway font family used throughout the application.
Branding colors: #0a1b3d (dark blue), #00a7b2 (teal), #2f3a45 (gray), #f9fafc (light background).
Design reference: Clean, modern design inspired by sectorintelligence.ai with minimalist navigation, split hero layout, and professional typography.
Branding: Custom Sector Intelligence logo featuring an eye with circuit board elements implemented throughout the platform.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **UI Framework**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured error handling
- **Development**: Hot reload with tsx for TypeScript execution

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (configured for Neon Database)
- **Schema**: Type-safe schema definitions with Zod validation
- **Migrations**: Drizzle Kit for schema management

## Key Components

### Role-Based System
The application supports five distinct user roles:
- **Investor**: Focus on ROI analysis, market comparisons, investment reports
- **Contractor**: Access to project pipeline, tender alerts, construction timelines
- **Consultant**: Market analysis, feasibility studies, trend reports
- **Developer**: Site analysis, zoning data, competition mapping
- **Supplier**: Supply opportunities, material demand tracking, procurement schedules

Each role has customized features and data views tailored to their specific needs.

### Project Management
- Comprehensive project database with detailed metadata
- Advanced filtering and search capabilities
- Project comparison tools
- Favorite projects and saved searches
- Export functionality for reports

### Market Intelligence
- Real-time market indicators
- Trend analysis and alerts
- Location-based insights
- Sector-specific data

### User Interface
- Responsive design with mobile-first approach
- Dark/light theme support
- Accessibility features using Radix UI primitives
- Consistent design system with role-based color coding

## Data Flow

1. **Homepage Discovery**: Users start with latest projects, trending sectors, and featured content
2. **Role Selection**: Users select their role which customizes the entire experience
3. **Search & Filter**: Advanced filtering with real-time updates via React Query
4. **Dashboard**: Personalized dashboards with role-specific widgets and data
5. **Project Details**: Detailed project views with comparison capabilities

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for serverless environments
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI component primitives
- **drizzle-orm**: Type-safe ORM with PostgreSQL support
- **zod**: Runtime type validation and schema validation

### Development Tools
- **Vite**: Fast build tool with HMR
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling
- **ESBuild**: Fast bundling for production builds

### UI Components
- Complete shadcn/ui component library
- Custom components for project cards, market indicators
- Form handling with React Hook Form and Zod validation

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: ESBuild bundles Express server to `dist/index.js`
- **Database**: Drizzle migrations in `migrations/` directory

### Environment Configuration
- Development: Hot reload for both frontend and backend
- Production: Optimized builds with static file serving
- Database: PostgreSQL connection via `DATABASE_URL` environment variable

### File Structure
- `client/`: React frontend application
- `server/`: Express.js backend with API routes
- `shared/`: Shared TypeScript schemas and types
- `migrations/`: Database migration files

The application uses a monorepo structure with shared types between frontend and backend, ensuring type safety across the entire stack. The storage layer includes both in-memory implementation for development and database integration for production.