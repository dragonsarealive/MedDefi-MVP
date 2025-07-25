# Netlify Environment Variables Setup
## Required for MedDefi MVP Deployment

### 🚀 **Set these variables in Netlify Dashboard:**
**URL: https://app.netlify.com/sites/meddefi-mvp-dev/settings/deploys#environment-variables**

```bash
# ==============================================
# SUPABASE CONFIGURATION (REQUIRED)
# ==============================================
NEXT_PUBLIC_SUPABASE_URL=https://lmryszvrzytmfzljkfru.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# ==============================================
# WALLETDASH API (ALREADY CONFIGURED)
# ==============================================
NEXT_PUBLIC_WALLETDASH_API_URL=https://backend-medefi-walletdash.up.railway.app
NEXT_PUBLIC_WALLETDASH_API_TIMEOUT=10000

# ==============================================
# FRONTEND CONFIGURATION
# ==============================================
NEXT_PUBLIC_APP_URL=https://meddefi-mvp-dev.netlify.app
NEXT_PUBLIC_APP_NAME=MedDefi MVP
NODE_ENV=production

# ==============================================
# BLOCKCHAIN CONFIGURATION (OPTIONAL)
# ==============================================
NEXT_PUBLIC_BLOCKCHAIN_NETWORK=Starknet Sepolia Testnet
NEXT_PUBLIC_BLOCKCHAIN_EXPLORER=https://sepolia.starkscan.co
```

### 🎯 **Critical Variables Needed:**

1. **NEXT_PUBLIC_SUPABASE_URL** = `https://lmryszvrzytmfzljkfru.supabase.co`
2. **SUPABASE_SERVICE_ROLE_KEY** = *(You need to get this from Supabase Dashboard)*
3. **NEXT_PUBLIC_WALLETDASH_API_URL** = `https://backend-medefi-walletdash.up.railway.app`
4. **NEXT_PUBLIC_APP_URL** = `https://meddefi-mvp-dev.netlify.app`

### 📋 **Steps to Complete Deployment:**

1. **Go to Netlify Dashboard:** https://app.netlify.com/sites/meddefi-mvp-dev/settings/deploys#environment-variables
2. **Add each environment variable above**
3. **Get SUPABASE_SERVICE_ROLE_KEY from:** https://supabase.com/dashboard/project/lmryszvrzytmfzljkfru/settings/api
4. **Trigger a redeploy** (or wait for auto-deploy to complete)

### 🎉 **After Setup - Test at:**
https://meddefi-mvp-dev.netlify.app/integration-demo

### 🧪 **Expected Functionality:**
- ✅ Patient Registration → Real 5 STRK wallet creation
- ✅ Doctor Registration → Real 2 STRK wallet creation  
- ✅ Practice Creation → Real smart contract deployment
- ✅ Service Creation → Real blockchain contracts
- ✅ Service Purchase → Real STRK transactions
- ✅ Debug Terminal → Live blockchain/API/database logs

### 🔍 **Debugging:**
- All operations logged in real-time via TestingTerminal
- Check browser console for any errors
- Verify environment variables are set correctly
- Ensure Supabase service role key has proper permissions 