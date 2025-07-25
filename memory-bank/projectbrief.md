# MedDefi MVP - Project Brief

**Last Updated:** July 25, 2025  
**Project Status:** Production Testing  
**Current Phase:** API Architecture Implementation & Testing

## Project Overview

MedDefi is a modern medical tourism platform that connects international patients with top healthcare providers through blockchain technology. The platform enables seamless, transparent, and secure medical service transactions using Starknet blockchain integration.

## Core Mission

**Transform medical tourism** by providing a decentralized platform where:
- Patients can discover and book medical services globally
- Healthcare providers can expand their international reach
- All transactions are secured by blockchain technology
- Payments are automatically split between stakeholders

## Key Requirements

### Functional Requirements
1. **User Registration & Authentication**
   - Dual user types: Patients and Medical Professionals
   - Blockchain wallet creation and funding
   - Profile management with medical specialties

2. **Medical Service Marketplace**
   - Service discovery and browsing
   - Doctor profiles with ratings and reviews
   - Real-time pricing in USD with STRK conversion

3. **Blockchain Integration**
   - Starknet Sepolia testnet implementation
   - Automatic wallet funding (Medical: 2 STRK, Individual: 5 STRK)
   - Payment splitting (75% Doctor, 15% Platform, 5% Liquidity, 5% Rewards)

4. **Transaction Management**
   - Service purchasing with blockchain payments
   - Complete transaction history
   - Real-time payment confirmations

### Technical Requirements
1. **Frontend:** Next.js 15 with TypeScript and Tailwind CSS
2. **Backend Integration:** WalletDash API for blockchain operations
3. **Database:** Supabase PostgreSQL with comprehensive schema
4. **Deployment:** Netlify with Next.js runtime support
5. **Authentication:** Supabase Auth integration

## Success Criteria

### MVP Goals
- ✅ Complete user registration flow
- ✅ Blockchain wallet integration
- ✅ Modern UI/UX with 2025 design trends
- 🔄 **Production deployment with API routes**
- 🔄 **Environment variable security resolution**

### Business Goals
- Enable real medical service transactions
- Demonstrate blockchain payment splitting
- Provide seamless user experience
- Maintain security and compliance standards

## Current Focus Areas

1. **Production Testing** - Validating API route architecture
2. **Environment Security** - Proper server-side variable handling
3. **User Experience** - Modern glassmorphism design implementation
4. **Integration Stability** - WalletDash API reliability

## Constraints & Considerations

### Technical Constraints
- Static export limitations resolved with API routes
- Environment variable security requirements
- Blockchain testnet limitations
- Real-time transaction processing needs

### Business Constraints
- MVP scope focused on core functionality
- Testnet-only blockchain operations
- Demo-ready user experience required
- Scalable architecture for future expansion

## Success Metrics

- User registration completion rate
- Transaction success rate
- API response times < 2 seconds
- Zero security vulnerabilities
- 100% uptime on production deployment 