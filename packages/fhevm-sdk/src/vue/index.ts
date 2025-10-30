/**
 * Vue 3 Composables for FHEVM SDK
 * Framework adapter for Vue.js applications
 */

import { ref, computed, onMounted, Ref } from 'vue';
import { FhevmClient } from '../core/FhevmClient';

export interface UseFhevmOptions {
  network: string;
  contractAddress?: string;
  gatewayUrl?: string;
}

export interface UseFhevmReturn {
  sdk: Ref<FhevmClient | null>;
  isReady: Ref<boolean>;
  isLoading: Ref<boolean>;
  error: Ref<string | null>;
  reinitialize: () => Promise<void>;
}

/**
 * Vue composable for FHEVM SDK
 * Usage:
 * ```ts
 * const { sdk, isReady, isLoading, error } = useFhevm({
 *   network: 'sepolia',
 *   contractAddress: '0x...'
 * });
 * ```
 */
export function useFhevm(options: UseFhevmOptions): UseFhevmReturn {
  const sdk = ref<FhevmClient | null>(null);
  const isReady = ref(false);
  const isLoading = ref(true);
  const error = ref<string | null>(null);

  const initialize = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const client = new FhevmClient({
        network: options.network,
        contractAddress: options.contractAddress || '',
        gatewayUrl: options.gatewayUrl,
      });

      await client.init();

      sdk.value = client;
      isReady.value = true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to initialize FHEVM';
      console.error('FHEVM initialization error:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const reinitialize = async () => {
    await initialize();
  };

  onMounted(() => {
    initialize();
  });

  return {
    sdk,
    isReady,
    isLoading,
    error,
    reinitialize,
  };
}

/**
 * Vue composable for encryption operations
 */
export function useEncrypt(sdk: Ref<FhevmClient | null>) {
  const isEncrypting = ref(false);
  const error = ref<string | null>(null);

  const encrypt = async <T,>(value: T, type: string): Promise<string | null> => {
    if (!sdk.value) {
      error.value = 'SDK not initialized';
      return null;
    }

    try {
      isEncrypting.value = true;
      error.value = null;

      const encrypted = await sdk.value.encrypt(value, type);
      return encrypted;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Encryption failed';
      return null;
    } finally {
      isEncrypting.value = false;
    }
  };

  return {
    encrypt,
    isEncrypting: computed(() => isEncrypting.value),
    error: computed(() => error.value),
  };
}

/**
 * Vue composable for decryption operations
 */
export function useDecrypt(sdk: Ref<FhevmClient | null>) {
  const isDecrypting = ref(false);
  const error = ref<string | null>(null);

  const decrypt = async <T,>(encryptedValue: string, type: string): Promise<T | null> => {
    if (!sdk.value) {
      error.value = 'SDK not initialized';
      return null;
    }

    try {
      isDecrypting.value = true;
      error.value = null;

      const decrypted = await sdk.value.decrypt<T>(encryptedValue, type);
      return decrypted;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Decryption failed';
      return null;
    } finally {
      isDecrypting.value = false;
    }
  };

  return {
    decrypt,
    isDecrypting: computed(() => isDecrypting.value),
    error: computed(() => error.value),
  };
}
