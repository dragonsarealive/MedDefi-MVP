# Eliminated Features Documentation

This document tracks features removed during MVP simplification and provides requirements for future re-implementation.

## 🏗️ MVP Architecture (Hybrid Approach)

**PRESERVED:**
- **Supabase Integration** - User authentication, profiles, onboarding (`src/lib/actions.ts`)
- **Blockchain Backend API** - Wallet management, practices, services, payments (16 endpoints)

**This hybrid approach allows:**
1. Users authenticate and set up profiles via Supabase
2. Once authenticated, they interact with blockchain features (wallet creation, service purchases)
3. Supabase user_id links to blockchain wallet user_id for seamless integration

---

## 🗑️ Eliminated Features

### 1. Invoice Tables and Complex Billing UI

**Files Eliminated:**
- `src/components/invoices/InvoiceTable.tsx` - Complex invoice table with pagination, filtering, search
- `src/app/patient/invoices/page.tsx` - Patient invoice dashboard
- `src/components/doctor/invoices/page.tsx` - Doctor invoice management
- Related mock data in `src/lib/mockData.ts`

**Functionality Removed:**
- Invoice listing with status badges (Paid, Pending, Overdue)
- Invoice filtering by status, date range, amount
- Pagination for large invoice lists
- Invoice search functionality
- PDF download capabilities
- Detailed invoice views with line items
- Payment status tracking
- Invoice analytics and summaries

**Re-implementation Requirements:**
```typescript
// Future Invoice System Requirements
interface Invoice {
  id: string;
  purchaseId: string; // Links to backend purchase record
  serviceId: string;
  practiceId: string;
  patientId: string;
  medicId: string;
  amount: number;
  currency: 'USD' | 'STRK';
  status: 'paid' | 'pending' | 'failed';
  paymentSplit: {
    medic: number;
    treasury: number;
    liquidity: number;
    rewards: number;
  };
  transactionHash: string;
  createdAt: string;
  paidAt?: string;
  metadata: {
    serviceName: string;
    practiceName: string;
    patientWallet: string;
    medicWallet: string;
  };
}

// Required API Integration
- GET /purchase/{id} - For invoice details
- Integration with payment status from blockchain
- Real-time updates via WebSocket for payment confirmations
```

**UI Components Needed:**
- InvoiceTable with real backend data
- Invoice filtering and search
- PDF generation for tax/record purposes
- Payment status indicators
- Transaction hash links to blockchain explorer

---

### 2. Multi-step Appointment Booking

**Files Eliminated:**
- `src/app/patient/top-doctors/[doctorId]/[serviceId]/page.tsx` - Complex 5-step booking process
- `src/components/dashboard/Appointments/AppointmentCard.tsx`
- `src/components/dashboard/Appointments/AppointmentList.tsx`
- Related appointment management UI

**Functionality Removed:**
- 5-step booking flow (Schedule → Confirm → Wallet → Escrow → Success)
- Calendar date/time selection
- Appointment confirmation system
- Appointment status tracking
- Appointment cancellation/rescheduling
- Doctor availability management
- Appointment reminders
- Meeting link generation

**Re-implementation Requirements:**
```typescript
// Future Appointment System Requirements
interface Appointment {
  id: string;
  purchaseId: string; // Links to backend purchase
  serviceId: string;
  practiceId: string;
  patientId: string;
  medicId: string;
  scheduledDateTime: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  meetingType: 'in-person' | 'video' | 'phone';
  meetingLink?: string;
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Required Backend Extensions
- Appointment scheduling endpoints
- Calendar integration APIs
- Notification system for reminders
- Video call integration (Zoom/Teams/WebRTC)
- Doctor availability management
```

**UI Components Needed:**
- Calendar component for date/time selection
- Multi-step booking wizard
- Appointment confirmation flow
- Status tracking interface
- Rescheduling functionality

---

### 3. Mock Doctor Profiles and Ratings

**Files Eliminated:**
- `src/app/api/doctors/[doctorId]/route.ts` - Mock doctor API with fake profiles
- Doctor profile components with ratings, reviews, photos
- Mock doctor data with specialties, bios, service lists

**Functionality Removed:**
- Doctor profile pages with photos, bios, specialties
- Star rating system (1-5 stars)
- Patient reviews and testimonials
- Doctor availability indicators
- Specialty filtering
- Location-based doctor search
- Doctor verification badges
- Service pricing per doctor

**Re-implementation Requirements:**
```typescript
// Future Doctor Profile System Requirements
interface DoctorProfile {
  id: string;
  userId: string; // Links to wallet user_id
  walletAddress: string;
  practiceIds: string[];
  personalInfo: {
    name: string;
    photoUrl?: string;
    bio: string;
    specialties: string[];
    qualifications: string[];
    experience: number; // years
    languages: string[];
  };
  verificationStatus: 'pending' | 'verified' | 'rejected';
  ratings: {
    average: number;
    totalReviews: number;
    breakdown: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
  availability: {
    timezone: string;
    workingHours: {
      [day: string]: { start: string; end: string; }[];
    };
    breaks: { start: string; end: string; }[];
  };
  location: {
    country: string;
    city: string;
    address?: string;
    coordinates?: { lat: number; lng: number; };
  };
}

// Required Backend Extensions
- Doctor profile management endpoints
- Medical license verification system
- Review and rating system
- Availability management
- Photo upload and management
```

**UI Components Needed:**
- Doctor profile creation/editing forms
- Photo upload component
- Qualification verification interface
- Rating and review system
- Availability calendar management

---

### 4. Complex Calendar/Scheduling Components

**Files Eliminated:**
- Calendar components for appointment scheduling
- Time slot selection interfaces
- Availability management systems
- Recurring appointment settings

**Functionality Removed:**
- Interactive calendar views (monthly, weekly, daily)
- Time slot selection with availability
- Drag-and-drop appointment management
- Recurring appointment creation
- Appointment conflict detection
- Multi-timezone support
- Calendar sync with external systems
- Appointment block management

**Re-implementation Requirements:**
```typescript
// Future Calendar System Requirements
interface TimeSlot {
  id: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'available' | 'booked' | 'blocked' | 'break';
  appointmentId?: string;
  timezone: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  type: 'appointment' | 'break' | 'blocked';
  start: string;
  end: string;
  attendees: string[];
  location?: string;
  notes?: string;
}

// Required Backend Extensions
- Time slot management endpoints
- Calendar availability APIs
- Timezone handling
- Recurring slot generation
- Conflict detection algorithms
```

**UI Components Needed:**
- Interactive calendar component (react-calendar or similar)
- Time slot picker
- Availability configuration interface
- Appointment drag-and-drop
- Multi-timezone display

---

### 5. Placeholder Pages Causing Build Errors

**Files Eliminated/Fixed:**
- Empty `src/app/(app)/dashboard/page.tsx` - Created basic redirect
- Empty `src/app/(app)/layout.tsx` - Created basic layout
- Empty `src/app/(auth)/forgot-password/page.tsx` - Created basic form
- Various other empty or incomplete page components

**Functionality Removed:**
- Complex dashboard layouts with multiple widgets
- Advanced authentication flows
- Multi-layout support for different user types
- Complex routing structures

**Re-implementation Requirements:**
```typescript
// Future Dashboard System Requirements
interface DashboardWidget {
  id: string;
  type: 'stats' | 'chart' | 'list' | 'calendar' | 'notifications';
  title: string;
  data: any;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number; };
  refreshInterval?: number;
}

interface UserDashboard {
  userId: string;
  userType: 'Medical' | 'Individual';
  layout: 'default' | 'compact' | 'detailed';
  widgets: DashboardWidget[];
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    autoRefresh: boolean;
  };
}

// Required Backend Extensions
- Dashboard configuration endpoints
- Widget data APIs
- User preference management
- Real-time data updates
```

**UI Components Needed:**
- Drag-and-drop dashboard builder
- Widget library with various chart types
- Dashboard layout management
- User preference settings
- Responsive dashboard design

---

## 🎯 Current MVP Focus

After elimination, the MVP should focus on:

### Core User Flows
1. **User Registration** → `/wallet/create`
2. **Practice Creation** → `/practice/create` (Medical users)
3. **Service Creation** → `/service/create` (Practice owners)
4. **Service Purchase** → `/service/purchase` (Individual users)
5. **Wallet Management** → `/wallet/claim`, `/wallet/claim-status`

### Simplified UI Components
- Basic user registration forms
- Simple practice/service creation forms
- Service listing and purchase interface
- Wallet status and claiming interface
- Transaction confirmation displays

### Essential Pages Only
- Landing/authentication
- User type selection
- Medical professional dashboard (create practice/services)
- Patient dashboard (browse/purchase services)
- Wallet management
- Purchase confirmation

---

## 🔄 Re-implementation Priority

When ready to re-add features, implement in this order:

1. **Doctor Profiles** - Essential for trust and credibility
2. **Basic Calendar/Scheduling** - Core to medical appointments
3. **Invoice System** - Important for record keeping
4. **Complex Appointment Booking** - Enhanced user experience
5. **Advanced Dashboard Features** - Nice-to-have improvements

---

## 📋 Technical Debt Notes

- Need to establish proper TypeScript interfaces for all eliminated features
- Consider state management solution (Zustand/Redux) for complex features
- Plan for real-time updates (WebSocket integration)
- Design for scalability with proper caching strategies
- Implement proper error handling and loading states

---

*Last Updated: January 2025*
*Status: Features eliminated for MVP focus* 