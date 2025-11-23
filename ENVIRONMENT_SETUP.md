# Environment Setup

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Supabase Configuration (DeenHub Project)
NEXT_PUBLIC_SUPABASE_URL=https://gbfgotocraqfbzovzzum.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiZmdvdG9jcmFxZmJ6b3Z6enVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NzA1NTQsImV4cCI6MjA2MjQ0NjU1NH0.HTmRSjrliQghBFyb2C9i-E8u2Qxa1pgbRdA_X3VC7mQ

# Service Role Key (Required for admin operations)
# IMPORTANT: Get this from Supabase Dashboard > Settings > API > service_role key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
```

## Setup Instructions

1. Copy the above content to a new file named `.env.local` in your project root
2. Get the `SUPABASE_SERVICE_ROLE_KEY` from your Supabase project dashboard:
   - Go to Supabase Dashboard
   - Select your "deenhub" project
   - Navigate to Settings > API
   - Copy the `service_role` key (⚠️ Keep this secret!)
3. Generate a random `NEXTAUTH_SECRET` (you can use: `openssl rand -base64 32`)

## Project Details

- **Project Name**: deenhub
- **Project ID**: gbfgotocraqfbzovzzum
- **Region**: ap-southeast-1
- **Status**: ACTIVE_HEALTHY
- **Database Version**: PostgreSQL 15.8.1 