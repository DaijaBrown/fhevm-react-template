/**
 * FHEVM SDK - Main Entry Point
 * Framework-agnostic SDK for Fully Homomorphic Encryption
 */

// Core exports
export * from './core';
export { FhevmClient } from './core/FhevmClient';
export { EncryptionService } from './core/EncryptionService';
export { DecryptionService } from './core/DecryptionService';

// Utils exports
export * from './utils';

// Types
export * from './types';

// Re-export for convenience
import { FhevmClient } from './core/FhevmClient';
export default FhevmClient;
