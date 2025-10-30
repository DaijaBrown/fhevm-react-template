/**
 * Type definitions for FHEVM SDK
 */

export type FHEType =
  | 'bool'
  | 'uint8'
  | 'uint16'
  | 'uint32'
  | 'uint64'
  | 'uint128'
  | 'uint256'
  | 'address'
  | 'bytes';

export interface FhevmConfig {
  network: string;
  contractAddress: string;
  gatewayUrl?: string;
  rpcUrl?: string;
}

export interface EncryptionOptions {
  type: FHEType;
  contractAddress: string;
  userAddress?: string;
}

export interface DecryptionOptions {
  type: FHEType;
  userAddress: string;
  contractAddress: string;
  signature?: string;
}

export interface EncryptedValue {
  data: string;
  type: FHEType;
  metadata?: {
    timestamp: number;
    version: string;
  };
}

export interface DecryptedValue<T = any> {
  value: T;
  type: FHEType;
}

export interface FhevmError {
  code: string;
  message: string;
  details?: any;
}

export interface PublicKey {
  key: string;
  contractAddress: string;
  expiresAt?: number;
}
