# Million Flights - Flight Booking Application

## Overview

Million Flights is a full-stack flight booking application built with React, Express, and PostgreSQL. The application allows users to search for flights across European airports, view available aircraft fleet, and book flights with a comprehensive booking system including passenger details and payment processing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui components for consistent design
- **State Management**: React hooks with local component state
- **Data Fetching**: TanStack React Query for server state management
- **Maps**: Leaflet for interactive airport maps
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with /api prefix routing
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Development**: Hot reload with Vite middleware integration

### Project Structure
```
├── client/          # React frontend application
├── server/          # Express backend API
├── shared/          # Shared types and schemas
└── migrations/      # Database migration files
```

## Key Components

### Frontend Components
- **FlightSearch**: Airport search with autocomplete functionality
- **FlightResults**: Display available flights with filtering
- **BookingForm**: Multi-step booking process with passenger details
- **FleetPage**: Aircraft information and specifications
- **MapView**: Interactive map showing airport locations
- **AirportSearch**: Reusable airport selection component

### Backend Services
- **Storage Interface**: Abstracted storage layer with in-memory implementation
- **Route Registration**: Centralized route management system
- **Database Connection**: Neon PostgreSQL with connection pooling
- **Development Middleware**: Request logging and error handling

### Data Models
- **Users**: Basic user authentication schema
- **Airports**: European airport database with coordinates
- **Flights**: Flight information with pricing and scheduling
- **Passengers**: Booking passenger details and validation
- **Aircraft**: Fleet management with specifications

## Data Flow

### Flight Search Flow
1. User inputs departure/arrival airports and date
2. Frontend validates inputs and sends search request
3. Backend generates flight options based on criteria
4. Results displayed with sorting and filtering options
5. User selects flight and proceeds to booking

### Booking Process
1. Multi-step form collection (passenger details, payment)
2. Form validation with Zod schemas
3. Booking confirmation with unique ID generation
4. Payment processing integration (Stripe/PayPal ready)

### Real-time Features
- Flight availability updates
- Price change notifications
- Booking status tracking

## External Dependencies

### Payment Processing
- **Stripe**: Credit card processing with React components
- **PayPal**: Alternative payment method integration

### Mapping and Location
- **Leaflet**: Interactive maps for airport visualization
- **OpenStreetMap**: Tile layer for map rendering

### UI/UX Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Replit Integration**: Custom plugins for development environment
- **ESBuild**: Fast bundling for production builds
- **TSX**: TypeScript execution for development

## Deployment Strategy

### Development Environment
- Vite dev server with HMR for frontend
- Express server with TypeScript compilation
- Database migrations through Drizzle Kit
- Environment variable configuration

### Production Build
- Frontend: Vite production build with asset optimization
- Backend: ESBuild bundling with external package handling
- Database: Neon PostgreSQL serverless deployment
- Static assets served through Express middleware

### Environment Configuration
- Development: Local development with file watching
- Production: Optimized builds with proper error handling
- Database: Connection pooling with WebSocket support

### Key Architectural Decisions

1. **Monorepo Structure**: Single repository with clear separation between client, server, and shared code for easier development and deployment.

2. **Type Safety**: Full TypeScript implementation with shared schemas between frontend and backend using Zod validation.

3. **Database Strategy**: Drizzle ORM chosen for type-safe database operations with PostgreSQL for production scalability.

4. **UI Framework**: Shadcn/ui with Radix UI primitives for accessible, customizable components without heavy framework dependencies.

5. **State Management**: React Query for server state with local React state for UI concerns, avoiding unnecessary complexity.

6. **Development Experience**: Vite for fast HMR, integrated with Express for full-stack development in single environment.