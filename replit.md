# CrossField - Replit Migration

## Overview
CrossField is a Next.js 14 application for curating collaboration opportunities, posts, and news. The app features a public-facing site for browsing content and submitting collaboration requests, plus an admin dashboard for content management and moderation.

**Current State**: Successfully migrated from Vercel to Replit on October 29, 2025. Running on Next.js 14.2.33 with PostgreSQL database.

## Recent Changes

### October 30, 2025 - Homepage Redesign & Navigation Updates
- **Navigation Simplification**: Removed "Home" tab from navigation menu (only Collaborations and News tabs remain)
- **Homepage Hero Update**: Changed hero heading to "The World's First Hub Of Tech and Research Collaborations."
- **Homepage Content**: Simplified homepage to focus on mission statement with prominent "Explore" button
  - Added detailed subtitle: "A one-stop shop for founders and scientists to stay up to date with the latest projects in both academia and the startup world. We curate frontier projects that are pushing the boundaries across scientific fields."
  - Removed posts display, Recent News section, and empty state messages
  - Single prominent "Explore" button that redirects to Collaborations page
- **Authentication Fix**: Updated cookie settings for Replit's cross-origin iframe environment (sameSite: "none", secure: true)

### October 30, 2025 - Monochrome Design System
- **Design Overhaul**: Complete redesign with minimal black and white aesthetic
  - Removed all blue/gradient colors from design system
  - Updated all components (navbar, hero, cards, forms, modals) to use monochrome palette
  - Simplified shadows, borders, and visual effects
  - Clean, sleek, and minimal user interface
- **Modal Improvements**: Fixed Get Updates modal overlay with proper centering and dismiss functionality
- **Accessibility**: Maintained full accessibility compliance (ARIA attributes, label associations, keyboard navigation)

### October 29, 2025 - Vercel to Replit Migration
- **Database Migration**: Converted from SQLite to PostgreSQL to support enums and array fields
- **Configuration Updates**: 
  - Updated package.json scripts to bind to port 5000 and host 0.0.0.0 for Replit compatibility
  - Added Cache-Control headers to next.config.mjs to prevent caching issues in iframe
  - Updated Prisma schema provider from sqlite to postgresql
- **Environment Setup**: Configured Replit secrets for admin authentication (ADMIN_USERNAME, ADMIN_PASSWORD_HASH, ADMIN_JWT_SECRET)
- **Database Schema**: Successfully deployed all models (Collaboration, Post, News, Subscriber) to PostgreSQL with proper enums and array support

## Project Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router, TypeScript, React 18)
- **Styling**: Tailwind CSS with Typography plugin
- **Database**: PostgreSQL (Replit managed) with Prisma ORM
- **Authentication**: JWT-based admin auth using jose library, bcrypt password hashing
- **Forms**: React Hook Form with Zod validation
- **UI Components**: React Icons, React Hot Toast, React Markdown

### Directory Structure
```
src/
  app/
    (authenticated)/admin/      # Protected admin routes
    (site)/                     # Public site routes
      collaborations/
      news/
      posts/
    admin/login/                # Admin login page
    api/                        # API routes
      admin/                    # Admin API endpoints
      collaborations/           # Public collaboration submission
      subscribers/              # Newsletter subscription
  components/
    admin/                      # Admin dashboard components
    [various public components] # Public-facing components
  lib/
    auth.ts                     # JWT authentication utilities
    prisma.ts                   # Prisma client singleton
    collaboration-constants.ts  # Collaboration type definitions
```

### Database Models
- **Collaboration**: Stores collaboration requests with type (RESEARCH, OPEN_SOURCE_PROJECT, STARTUP_COFOUNDER) and status (PENDING, APPROVED, REJECTED)
- **Post**: Blog posts with tags array, slug-based routing
- **News**: News articles with Markdown body, publish dates
- **Subscriber**: Email newsletter subscribers

## Replit-Specific Configuration

### Environment Variables (Secrets)
Required secrets (configured via Replit Secrets):
- `ADMIN_USERNAME`: Admin login username
- `ADMIN_PASSWORD_HASH`: Bcrypt hash of admin password (use `node scripts/generate-admin-hash.js "password"`)
- `ADMIN_JWT_SECRET`: Secret key for JWT token signing
- `DATABASE_URL`: Auto-configured by Replit PostgreSQL

### Port Configuration
- Development: Port 5000, bound to 0.0.0.0
- Production: Port 5000, bound to 0.0.0.0
- Host binding required for Replit's proxy/iframe architecture

### Database Operations
- Schema changes: Use `npx prisma db push` (no migrations directory in use)
- Client regeneration: Automatic on `npm run build`, or manual via `npx prisma generate`
- PostgreSQL connection: Managed via Replit's built-in DATABASE_URL

## Development Workflow

### Local Development
```bash
npm install           # Install dependencies
npx prisma generate  # Generate Prisma client
npm run dev          # Start dev server on port 5000
```

### Deployment
- Deployment type: Autoscale (stateless)
- Build command: `npm run build` (includes Prisma client generation)
- Start command: `npm run start`

## Security Notes
- Admin authentication uses JWT with httpOnly cookies
- Passwords hashed with bcrypt (10 rounds)
- Secrets managed via Replit environment variables (never committed)
- Client/server validation on all forms using Zod schemas

## Known Considerations
- Cross-origin warning in dev logs is expected (Replit's iframe proxy) - informational only, doesn't affect functionality
- Cache-Control headers configured to prevent stale content in Replit's iframe environment
