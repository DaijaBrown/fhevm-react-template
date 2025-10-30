/**
 * Key Management for FHE
 * Handles public key fetching and caching
 */

export interface PublicKeyInfo {
  key: string;
  contractAddress: string;
  timestamp: number;
  expiresAt?: number;
}

class KeyManager {
  private keyCache: Map<string, PublicKeyInfo> = new Map();
  private cacheDuration: number = 60 * 60 * 1000; // 1 hour

  async getPublicKey(contractAddress: string): Promise<string> {
    // Check cache first
    const cached = this.keyCache.get(contractAddress);
    if (cached && !this.isExpired(cached)) {
      return cached.key;
    }

    // Fetch new key
    const key = await this.fetchPublicKey(contractAddress);

    // Cache the key
    this.cacheKey(contractAddress, key);

    return key;
  }

  private async fetchPublicKey(contractAddress: string): Promise<string> {
    try {
      // In production, fetch from blockchain or gateway
      await new Promise(resolve => setTimeout(resolve, 200));

      return `0x${Array.from({ length: 128 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`;
    } catch (error) {
      console.error('Failed to fetch public key:', error);
      throw new Error('Could not retrieve public key');
    }
  }

  private cacheKey(contractAddress: string, key: string): void {
    const keyInfo: PublicKeyInfo = {
      key,
      contractAddress,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.cacheDuration,
    };

    this.keyCache.set(contractAddress, keyInfo);
  }

  private isExpired(keyInfo: PublicKeyInfo): boolean {
    if (!keyInfo.expiresAt) {
      return false;
    }

    return Date.now() > keyInfo.expiresAt;
  }

  clearCache(): void {
    this.keyCache.clear();
  }

  removeKey(contractAddress: string): void {
    this.keyCache.delete(contractAddress);
  }
}

export const keyManager = new KeyManager();
