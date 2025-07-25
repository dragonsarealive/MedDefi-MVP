-- MedDefi MVP Database Setup Script
-- Run this in your Supabase SQL Editor to set up all required tables

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. ENHANCED PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  -- Core identity
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT,
  last_name TEXT,
  username TEXT UNIQUE,
  user_type TEXT CHECK (user_type IN ('doctor', 'patient', 'Medical', 'Individual', 'Finance', 'Gaming', 'Social', 'Enterprise')),
  country TEXT,
  
  -- Onboarding tracking
  onboarding_step INTEGER DEFAULT 1,
  onboarding_completed BOOLEAN DEFAULT false,
  
  -- Enhanced blockchain integration
  blockchain_user_type TEXT CHECK (blockchain_user_type IN ('Medical', 'Individual', 'Finance', 'Gaming', 'Social', 'Enterprise')),
  wallet_claimed BOOLEAN DEFAULT false,
  wallet_funding_amount NUMERIC(20,2),
  active_wallet_id UUID, -- Will reference blockchain_wallets(id)
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. DOCTOR PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS doctor_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  specialty TEXT,
  bio TEXT,
  experience_years INTEGER,
  photo_url TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  country TEXT,
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. BLOCKCHAIN WALLETS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS blockchain_wallets (
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

-- Add foreign key constraint for active_wallet_id
ALTER TABLE profiles ADD CONSTRAINT fk_profiles_active_wallet 
  FOREIGN KEY (active_wallet_id) REFERENCES blockchain_wallets(id);

-- =============================================
-- 4. MEDICAL PRACTICES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS medical_practices (
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

-- =============================================
-- 5. MEDICAL SERVICES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS medical_services (
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

-- =============================================
-- 6. SERVICE PURCHASES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS service_purchases (
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

-- =============================================
-- 7. ORACLE EXCHANGE RATES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS oracle_exchange_rates (
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

-- =============================================
-- 8. ANALYTICS TABLES
-- =============================================
CREATE TABLE IF NOT EXISTS analytics_user_types (
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

CREATE TABLE IF NOT EXISTS analytics_claim_rates (
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

-- =============================================
-- 9. API RESPONSE LOGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS api_response_logs (
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

-- =============================================
-- PERFORMANCE INDEXES
-- =============================================

-- Blockchain wallets indexes
CREATE INDEX IF NOT EXISTS idx_blockchain_wallets_user_id ON blockchain_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_wallets_claim_token ON blockchain_wallets(claim_token);
CREATE INDEX IF NOT EXISTS idx_blockchain_wallets_wallet_address ON blockchain_wallets(wallet_address);
CREATE INDEX IF NOT EXISTS idx_blockchain_wallets_profile_id ON blockchain_wallets(profile_id);

-- Medical practices indexes
CREATE INDEX IF NOT EXISTS idx_medical_practices_backend_id ON medical_practices(backend_practice_id);
CREATE INDEX IF NOT EXISTS idx_medical_practices_doctor_id ON medical_practices(doctor_id);

-- Medical services indexes
CREATE INDEX IF NOT EXISTS idx_medical_services_practice_id ON medical_services(practice_id);
CREATE INDEX IF NOT EXISTS idx_medical_services_doctor_id ON medical_services(doctor_id);
CREATE INDEX IF NOT EXISTS idx_medical_services_backend_id ON medical_services(backend_service_id);

-- Service purchases indexes
CREATE INDEX IF NOT EXISTS idx_service_purchases_patient_id ON service_purchases(patient_id);
CREATE INDEX IF NOT EXISTS idx_service_purchases_service_id ON service_purchases(service_id);

-- Oracle exchange rates indexes
CREATE INDEX IF NOT EXISTS idx_oracle_rates_timestamp ON oracle_exchange_rates(created_at DESC);

-- API logging indexes
CREATE INDEX IF NOT EXISTS idx_api_logs_endpoint ON api_response_logs(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_logs_profile_id ON api_response_logs(profile_id);
CREATE INDEX IF NOT EXISTS idx_api_logs_timestamp ON api_response_logs(created_at DESC);

-- =============================================
-- OPTIMIZED VIEWS
-- =============================================

-- 1. Complete Doctor Profiles View
CREATE OR REPLACE VIEW complete_doctor_profiles AS
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

-- 2. Complete Patient Profiles View
CREATE OR REPLACE VIEW complete_patient_profiles AS
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

-- 3. Complete Service Listings View
CREATE OR REPLACE VIEW complete_service_listings AS
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
  p.country,
  
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

-- Success message
SELECT 'MedDefi database schema setup completed successfully!' as message; 