import { FhevmClient } from './FhevmClient';
import { Signer } from 'ethers';

export class DecryptionService {
  constructor(private client: FhevmClient) {}

  /**
   * Decrypt a uint8 value using EIP-712 signature
   */
  async uint8(encryptedValue: string, userAddress: string, contractAddress: string): Promise<number> {
    const instance = this.client.getInstance();
    const signer = await this.client.getSigner();

    const value = await instance.decrypt(contractAddress, encryptedValue);
    return Number(value);
  }

  /**
   * Decrypt a uint16 value using EIP-712 signature
   */
  async uint16(encryptedValue: string, userAddress: string, contractAddress: string): Promise<number> {
    const instance = this.client.getInstance();
    const signer = await this.client.getSigner();

    const value = await instance.decrypt(contractAddress, encryptedValue);
    return Number(value);
  }

  /**
   * Decrypt a uint32 value using EIP-712 signature
   */
  async uint32(encryptedValue: string, userAddress: string, contractAddress: string): Promise<number> {
    const instance = this.client.getInstance();
    const signer = await this.client.getSigner();

    const value = await instance.decrypt(contractAddress, encryptedValue);
    return Number(value);
  }

  /**
   * Decrypt a uint64 value using EIP-712 signature
   */
  async uint64(encryptedValue: string, userAddress: string, contractAddress: string): Promise<bigint> {
    const instance = this.client.getInstance();
    const signer = await this.client.getSigner();

    const value = await instance.decrypt(contractAddress, encryptedValue);
    return BigInt(value);
  }

  /**
   * Decrypt a boolean value
   */
  async bool(encryptedValue: string, userAddress: string, contractAddress: string): Promise<boolean> {
    const instance = this.client.getInstance();
    const value = await instance.decrypt(contractAddress, encryptedValue);
    return Boolean(value);
  }

  /**
   * Public decrypt (no signature required)
   */
  async public<T = any>(encryptedValue: string): Promise<T> {
    const instance = this.client.getInstance();
    const value = await instance.decrypt(this.client.getContractAddress(), encryptedValue);
    return value as T;
  }

  /**
   * Batch decrypt multiple values
   */
  async batch(
    encryptedValues: Array<{
      value: string;
      type: 'bool' | 'uint8' | 'uint16' | 'uint32' | 'uint64';
    }>,
    userAddress: string,
    contractAddress: string
  ): Promise<Array<boolean | number | bigint>> {
    const results: Array<boolean | number | bigint> = [];

    for (const item of encryptedValues) {
      switch (item.type) {
        case 'bool':
          results.push(await this.bool(item.value, userAddress, contractAddress));
          break;
        case 'uint8':
          results.push(await this.uint8(item.value, userAddress, contractAddress));
          break;
        case 'uint16':
          results.push(await this.uint16(item.value, userAddress, contractAddress));
          break;
        case 'uint32':
          results.push(await this.uint32(item.value, userAddress, contractAddress));
          break;
        case 'uint64':
          results.push(await this.uint64(item.value, userAddress, contractAddress));
          break;
      }
    }

    return results;
  }
}
