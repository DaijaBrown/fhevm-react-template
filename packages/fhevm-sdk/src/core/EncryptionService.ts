import { FhevmClient } from './FhevmClient';

export interface EncryptedData {
  data: Uint8Array;
  handles: string[];
  inputProof: string;
}

export class EncryptionService {
  constructor(private client: FhevmClient) {}

  /**
   * Create encrypted input for contract
   */
  async createEncryptedInput(
    contractAddress: string,
    userAddress: string
  ): Promise<{
    add8: (value: number) => void;
    add16: (value: number) => void;
    add32: (value: number) => void;
    add64: (value: bigint) => void;
    addBool: (value: boolean) => void;
    addAddress: (value: string) => void;
    encrypt: () => Promise<EncryptedData>;
  }> {
    const instance = this.client.getInstance();

    return instance.createEncryptedInput(contractAddress, userAddress);
  }

  /**
   * Encrypt a boolean value
   */
  async bool(value: boolean, contractAddress: string, userAddress: string): Promise<EncryptedData> {
    const input = await this.createEncryptedInput(contractAddress, userAddress);
    input.addBool(value);
    return input.encrypt();
  }

  /**
   * Encrypt a uint8 value
   */
  async uint8(value: number, contractAddress: string, userAddress: string): Promise<EncryptedData> {
    if (value < 0 || value > 255) {
      throw new Error('Value must be between 0 and 255');
    }
    const input = await this.createEncryptedInput(contractAddress, userAddress);
    input.add8(value);
    return input.encrypt();
  }

  /**
   * Encrypt a uint16 value
   */
  async uint16(value: number, contractAddress: string, userAddress: string): Promise<EncryptedData> {
    if (value < 0 || value > 65535) {
      throw new Error('Value must be between 0 and 65535');
    }
    const input = await this.createEncryptedInput(contractAddress, userAddress);
    input.add16(value);
    return input.encrypt();
  }

  /**
   * Encrypt a uint32 value
   */
  async uint32(value: number, contractAddress: string, userAddress: string): Promise<EncryptedData> {
    if (value < 0 || value > 4294967295) {
      throw new Error('Value must be between 0 and 4294967295');
    }
    const input = await this.createEncryptedInput(contractAddress, userAddress);
    input.add32(value);
    return input.encrypt();
  }

  /**
   * Encrypt a uint64 value
   */
  async uint64(value: bigint, contractAddress: string, userAddress: string): Promise<EncryptedData> {
    const input = await this.createEncryptedInput(contractAddress, userAddress);
    input.add64(value);
    return input.encrypt();
  }

  /**
   * Encrypt an address
   */
  async address(value: string, contractAddress: string, userAddress: string): Promise<EncryptedData> {
    const input = await this.createEncryptedInput(contractAddress, userAddress);
    input.addAddress(value);
    return input.encrypt();
  }

  /**
   * Batch encrypt multiple values
   */
  async batch(
    values: Array<{
      type: 'bool' | 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address';
      value: boolean | number | bigint | string;
    }>,
    contractAddress: string,
    userAddress: string
  ): Promise<EncryptedData> {
    const input = await this.createEncryptedInput(contractAddress, userAddress);

    for (const item of values) {
      switch (item.type) {
        case 'bool':
          input.addBool(item.value as boolean);
          break;
        case 'uint8':
          input.add8(item.value as number);
          break;
        case 'uint16':
          input.add16(item.value as number);
          break;
        case 'uint32':
          input.add32(item.value as number);
          break;
        case 'uint64':
          input.add64(item.value as bigint);
          break;
        case 'address':
          input.addAddress(item.value as string);
          break;
      }
    }

    return input.encrypt();
  }
}
