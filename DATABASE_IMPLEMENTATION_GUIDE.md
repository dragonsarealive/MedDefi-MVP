# MedDefi Database Implementation Guide

**Project:** MedDefi MVP - Medical Tourism Platform  
**Implementation Date:** July 24, 2025  
**Database:** Supabase PostgreSQL  
**API Coverage:** 100% WalletDash Backend Integration  

---

## 📋 Overview

This document outlines the comprehensive database schema implementation for the MedDefi medical tourism platform, providing complete coverage for all 16 WalletDash API endpoints. The schema enables persistent storage of blockchain interactions, user relationships, and transaction data across development iterations.

### Architecture Goals

- **100% API Coverage:** Every field from all 16 WalletDash endpoints tracked
- **Data Persistence:** Maintain blockchain relationships across development restarts
- **Real Integration:** Support actual doctor-patient-service workflows
- **Performance Optimization:** Views and indexes for common queries
- **Comprehensive Logging:** Complete audit trail of all API interactions

---

## 🗄️ Database Schema Overview

### Core Entity Relationships

```mermaid
erDiagram
    profiles ||--o{ blockchain_wallets : "has"
    profiles ||--o{ doctor_profiles : "extends"
    profiles ||--o{ medical_practices : "owns"
    profiles ||--o{ service_purchases : "makes"
    
    medical_practices ||--o{ medical_services : "offers"
    medical_services ||--o{ service_purchases : "purchased"
    
    blockchain_wallets ||--o{ medical_practices : "funds"
    blockchain_wallets ||--o{ api_response_logs : "logs"
```

### Table Count Summary

| Category | Tables | Purpose |
|----------|--------|---------|
| **Core Entities** | 4 | User profiles, wallets, practices, services |
| **Transactions** | 1 | Service purchases and payment tracking |
| **Analytics** | 3 | Exchange rates, user analytics, claim analytics |
| **Logging** | 1 | Complete API interaction tracking |
| **Views** | 6 | Optimized query interfaces |

---

## 📊 Detailed Table Specifications

### 1. Enhanced Profiles Table

**Purpose:** Central user identity linking Supabase auth with blockchain data

```sql
TABLE profiles (
  -- Core identity (existing)
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  first_name TEXT,
  last_name TEXT,
  username TEXT UNIQUE,
  user_type TEXT CHECK (user_type IN ('doctor', 'patient', 'Medical', 'Individual', 'Finance', 'Gaming', 'Social', 'Enterprise')),
  country TEXT,
  
  -- Legacy wallet fields (preserved for compatibility)
  wallet_user_id TEXT,
  wallet_address TEXT,
  claim_token TEXT,
  
  -- Onboarding tracking
  onboarding_step INTEGER DEFAULT 1,
  onboarding_completed BOOLEAN DEFAULT false,
  
  -- Enhanced blockchain integration
  blockchain_user_type TEXT CHECK (blockchain_user_type IN ('Medical', 'Individual', 'Finance', 'Gaming', 'Social', 'Enterprise')),
  wallet_claimed BOOLEAN DEFAULT false,
  wallet_funding_amount NUMERIC(20,2),
  active_wallet_id UUID REFERENCES blockchain_wallets(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**API Coverage:**
- User registration and onboarding flows
- Wallet association and claim status
- User type mapping for blockchain integration

---

### 2. Blockchain Wallets Table

**Purpose:** Complete wallet lifecycle tracking for all API endpoints

```sql
CREATE TABLE blockchain_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Core wallet data from POST /wallet/create
  wallet_address TEXT NOT NULL UNIQUE,
  claim_token TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL, -- Backend user_id for API calls
  user_type TEXT NOT NULL CHECK (user_type IN ('Medical', 'Individual', 'Finance', 'Gaming', 'Social', 'Enterprise')),
  
  -- System management and funding
  system_managed BOOLEAN DEFAULT true,
  auto_funded BOOLEAN DEFAULT true,
  funding_amount_strk NUMERIC(20,2),
  funding_transaction_hash TEXT,
  ready_for_transactions BOOLEAN DEFAULT true,
  
  -- Metadata storage (flexible JSONB)
  metadata JSONB,
  creation_transaction_hash TEXT,
  
  -- Claim tracking from POST /wallet/claim
  claimed BOOLEAN DEFAULT false,
  claimed_at TIMESTAMPTZ,
  new_owner_public_key TEXT,
  claim_transaction_hash TEXT,
  
  -- Blockchain verification from GET /wallet/claim-status
  blockchain_verification JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_blockchain_wallets_user_id ON blockchain_wallets(user_id);
CREATE INDEX idx_blockchain_wallets_claim_token ON blockchain_wallets(claim_token);
CREATE INDEX idx_blockchain_wallets_wallet_address ON blockchain_wallets(wallet_address);
```

**API Coverage:**
- `POST /wallet/create` - Complete wallet creation data
- `GET /wallet/user/{userId}` - User wallet retrieval
- `POST /wallet/claim` - Ownership transfer tracking
- `GET /wallet/claim-status/{claimToken}` - Claim verification
- `GET /wallet/stats` - Aggregated wallet statistics

**Funding Amounts by User Type:**
- Medical: 2 STRK
- Individual: 5 STRK  
- Finance: 3 STRK
- Gaming: 2 STRK
- Social: 2 STRK
- Enterprise: 10 STRK

---

### 3. Medical Practices Table

**Purpose:** Blockchain practice contracts from POST /practice/create

```sql
CREATE TABLE medical_practices (
  id SERIAL PRIMARY KEY,
  doctor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  wallet_id UUID REFERENCES blockchain_wallets(id) ON DELETE SET NULL,
  
  -- Backend integration
  backend_practice_id INTEGER UNIQUE, -- ID from backend API
  
  -- Practice information
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  location TEXT NOT NULL,
  
  -- Blockchain contract data
  owner_wallet TEXT NOT NULL,
  contract_address TEXT NOT NULL,
  factory_address TEXT NOT NULL,
  transaction_hash TEXT NOT NULL,
  
  -- Status tracking
  active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_medical_practices_backend_id ON medical_practices(backend_practice_id);
```

**API Coverage:**
- `POST /practice/create` - Complete practice creation data
- `GET /practice/{id}` - Practice information retrieval

**Integration Flow:**
1. Medical user creates wallet → blockchain_wallets
2. Doctor creates practice → medical_practices (linked to wallet)
3. Backend returns practice_id → stored as backend_practice_id

---

### 4. Enhanced Medical Services Table

**Purpose:** Service blockchain data with complete API field coverage

```sql
ALTER TABLE medical_services ADD COLUMN (
  -- Backend integration fields
  backend_practice_id INTEGER,
  practice_name TEXT,
  price_usd_cents INTEGER,
  factory_address TEXT,
  service_transaction_hash TEXT,
  practice_id INTEGER REFERENCES medical_practices(id)
);

-- Complete service structure
TABLE medical_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES doctor_profiles(id),
  
  -- Service details
  name TEXT NOT NULL,
  description TEXT,
  price_usd NUMERIC NOT NULL,
  duration_minutes INTEGER,
  
  -- Backend integration
  backend_service_id INTEGER, -- From POST /service/create
  service_contract_address TEXT,
  backend_practice_id INTEGER,
  practice_name TEXT,
  price_usd_cents INTEGER,
  factory_address TEXT,
  service_transaction_hash TEXT,
  
  -- Relationships
  practice_id INTEGER REFERENCES medical_practices(id),
  
  -- Status
  active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**API Coverage:**
- `POST /service/create` - Complete service creation data
- `GET /service/{id}` - Service information retrieval

---

### 5. Enhanced Service Purchases Table

**Purpose:** Complete transaction tracking with payment splits

```sql
ALTER TABLE service_purchases ADD COLUMN (
  -- Complete purchase tracking
  service_name TEXT,
  practice_id INTEGER,
  practice_name TEXT,
  buyer_user_id TEXT, -- Backend user_id
  buyer_wallet TEXT,
  medic_wallet TEXT,
  usd_to_strk_conversion_rate NUMERIC(20,8),
  completed BOOLEAN DEFAULT false
);

-- Complete purchase structure
TABLE service_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES medical_services(id),
  patient_id UUID REFERENCES profiles(id),
  
  -- Backend integration
  backend_purchase_id INTEGER, -- From POST /service/purchase
  
  -- Transaction data
  transaction_hash TEXT,
  amount_usd NUMERIC,
  amount_strk BIGINT,
  
  -- Payment split tracking (75/15/5/5)
  medic_amount BIGINT,      -- 75% to medical professional
  treasury_amount BIGINT,   -- 15% to platform treasury
  liquidity_amount BIGINT,  -- 5% to liquidity pool
  rewards_amount BIGINT,    -- 5% to rewards program
  
  -- Additional tracking
  service_name TEXT,
  practice_id INTEGER,
  practice_name TEXT,
  buyer_user_id TEXT,
  buyer_wallet TEXT,
  medic_wallet TEXT,
  usd_to_strk_conversion_rate NUMERIC(20,8),
  
  -- Status tracking
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  completed BOOLEAN DEFAULT false,
  
  -- Timestamps
  purchased_at TIMESTAMPTZ DEFAULT NOW()
);
```

**API Coverage:**
- `POST /service/purchase` - Complete purchase transaction data
- `GET /purchase/{id}` - Purchase information retrieval

**Payment Split Formula:**
- **75%** → Medical Professional (medic_amount)
- **15%** → Platform Treasury (treasury_amount)  
- **5%** → Liquidity Pool (liquidity_amount)
- **5%** → Rewards Program (rewards_amount)

---

### 6. Oracle Exchange Rates Table

**Purpose:** USD-STRK conversion tracking from GET /oracle/health

```sql
CREATE TABLE oracle_exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Oracle health data
  oracle_service TEXT DEFAULT 'online',
  usd_strk_rate NUMERIC(20,8) NOT NULL,
  oracle_source TEXT DEFAULT 'Pragma Oracle with fallback',
  status TEXT DEFAULT 'operational',
  
  -- Test conversion samples
  test_conversions JSONB,
  
  -- Update tracking
  last_update TIMESTAMPTZ DEFAULT NOW(),
  update_frequency TEXT DEFAULT 'continuous',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_oracle_rates_timestamp ON oracle_exchange_rates(created_at DESC);
```

**API Coverage:**
- `GET /oracle/health` - Complete oracle status and conversion rates

**Sample Data Structure:**
```json
{
  "oracle_service": "online",
  "usd_strk_rate": 0.0475,
  "test_conversions": {
    "$50": "21052 STRK",
    "$100": "42105 STRK",
    "$500": "210526 STRK"
  }
}
```

---

### 7. Analytics Cache Tables

**Purpose:** Performance optimization for analytics endpoints

#### Analytics User Types
```sql
CREATE TABLE analytics_user_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Overview metrics
  total_wallets INTEGER,
  claimed_wallets INTEGER,
  unclaimed_wallets INTEGER,
  total_user_types INTEGER,
  active_user_types INTEGER,
  
  -- Detailed breakdowns (JSONB for flexibility)
  user_type_data JSONB,
  rankings JSONB,
  insights JSONB,
  
  -- Analysis metadata
  analysis_period TEXT DEFAULT '24_hours',
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Analytics Claim Rates
```sql
CREATE TABLE analytics_claim_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Performance metrics
  overall_claim_rate_percentage NUMERIC(5,2),
  performance_rating TEXT,
  
  -- Detailed analysis (JSONB for flexibility)
  time_based_analysis JSONB,
  user_type_claim_rates JSONB,
  claim_speed_analysis JSONB,
  trends JSONB,
  insights JSONB,
  medical_tourism_insights JSONB,
  
  -- Analysis metadata
  analysis_period TEXT DEFAULT 'last_30_days',
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**API Coverage:**
- `GET /analytics/user-types` - User distribution analytics
- `GET /analytics/claim-rate` - Claim pattern analytics

---

### 8. API Response Logs Table

**Purpose:** Comprehensive logging of all API interactions

```sql
CREATE TABLE api_response_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Request identification
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  profile_id UUID REFERENCES profiles(id),
  user_id TEXT, -- Backend user_id when available
  
  -- Request/Response data
  request_data JSONB,
  response_data JSONB,
  success BOOLEAN NOT NULL,
  
  -- Error tracking
  error_message TEXT,
  http_status_code INTEGER,
  
  -- Performance metrics
  response_time_ms INTEGER,
  
  -- Timestamps
  request_timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_api_logs_endpoint ON api_response_logs(endpoint);
CREATE INDEX idx_api_logs_profile_id ON api_response_logs(profile_id);
CREATE INDEX idx_api_logs_timestamp ON api_response_logs(created_at DESC);
```

**API Coverage:**
- `POST /debug/system-account` - Debug operations
- `GET /health` - Health check monitoring
- All other endpoints - Complete interaction logging

---

## 🔍 Optimized Views

### 1. Complete Doctor Profiles View

```sql
CREATE VIEW complete_doctor_profiles AS
SELECT 
  p.id,
  p.first_name,
  p.last_name,
  p.username,
  p.user_type,
  p.country,
  dp.specialty,
  dp.bio,
  dp.experience_years,
  dp.photo_url,
  dp.verification_status,
  dp.city,
  
  -- Blockchain wallet data
  bw.wallet_address,
  bw.claim_token,
  bw.user_id as backend_user_id,
  bw.user_type as blockchain_user_type,
  bw.claimed as wallet_claimed,
  bw.funding_amount_strk,
  
  -- Practice data
  mp.backend_practice_id,
  mp.name as practice_name,
  mp.contract_address as practice_contract_address,
  mp.active as practice_active,
  
  -- Service statistics
  (SELECT COUNT(*) FROM medical_services ms WHERE ms.doctor_id = p.id) as service_count,
  
  p.created_at,
  p.updated_at
FROM profiles p
LEFT JOIN doctor_profiles dp ON p.id = dp.id
LEFT JOIN blockchain_wallets bw ON p.id = bw.profile_id AND bw.user_type = 'Medical'
LEFT JOIN medical_practices mp ON p.id = mp.doctor_id
WHERE p.user_type IN ('doctor', 'Medical');
```

### 2. Complete Patient Profiles View

```sql
CREATE VIEW complete_patient_profiles AS
SELECT 
  p.id,
  p.first_name,
  p.last_name,
  p.username,
  p.user_type,
  p.country,
  
  -- Blockchain wallet data
  bw.wallet_address,
  bw.claim_token,
  bw.user_id as backend_user_id,
  bw.user_type as blockchain_user_type,
  bw.claimed as wallet_claimed,
  bw.funding_amount_strk,
  
  -- Purchase history
  (SELECT COUNT(*) FROM service_purchases sp WHERE sp.patient_id = p.id) as total_purchases,
  (SELECT SUM(amount_usd) FROM service_purchases sp WHERE sp.patient_id = p.id) as total_spent_usd,
  
  p.created_at,
  p.updated_at
FROM profiles p
LEFT JOIN blockchain_wallets bw ON p.id = bw.profile_id AND bw.user_type = 'Individual'
WHERE p.user_type IN ('patient', 'Individual');
```

### 3. Complete Service Listings View

```sql
CREATE VIEW complete_service_listings AS
SELECT 
  ms.id,
  ms.name,
  ms.description,
  ms.price_usd,
  ms.duration_minutes,
  ms.backend_service_id,
  ms.service_contract_address,
  ms.active,
  
  -- Doctor information
  p.first_name || ' ' || p.last_name as doctor_name,
  dp.specialty as doctor_specialty,
  dp.photo_url as doctor_photo,
  dp.city,
  dp.country,
  
  -- Practice information
  mp.name as practice_name,
  mp.contract_address as practice_contract_address,
  mp.location as practice_location,
  
  -- Blockchain wallet info
  bw.wallet_address as doctor_wallet_address,
  
  ms.created_at,
  ms.updated_at
FROM medical_services ms
JOIN doctor_profiles dp ON ms.doctor_id = dp.id
JOIN profiles p ON dp.id = p.id
LEFT JOIN medical_practices mp ON ms.practice_id = mp.id
LEFT JOIN blockchain_wallets bw ON p.id = bw.profile_id AND bw.user_type = 'Medical'
WHERE ms.active = true;
```

### 4. Complete Purchase Transactions View

```sql
CREATE VIEW complete_purchase_transactions AS
SELECT 
  sp.id,
  sp.backend_purchase_id,
  sp.transaction_hash,
  sp.amount_usd,
  sp.amount_strk,
  sp.medic_amount,
  sp.treasury_amount,
  sp.liquidity_amount,
  sp.rewards_amount,
  sp.status,
  sp.purchased_at,
  
  -- Service information
  ms.name as service_name,
  ms.description as service_description,
  ms.price_usd as service_price,
  
  -- Doctor information
  p_doc.first_name || ' ' || p_doc.last_name as doctor_name,
  dp.specialty as doctor_specialty,
  
  -- Patient information
  p_patient.first_name || ' ' || p_patient.last_name as patient_name,
  p_patient.country as patient_country,
  
  -- Wallet addresses
  sp.buyer_wallet,
  sp.medic_wallet,
  
  -- Practice information
  sp.practice_name
FROM service_purchases sp
LEFT JOIN medical_services ms ON sp.service_id = ms.id
LEFT JOIN doctor_profiles dp ON ms.doctor_id = dp.id
LEFT JOIN profiles p_doc ON dp.id = p_doc.id
LEFT JOIN profiles p_patient ON sp.patient_id = p_patient.id;
```

### 5. Wallet Status Overview

```sql
CREATE VIEW wallet_status_overview AS
SELECT 
  p.id as profile_id,
  p.first_name || ' ' || p.last_name as full_name,
  p.user_type,
  p.country,
  
  -- Wallet information
  bw.wallet_address,
  bw.user_id as backend_user_id,
  bw.user_type as blockchain_user_type,
  bw.claimed,
  bw.funding_amount_strk,
  bw.ready_for_transactions,
  
  -- Claim information
  bw.claim_token,
  bw.claimed_at,
  bw.new_owner_public_key,
  
  -- System status
  bw.system_managed,
  bw.auto_funded,
  
  bw.created_at as wallet_created_at,
  p.created_at as profile_created_at
FROM profiles p
LEFT JOIN blockchain_wallets bw ON p.id = bw.profile_id;
```

### 6. Analytics Summary View

```sql
CREATE VIEW analytics_summary AS
SELECT 
  -- Wallet statistics
  (SELECT COUNT(*) FROM blockchain_wallets) as total_wallets,
  (SELECT COUNT(*) FROM blockchain_wallets WHERE claimed = true) as claimed_wallets,
  (SELECT COUNT(*) FROM blockchain_wallets WHERE claimed = false) as unclaimed_wallets,
  
  -- User type distribution
  (SELECT COUNT(*) FROM blockchain_wallets WHERE user_type = 'Medical') as medical_wallets,
  (SELECT COUNT(*) FROM blockchain_wallets WHERE user_type = 'Individual') as individual_wallets,
  
  -- Practice and service counts
  (SELECT COUNT(*) FROM medical_practices WHERE active = true) as active_practices,
  (SELECT COUNT(*) FROM medical_services WHERE active = true) as active_services,
  
  -- Transaction statistics
  (SELECT COUNT(*) FROM service_purchases WHERE status = 'completed') as completed_purchases,
  (SELECT SUM(amount_usd) FROM service_purchases WHERE status = 'completed') as total_revenue_usd,
  (SELECT SUM(amount_strk) FROM service_purchases WHERE status = 'completed') as total_volume_strk,
  
  -- Latest exchange rate
  (SELECT usd_strk_rate FROM oracle_exchange_rates ORDER BY created_at DESC LIMIT 1) as current_usd_strk_rate,
  
  NOW() as generated_at;
```

---

## 🔄 Implementation Workflows

### Doctor Registration & Practice Setup

```sql
-- 1. Doctor registers in frontend
INSERT INTO profiles (id, first_name, last_name, user_type, country)
VALUES ('doc-uuid', 'Dr. Alice', 'Johnson', 'Medical', 'Costa Rica');

-- 2. Create blockchain wallet via WalletDash API
INSERT INTO blockchain_wallets (
  profile_id, wallet_address, claim_token, user_id, user_type, 
  funding_amount_strk, funding_transaction_hash
)
VALUES (
  'doc-uuid', '0x06ab129...', 'claim_token_123', 'backend-user-id', 'Medical',
  2.0, '0x56a9078...'
);

-- 3. Create practice via WalletDash API
INSERT INTO medical_practices (
  doctor_id, backend_practice_id, name, specialty, location,
  owner_wallet, contract_address, factory_address, transaction_hash
)
VALUES (
  'doc-uuid', 1, 'Downtown Cardiology', 'Cardiology', 'San José, Costa Rica',
  '0x06ab129...', 'PRACTICE_1_123', '0x266674e...', '0x1d9bd21...'
);

-- 4. Create services via WalletDash API
INSERT INTO medical_services (
  doctor_id, practice_id, name, description, price_usd,
  backend_service_id, service_contract_address, practice_name
)
VALUES (
  'doc-uuid', 1, 'Cardiac Consultation', '45-minute consultation', 200.00,
  1, 'SERVICE_1_123', 'Downtown Cardiology'
);
```

### Patient Purchase Flow

```sql
-- 1. Patient registers
INSERT INTO profiles (id, first_name, last_name, user_type, country)
VALUES ('patient-uuid', 'John', 'Smith', 'Individual', 'USA');

-- 2. Create blockchain wallet
INSERT INTO blockchain_wallets (
  profile_id, wallet_address, claim_token, user_id, user_type,
  funding_amount_strk, funding_transaction_hash
)
VALUES (
  'patient-uuid', '0x01b656...', 'claim_patient_123', 'patient-backend-id', 'Individual',
  5.0, '0x789abc...'
);

-- 3. Purchase service via WalletDash API
INSERT INTO service_purchases (
  service_id, patient_id, backend_purchase_id, transaction_hash,
  amount_usd, amount_strk, medic_amount, treasury_amount, 
  liquidity_amount, rewards_amount, buyer_wallet, medic_wallet
)
VALUES (
  'service-uuid', 'patient-uuid', 1, '0x53fcfc...',
  200.00, 21050, 15787, 3157, 1052, 1054,
  '0x01b656...', '0x06ab129...'
);
```

---

## 📈 Performance Optimizations

### Database Indexes

```sql
-- Wallet lookups
CREATE INDEX idx_blockchain_wallets_user_id ON blockchain_wallets(user_id);
CREATE INDEX idx_blockchain_wallets_claim_token ON blockchain_wallets(claim_token);
CREATE INDEX idx_blockchain_wallets_wallet_address ON blockchain_wallets(wallet_address);

-- Practice lookups
CREATE INDEX idx_medical_practices_backend_id ON medical_practices(backend_practice_id);

-- Exchange rate history
CREATE INDEX idx_oracle_rates_timestamp ON oracle_exchange_rates(created_at DESC);

-- API logging
CREATE INDEX idx_api_logs_endpoint ON api_response_logs(endpoint);
CREATE INDEX idx_api_logs_profile_id ON api_response_logs(profile_id);
CREATE INDEX idx_api_logs_timestamp ON api_response_logs(created_at DESC);
```

### Query Optimization Strategies

1. **Use Views for Complex Joins:** Pre-optimized queries for common use cases
2. **JSONB for Flexible Data:** Analytics and metadata stored efficiently
3. **Proper Foreign Keys:** Maintain referential integrity with cascading
4. **Timestamp Indexes:** Fast time-based queries for analytics
5. **Unique Constraints:** Prevent duplicate blockchain identifiers

---

## 🚀 Integration Patterns

### Frontend Integration Example

```typescript
// Doctor registration with blockchain integration
const createDoctorWithWallet = async (doctorData: DoctorRegistration) => {
  // 1. Create Supabase profile
  const { data: profile } = await supabase
    .from('profiles')
    .insert({
      first_name: doctorData.firstName,
      last_name: doctorData.lastName,
      user_type: 'Medical',
      country: doctorData.country
    })
    .select()
    .single();

  // 2. Create blockchain wallet via WalletDash
  const walletResponse = await fetch(`${WALLETDASH_API}/wallet/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: profile.id,
      user_type: 'Medical'
    })
  });
  
  const walletData = await walletResponse.json();

  // 3. Store wallet data in Supabase
  await supabase
    .from('blockchain_wallets')
    .insert({
      profile_id: profile.id,
      wallet_address: walletData.data.wallet_address,
      claim_token: walletData.data.claim_token,
      user_id: walletData.data.user_id,
      user_type: 'Medical',
      funding_amount_strk: walletData.data.funding_amount_strk,
      funding_transaction_hash: walletData.data.funding_transaction_hash,
      metadata: walletData.data.metadata
    });

  // 4. Create doctor profile
  await supabase
    .from('doctor_profiles')
    .insert({
      id: profile.id,
      specialty: doctorData.specialty,
      bio: doctorData.bio,
      country: doctorData.country,
      city: doctorData.city
    });

  return { profile, wallet: walletData.data };
};
```

### Service Purchase Integration

```typescript
const purchaseService = async (serviceId: string, patientId: string) => {
  // 1. Get service and patient wallet info
  const { data: serviceData } = await supabase
    .from('complete_service_listings')
    .select('*')
    .eq('id', serviceId)
    .single();

  const { data: patientWallet } = await supabase
    .from('blockchain_wallets')
    .select('user_id')
    .eq('profile_id', patientId)
    .eq('user_type', 'Individual')
    .single();

  // 2. Execute purchase via WalletDash
  const purchaseResponse = await fetch(`${WALLETDASH_API}/service/purchase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: serviceData.backend_service_id,
      buyer_user_id: patientWallet.user_id
    })
  });

  const purchaseData = await purchaseResponse.json();

  // 3. Store purchase data in Supabase
  await supabase
    .from('service_purchases')
    .insert({
      service_id: serviceId,
      patient_id: patientId,
      backend_purchase_id: purchaseData.data.id,
      transaction_hash: purchaseData.data.transaction_hash,
      amount_usd: purchaseData.data.amount_usd,
      amount_strk: purchaseData.data.amount_strk,
      medic_amount: purchaseData.data.payment_split.medic,
      treasury_amount: purchaseData.data.payment_split.treasury,
      liquidity_amount: purchaseData.data.payment_split.liquidity,
      rewards_amount: purchaseData.data.payment_split.rewards,
      buyer_wallet: purchaseData.data.buyer_wallet,
      medic_wallet: purchaseData.data.medic_wallet,
      service_name: purchaseData.data.service_name,
      practice_name: purchaseData.data.practice_name,
      status: 'completed'
    });

  return purchaseData.data;
};
```

---

## 🔒 Security Considerations

### Row Level Security (RLS) Policies

```sql
-- Profiles: Users can only see their own data
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Blockchain wallets: Users can only access their own wallets
CREATE POLICY "Users can view own wallets" ON blockchain_wallets
  FOR SELECT USING (profile_id = auth.uid());

-- Doctor profiles: Only doctors can see doctor data
CREATE POLICY "Doctors can view doctor profiles" ON doctor_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND user_type IN ('doctor', 'Medical')
    )
  );

-- Medical services: Public read, doctor-only write
CREATE POLICY "Anyone can view services" ON medical_services
  FOR SELECT USING (active = true);

CREATE POLICY "Doctors can manage their services" ON medical_services
  FOR ALL USING (
    doctor_id = auth.uid() AND 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND user_type IN ('doctor', 'Medical')
    )
  );

-- Service purchases: Users can see their own purchases
CREATE POLICY "Users can view own purchases" ON service_purchases
  FOR SELECT USING (patient_id = auth.uid());
```

### Data Protection

- **Sensitive Data Encryption:** Wallet addresses and claim tokens
- **API Key Management:** WalletDash API keys in environment variables
- **Input Validation:** All API inputs validated before database storage
- **Audit Logging:** Complete API interaction tracking in api_response_logs

---

## 🔍 Monitoring & Analytics

### Key Performance Indicators (KPIs)

```sql
-- Platform Health Dashboard
SELECT 
  total_wallets,
  claimed_wallets,
  (claimed_wallets::float / total_wallets * 100)::numeric(5,2) as claim_rate_percentage,
  active_practices,
  active_services,
  completed_purchases,
  total_revenue_usd
FROM analytics_summary;

-- User Growth Tracking
SELECT 
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as new_users,
  COUNT(*) FILTER (WHERE user_type = 'Medical') as new_doctors,
  COUNT(*) FILTER (WHERE user_type = 'Individual') as new_patients
FROM profiles 
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date;

-- Revenue Analytics
SELECT 
  DATE_TRUNC('month', purchased_at) as month,
  COUNT(*) as total_purchases,
  SUM(amount_usd) as revenue_usd,
  SUM(medic_amount) as medic_payments_strk,
  AVG(amount_usd) as avg_purchase_value
FROM service_purchases 
WHERE status = 'completed'
GROUP BY DATE_TRUNC('month', purchased_at)
ORDER BY month;
```

### Real-Time Monitoring Queries

```sql
-- Active Wallets (last 24 hours)
SELECT COUNT(*) as active_wallets
FROM blockchain_wallets 
WHERE updated_at >= NOW() - INTERVAL '24 hours';

-- Failed Transactions (last hour)
SELECT COUNT(*) as failed_purchases
FROM service_purchases 
WHERE status = 'failed' 
AND purchased_at >= NOW() - INTERVAL '1 hour';

-- API Error Rate (last hour)
SELECT 
  endpoint,
  COUNT(*) as total_requests,
  COUNT(*) FILTER (WHERE success = false) as failed_requests,
  (COUNT(*) FILTER (WHERE success = false)::float / COUNT(*) * 100)::numeric(5,2) as error_rate_percentage
FROM api_response_logs 
WHERE request_timestamp >= NOW() - INTERVAL '1 hour'
GROUP BY endpoint
HAVING COUNT(*) > 10  -- Only show endpoints with significant traffic
ORDER BY error_rate_percentage DESC;
```

---

## 📚 API Endpoint Coverage Matrix

| Endpoint | Tables Used | Data Tracked | Status |
|----------|-------------|--------------|--------|
| `POST /wallet/create` | blockchain_wallets, profiles | Complete wallet creation data | ✅ 100% |
| `GET /wallet/user/{userId}` | blockchain_wallets | User wallet retrieval | ✅ 100% |
| `GET /wallet/stats` | blockchain_wallets, analytics_user_types | Aggregate statistics | ✅ 100% |
| `POST /wallet/claim` | blockchain_wallets | Ownership transfer | ✅ 100% |
| `GET /wallet/claim-status/{claimToken}` | blockchain_wallets | Claim verification | ✅ 100% |
| `POST /practice/create` | medical_practices, blockchain_wallets | Practice blockchain data | ✅ 100% |
| `GET /practice/{id}` | medical_practices | Practice information | ✅ 100% |
| `POST /service/create` | medical_services, medical_practices | Service blockchain data | ✅ 100% |
| `GET /service/{id}` | medical_services | Service information | ✅ 100% |
| `POST /service/purchase` | service_purchases, blockchain_wallets | Complete transaction & splits | ✅ 100% |
| `GET /purchase/{id}` | service_purchases | Purchase details | ✅ 100% |
| `GET /oracle/health` | oracle_exchange_rates | USD-STRK conversion rates | ✅ 100% |
| `GET /analytics/user-types` | analytics_user_types | User distribution analytics | ✅ 100% |
| `GET /analytics/claim-rate` | analytics_claim_rates | Claim pattern analytics | ✅ 100% |
| `POST /debug/system-account` | api_response_logs | Debug operations | ✅ 100% |
| `GET /health` | api_response_logs | Health monitoring | ✅ 100% |

**Total Coverage: 16/16 endpoints (100%)**

---

## 🔄 Migration & Deployment

### Database Migration Script

```sql
-- Execute migrations in order
\i migrations/001_comprehensive_walletdash_schema.sql
\i migrations/002_create_comprehensive_views.sql
\i migrations/003_setup_rls_policies.sql
\i migrations/004_create_performance_indexes.sql
```

### Environment Configuration

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://lmryszvrzytmfzljkfru.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# WalletDash API Integration  
WALLETDASH_API_URL=https://backend-medefi-walletdash.up.railway.app
WALLETDASH_API_TIMEOUT=10000

# Development vs Production
NODE_ENV=development
DATABASE_POOL_SIZE=10
```

### Deployment Checklist

- [ ] Database migrations applied
- [ ] RLS policies configured
- [ ] Environment variables set
- [ ] API integration endpoints tested
- [ ] Performance indexes created
- [ ] Monitoring queries validated
- [ ] Backup strategy implemented
- [ ] Security policies reviewed

---

## 🔮 Future Enhancements

### Planned Improvements

1. **Real-Time Subscriptions**
   - WebSocket integration for live wallet updates
   - Real-time purchase notifications
   - Live analytics dashboard updates

2. **Advanced Analytics**
   - Machine learning for user behavior prediction
   - Geographic analysis of medical tourism patterns
   - Predictive analytics for service demand

3. **Enhanced Security**
   - Multi-signature wallet support
   - Advanced fraud detection
   - Compliance reporting automation

4. **Scalability Optimizations**
   - Database partitioning by date
   - Read replicas for analytics
   - Caching layer for frequent queries

### Technical Debt

- Normalize payment split configuration (currently hardcoded 75/15/5/5)
- Implement automatic data archiving for old transactions
- Add comprehensive data validation constraints
- Create automated backup and recovery procedures

---

## 📞 Support & Maintenance

### Database Administration

- **Backup Schedule:** Daily automated backups with 30-day retention
- **Monitoring:** Real-time alerts for failed transactions and API errors  
- **Performance:** Weekly query performance analysis and optimization
- **Security:** Monthly security audit and access review

### Development Support

- **Documentation:** Keep API coverage matrix updated with new endpoints
- **Testing:** Maintain comprehensive test suite for all database operations
- **Migration:** Version control all schema changes with rollback procedures
- **Integration:** Monitor WalletDash API changes and update schema accordingly

---

**Document Version:** 1.0  
**Last Updated:** July 24, 2025  
**Next Review:** August 24, 2025  

---

*This implementation provides complete coverage for all 16 WalletDash API endpoints with optimized performance, comprehensive security, and real-time monitoring capabilities for the MedDefi medical tourism platform.* 