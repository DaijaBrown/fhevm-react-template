/**
 * Validation utility functions
 */

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate encryption type
 */
export function isValidType(type: string): boolean {
  const validTypes = [
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
  return validTypes.includes(type);
}

/**
 * Validate value for given type
 */
export function validateValue(value: any, type: string): boolean {
  switch (type) {
    case 'bool':
      return typeof value === 'boolean';

    case 'uint8':
      return typeof value === 'number' && value >= 0 && value <= 255;

    case 'uint16':
      return typeof value === 'number' && value >= 0 && value <= 65535;

    case 'uint32':
      return typeof value === 'number' && value >= 0 && value <= 4294967295;

    case 'uint64':
      return typeof value === 'number' || typeof value === 'bigint';

    case 'address':
      return isValidAddress(value);

    case 'bytes':
      return typeof value === 'string' && value.startsWith('0x');

    default:
      return false;
  }
}

/**
 * Validate SDK configuration
 */
export function validateConfig(config: any): { valid: boolean; error?: string } {
  if (!config.network) {
    return { valid: false, error: 'Network is required' };
  }

  if (config.contractAddress && !isValidAddress(config.contractAddress)) {
    return { valid: false, error: 'Invalid contract address' };
  }

  return { valid: true };
}
