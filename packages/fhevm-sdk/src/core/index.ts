import { FhevmClient, FhevmConfig } from './FhevmClient';
import { EncryptionService } from './EncryptionService';
import { DecryptionService } from './DecryptionService';

export { FhevmClient, EncryptionService, DecryptionService };
export type { FhevmConfig };

/**
 * Main FHEVM SDK class
 */
export class FhevmSDK {
  private client: FhevmClient;
  public encrypt: EncryptionService;
  public decrypt: DecryptionService;

  private constructor(config: FhevmConfig = {}) {
    this.client = new FhevmClient(config);
    this.encrypt = new EncryptionService(this.client);
    this.decrypt = new DecryptionService(this.client);
  }

  /**
   * Initialize the SDK
   */
  static async init(config: FhevmConfig = {}): Promise<FhevmSDK> {
    const sdk = new FhevmSDK(config);
    await sdk.client.init();
    return sdk;
  }

  /**
   * Get the underlying client
   */
  getClient(): FhevmClient {
    return this.client;
  }

  /**
   * Get contract address
   */
  getContractAddress(): string {
    return this.client.getContractAddress();
  }

  /**
   * Create a contract instance
   */
  createContract(address: string, abi: any[]) {
    return this.client.createContract(address, abi);
  }

  /**
   * Get provider
   */
  getProvider() {
    return this.client.getProvider();
  }

  /**
   * Get signer
   */
  async getSigner() {
    return this.client.getSigner();
  }
}
