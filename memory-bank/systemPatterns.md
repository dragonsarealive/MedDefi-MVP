# System Patterns - Technical Architecture

**Last Updated:** July 25, 2025  
**Architecture Status:** API Routes Implementation  
**Current Focus:** Production Environment Validation

## C4 Architecture Model

### Context Level (Level 1)
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Patients      │    │  Medical Pros   │    │  Admin Users    │
│                 │    │                 │    │                 │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │                           │
                    │     MedDefi Platform      │
                    │                           │
                    └─────────────┬─────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
    ┌─────▼─────┐      ┌─────────▼─────────┐    ┌─────▼─────┐
    │ Supabase  │      │   WalletDash API  │    │  Starknet │
    │ Database  │      │   (Blockchain)    │    │ Blockchain│
    └───────────┘      └───────────────────┘    └───────────┘
```

### Container Level (Level 2)
```
┌─────────────────────────────────────────────────────────────┐
│                    MedDefi Platform                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   Web Browser   │    │  Mobile App     │                │
│  │   (React/Next)  │    │   (Future)      │                │
│  └─────────┬───────┘    └─────────┬───────┘                │
│            │                      │                        │
│            └──────────────────────┼────────────────────────│
│                                   │                        │
│  ┌─────────────────────────────────▼─────────────────────┐  │
│  │              Next.js Application                     │  │
│  │                                                     │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │   Pages     │  │ Components  │  │ API Routes  │  │  │
│  │  │ (Frontend)  │  │    (UI)     │  │ (Backend)   │  │  │
│  │  └─────────────┘  └─────────────┘  └──────┬──────┘  │  │
│  └─────────────────────────────────────────────┼────────┘  │
│                                               │           │
└───────────────────────────────────────────────┼───────────┘
                                               │
        ┌──────────────────────────────────────┼──────────────────────────────────────┐
        │                                     │                                     │
  ┌─────▼─────┐                    ┌─────────▼─────────┐                    ┌─────▼─────┐
  │ Supabase  │                    │   WalletDash API  │                    │  Netlify  │
  │ Database  │                    │   (Blockchain)    │                    │ Hosting   │
  └───────────┘                    └───────────────────┘                    └───────────┘
```

### Component Level (Level 3) - API Routes Focus
```
┌─────────────────────────────────────────────────────────────┐
│                    API Routes Layer                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │ Authentication  │    │   Wallet Mgmt   │                │
│  │   /api/auth/*   │    │  /api/wallet/*  │                │
│  └─────────┬───────┘    └─────────┬───────┘                │
│            │                      │                        │
│  ┌─────────▼─────────┐  ┌─────────▼─────────┐              │
│  │   Registration    │  │ Transaction Mgmt  │              │
│  │     Handler       │  │     Handler       │              │
│  └─────────┬───────┘    └─────────┬───────┘                │
│            │                      │                        │
│            └──────────────────────┼────────────────────────│
│                                   │                        │
│  ┌─────────────────────────────────▼─────────────────────┐  │
│  │              Service Layer                           │  │
│  │                                                     │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │  Database   │  │ WalletDash  │  │   Logging   │  │  │
│  │  │  Service    │  │  Service    │  │   Service   │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Key Technical Decisions

### Architecture Patterns

#### 1. **API-First Architecture**
- **Decision:** Implement server-side API routes for all database operations
- **Rationale:** Security, environment variable access, and scalability
- **Implementation:** Next.js App Router API routes (`/api/*`)
- **Benefits:** Proper separation of concerns, enhanced security, future mobile support

#### 2. **Service Layer Pattern**
- **Pattern:** Dedicated service classes for external integrations
- **Services:** `databaseService`, `walletDashService`
- **Location:** Server-side only for security
- **Benefits:** Testability, maintainability, separation of concerns

#### 3. **Client-Server Separation**
- **Client:** React components with state management
- **Server:** API routes with business logic
- **Communication:** RESTful API calls with JSON
- **Security:** Environment variables server-side only

### Data Flow Patterns

#### User Registration Flow
```
Client Component → API Route → Database Service → Supabase
                            → WalletDash Service → Blockchain
                            ← Response Chain ← Success/Error
```

#### Authentication Pattern
```
User Input → Validation → API Route → Database Check → JWT Token
         ← UI Update ← JSON Response ← Token Creation ← Success
```

### Security Patterns

#### 1. **Environment Variable Scoping**
- **Client-side:** Only `NEXT_PUBLIC_*` variables
- **Server-side:** All variables including sensitive keys
- **Implementation:** API routes for sensitive operations
- **Validation:** Runtime checks for required variables

#### 2. **API Security**
- **CORS:** Configured for specific origins
- **CSP:** Content Security Policy with allowed sources
- **Validation:** Input validation on all API endpoints
- **Error Handling:** Sanitized error responses

### Component Patterns

#### 1. **Modern UI Components**
- **Design System:** Glassmorphism with 2025 trends
- **State Management:** React hooks with local state
- **Interactions:** Micro-animations and hover effects
- **Accessibility:** WCAG compliance with proper contrast

#### 2. **Form Patterns**
- **Progressive Disclosure:** Show relevant fields based on user type
- **Smart Defaults:** Pre-filled values for better UX
- **Real-time Validation:** Immediate feedback on input
- **Error Handling:** Clear, actionable error messages

## Integration Patterns

### Database Integration
- **ORM:** Supabase client with TypeScript
- **Connection:** Server-side singleton pattern
- **Queries:** Prepared statements with parameter binding
- **Error Handling:** Comprehensive try-catch with logging

### Blockchain Integration
- **API Wrapper:** WalletDash service abstraction
- **Error Handling:** Retry logic with exponential backoff
- **Logging:** Comprehensive transaction logging
- **State Management:** Client-side state with server validation

### Deployment Patterns
- **Platform:** Netlify with Next.js runtime
- **Build:** Optimized production builds
- **Environment:** Separate configs for dev/staging/prod
- **Monitoring:** Built-in logging and error tracking

## Performance Patterns

### Optimization Strategies
- **Code Splitting:** Dynamic imports for large components
- **Image Optimization:** Next.js Image component
- **Caching:** Static asset caching with appropriate headers
- **Bundle Analysis:** Webpack bundle analyzer integration

### Monitoring Patterns
- **API Metrics:** Response times and error rates
- **User Analytics:** Registration completion rates
- **Error Tracking:** Comprehensive error logging
- **Performance:** Core Web Vitals monitoring

## Future Architecture Considerations

### Scalability Patterns
- **Microservices:** Potential service separation for scale
- **Database Sharding:** For large user bases
- **CDN Integration:** Global content delivery
- **Caching Layer:** Redis for session management

### Mobile Integration
- **API Compatibility:** RESTful APIs ready for mobile
- **Authentication:** JWT token-based auth
- **Real-time Updates:** WebSocket consideration
- **Offline Support:** Progressive Web App features 