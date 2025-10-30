/**
 * FHE-specific type definitions for Next.js example
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

export interface EncryptedValue {
  data: string;
  type: FHEType;
  timestamp: number;
}

export interface FHEOperation {
  id: string;
  type: 'encrypt' | 'decrypt' | 'compute';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: number;
  result?: any;
  error?: string;
}

export interface FHEClientState {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  network: string;
  contractAddress: string | null;
}

export interface ComputationRequest {
  operation: string;
  operands: EncryptedValue[];
  resultType: FHEType;
}

export interface DecryptionRequest {
  encryptedValue: string;
  type: FHEType;
  userAddress: string;
  signature: string;
}
