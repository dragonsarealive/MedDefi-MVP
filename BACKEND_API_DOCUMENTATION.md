# MeDefi WalletDash API Documentation

**Base URL:** `https://backend-medefi-walletdash.up.railway.app`  
**Generated:** From actual backend code analysis (simple-wallet-api.js)  
**API Pattern:** Progressive decentralization with system account management

---

## 📊 CORE WALLET ENDPOINTS

### 1. POST /wallet/create
**Purpose:** Create a new blockchain wallet with automatic funding  
**Description:** This endpoint creates a new Starknet wallet for users with automatic STRK funding based on user type. The wallet is initially managed by the system account until the user claims ownership through the progressive decentralization pattern. Medical users receive 2 STRK for practice/service creation, while Individual users receive 5 STRK for service purchases. The wallet is immediately ready for transactions upon creation.  

**Parameter Dependencies:**
- **Input Dependencies:** None (Entry point endpoint)
- **Provides for other endpoints:** 
  - `user_id` → Used in `/wallet/user/{userId}`, `/practice/create`, `/service/purchase`, `/debug/system-account`
  - `claim_token` → Used in `/wallet/claim`, `/wallet/claim-status/{claimToken}`
  - `wallet_address` → Referenced in practice/service ownership

**Request:**
```json
{
  "user_id": "string (required)",
  "user_type": "string (optional, default: 'Medical')",
  "custom_data": "string (optional, default: '0')"
}
```

**Valid user_type values:**
- `"Medical"` - 2 STRK funding
- `"Individual"` - 5 STRK funding  
- `"Finance"` - 3 STRK funding
- `"Gaming"` - 2 STRK funding
- `"Social"` - 2 STRK funding
- `"Enterprise"` - 10 STRK funding

**Success Response:**
```json
{
  "success": true,
  "data": {
    "wallet_address": "0x06ab129cb3779ff02c5c96bc99551a3aee7ee3c0331397b4cc2fc589629417bc",
    "claim_token": "claim_test-medical-corrected-1753300530525_1753300565961",
    "user_type": "Medical",
    "system_managed": true,
    "auto_funded": true,
    "funding_amount_strk": "2.0",
    "funding_transaction_hash": "0x56a9078105ba92f6c4c1589c4962c88638ec265cd5978c2a49712555e1b103e",
    "ready_for_transactions": true,
    "metadata": {
      "user_type": 0,
      "permissions": 100,
      "custom_data": "0",
      "created_at": 1753300565961
    },
    "transaction_hash": "0x56a9078105ba92f6c4c1589c4962c88638ec265cd5978c2a49712555e1b103e"
  },
  "message": "Wallet created and funded successfully - Ready for immediate use!"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "user_id is required",
  "message": "Failed to create wallet"
}
```

---

### 2. GET /wallet/user/{userId}
**Purpose:** Get all wallets for a specific user  
**Description:** Retrieves all wallet information associated with a specific user ID. This endpoint is useful for checking if a user already has wallets before creating new ones, or for displaying user wallet history. Returns wallet metadata, claim status, and funding information for each wallet owned by the user.

**Parameter Dependencies:**
- **Input Dependencies:** 
  - `userId` ← From `/wallet/create` response (`user_id`)
- **Provides for other endpoints:** Wallet verification data for frontend display

**Path Parameters:**
- `userId` - User identifier (string)

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "wallet_address": "0x06ab129cb3779ff02c5c96bc99551a3aee7ee3c0331397b4cc2fc589629417bc",
      "claim_token": "claim_test-medical-corrected-1753300530525_1753300565961",
      "user_type": "Medical",
      "user_id": "test-medical-corrected",
      "claimed": false,
      "created_at": "2025-01-23T09:36:05.961Z",
      "transaction_hash": "0x56a9078105ba92f6c4c1589c4962c88638ec265cd5978c2a49712555e1b103e",
      "metadata": {
        "user_type": 0,
        "permissions": 100,
        "created_at": 1753300565961
      }
    }
  ],
  "count": 1,
  "message": "Found 1 wallet(s) for user test-medical-corrected"
}
```

**Error Response (Not Found):**
```json
{
  "success": false,
  "message": "No wallets found for this user",
  "data": []
}
```

---

### 3. GET /wallet/stats
**Purpose:** Get overall wallet statistics  
**Description:** Provides comprehensive statistics about the entire wallet ecosystem including total wallets created, claim rates, user type distribution, and recent activity. This endpoint is valuable for administrative dashboards, monitoring platform health, and understanding user engagement patterns across different wallet types.

**Parameter Dependencies:**
- **Input Dependencies:** None (Aggregated data endpoint)
- **Provides for other endpoints:** Statistical data for dashboards and analytics

**Success Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_wallets": 2,
      "claimed_wallets": 0,
      "unclaimed_wallets": 2,
      "unique_users": 2,
      "claim_rate_percentage": 0
    },
    "user_types": {
      "Medical": 1,
      "Finance": 0,
      "Gaming": 0,
      "Social": 0,
      "Enterprise": 0,
      "Individual": 1
    },
    "activity": {
      "wallets_created_today": 2,
      "average_wallets_per_user": "1.00"
    },
    "timestamps": {
      "generated_at": "2025-01-23T09:36:48.189Z",
      "server_uptime_since": 143.37
    }
  },
  "message": "Statistics for 2 wallets across 2 users"
}
```

---

### 4. POST /wallet/claim
**Purpose:** Transfer wallet ownership from custody to user  
**Description:** Executes the progressive decentralization process by transferring wallet ownership from the system account to the user's public key. This endpoint is called when users want to take full control of their wallet. Requires the claim token received during wallet creation and the user's public key from their connected wallet (ArgentX/Braavos). Once claimed, the wallet is fully controlled by the user.

**Parameter Dependencies:**
- **Input Dependencies:** 
  - `claim_token` ← From `/wallet/create` response
  - `new_owner_public_key` ← From user's connected wallet (ArgentX/Braavos)
- **Provides for other endpoints:** Claimed wallet status for verification

**Request:**
```json
{
  "claim_token": "string (required)",
  "new_owner_public_key": "string (required, 0x + 64 hex chars)"
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "wallet_address": "0x06ab129cb3779ff02c5c96bc99551a3aee7ee3c0331397b4cc2fc589629417bc",
    "claim_token": "claim_test-medical-corrected-1753300530525_1753300565961",
    "new_owner": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    "transaction_hash": "0x789...",
    "claimed_at": "2025-01-23T10:00:00.000Z"
  },
  "message": "Wallet ownership transferred successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "claim_token is required",
  "message": "Missing claim token"
}
```

---

### 5. GET /wallet/claim-status/{claimToken}
**Purpose:** Check claim status and verify blockchain ownership  
**Description:** Verifies the current claim status of a wallet using its claim token. This endpoint checks both the backend database status and the actual blockchain state to ensure accuracy. It's essential for confirming whether a wallet has been successfully claimed and for troubleshooting ownership issues. Provides blockchain verification to ensure the recorded owner matches the actual smart contract owner.

**Parameter Dependencies:**
- **Input Dependencies:** 
  - `claimToken` ← From `/wallet/create` response (`claim_token`)
- **Provides for other endpoints:** Claim verification data for UI status display

**Path Parameters:**
- `claimToken` - Claim token identifier (string)

**Success Response (Unclaimed):**
```json
{
  "success": true,
  "data": {
    "claim_token": "claim_test-medical-corrected-1753300530525_1753300565961",
    "wallet_address": "0x06ab129cb3779ff02c5c96bc99551a3aee7ee3c0331397b4cc2fc589629417bc",
    "user_id": "test-medical-corrected",
    "user_type": "Medical",
    "claimed": false,
    "created_at": "2025-01-23T09:36:05.961Z",
    "transaction_hash": "0x56a9078105ba92f6c4c1589c4962c88638ec265cd5978c2a49712555e1b103e",
    "metadata": {
      "user_type": 0,
      "permissions": 100,
      "created_at": 1753300565961
    },
    "blockchain_verification": {
      "verified": false,
      "current_owner": null
    }
  },
  "message": "Wallet is available for claiming"
}
```

**Success Response (Claimed):**
```json
{
  "success": true,
  "data": {
    "claim_token": "claim_test-medical-corrected-1753300530525_1753300565961",
    "wallet_address": "0x06ab129cb3779ff02c5c96bc99551a3aee7ee3c0331397b4cc2fc589629417bc",
    "user_id": "test-medical-corrected",
    "user_type": "Medical",
    "claimed": true,
    "claimed_at": "2025-01-23T10:00:00.000Z",
    "new_owner_public_key": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    "claim_transaction_hash": "0x789...",
    "blockchain_verification": {
      "verified": true,
      "current_owner": "123456789012345678901234567890123456789012345678901234567890123456789012",
      "ownership_confirmed": true
    }
  },
  "message": "Wallet has been claimed and ownership transferred"
}
```

---

## 🏢 MEDICAL PRACTICE ENDPOINTS

### 6. POST /practice/create
**Purpose:** Create a new medical practice (Medical wallet required)  
**Description:** Creates a new medical practice on the blockchain using the factory pattern. Only users with Medical type wallets can create practices. This endpoint deploys a unique practice smart contract and stores practice information including name, specialty, and location. The practice is owned by the medical professional's wallet and serves as the foundation for creating medical services that can be purchased by patients.

**Parameter Dependencies:**
- **Input Dependencies:** 
  - `user_id` ← From `/wallet/create` response (Medical type wallet required)
- **Provides for other endpoints:** 
  - `id` (practice_id) → Used in `/service/create`, `/practice/{id}`
  - `contract_address` → Referenced in service creation

**Request:**
```json
{
  "user_id": "string (required)",
  "name": "string (required)",
  "specialty": "string (required)",
  "location": "string (required)"
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": "test-medical-corrected",
    "name": "Downtown Medical Center",
    "specialty": "General Medicine",
    "location": "Downtown City",
    "owner_wallet": "0x06ab129cb3779ff02c5c96bc99551a3aee7ee3c0331397b4cc2fc589629417bc",
    "contract_address": "PRACTICE_2_1753300647265",
    "factory_address": "0x266674e277c5f59ef29abdaa5d86c82ec74e731ddc0d0f084770af6771af298",
    "transaction_hash": "0x1d9bd21dae4b9bbf77deac6e13b09966ed6b51d0e816b6b6b2dd06c6aa9f3ee",
    "created_at": "2025-01-23T09:37:27.264Z",
    "active": true
  },
  "message": "Practice \"Downtown Medical Center\" created successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Medical wallet not found",
  "message": "User must have a Medical type wallet to create practices"
}
```

---

### 7. GET /practice/{id}
**Purpose:** Get practice information by ID  
**Description:** Retrieves detailed information about a specific medical practice including its contract address, owner wallet, and metadata. This endpoint is used to display practice details to users, verify practice ownership, and provide information needed for creating services under the practice. Essential for the medical tourism platform's practice discovery and verification process.

**Parameter Dependencies:**
- **Input Dependencies:** 
  - `id` ← From `/practice/create` response (`id`)
- **Provides for other endpoints:** Practice details for UI display and service association

**Path Parameters:**
- `id` - Practice ID (integer)

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": "test-medical-corrected",
    "name": "Downtown Medical Center",
    "specialty": "General Medicine",
    "location": "Downtown City",
    "owner_wallet": "0x06ab129cb3779ff02c5c96bc99551a3aee7ee3c0331397b4cc2fc589629417bc",
    "contract_address": "PRACTICE_2_1753300647265",
    "factory_address": "0x266674e277c5f59ef29abdaa5d86c82ec74e731ddc0d0f084770af6771af298",
    "transaction_hash": "0x1d9bd21dae4b9bbf77deac6e13b09966ed6b51d0e816b6b6b2dd06c6aa9f3ee",
    "created_at": "2025-01-23T09:37:27.264Z",
    "active": true
  },
  "message": "Practice 1 retrieved successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Practice not found",
  "data": null
}
```

---

## 🛍️ SERVICE ENDPOINTS

### 8. POST /service/create
**Purpose:** Create a new medical service (Practice owner required)  
**Description:** Creates a new medical service offering under an existing practice using the factory pattern. Only the practice owner can create services for their practice. Services are priced in USD and deployed as unique smart contracts. This endpoint enables medical professionals to list their treatments, consultations, and procedures for patient booking and payment through the MedDefi platform.

**Parameter Dependencies:**
- **Input Dependencies:** 
  - `practice_id` ← From `/practice/create` response (`id`)
  - Practice owner verification through `user_id` chain
- **Provides for other endpoints:** 
  - `id` (service_id) → Used in `/service/purchase`, `/service/{id}`
  - `contract_address` → Referenced in purchase transactions

**Request:**
```json
{
  "practice_id": "integer (required)",
  "name": "string (required)",
  "description": "string (required)",
  "price_usd": "number (required, > 0)"
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "practice_id": 1,
    "practice_name": "Downtown Medical Center",
    "name": "Basic Medical Consultation",
    "description": "30-minute general consultation",
    "price_usd": 1,
    "price_usd_cents": 100,
    "contract_address": "SERVICE_1_1753300659534",
    "factory_address": "0x397d6ac61422a12f5466403e97748ebfab4548a77474e7e1b9e2d225c29fe8",
    "transaction_hash": "0x51c0b5e92ee2e32fcfd00bf49b21b70ff16b82c5ed22fc9e08cc1f0b717e3ea",
    "created_at": "2025-01-23T09:37:39.534Z",
    "active": true
  },
  "message": "Service created successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "practice_id, name, description, and price_usd are required",
  "message": "Failed to create service"
}
```

---

### 9. GET /service/{id}
**Purpose:** Get service information by ID  
**Description:** Retrieves detailed information about a specific medical service including pricing, description, and associated practice details. This endpoint is essential for displaying service listings to patients, showing service details during the booking process, and providing information needed for the purchase transaction. Returns both service metadata and pricing information.

**Parameter Dependencies:**
- **Input Dependencies:** 
  - `id` ← From `/service/create` response (`id`)
- **Provides for other endpoints:** Service details for purchase confirmation and UI display

**Path Parameters:**
- `id` - Service ID (integer)

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "practice_id": 1,
    "practice_name": "Downtown Medical Center",
    "name": "Basic Medical Consultation",
    "description": "30-minute general consultation",
    "price_usd": 1,
    "price_usd_cents": 100,
    "contract_address": "SERVICE_1_1753300659534",
    "factory_address": "0x397d6ac61422a12f5466403e97748ebfab4548a77474e7e1b9e2d225c29fe8",
    "transaction_hash": "0x51c0b5e92ee2e32fcfd00bf49b21b70ff16b82c5ed22fc9e08cc1f0b717e3ea",
    "created_at": "2025-01-23T09:37:39.534Z",
    "active": true
  },
  "message": "Service 1 retrieved successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Service not found",
  "data": null
}
```

---

### 10. POST /service/purchase
**Purpose:** Purchase a medical service with automatic payment splitting  
**Description:** Processes a medical service purchase with automatic payment distribution using the oracle for USD to STRK conversion. Implements the 75/15/5/5 payment split (medic/treasury/liquidity/rewards) automatically. This endpoint handles the complete payment flow from Individual user wallets, ensuring medical professionals receive 75% of payments while supporting platform operations and ecosystem growth.

**Parameter Dependencies:**
- **Input Dependencies:** 
  - `service_id` ← From `/service/create` response (`id`)
  - `buyer_user_id` ← From `/wallet/create` response (`user_id`) - Individual wallet required
- **Provides for other endpoints:** 
  - `id` (purchase_id) → Used in `/purchase/{id}`
  - Transaction data for purchase history

**Request:**
```json
{
  "service_id": "integer (required)",
  "buyer_user_id": "string (required)"
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "service_id": 1,
    "service_name": "Basic Medical Consultation",
    "practice_id": 1,
    "practice_name": "Downtown Medical Center",
    "buyer_user_id": "test-individual-corrected",
    "buyer_wallet": "0x01b65616d378a99836df4d243522a4f1ecc2d0f26eec33bb8f4401922ada9ef0",
    "medic_wallet": "0x06ab129cb3779ff02c5c96bc99551a3aee7ee3c0331397b4cc2fc589629417bc",
    "amount_usd": 1,
    "amount_strk": 21050,
    "payment_split": {
      "medic": 15787,
      "treasury": 3157,
      "liquidity": 1052,
      "rewards": 1054
    },
    "transaction_hash": "0x53fcfcb95b51f69b25ac13f9b426c9b5b16b97ff9bfb34506b7ad95fcaec2dd",
    "purchased_at": "2025-01-23T09:37:53.175Z",
    "completed": true
  },
  "message": "Service purchased successfully with payment split"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "service_id and buyer_user_id are required",
  "message": "Failed to purchase service"
}
```

---

## 💰 PURCHASE & ORACLE ENDPOINTS

### 11. GET /purchase/{id}
**Purpose:** Get purchase information by ID  
**Description:** Retrieves detailed transaction information for a completed service purchase including payment amounts, STRK conversion rates, payment split details, and transaction hashes. This endpoint is essential for purchase confirmations, transaction history, accounting purposes, and providing users with detailed payment breakdowns showing how their payment was distributed across the ecosystem.

**Parameter Dependencies:**
- **Input Dependencies:** 
  - `id` ← From `/service/purchase` response (`id`)
- **Provides for other endpoints:** Transaction details for accounting and user history display

**Path Parameters:**
- `id` - Purchase ID (integer)

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "service_id": 1,
    "service_name": "Basic Medical Consultation",
    "practice_id": 1,
    "practice_name": "Downtown Medical Center",
    "buyer_user_id": "test-individual-corrected",
    "buyer_wallet": "0x01b65616d378a99836df4d243522a4f1ecc2d0f26eec33bb8f4401922ada9ef0",
    "medic_wallet": "0x06ab129cb3779ff02c5c96bc99551a3aee7ee3c0331397b4cc2fc589629417bc",
    "amount_usd": 1,
    "amount_strk": 21050,
    "payment_split": {
      "medic": 15787,
      "treasury": 3157,
      "liquidity": 1052,
      "rewards": 1054
    },
    "transaction_hash": "0x53fcfcb95b51f69b25ac13f9b426c9b5b16b97ff9bfb34506b7ad95fcaec2dd",
    "purchased_at": "2025-01-23T09:37:53.175Z",
    "completed": true
  },
  "message": "Purchase 1 retrieved successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Purchase not found",
  "data": null
}
```

---

### 12. GET /oracle/health
**Purpose:** Check Oracle service health and test USD to STRK conversions  
**Description:** Monitors the health and functionality of the Pragma Oracle integration used for USD to STRK price conversions. This endpoint provides real-time exchange rates, tests conversion accuracy with sample amounts, and ensures the oracle service is operational. Critical for maintaining accurate pricing in the medical tourism platform where services are priced in USD but paid in STRK.

**Parameter Dependencies:**
- **Input Dependencies:** None (Health monitoring endpoint)
- **Provides for other endpoints:** Oracle health status for payment system validation

**Success Response:**
```json
{
  "success": true,
  "data": {
    "oracle_service": "online",
    "last_update": "2025-01-23T09:36:48.189Z",
    "update_frequency": "continuous",
    "source": "Pragma Oracle with fallback",
    "status": "operational",
    "current_usd_strk_rate": 0.0475,
    "test_conversions": {
      "$50": "21052 STRK",
      "$100": "42105 STRK",
      "$500": "210526 STRK",
      "$1000": "421052 STRK",
      "$15000": "6315789 STRK"
    },
    "oracle_integration": "Pragma Oracle with fallback rate",
    "timestamp": "2025-01-23T09:36:48.189Z"
  },
  "message": "Oracle service operational"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Oracle service error",
  "message": "Connection failed"
}
```

---

## 📈 ANALYTICS ENDPOINTS

### 13. GET /analytics/user-types
**Purpose:** Get detailed user type analytics and statistics  
**Description:** Provides comprehensive analytics on wallet distribution across different user types (Medical, Individual, Enterprise, etc.) including adoption rates, activity metrics, and user behavior patterns. This endpoint supports business intelligence, user segmentation analysis, and platform optimization by showing which user types are most active and engaged with the medical tourism ecosystem.

**Parameter Dependencies:**
- **Input Dependencies:** None (Aggregated analytics endpoint)
- **Provides for other endpoints:** User segmentation data for business intelligence dashboards

**Success Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_wallets": 2,
      "claimed_wallets": 0,
      "unclaimed_wallets": 2,
      "total_user_types": 6,
      "active_user_types": 2
    },
    "user_types": {
      "Medical": {
        "total_wallets": 1,
        "claimed_wallets": 0,
        "unclaimed_wallets": 1,
        "percentage_of_total": 50.00,
        "claim_rate_percentage": 0.00,
        "unique_users": 1,
        "average_wallets_per_user": 1.00,
        "recent_activity": {
          "wallets_created_24h": 1,
          "most_recent_creation": "2025-01-23T09:36:05.961Z"
        },
        "permissions_info": {
          "default_permissions": 100,
          "user_type_value": 0
        }
      },
      "Individual": {
        "total_wallets": 1,
        "claimed_wallets": 0,
        "unclaimed_wallets": 1,
        "percentage_of_total": 50.00,
        "claim_rate_percentage": 0.00,
        "unique_users": 1,
        "average_wallets_per_user": 1.00,
        "recent_activity": {
          "wallets_created_24h": 1,
          "most_recent_creation": "2025-01-23T09:36:43.456Z"
        },
        "permissions_info": {
          "default_permissions": 10,
          "user_type_value": 5
        }
      }
    },
    "rankings": {
      "by_total_wallets": [
        {
          "user_type": "Medical",
          "total_wallets": 1,
          "percentage": 50.00
        },
        {
          "user_type": "Individual",
          "total_wallets": 1,
          "percentage": 50.00
        }
      ],
      "by_claim_rate": []
    },
    "insights": {
      "most_popular_type": "Medical",
      "highest_claim_rate_type": "None",
      "total_user_types_used": 2,
      "average_claim_rate_across_types": "0.00"
    },
    "timestamps": {
      "generated_at": "2025-01-23T09:36:48.189Z",
      "analysis_period": "24_hours"
    }
  },
  "message": "User type analytics for 2 wallets across 2 active user types"
}
```

---

### 14. GET /analytics/claim-rate
**Purpose:** Get detailed claim rate analytics with time-based trends  
**Description:** Analyzes wallet claim patterns and trends over time, providing insights into user engagement with the progressive decentralization process. Tracks claim rates by user type, time periods, and claim speed metrics. This data is crucial for understanding user adoption of wallet ownership and optimizing the transition from custodial to self-custodial wallet management in the medical tourism context.

**Parameter Dependencies:**
- **Input Dependencies:** None (Aggregated analytics endpoint)
- **Provides for other endpoints:** Claim trend data for progressive decentralization optimization

**Success Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_wallets": 2,
      "claimed_wallets": 0,
      "unclaimed_wallets": 2,
      "overall_claim_rate_percentage": 0.00,
      "performance_rating": "Needs Improvement"
    },
    "time_based_analysis": {
      "1h": {
        "total_wallets": 2,
        "claimed_wallets": 0,
        "unclaimed_wallets": 2,
        "claim_rate_percentage": 0.00
      },
      "24h": {
        "total_wallets": 2,
        "claimed_wallets": 0,
        "unclaimed_wallets": 2,
        "claim_rate_percentage": 0.00
      },
      "7d": {
        "total_wallets": 2,
        "claimed_wallets": 0,
        "unclaimed_wallets": 2,
        "claim_rate_percentage": 0.00
      },
      "30d": {
        "total_wallets": 2,
        "claimed_wallets": 0,
        "unclaimed_wallets": 2,
        "claim_rate_percentage": 0.00
      }
    },
    "user_type_claim_rates": {
      "Medical": {
        "total_wallets": 1,
        "claimed_wallets": 0,
        "unclaimed_wallets": 1,
        "claim_rate_percentage": 0.00,
        "permissions_level": 100
      },
      "Individual": {
        "total_wallets": 1,
        "claimed_wallets": 0,
        "unclaimed_wallets": 1,
        "claim_rate_percentage": 0.00,
        "permissions_level": 10
      }
    },
    "claim_speed_analysis": {
      "statistics": {
        "total_claimed_wallets": 0,
        "average_claim_time_minutes": 0,
        "fastest_claim_minutes": 0,
        "slowest_claim_minutes": 0
      },
      "individual_claims": []
    },
    "trends": {
      "hourly_data": [
        {
          "hour": "2025-01-22T10:00:00Z",
          "wallets_created": 0,
          "wallets_claimed": 0,
          "claim_rate": 0
        }
      ],
      "trending_direction": "Declining"
    },
    "insights": {
      "overall_performance": "Needs Improvement",
      "best_performing_user_type": "Medical",
      "worst_performing_user_type": "Individual",
      "claim_speed_assessment": "Fast",
      "trending_direction": "Declining"
    },
    "medical_tourism_insights": {
      "medical_wallets_claim_rate": 0.00,
      "medical_vs_overall": "Below Average",
      "enterprise_adoption": 0.00,
      "individual_patient_rate": 0.00
    },
    "timestamps": {
      "generated_at": "2025-01-23T09:36:48.189Z",
      "analysis_period": "last_30_days"
    }
  },
  "message": "Claim rate analytics for 2 wallets with 0.00% overall claim rate"
}
```

---

## 🔧 DEBUG & HEALTH ENDPOINTS

### 15. POST /debug/system-account
**Purpose:** Debug and test system account pattern functionality  
**Description:** Provides debugging and validation capabilities for the system account architecture used in the progressive decentralization pattern. This endpoint verifies wallet system management status, validates account configurations, and helps troubleshoot issues with wallet creation or transaction processing. Essential for development, testing, and production debugging of the custodial wallet management system.

**Parameter Dependencies:**
- **Input Dependencies:** 
  - `user_id` ← From `/wallet/create` response (`user_id`) - for testing specific user wallets
- **Provides for other endpoints:** Debug information for troubleshooting other endpoint issues

**Request:**
```json
{
  "user_id": "string (required)"
}
```

**Success Response:**
```json
{
  "success": true,
  "debug": "System account pattern validation completed",
  "wallet_info": {
    "wallet_address": "0x06ab129cb3779ff02c5c96bc99551a3aee7ee3c0331397b4cc2fc589629417bc",
    "system_managed": true,
    "user_type": "Medical",
    "auto_funded": true
  },
  "system_account": {
    "exists": true,
    "address": "0x07458d134151De3fFb903eAf6F9ba7Fd7712d89215B9cCa4Fac5539A4C1d2351"
  },
  "architecture": "system_account_pattern",
  "ready_for_medical_transactions": true
}
```

**Error Response:**
```json
{
  "success": false,
  "debug": "Medical wallet not found in backend storage",
  "wallets_count": 2,
  "available_user_ids": [
    {
      "user_id": "test-medical-corrected",
      "type": "Medical"
    },
    {
      "user_id": "test-individual-corrected",
      "type": "Individual"
    }
  ]
}
```

---

### 16. GET /health
**Purpose:** Basic API health check  
**Description:** Simple endpoint to verify that the API server is running and responsive. This endpoint is commonly used by monitoring systems, load balancers, and deployment pipelines to ensure service availability. Returns a basic status confirmation without requiring authentication or complex processing, making it ideal for automated health monitoring of the medical tourism platform backend.

**Parameter Dependencies:**
- **Input Dependencies:** None (Health check endpoint)
- **Provides for other endpoints:** API availability status for monitoring systems

**Success Response:**
```json
{
  "status": "OK",
  "message": "Wallet API is running"
}
```

---

## 📋 TESTING WORKFLOW

### Recommended Test Sequence:
1. **Create Medical Wallet:** `POST /wallet/create` (user_type: "Medical")
2. **Create Individual Wallet:** `POST /wallet/create` (user_type: "Individual")  
3. **Create Practice:** `POST /practice/create` (using Medical user_id)
4. **Create Service:** `POST /service/create` (using practice_id, $1 price)
5. **Purchase Service:** `POST /service/purchase` (using Individual user_id)

### Parameter Flow Sequence:
```
1. POST /wallet/create (Medical)
   ├─ Returns: user_id, claim_token, wallet_address
   └─ user_id → Used in /practice/create

2. POST /practice/create
   ├─ Requires: user_id (from step 1)
   ├─ Returns: id (practice_id), contract_address
   └─ practice_id → Used in /service/create

3. POST /service/create
   ├─ Requires: practice_id (from step 2)
   ├─ Returns: id (service_id), contract_address
   └─ service_id → Used in /service/purchase

4. POST /wallet/create (Individual)
   ├─ Returns: user_id, claim_token, wallet_address
   └─ user_id → Used in /service/purchase

5. POST /service/purchase
   ├─ Requires: service_id (from step 3), buyer_user_id (from step 4)
   ├─ Returns: id (purchase_id), transaction details
   └─ purchase_id → Used in /purchase/{id}

6. GET /purchase/{id}
   ├─ Requires: id (from step 5)
   └─ Returns: Complete transaction details
```

### Parameter Persistence Guide:
- **`user_id`**: Store after wallet creation, needed for practice creation and purchases
- **`claim_token`**: Store for later wallet claiming process
- **`practice_id`**: Store after practice creation, needed for service creation
- **`service_id`**: Store after service creation, needed for purchases
- **`purchase_id`**: Store after purchase, needed for transaction details retrieval

### Payment Flow:
- **Medical wallets:** 2 STRK funding for practice/service creation
- **Individual wallets:** 5 STRK funding for service purchases
- **Service purchases:** Automatic 75/15/5/5 payment split (medic/treasury/liquidity/rewards)
- **Oracle conversion:** USD prices converted to STRK using Pragma Oracle

### System Architecture:
- **Progressive Decentralization:** System creates wallets → Users claim ownership  
- **System Account Pattern:** Backend manages transactions until user claims
- **Factory Pattern:** Smart contracts deployed via factory for unique addresses
- **Auto-funding:** Wallets funded immediately upon creation for seamless UX

---

## 🚀 ENVIRONMENT
- **Production URL:** https://backend-medefi-walletdash.up.railway.app
- **Network:** Starknet Sepolia Testnet
- **Smart Contracts:** Verified and deployed factory pattern
- **Authentication:** System account management with ownership transfer
- **Payments:** USD pricing with STRK conversion via Pragma Oracle 