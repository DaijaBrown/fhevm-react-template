/**
 * API type definitions for Next.js routes
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface EncryptionApiRequest {
  value: any;
  type: string;
  contractAddress: string;
  userAddress: string;
}

export interface DecryptionApiRequest {
  encryptedValue: string;
  type: string;
  userAddress: string;
  contractAddress: string;
  signature?: string;
}

export interface ComputationApiRequest {
  operation: string;
  operands: string[];
  type?: string;
}

export interface KeyManagementRequest {
  action: 'fetch' | 'refresh' | 'validate';
  contractAddress: string;
}

export interface FHEApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
}
