// WalletDash API Types - Complete coverage for all 16 endpoints
// Based on BACKEND_API_DOCUMENTATION.md

export type UserType = 'Medical' | 'Individual' | 'Finance' | 'Gaming' | 'Social' | 'Enterprise';

export interface WalletCreateRequest {
  user_id: string;
  user_type?: UserType;
  custom_data?: string;
}

export interface WalletCreateResponse {
  success: boolean;
  data: {
    wallet_address: string;
    claim_token: string;
    user_type: UserType;
    system_managed: boolean;
    auto_funded: boolean;
    funding_amount_strk: string;
    funding_transaction_hash: string;
    ready_for_transactions: boolean;
    metadata: {
      user_type: number;
      permissions: number;
      custom_data: string;
      created_at: number;
    };
    transaction_hash: string;
  };
  message: string;
}

export interface WalletClaimRequest {
  claim_token: string;
  new_owner_public_key: string;
}

export interface WalletClaimResponse {
  success: boolean;
  data: {
    wallet_address: string;
    claim_token: string;
    new_owner: string;
    transaction_hash: string;
    claimed_at: string;
  };
  message: string;
}

export interface WalletClaimStatusResponse {
  success: boolean;
  data: {
    claim_token: string;
    wallet_address: string;
    user_id: string;
    user_type: UserType;
    claimed: boolean;
    created_at: string;
    transaction_hash: string;
    metadata: {
      user_type: number;
      permissions: number;
      created_at: number;
    };
    blockchain_verification: {
      verified: boolean;
      current_owner: string | null;
      ownership_confirmed?: boolean;
    };
    claimed_at?: string;
    new_owner_public_key?: string;
    claim_transaction_hash?: string;
  };
  message: string;
}

export interface PracticeCreateRequest {
  user_id: string;
  name: string;
  specialty: string;
  location: string;
}

export interface PracticeCreateResponse {
  success: boolean;
  data: {
    id: number;
    user_id: string;
    name: string;
    specialty: string;
    location: string;
    owner_wallet: string;
    contract_address: string;
    factory_address: string;
    transaction_hash: string;
    created_at: string;
    active: boolean;
  };
  message: string;
}

export interface ServiceCreateRequest {
  practice_id: number;
  name: string;
  description: string;
  price_usd: number;
}

export interface ServiceCreateResponse {
  success: boolean;
  data: {
    id: number;
    practice_id: number;
    practice_name: string;
    name: string;
    description: string;
    price_usd: number;
    price_usd_cents: number;
    contract_address: string;
    factory_address: string;
    transaction_hash: string;
    created_at: string;
    active: boolean;
  };
  message: string;
}

export interface ServicePurchaseRequest {
  service_id: number;
  buyer_user_id: string;
}

export interface ServicePurchaseResponse {
  success: boolean;
  data: {
    id: number;
    service_id: number;
    service_name: string;
    practice_id: number;
    practice_name: string;
    buyer_user_id: string;
    buyer_wallet: string;
    medic_wallet: string;
    amount_usd: number;
    amount_strk: number;
    payment_split: {
      medic: number;
      treasury: number;
      liquidity: number;
      rewards: number;
    };
    transaction_hash: string;
    purchased_at: string;
    completed: boolean;
  };
  message: string;
}

export interface OracleHealthResponse {
  success: boolean;
  data: {
    oracle_service: string;
    last_update: string;
    update_frequency: string;
    source: string;
    status: string;
    current_usd_strk_rate: number;
    test_conversions: {
      [key: string]: string;
    };
    oracle_integration: string;
    timestamp: string;
  };
  message: string;
}

export interface AnalyticsUserTypesResponse {
  success: boolean;
  data: {
    overview: {
      total_wallets: number;
      claimed_wallets: number;
      unclaimed_wallets: number;
      total_user_types: number;
      active_user_types: number;
    };
    user_types: {
      [key in UserType]: {
        total_wallets: number;
        claimed_wallets: number;
        unclaimed_wallets: number;
        percentage_of_total: number;
        claim_rate_percentage: number;
        unique_users: number;
        average_wallets_per_user: number;
        recent_activity: {
          wallets_created_24h: number;
          most_recent_creation: string;
        };
        permissions_info: {
          default_permissions: number;
          user_type_value: number;
        };
      };
    };
    rankings: {
      by_total_wallets: Array<{
        user_type: UserType;
        total_wallets: number;
        percentage: number;
      }>;
      by_claim_rate: Array<{
        user_type: UserType;
        claim_rate: number;
      }>;
    };
    insights: {
      most_popular_type: string;
      highest_claim_rate_type: string;
      total_user_types_used: number;
      average_claim_rate_across_types: string;
    };
    timestamps: {
      generated_at: string;
      analysis_period: string;
    };
  };
  message: string;
}

// Database Types from DATABASE_IMPLEMENTATION_GUIDE.md
export interface DatabaseProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  user_type: string | null;
  country: string | null;
  blockchain_user_type: UserType | null;
  wallet_claimed: boolean;
  wallet_funding_amount: number | null;
  active_wallet_id: string | null;
  onboarding_step: number;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseBlockchainWallet {
  id: string;
  profile_id: string;
  wallet_address: string;
  claim_token: string;
  user_id: string;
  user_type: UserType;
  system_managed: boolean;
  auto_funded: boolean;
  funding_amount_strk: number;
  funding_transaction_hash: string | null;
  ready_for_transactions: boolean;
  metadata: any;
  creation_transaction_hash: string | null;
  claimed: boolean;
  claimed_at: string | null;
  new_owner_public_key: string | null;
  claim_transaction_hash: string | null;
  blockchain_verification: any;
  created_at: string;
  updated_at: string;
}

export interface DatabaseMedicalPractice {
  id: number;
  doctor_id: string;
  wallet_id: string | null;
  backend_practice_id: number | null;
  name: string;
  specialty: string;
  location: string;
  owner_wallet: string;
  contract_address: string;
  factory_address: string;
  transaction_hash: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseMedicalService {
  id: string;
  doctor_id: string | null;
  name: string;
  description: string | null;
  price_usd: number;
  duration_minutes: number | null;
  backend_service_id: number | null;
  service_contract_address: string | null;
  backend_practice_id: number | null;
  practice_name: string | null;
  price_usd_cents: number | null;
  factory_address: string | null;
  service_transaction_hash: string | null;
  practice_id: number | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// API Response Logging
export interface ApiLogEntry {
  endpoint: string;
  method: string;
  profile_id?: string;
  user_id?: string;
  request_data: any;
  response_data: any;
  success: boolean;
  error_message?: string;
  http_status_code?: number;
  response_time_ms?: number;
  request_timestamp: string;
}

// Frontend Form Types
export interface UserRegistrationForm {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  userType: 'patient' | 'doctor';
  specialty?: string; // Only for doctors
  bio?: string; // Only for doctors
  city?: string; // Only for doctors
}

export interface PracticeForm {
  name: string;
  specialty: string;
  location: string;
}

export interface ServiceForm {
  name: string;
  description: string;
  price_usd: number;
  duration_minutes?: number;
}

// Error types
export interface ApiError {
  success: false;
  error: string;
  message: string;
}

// Unified response type
export type ApiResponse<T> = T | ApiError;

// Testing Terminal Types
export interface TerminalLog {
  id: string;
  timestamp: string;
  type: 'api' | 'database' | 'blockchain' | 'info' | 'error' | 'success';
  title: string;
  details: any;
  duration?: number;
} 