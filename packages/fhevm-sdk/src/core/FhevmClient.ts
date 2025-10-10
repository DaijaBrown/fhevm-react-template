import { BrowserProvider, Contract, Signer } from 'ethers';
import { createInstance, FhevmInstance } from 'fhevmjs';

export interface FhevmConfig {
  network?: 'sepolia' | 'localhost' | 'mainnet';
  rpcUrl?: string;
  contractAddress?: string;
  chainId?: number;
}

export class FhevmClient {
  private instance: FhevmInstance | null = null;
  private provider: BrowserProvider | null = null;
  private signer: Signer | null = null;
  private config: FhevmConfig;

  constructor(config: FhevmConfig = {}) {
    this.config = {
      network: 'sepolia',
      chainId: 11155111,
      ...config,
    };
  }

  /**
   * Initialize the FHEVM instance
   */
  async init(): Promise<void> {
    if (this.instance) {
      return;
    }

    try {
      // Create FHEVM instance
      this.instance = await createInstance({
        chainId: this.config.chainId!,
        networkUrl: this.config.rpcUrl || this.getDefaultRpcUrl(),
        gatewayUrl: this.getGatewayUrl(),
      });

      // Connect to provider if available
      if (typeof window !== 'undefined' && window.ethereum) {
        this.provider = new BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
      }
    } catch (error) {
      console.error('Failed to initialize FHEVM:', error);
      throw error;
    }
  }

  /**
   * Get the FHEVM instance
   */
  getInstance(): FhevmInstance {
    if (!this.instance) {
      throw new Error('FHEVM instance not initialized. Call init() first.');
    }
    return this.instance;
  }

  /**
   * Get the provider
   */
  getProvider(): BrowserProvider {
    if (!this.provider) {
      throw new Error('Provider not available');
    }
    return this.provider;
  }

  /**
   * Get the signer
   */
  async getSigner(): Promise<Signer> {
    if (!this.signer) {
      if (this.provider) {
        this.signer = await this.provider.getSigner();
      } else {
        throw new Error('Signer not available');
      }
    }
    return this.signer;
  }

  /**
   * Get default RPC URL for network
   */
  private getDefaultRpcUrl(): string {
    switch (this.config.network) {
      case 'sepolia':
        return 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY';
      case 'localhost':
        return 'http://127.0.0.1:8545';
      case 'mainnet':
        return 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY';
      default:
        return 'http://127.0.0.1:8545';
    }
  }

  /**
   * Get gateway URL for network
   */
  private getGatewayUrl(): string {
    switch (this.config.network) {
      case 'sepolia':
        return 'https://gateway.sepolia.zama.ai';
      case 'localhost':
        return 'http://localhost:8545';
      default:
        return 'https://gateway.zama.ai';
    }
  }

  /**
   * Create a contract instance
   */
  createContract(address: string, abi: any[]): Contract {
    if (!this.signer) {
      throw new Error('Signer not available');
    }
    return new Contract(address, abi, this.signer);
  }

  /**
   * Get contract address from config
   */
  getContractAddress(): string {
    if (!this.config.contractAddress) {
      throw new Error('Contract address not configured');
    }
    return this.config.contractAddress;
  }
}
