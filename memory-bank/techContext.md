# Technical Context - Technology Stack & Development Environment

**Last Updated:** July 25, 2025  
**Stack Status:** Production Ready  
**Current Focus:** API Routes & Environment Variables

## Technology Stack

### Frontend Technologies

#### Core Framework
- **Next.js 15.4.2** - React framework with App Router
  - Server-side rendering and static generation
  - API routes for backend functionality
  - Built-in optimization and performance features
  - TypeScript support out of the box

#### UI & Styling
- **React 18.2.0** - Component-based UI library
- **TypeScript 5.8.3** - Static typing for JavaScript
- **Tailwind CSS 3.3.3** - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **Framer Motion** (Motion 12.23.6) - Animation library

#### UI Components & Design
- **Glassmorphism Design System** - 2025 UI trends
- **Micro-interactions** - Enhanced user experience
- **Responsive Design** - Mobile-first approach
- **Accessibility Compliance** - WCAG guidelines

### Backend & Database

#### Database & Authentication
- **Supabase** - PostgreSQL database with real-time features
  - `@supabase/supabase-js 2.52.1` - JavaScript client
  - `@supabase/ssr 0.6.1` - Server-side rendering support
  - Row Level Security (RLS) policies
  - Real-time subscriptions

#### External APIs
- **WalletDash API** - Blockchain integration service
  - Starknet blockchain operations
  - Wallet creation and management
  - Transaction processing
  - Payment splitting logic

### Development Tools

#### Build & Development
- **Node.js 20.18.1** - JavaScript runtime
- **NPM 10.0.0** - Package manager
- **ESLint** - Code linting and formatting
- **Webpack Bundle Analyzer** - Bundle optimization

#### Deployment & Hosting
- **Netlify** - Static site hosting with serverless functions
- **Next.js Netlify Plugin** - Optimized deployment
- **Git** - Version control with GitHub integration

## Development Environment Setup

### Prerequisites
```bash
# Required versions
Node.js: >= 20.18.1
NPM: >= 10.0.0
Git: Latest version
```

### Local Development Setup
```bash
# 1. Clone repository
git clone https://github.com/dragonsarealive/MedDefi-MVP.git
cd MedDefi-MVP

# 2. Install dependencies
npm install

# 3. Environment configuration
cp env.example .env.local
# Edit .env.local with your configuration

# 4. Start development server
npm run dev

# 5. Build for production
npm run build
```

### Required Environment Variables
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# WalletDash API Configuration
NEXT_PUBLIC_WALLETDASH_API_URL=https://backend-medefi-walletdash.up.railway.app
NEXT_PUBLIC_WALLETDASH_API_TIMEOUT=10000

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=MedDefi MVP
NODE_ENV=development
```

## Architecture Decisions

### Framework Choices

#### Next.js over Alternative Frameworks
- **Chosen:** Next.js 15 with App Router
- **Alternatives Considered:** Vite + React, Remix, SvelteKit
- **Rationale:** 
  - Built-in API routes for backend functionality
  - Excellent TypeScript support
  - Optimized performance and SEO
  - Strong ecosystem and community

#### API Routes vs External Backend
- **Chosen:** Next.js API routes
- **Alternatives Considered:** Separate Express.js server, Serverless functions
- **Rationale:**
  - Simplified deployment and maintenance
  - Better integration with frontend
  - Reduced complexity and infrastructure costs
  - Easy environment variable management

### Database & State Management

#### Supabase over Alternatives
- **Chosen:** Supabase PostgreSQL
- **Alternatives Considered:** Firebase, PlanetScale, MongoDB
- **Rationale:**
  - PostgreSQL reliability and features
  - Real-time capabilities
  - Built-in authentication
  - Excellent TypeScript support

#### Client State Management
- **Chosen:** React hooks with local state
- **Alternatives Considered:** Redux, Zustand, Context API
- **Rationale:**
  - Simplicity for current scope
  - Reduced bundle size
  - Easy to understand and maintain
  - Future migration path available

## Dependencies & Packages

### Production Dependencies
```json
{
  "@heroicons/react": "^2.2.0",
  "@radix-ui/react-icons": "^1.3.2",
  "@radix-ui/react-slot": "^1.2.3",
  "@supabase/ssr": "^0.6.1",
  "@supabase/supabase-js": "^2.52.1",
  "@tailwindcss/typography": "^0.5.16",
  "axios": "^1.6.0",
  "bcryptjs": "^3.0.2",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "date-fns": "^4.1.0",
  "lucide-react": "^0.511.0",
  "motion": "^12.23.6",
  "next": "^15.4.2",
  "react": "^18.2.0",
  "react-day-picker": "^9.7.0",
  "react-dom": "^18.2.0",
  "react-icons": "^5.5.0",
  "recharts": "^2.15.3",
  "tailwind-merge": "^3.3.1",
  "tailwindcss": "^3.3.3",
  "typescript": "^5.8.3"
}
```

### Development Dependencies
```json
{
  "@types/bcryptjs": "^2.4.6",
  "@types/node": "^24.1.0",
  "@types/react": "^19.1.8",
  "@types/react-dom": "^19.1.6",
  "eslint": "^8.51.0",
  "eslint-config-next": "^14.0.0",
  "rimraf": "^5.0.5",
  "webpack-bundle-analyzer": "^4.9.1"
}
```

## Build & Deployment Configuration

### Next.js Configuration
```javascript
// next.config.js - Key settings
{
  // Removed static export for API routes
  trailingSlash: true,
  images: {
    domains: ['localhost', 'images.unsplash.com', 'cdn.meddefi.com'],
    formats: ['image/webp', 'image/avif']
  },
  experimental: {
    esmExternals: true,
    optimizePackageImports: ['lucide-react', '@heroicons/react']
  }
}
```

### Netlify Configuration
```toml
# netlify.toml - Key settings
[build]
  publish = ".next"
  command = "npm ci && npm run build"

[[plugins]]
  package = "@netlify/plugin-nextjs"

# Security headers and CSP policies configured
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

## Performance Optimizations

### Bundle Optimization
- **Tree Shaking:** Automatic dead code elimination
- **Code Splitting:** Dynamic imports for large components
- **Image Optimization:** Next.js Image component with WebP/AVIF
- **Font Optimization:** Automatic font loading optimization

### Runtime Performance
- **React 18 Features:** Concurrent rendering and automatic batching
- **Tailwind CSS:** JIT compilation for minimal CSS bundle
- **API Route Optimization:** Efficient database queries and caching
- **CDN Integration:** Static asset delivery via Netlify CDN

## Security Considerations

### Environment Variables
- **Client-side:** Only `NEXT_PUBLIC_*` variables exposed
- **Server-side:** Sensitive keys kept secure in API routes
- **Validation:** Runtime checks for required variables
- **Production:** Secure environment variable management

### Content Security Policy
```
default-src 'self'; 
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.meddefi.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
connect-src 'self' https://api.meddefi.com https://*.supabase.co https://backend-medefi-walletdash.up.railway.app;
```

### API Security
- **Input Validation:** All API endpoints validate input data
- **Error Handling:** Sanitized error responses
- **Rate Limiting:** Protection against abuse (future implementation)
- **CORS:** Configured for specific origins

## Development Workflow

### Code Quality
- **ESLint:** Automated code linting
- **TypeScript:** Static type checking
- **Prettier:** Code formatting (configured in ESLint)
- **Git Hooks:** Pre-commit validation (future implementation)

### Testing Strategy
- **Unit Testing:** Component testing (future implementation)
- **Integration Testing:** API route testing (future implementation)
- **E2E Testing:** User flow validation (future implementation)
- **Manual Testing:** Current primary testing method

### Deployment Pipeline
1. **Development:** Local development with hot reload
2. **Build:** Production build with optimization
3. **Testing:** Manual testing and validation
4. **Deployment:** Automatic deployment via Netlify
5. **Monitoring:** Error tracking and performance monitoring 