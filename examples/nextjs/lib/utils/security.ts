/**
 * Security utilities for FHE operations
 */

export class SecurityUtils {
  /**
   * Validates Ethereum address format
   */
  static isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Validates encrypted data format
   */
  static isValidEncryptedData(data: string): boolean {
    return data.startsWith('0x') && data.length > 10;
  }

  /**
   * Sanitize user input
   */
  static sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  /**
   * Validates signature format
   */
  static isValidSignature(signature: string): boolean {
    return /^0x[a-fA-F0-9]{130}$/.test(signature);
  }

  /**
   * Check if value is within safe integer range
   */
  static isSafeInteger(value: number, bits: number = 32): boolean {
    const max = Math.pow(2, bits) - 1;
    return Number.isInteger(value) && value >= 0 && value <= max;
  }

  /**
   * Validate contract address against whitelist
   */
  static isWhitelistedContract(address: string, whitelist: string[]): boolean {
    return whitelist.some(
      addr => addr.toLowerCase() === address.toLowerCase()
    );
  }

  /**
   * Generate random nonce for requests
   */
  static generateNonce(): string {
    return `0x${Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`;
  }

  /**
   * Hash data for verification
   */
  static async hashData(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
