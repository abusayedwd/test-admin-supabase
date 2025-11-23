# Next.js Admin Panel for Islamic App

## Project Overview

This is a Next.js-based admin panel application for managing the Islamic App. The system provides comprehensive administrative functionality including user management, report handling, Quran content requests, and mosque management. The application uses Supabase for authentication and database management, and is deployed on Cloudflare Pages.

The admin panel is designed to handle various content quality and user management tasks for the Islamic App, with a focus on reporting systems for AI chatbot responses, AI verse explanations, and hadith content.

## Architecture & Technologies

### Core Technologies
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS with Radix UI primitives
- **Database/Authentication**: Supabase (PostgreSQL + Auth)
- **Deployment**: Cloudflare Pages
- **State Management**: React hooks and client-side state
- **Icons**: Lucide React
- **Form Handling**: React Hook Form with Zod validation
- **Date Handling**: date-fns
- **UI Components**: Radix UI primitives with custom styling

### Key Features
1. **Authentication System**:
   - Admin-only access with role-based permissions
   - Email/password and Google OAuth login
   - Session management via Supabase
   - Admin user table with role-based access

2. **Reporting Management**:
   - Comprehensive reporting system for multiple content types:
     - AI Chatbot messages
     - AI-generated verse explanations
     - Hadith content
   - Report status tracking (Pending, Reviewing, Resolved, Dismissed)
   - Administrative notes and resolution tracking
   - SQL queries for report analysis and management

3. **User Management**:
   - Admin role and permission system
   - User activity monitoring
   - Access control with RLS (Row Level Security)

4. **Content Management**:
   - Quran content requests management
   - Mosque management system
   - Integration with various Islamic content types

### Project Structure
```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── components/        # Reusable UI components
│   ├── dashboard/         # Admin dashboard
│   ├── login/             # Login page
│   └── unauthorized/      # Unauthorized access page
├── lib/                   # Business logic and utilities
│   ├── auth.ts            # Authentication functions
│   ├── supabase/          # Supabase client configuration
│   ├── types/             # TypeScript type definitions
│   └── ...                # Other utilities
├── components/            # UI components
└── ...                    # Configuration files
```

## Building and Running

### Prerequisites
- Node.js (v18 or higher)
- npm, yarn, pnpm, or bun
- Supabase project setup with required tables and RLS policies

### Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Development
To run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Visit [http://localhost:3002](http://localhost:3002) to view the application.

### Production Build
To build the application for production:
```bash
npm run build
```

To run the production server:
```bash
npm start
```

### Deployment to Cloudflare Pages
The application is configured for deployment on Cloudflare Pages:

1. Connect your GitHub repository to Cloudflare Pages
2. Set build configuration:
   - Build command: `npm run build`
   - Build output directory: `.next`
   - Root directory: `/`
3. Set environment variables in the Cloudflare Pages dashboard
4. Deploy automatically on push to main branch

## Development Conventions

### Code Style
- Use TypeScript for type safety
- Follow Next.js App Router conventions
- Use Tailwind CSS for styling with consistent class naming
- Follow component-based architecture with reusable UI elements

### Authentication & Security
- All admin routes must be protected with `requireAdmin` or similar checks
- Use Supabase RLS (Row Level Security) for database access control
- Never expose sensitive data in client-side code
- Always validate and sanitize user inputs

### Database Operations
- Use Supabase client libraries for database interactions
- Implement proper error handling for database operations
- Use server-side functions for privileged operations requiring service role keys
- Follow REST principles for API routes

### Component Development
- Use Radix UI primitives for accessible base components
- Create custom wrapper components with consistent styling
- Implement proper TypeScript interfaces for props
- Follow accessibility best practices (ARIA attributes, keyboard navigation)

### API Routes
- Place API routes in the `app/api` directory
- Implement proper error handling and status codes
- Use async/await for asynchronous operations
- Validate request data and sanitize inputs

### State Management
- Use React hooks for component state management
- Implement custom hooks for reusable logic
- Keep components focused and avoid overly complex state
- Use client-side state for UI interactions and user preferences