# PickMyPDF - Phase 1 Complete

A modern PDF management application built with Next.js 14, Supabase, and TypeScript. Features secure Google OAuth authentication, role-based access control, and a responsive UI.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- A Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ba517h/pickmypdf.git
   cd pickmypdf
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your actual values:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key-here"
   SUPABASE_JWT_SECRET="your-jwt-secret-here"
   ```

4. **Configure Google OAuth in Supabase**
   
   a. Go to your [Supabase Dashboard](https://app.supabase.com)
   
   b. Navigate to **Authentication** → **Providers**
   
   c. Enable **Google** provider
   
   d. Set up Google OAuth:
      - Go to [Google Cloud Console](https://console.cloud.google.com)
      - Create a new project or select existing
      - Enable Google+ API
      - Create OAuth 2.0 credentials
      - Add authorized redirect URI: `https://your-project-ref.supabase.co/auth/v1/callback`
      - Copy Client ID and Client Secret to Supabase
   
   e. Get your JWT Secret:
      - In Supabase: **Settings** → **API** → **JWT Secret**
      - Add to your `.env.local`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 🛡️ Security Setup

### Google OAuth Configuration
1. **Google Cloud Console Setup**:
   - Create OAuth 2.0 Client ID
   - Set application type to "Web application"
   - Add authorized redirect URIs:
     - Development: `https://your-project-ref.supabase.co/auth/v1/callback`
     - Production: `https://yourdomain.com/auth/v1/callback`

2. **Supabase Configuration**:
   - Enable Google provider in Authentication settings
   - Add Client ID and Client Secret from Google
   - Configure redirect URLs

### Environment Variables
All sensitive configuration is stored in environment variables:

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=""      # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY="" # Your Supabase anon key
SUPABASE_JWT_SECRET=""           # Your Supabase JWT secret

# Optional
NEXT_PUBLIC_SITE_URL=""          # For production deployments
```

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Authentication**: Supabase Auth + Google OAuth
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS + shadcn/ui
- **Deployment**: Vercel-ready

### Key Features
- ✅ Google OAuth authentication
- ✅ Role-based access control (RBAC)
- ✅ Protected routes with middleware
- ✅ Server-side and client-side rendering
- ✅ Responsive UI with loading states
- ✅ Type-safe API integration
- ✅ Error handling and user feedback

### Project Structure
```
pickmypdf/
├── app/                 # Next.js App Router pages
│   ├── auth/           # Authentication routes
│   ├── admin/          # Admin-only pages
│   ├── client/         # Client dashboard
│   ├── server/         # Server-rendered pages
│   └── protected/      # Protected content
├── components/         # Reusable React components
│   └── ui/            # UI components (shadcn/ui)
├── lib/               # Utility functions
│   └── supabase/      # Supabase client configurations
├── hooks/             # Custom React hooks
└── reports/           # Technical documentation
```

## 🧪 Testing Authentication

1. **Start the dev server**: `npm run dev`
2. **Navigate to sign-in**: [http://localhost:3000/signin](http://localhost:3000/signin)
3. **Test Google OAuth**: Click "Sign in with Google"
4. **Verify session**: Check user info in dashboard
5. **Test protected routes**: Try accessing `/admin` or `/protected`

## 📋 Development Status

### ✅ Phase 1 Complete
- Authentication system with Google OAuth
- Role-based access control
- Protected routes and middleware
- Responsive UI with loading states
- Error handling and user feedback
- Environment configuration
- Security best practices

### 🔄 Next: Phase 2
- PDF upload and processing
- File management system
- Advanced PDF features
- User dashboard improvements
- Analytics and monitoring

## 🚨 Troubleshooting

### Common Issues

1. **"Unsupported provider" error**
   - Ensure Google provider is enabled in Supabase
   - Verify OAuth credentials are correct

2. **JWT verification errors**
   - Check `SUPABASE_JWT_SECRET` is set correctly
   - App falls back to user metadata if JWT secret missing

3. **Authentication redirect issues**
   - Verify redirect URLs in Google Cloud Console
   - Check Supabase callback URL configuration

4. **Environment variables not loading**
   - Ensure `.env.local` exists and has correct format
   - Restart development server after changes

## 📚 Documentation

- [Phase 1 CTO Report](./reports/phase-1-cto-report.md) - Comprehensive technical analysis
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Next.js App Router](https://nextjs.org/docs/app)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Status**: Phase 1 Complete ✅  
**Next Milestone**: PDF Processing Core Development
