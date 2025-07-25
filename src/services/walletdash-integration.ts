// WalletDash API Integration Service
// Handles all interactions with the blockchain backend

import {
  WalletCreateRequest,
  WalletCreateResponse,
  WalletClaimRequest,
  WalletClaimResponse,
  WalletClaimStatusResponse,
  PracticeCreateRequest,
  PracticeCreateResponse,
  ServiceCreateRequest,
  ServiceCreateResponse,
  ServicePurchaseRequest,
  ServicePurchaseResponse,
  OracleHealthResponse,
  AnalyticsUserTypesResponse,
  ApiResponse,
  ApiError,
  TerminalLog
} from '@/types/walletdash-api';

class WalletDashIntegrationService {
  private baseUrl: string;
  private timeout: number;
  private onLogEntry?: (log: TerminalLog) => void;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_WALLETDASH_API_URL || 'https://backend-medefi-walletdash.up.railway.app';
    this.timeout = parseInt(process.env.NEXT_PUBLIC_WALLETDASH_API_TIMEOUT || '150000'); // 2.5 minutes
  }

  // Set callback for logging API interactions
  setLogCallback(callback: (log: TerminalLog) => void) {
    this.onLogEntry = callback;
  }

  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' = 'GET',
    data?: any,
    profileId?: string,
    userId?: string
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const startTime = Date.now();
    
    const requestData: any = {
      endpoint,
      method,
      profile_id: profileId,
      user_id: userId,
      request_data: data,
      request_timestamp: new Date().toISOString(),
      success: false,
      response_data: null
    };

    try {
      // Log the outgoing request
      this.onLogEntry?.({
        id: `req-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'api',
        title: `🚀 ${method} ${endpoint}`,
        details: {
          url,
          payload: data,
          headers: { 'Content-Type': 'application/json' }
        }
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      const responseData = await response.json();

      // Update request data for logging
      requestData.success = response.ok;
      requestData.response_data = responseData;
      requestData.http_status_code = response.status;
      requestData.response_time_ms = responseTime;

      if (!response.ok) {
        requestData.error_message = `HTTP ${response.status}: ${response.statusText}`;
      }

      // Log the response
      this.onLogEntry?.({
        id: `res-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: response.ok ? 'success' : 'error',
        title: `${response.ok ? '✅' : '❌'} ${method} ${endpoint} (${responseTime}ms)`,
        details: {
          status: response.status,
          statusText: response.statusText,
          data: responseData,
          responseTime: `${responseTime}ms`
        },
        duration: responseTime
      });

      if (!response.ok) {
        return {
          success: false,
          error: responseData.error || `HTTP ${response.status}`,
          message: responseData.message || response.statusText
        } as ApiError;
      }

      return responseData as T;

    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      requestData.error_message = errorMessage;
      requestData.response_time_ms = responseTime;

      // Log the error
      this.onLogEntry?.({
        ...requestData,
        id: `err-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'error',
        title: `❌ ${method} ${endpoint} Failed`,
        details: {
          error: errorMessage,
          responseTime: `${responseTime}ms`
        },
        duration: responseTime
      });

      return {
        success: false,
        error: errorMessage,
        message: 'Network or parsing error occurred'
      } as ApiError;
    }
  }

  // =============================================
  // WALLET ENDPOINTS
  // =============================================

  async createWallet(
    request: WalletCreateRequest,
    profileId?: string
  ): Promise<ApiResponse<WalletCreateResponse>> {
    return this.makeRequest<WalletCreateResponse>(
      '/wallet/create',
      'POST',
      request,
      profileId,
      request.user_id
    );
  }

  async getUserWallets(userId: string, profileId?: string): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(
      `/wallet/user/${userId}`,
      'GET',
      undefined,
      profileId,
      userId
    );
  }

  async getWalletStats(profileId?: string): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(
      '/wallet/stats',
      'GET',
      undefined,
      profileId
    );
  }

  async claimWallet(
    request: WalletClaimRequest,
    profileId?: string
  ): Promise<ApiResponse<WalletClaimResponse>> {
    return this.makeRequest<WalletClaimResponse>(
      '/wallet/claim',
      'POST',
      request,
      profileId
    );
  }

  async getClaimStatus(
    claimToken: string,
    profileId?: string
  ): Promise<ApiResponse<WalletClaimStatusResponse>> {
    return this.makeRequest<WalletClaimStatusResponse>(
      `/wallet/claim-status/${claimToken}`,
      'GET',
      undefined,
      profileId
    );
  }

  // =============================================
  // PRACTICE ENDPOINTS
  // =============================================

  async createPractice(
    request: PracticeCreateRequest,
    profileId?: string
  ): Promise<ApiResponse<PracticeCreateResponse>> {
    return this.makeRequest<PracticeCreateResponse>(
      '/practice/create',
      'POST',
      request,
      profileId,
      request.user_id
    );
  }

  async getPractice(practiceId: number, profileId?: string): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(
      `/practice/${practiceId}`,
      'GET',
      undefined,
      profileId
    );
  }

  // =============================================
  // SERVICE ENDPOINTS
  // =============================================

  async createService(
    request: ServiceCreateRequest,
    profileId?: string
  ): Promise<ApiResponse<ServiceCreateResponse>> {
    return this.makeRequest<ServiceCreateResponse>(
      '/service/create',
      'POST',
      request,
      profileId
    );
  }

  async getService(serviceId: number, profileId?: string): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(
      `/service/${serviceId}`,
      'GET',
      undefined,
      profileId
    );
  }

  async purchaseService(
    request: ServicePurchaseRequest,
    profileId?: string
  ): Promise<ApiResponse<ServicePurchaseResponse>> {
    return this.makeRequest<ServicePurchaseResponse>(
      '/service/purchase',
      'POST',
      request,
      profileId,
      request.buyer_user_id
    );
  }

  // =============================================
  // PURCHASE & ORACLE ENDPOINTS
  // =============================================

  async getPurchase(purchaseId: number, profileId?: string): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(
      `/purchase/${purchaseId}`,
      'GET',
      undefined,
      profileId
    );
  }

  async getOracleHealth(profileId?: string): Promise<ApiResponse<OracleHealthResponse>> {
    return this.makeRequest<OracleHealthResponse>(
      '/oracle/health',
      'GET',
      undefined,
      profileId
    );
  }

  // =============================================
  // ANALYTICS ENDPOINTS
  // =============================================

  async getAnalyticsUserTypes(profileId?: string): Promise<ApiResponse<AnalyticsUserTypesResponse>> {
    return this.makeRequest<AnalyticsUserTypesResponse>(
      '/analytics/user-types',
      'GET',
      undefined,
      profileId
    );
  }

  async getAnalyticsClaimRate(profileId?: string): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(
      '/analytics/claim-rate',
      'GET',
      undefined,
      profileId
    );
  }

  // =============================================
  // DEBUG & HEALTH ENDPOINTS
  // =============================================

  async debugSystemAccount(userId: string, profileId?: string): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(
      '/debug/system-account',
      'POST',
      { user_id: userId },
      profileId,
      userId
    );
  }

  async getHealth(profileId?: string): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(
      '/health',
      'GET',
      undefined,
      profileId
    );
  }

  // =============================================
  // UTILITY METHODS
  // =============================================

  // Check if API is available
  async checkApiHealth(): Promise<boolean> {
    try {
      const response = await this.getHealth();
      return response.success !== false;
    } catch {
      return false;
    }
  }

  // Get funding amount for user type
  getFundingAmount(userType: string): number {
    const fundingMap: { [key: string]: number } = {
      'Medical': 2,
      'Individual': 5,
      'Finance': 3,
      'Gaming': 2,
      'Social': 2,
      'Enterprise': 10
    };
    return fundingMap[userType] || 2;
  }

  // Convert user type from frontend to blockchain
  mapUserType(frontendUserType: 'patient' | 'doctor'): 'Individual' | 'Medical' {
    return frontendUserType === 'doctor' ? 'Medical' : 'Individual';
  }
}

// Export singleton instance
export const walletDashService = new WalletDashIntegrationService();
export default walletDashService; 