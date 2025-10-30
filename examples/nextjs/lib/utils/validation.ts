/**
 * Validation utilities for FHE operations
 */

import { FHEType } from '../fhe/types';
import { SecurityUtils } from './security';

export class ValidationUtils {
  /**
   * Validate encryption input
   */
  static validateEncryptionInput(
    value: any,
    type: FHEType,
    contractAddress: string,
    userAddress: string
  ): { valid: boolean; error?: string } {
    // Validate addresses
    if (!SecurityUtils.isValidAddress(contractAddress)) {
      return { valid: false, error: 'Invalid contract address' };
    }

    if (!SecurityUtils.isValidAddress(userAddress)) {
      return { valid: false, error: 'Invalid user address' };
    }

    // Validate value based on type
    switch (type) {
      case 'bool':
        if (typeof value !== 'boolean') {
          return { valid: false, error: 'Value must be a boolean' };
        }
        break;

      case 'uint8':
        if (!SecurityUtils.isSafeInteger(value, 8)) {
          return { valid: false, error: 'Value must be a valid uint8 (0-255)' };
        }
        break;

      case 'uint16':
        if (!SecurityUtils.isSafeInteger(value, 16)) {
          return { valid: false, error: 'Value must be a valid uint16 (0-65535)' };
        }
        break;

      case 'uint32':
        if (!SecurityUtils.isSafeInteger(value, 32)) {
          return { valid: false, error: 'Value must be a valid uint32' };
        }
        break;

      case 'uint64':
        if (typeof value !== 'bigint' && typeof value !== 'number') {
          return { valid: false, error: 'Value must be a number or bigint' };
        }
        break;

      case 'address':
        if (!SecurityUtils.isValidAddress(value)) {
          return { valid: false, error: 'Value must be a valid Ethereum address' };
        }
        break;

      case 'bytes':
        if (typeof value !== 'string' || !value.startsWith('0x')) {
          return { valid: false, error: 'Value must be a hex string starting with 0x' };
        }
        break;

      default:
        return { valid: false, error: `Unsupported type: ${type}` };
    }

    return { valid: true };
  }

  /**
   * Validate decryption input
   */
  static validateDecryptionInput(
    encryptedValue: string,
    type: FHEType,
    userAddress: string,
    contractAddress: string
  ): { valid: boolean; error?: string } {
    // Validate addresses
    if (!SecurityUtils.isValidAddress(contractAddress)) {
      return { valid: false, error: 'Invalid contract address' };
    }

    if (!SecurityUtils.isValidAddress(userAddress)) {
      return { valid: false, error: 'Invalid user address' };
    }

    // Validate encrypted data
    if (!SecurityUtils.isValidEncryptedData(encryptedValue)) {
      return { valid: false, error: 'Invalid encrypted data format' };
    }

    // Validate type
    const validTypes: FHEType[] = [
      'bool',
      'uint8',
      'uint16',
      'uint32',
      'uint64',
      'uint128',
      'uint256',
      'address',
      'bytes',
    ];

    if (!validTypes.includes(type)) {
      return { valid: false, error: `Unsupported type: ${type}` };
    }

    return { valid: true };
  }

  /**
   * Validate computation operation
   */
  static validateComputationOperation(
    operation: string,
    operands: string[]
  ): { valid: boolean; error?: string } {
    const validOperations = [
      'add',
      'sub',
      'mul',
      'div',
      'eq',
      'ne',
      'gte',
      'gt',
      'lte',
      'lt',
      'min',
      'max',
      'and',
      'or',
      'xor',
      'not',
    ];

    if (!validOperations.includes(operation)) {
      return { valid: false, error: `Invalid operation: ${operation}` };
    }

    if (!Array.isArray(operands) || operands.length === 0) {
      return { valid: false, error: 'Operands must be a non-empty array' };
    }

    if (operation === 'not' && operands.length !== 1) {
      return { valid: false, error: 'NOT operation requires exactly 1 operand' };
    }

    if (operation !== 'not' && operands.length < 2) {
      return { valid: false, error: 'Operation requires at least 2 operands' };
    }

    // Validate operands are valid encrypted data
    for (const operand of operands) {
      if (!SecurityUtils.isValidEncryptedData(operand)) {
        return { valid: false, error: 'Invalid operand format' };
      }
    }

    return { valid: true };
  }
}
