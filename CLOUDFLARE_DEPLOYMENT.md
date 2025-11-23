# Cloudflare Pages Deployment Guide

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **GitHub Repository**: Your code must be in a GitHub repository
3. **Environment Variables**: Have your Supabase credentials ready

## Deployment Steps

### 1. Connect GitHub Repository

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** in the sidebar
3. Click **"Create a project"**
4. Choose **"Connect to Git"**
5. Authorize Cloudflare to access your GitHub account
6. Select your repository: `islamic_app_amdin_panel`

### 2. Configure Build Settings

Set the following build configuration:

- **Production branch**: `main`
- **Build command**: `npm run build`
- **Build output directory**: `.next`
- **Root directory**: `/` (leave empty if project is in root)

### 3. Environment Variables

In the Cloudflare Pages dashboard, go to **Settings > Environment variables** and add:

**Production Variables:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://gbfgotocraqfbzovzzum.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiZmdvdG9jcmFxZmJ6b3Z6enVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NzA1NTQsImV4cCI6MjA2MjQ0NjU1NH0.HTmRSjrliQghBFyb2C9i-E8u2Qxa1pgbRdA_X3VC7mQ
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiZmdvdG9jcmFxZmJ6b3Z6enVtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Njg3MDU1NCwiZXhwIjoyMDYyNDQ2NTU0fQ.eUDmNxXdqy5TnJmhXkLcQ3Pa3pKgQbPeWAiWXZVojaQ
NEXTAUTH_SECRET=your_random_secret_here_for_production
```

**Preview Variables:**
- Copy the same variables for preview/staging environments

### 4. Update Next.js Configuration

For Cloudflare Pages, update `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove 'output: export' for API routes to work
  images: {
    unoptimized: true
  },
  // Add Cloudflare-specific optimizations
  experimental: {
    runtime: 'edge', // Optional: Use edge runtime for better performance
  },
};

export default nextConfig;
```

### 5. Deploy

1. Click **"Save and Deploy"**
2. Cloudflare will automatically build and deploy your app
3. You'll get a URL like: `https://islamic-app-admin-panel.pages.dev`

### 6. Custom Domain (Optional)

1. In Cloudflare Pages dashboard, go to **Custom domains**
2. Click **"Set up a custom domain"**
3. Enter your domain (e.g., `admin.yourdomain.com`)
4. Follow the DNS configuration steps

## Important Notes

### API Routes Support
- ✅ **Cloudflare Pages supports Next.js API routes** with the new runtime
- ✅ **Server-side rendering (SSR)** is supported
- ✅ **Environment variables** work correctly

### Database Connections
- ✅ **Supabase connections** work from Cloudflare edge
- ✅ **Service role key** is securely handled in environment variables
- ✅ **RLS policies** remain enforced for security

### Performance Benefits
- 🚀 **Global CDN**: Your app loads fast worldwide
- 🚀 **Edge computing**: Server functions run close to users
- 🚀 **Automatic scaling**: Handles traffic spikes automatically

## Troubleshooting

### Build Failures
1. Check build logs in Cloudflare dashboard
2. Ensure all dependencies are in `package.json`
3. Verify environment variables are set correctly

### API Route Issues
1. Make sure `next.config.ts` doesn't have `output: 'export'`
2. Check that API routes use proper Next.js App Router syntax
3. Verify Supabase service role key is set

### Database Connection Issues
1. Verify Supabase project is active
2. Check environment variables match your Supabase project
3. Test API endpoints locally first

## Security Considerations

1. **Never commit** `.env.local` to your repository
2. **Use environment variables** for all sensitive data
3. **Service role key** should only be used in server-side code
4. **Enable RLS** on all Supabase tables for public access

## Automatic Deployments

Once set up, Cloudflare Pages will automatically:
- Deploy when you push to `main` branch
- Create preview deployments for pull requests
- Invalidate cache when needed
- Send deployment notifications

Your admin panel will be live and accessible globally! 🎉
