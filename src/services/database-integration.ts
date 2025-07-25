// Database Integration Service
// Handles all Supabase database operations with comprehensive logging

import { createClient } from '@supabase/supabase-js';
import {
  DatabaseProfile,
  DatabaseBlockchainWallet,
  DatabaseMedicalPractice,
  DatabaseMedicalService,
  UserRegistrationForm,
  WalletCreateResponse,
  PracticeCreateResponse,
  ServiceCreateResponse,
  ServicePurchaseResponse,
  ApiLogEntry,
  TerminalLog
} from '@/types/walletdash-api';

class DatabaseIntegrationService {
  private supabase;
  private onLogEntry?: (log: TerminalLog) => void;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }
    
    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  // Set callback for logging database operations
  setLogCallback(callback: (log: TerminalLog) => void) {
    this.onLogEntry = callback;
  }

  private logOperation(type: 'database' | 'info' | 'error' | 'success', title: string, details: any, duration?: number) {
    this.onLogEntry?.({
      id: `db-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type,
      title,
      details,
      duration
    });
  }

  // =============================================
  // USER PROFILE OPERATIONS
  // =============================================

  async createUserProfile(formData: UserRegistrationForm, authUserId: string): Promise<DatabaseProfile> {
    const startTime = Date.now();
    
    try {
      this.logOperation('database', '💾 Creating user profile in Supabase', {
        authUserId,
        userData: { ...formData, password: '[REDACTED]' }
      });

      const profileData = {
        id: authUserId,
        first_name: formData.firstName,
        last_name: formData.lastName,
        user_type: formData.userType,
        country: formData.country,
        blockchain_user_type: formData.userType === 'doctor' ? 'Medical' : 'Individual',
        onboarding_step: 1,
        onboarding_completed: false
      };

      const { data, error } = await this.supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        this.logOperation('error', '❌ Profile creation failed', { error: error.message, profileData }, Date.now() - startTime);
        throw new Error(`Failed to create profile: ${error.message}`);
      }

      // Create doctor profile if user is a doctor
      if (formData.userType === 'doctor') {
        await this.createDoctorProfile(authUserId, formData);
      }

      this.logOperation('success', '✅ Profile created successfully', { profileId: data.id }, Date.now() - startTime);
      return data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logOperation('error', '❌ Profile creation error', { error: errorMessage }, Date.now() - startTime);
      throw error;
    }
  }

  async createDoctorProfile(profileId: string, formData: UserRegistrationForm): Promise<void> {
    const startTime = Date.now();
    
    try {
      this.logOperation('database', '👨‍⚕️ Creating doctor profile', { profileId, specialty: formData.specialty });

      const doctorData = {
        id: profileId,
        specialty: formData.specialty || 'General Medicine',
        bio: formData.bio || '',
        country: formData.country,
        city: formData.city || '',
        verification_status: 'pending'
      };

      const { error } = await this.supabase
        .from('doctor_profiles')
        .insert(doctorData);

      if (error) {
        this.logOperation('error', '❌ Doctor profile creation failed', { error: error.message }, Date.now() - startTime);
        throw new Error(`Failed to create doctor profile: ${error.message}`);
      }

      this.logOperation('success', '✅ Doctor profile created', { profileId }, Date.now() - startTime);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logOperation('error', '❌ Doctor profile error', { error: errorMessage }, Date.now() - startTime);
      throw error;
    }
  }

  // =============================================
  // BLOCKCHAIN WALLET OPERATIONS
  // =============================================

  async storeBlockchainWallet(
    profileId: string, 
    walletResponse: WalletCreateResponse['data']
  ): Promise<DatabaseBlockchainWallet> {
    const startTime = Date.now();
    
    try {
      this.logOperation('database', '🔗 Storing blockchain wallet data', {
        profileId,
        walletAddress: walletResponse.wallet_address,
        userType: walletResponse.user_type,
        fundingAmount: walletResponse.funding_amount_strk
      });

      const walletData = {
        profile_id: profileId,
        wallet_address: walletResponse.wallet_address,
        claim_token: walletResponse.claim_token,
        user_id: walletResponse.metadata?.user_type?.toString() || profileId,
        user_type: walletResponse.user_type,
        system_managed: walletResponse.system_managed,
        auto_funded: walletResponse.auto_funded,
        funding_amount_strk: parseFloat(walletResponse.funding_amount_strk),
        funding_transaction_hash: walletResponse.funding_transaction_hash,
        ready_for_transactions: walletResponse.ready_for_transactions,
        metadata: walletResponse.metadata,
        creation_transaction_hash: walletResponse.transaction_hash,
        claimed: false
      };

      const { data, error } = await this.supabase
        .from('blockchain_wallets')
        .insert(walletData)
        .select()
        .single();

      if (error) {
        this.logOperation('error', '❌ Wallet storage failed', { error: error.message }, Date.now() - startTime);
        throw new Error(`Failed to store wallet: ${error.message}`);
      }

      // Update profile with wallet reference
      await this.supabase
        .from('profiles')
        .update({ 
          active_wallet_id: data.id,
          wallet_funding_amount: parseFloat(walletResponse.funding_amount_strk)
        })
        .eq('id', profileId);

      this.logOperation('success', '✅ Blockchain wallet stored', { 
        walletId: data.id, 
        address: data.wallet_address 
      }, Date.now() - startTime);

      return data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logOperation('error', '❌ Wallet storage error', { error: errorMessage }, Date.now() - startTime);
      throw error;
    }
  }

  // =============================================
  // MEDICAL PRACTICE OPERATIONS
  // =============================================

  async storeMedicalPractice(
    doctorId: string,
    walletId: string,
    practiceResponse: PracticeCreateResponse['data']
  ): Promise<DatabaseMedicalPractice> {
    const startTime = Date.now();
    
    try {
      this.logOperation('database', '🏥 Storing medical practice', {
        doctorId,
        practiceName: practiceResponse.name,
        backendPracticeId: practiceResponse.id
      });

      const practiceData = {
        doctor_id: doctorId,
        wallet_id: walletId,
        backend_practice_id: practiceResponse.id,
        name: practiceResponse.name,
        specialty: practiceResponse.specialty,
        location: practiceResponse.location,
        owner_wallet: practiceResponse.owner_wallet,
        contract_address: practiceResponse.contract_address,
        factory_address: practiceResponse.factory_address,
        transaction_hash: practiceResponse.transaction_hash,
        active: practiceResponse.active
      };

      const { data, error } = await this.supabase
        .from('medical_practices')
        .insert(practiceData)
        .select()
        .single();

      if (error) {
        this.logOperation('error', '❌ Practice storage failed', { error: error.message }, Date.now() - startTime);
        throw new Error(`Failed to store practice: ${error.message}`);
      }

      this.logOperation('success', '✅ Medical practice stored', { 
        practiceId: data.id,
        backendId: data.backend_practice_id 
      }, Date.now() - startTime);

      return data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logOperation('error', '❌ Practice storage error', { error: errorMessage }, Date.now() - startTime);
      throw error;
    }
  }

  // =============================================
  // MEDICAL SERVICE OPERATIONS
  // =============================================

  async storeMedicalService(
    doctorId: string,
    practiceId: number,
    serviceResponse: ServiceCreateResponse['data']
  ): Promise<DatabaseMedicalService> {
    const startTime = Date.now();
    
    try {
      this.logOperation('database', '⚕️ Storing medical service', {
        doctorId,
        serviceName: serviceResponse.name,
        backendServiceId: serviceResponse.id,
        price: serviceResponse.price_usd
      });

      const serviceData = {
        doctor_id: doctorId,
        practice_id: practiceId,
        name: serviceResponse.name,
        description: serviceResponse.description,
        price_usd: serviceResponse.price_usd,
        backend_service_id: serviceResponse.id,
        service_contract_address: serviceResponse.contract_address,
        backend_practice_id: serviceResponse.practice_id,
        practice_name: serviceResponse.practice_name,
        price_usd_cents: serviceResponse.price_usd_cents,
        factory_address: serviceResponse.factory_address,
        service_transaction_hash: serviceResponse.transaction_hash,
        active: serviceResponse.active
      };

      const { data, error } = await this.supabase
        .from('medical_services')
        .insert(serviceData)
        .select()
        .single();

      if (error) {
        this.logOperation('error', '❌ Service storage failed', { error: error.message }, Date.now() - startTime);
        throw new Error(`Failed to store service: ${error.message}`);
      }

      this.logOperation('success', '✅ Medical service stored', { 
        serviceId: data.id,
        backendId: data.backend_service_id 
      }, Date.now() - startTime);

      return data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logOperation('error', '❌ Service storage error', { error: errorMessage }, Date.now() - startTime);
      throw error;
    }
  }

  // =============================================
  // SERVICE PURCHASE OPERATIONS
  // =============================================

  async storeServicePurchase(
    serviceId: string,
    patientId: string,
    purchaseResponse: ServicePurchaseResponse['data']
  ): Promise<void> {
    const startTime = Date.now();
    
    try {
      this.logOperation('database', '💳 Storing service purchase', {
        serviceId,
        patientId,
        backendPurchaseId: purchaseResponse.id,
        amount: purchaseResponse.amount_usd
      });

      const purchaseData = {
        service_id: serviceId,
        patient_id: patientId,
        backend_purchase_id: purchaseResponse.id,
        transaction_hash: purchaseResponse.transaction_hash,
        amount_usd: purchaseResponse.amount_usd,
        amount_strk: purchaseResponse.amount_strk,
        medic_amount: purchaseResponse.payment_split.medic,
        treasury_amount: purchaseResponse.payment_split.treasury,
        liquidity_amount: purchaseResponse.payment_split.liquidity,
        rewards_amount: purchaseResponse.payment_split.rewards,
        service_name: purchaseResponse.service_name,
        practice_id: purchaseResponse.practice_id,
        practice_name: purchaseResponse.practice_name,
        buyer_user_id: purchaseResponse.buyer_user_id,
        buyer_wallet: purchaseResponse.buyer_wallet,
        medic_wallet: purchaseResponse.medic_wallet,
        status: 'completed',
        completed: purchaseResponse.completed
      };

      const { error } = await this.supabase
        .from('service_purchases')
        .insert(purchaseData);

      if (error) {
        this.logOperation('error', '❌ Purchase storage failed', { error: error.message }, Date.now() - startTime);
        throw new Error(`Failed to store purchase: ${error.message}`);
      }

      this.logOperation('success', '✅ Service purchase stored', { 
        backendPurchaseId: purchaseResponse.id,
        transactionHash: purchaseResponse.transaction_hash
      }, Date.now() - startTime);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logOperation('error', '❌ Purchase storage error', { error: errorMessage }, Date.now() - startTime);
      throw error;
    }
  }

  // =============================================
  // API LOGGING OPERATIONS
  // =============================================

  async logApiInteraction(logEntry: ApiLogEntry): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('api_response_logs')
        .insert({
          endpoint: logEntry.endpoint,
          method: logEntry.method,
          profile_id: logEntry.profile_id || null,
          user_id: logEntry.user_id || null,
          request_data: logEntry.request_data,
          response_data: logEntry.response_data,
          success: logEntry.success,
          error_message: logEntry.error_message || null,
          http_status_code: logEntry.http_status_code || null,
          response_time_ms: logEntry.response_time_ms || null,
          request_timestamp: logEntry.request_timestamp
        });

      if (error) {
        console.error('Failed to log API interaction:', error);
      }
    } catch (error) {
      console.error('Error logging API interaction:', error);
    }
  }

  // =============================================
  // DATA RETRIEVAL OPERATIONS
  // =============================================

  async getUserProfile(userId: string): Promise<DatabaseProfile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to get user profile: ${error.message}`);
    }

    return data;
  }

  async getUserWallet(userId: string): Promise<DatabaseBlockchainWallet | null> {
    const { data, error } = await this.supabase
      .from('blockchain_wallets')
      .select('*')
      .eq('profile_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to get user wallet: ${error.message}`);
    }

    return data;
  }

  async getDoctorPractices(doctorId: string): Promise<DatabaseMedicalPractice[]> {
    const { data, error } = await this.supabase
      .from('medical_practices')
      .select('*')
      .eq('doctor_id', doctorId)
      .eq('active', true);

    if (error) {
      throw new Error(`Failed to get doctor practices: ${error.message}`);
    }

    return data || [];
  }

  async getPracticeServices(practiceId: number): Promise<DatabaseMedicalService[]> {
    const { data, error } = await this.supabase
      .from('medical_services')
      .select('*')
      .eq('practice_id', practiceId)
      .eq('active', true);

    if (error) {
      throw new Error(`Failed to get practice services: ${error.message}`);
    }

    return data || [];
  }

  async getCompleteServiceListings(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('complete_service_listings')
      .select('*');

    if (error) {
      throw new Error(`Failed to get service listings: ${error.message}`);
    }

    return data || [];
  }

  // =============================================
  // UTILITY METHODS  
  // =============================================

  async checkDatabaseConnection(): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      return !error;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseIntegrationService();
export default databaseService; 