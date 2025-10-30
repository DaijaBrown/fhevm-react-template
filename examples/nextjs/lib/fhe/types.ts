/**
 * Type definitions for FHE operations
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

export interface EncryptionInput<T = any> {
  value: T;
  type: FHEType;
  contractAddress: string;
  userAddress: string;
}

export interface EncryptionResult {
  encrypted: string;
  type: FHEType;
  timestamp: number;
}

export interface DecryptionInput {
  encryptedValue: string;
  type: FHEType;
  userAddress: string;
  contractAddress: string;
  signature?: string;
}

export interface DecryptionResult<T = any> {
  value: T;
  type: FHEType;
  timestamp: number;
}

export interface ComputationOperation {
  operation: 'add' | 'sub' | 'mul' | 'div' | 'eq' | 'ne' | 'gte' | 'gt' | 'lte' | 'lt' | 'min' | 'max' | 'and' | 'or' | 'xor' | 'not';
  operands: string[];
  type: FHEType;
}

export interface FHEError {
  code: string;
  message: string;
  details?: any;
}

export interface FHEConfig {
  network: 'mainnet' | 'testnet' | 'sepolia' | 'local';
  contractAddress?: string;
  gatewayUrl?: string;
  rpcUrl?: string;
}
