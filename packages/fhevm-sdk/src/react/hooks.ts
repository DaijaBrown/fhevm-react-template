import { useState, useCallback } from 'react';
import { useFhevmContext } from './FhevmProvider';
import { EncryptedData } from '../core/EncryptionService';

/**
 * Hook to access FHEVM SDK
 */
export function useFhevm() {
  const { sdk, isReady, isLoading, error } = useFhevmContext();

  return {
    sdk,
    isReady,
    isLoading,
    error,
  };
}

/**
 * Hook for encryption operations
 */
export function useEncrypt() {
  const { sdk, isReady } = useFhevmContext();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [encryptError, setEncryptError] = useState<Error | null>(null);

  const encrypt = useCallback(
    {
      bool: async (value: boolean, contractAddress: string, userAddress: string) => {
        if (!sdk) throw new Error('SDK not initialized');
        setIsEncrypting(true);
        setEncryptError(null);
        try {
          return await sdk.encrypt.bool(value, contractAddress, userAddress);
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Encryption failed');
          setEncryptError(error);
          throw error;
        } finally {
          setIsEncrypting(false);
        }
      },

      uint8: async (value: number, contractAddress: string, userAddress: string) => {
        if (!sdk) throw new Error('SDK not initialized');
        setIsEncrypting(true);
        setEncryptError(null);
        try {
          return await sdk.encrypt.uint8(value, contractAddress, userAddress);
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Encryption failed');
          setEncryptError(error);
          throw error;
        } finally {
          setIsEncrypting(false);
        }
      },

      uint16: async (value: number, contractAddress: string, userAddress: string) => {
        if (!sdk) throw new Error('SDK not initialized');
        setIsEncrypting(true);
        setEncryptError(null);
        try {
          return await sdk.encrypt.uint16(value, contractAddress, userAddress);
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Encryption failed');
          setEncryptError(error);
          throw error;
        } finally {
          setIsEncrypting(false);
        }
      },

      uint32: async (value: number, contractAddress: string, userAddress: string) => {
        if (!sdk) throw new Error('SDK not initialized');
        setIsEncrypting(true);
        setEncryptError(null);
        try {
          return await sdk.encrypt.uint32(value, contractAddress, userAddress);
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Encryption failed');
          setEncryptError(error);
          throw error;
        } finally {
          setIsEncrypting(false);
        }
      },

      uint64: async (value: bigint, contractAddress: string, userAddress: string) => {
        if (!sdk) throw new Error('SDK not initialized');
        setIsEncrypting(true);
        setEncryptError(null);
        try {
          return await sdk.encrypt.uint64(value, contractAddress, userAddress);
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Encryption failed');
          setEncryptError(error);
          throw error;
        } finally {
          setIsEncrypting(false);
        }
      },

      address: async (value: string, contractAddress: string, userAddress: string) => {
        if (!sdk) throw new Error('SDK not initialized');
        setIsEncrypting(true);
        setEncryptError(null);
        try {
          return await sdk.encrypt.address(value, contractAddress, userAddress);
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Encryption failed');
          setEncryptError(error);
          throw error;
        } finally {
          setIsEncrypting(false);
        }
      },
    },
    [sdk]
  );

  return {
    encrypt,
    isEncrypting,
    encryptError,
    isReady,
  };
}

/**
 * Hook for decryption operations
 */
export function useDecrypt() {
  const { sdk, isReady } = useFhevmContext();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptError, setDecryptError] = useState<Error | null>(null);

  const decrypt = useCallback(
    {
      uint8: async (encryptedValue: string, userAddress: string, contractAddress: string) => {
        if (!sdk) throw new Error('SDK not initialized');
        setIsDecrypting(true);
        setDecryptError(null);
        try {
          return await sdk.decrypt.uint8(encryptedValue, userAddress, contractAddress);
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Decryption failed');
          setDecryptError(error);
          throw error;
        } finally {
          setIsDecrypting(false);
        }
      },

      uint16: async (encryptedValue: string, userAddress: string, contractAddress: string) => {
        if (!sdk) throw new Error('SDK not initialized');
        setIsDecrypting(true);
        setDecryptError(null);
        try {
          return await sdk.decrypt.uint16(encryptedValue, userAddress, contractAddress);
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Decryption failed');
          setDecryptError(error);
          throw error;
        } finally {
          setIsDecrypting(false);
        }
      },

      uint32: async (encryptedValue: string, userAddress: string, contractAddress: string) => {
        if (!sdk) throw new Error('SDK not initialized');
        setIsDecrypting(true);
        setDecryptError(null);
        try {
          return await sdk.decrypt.uint32(encryptedValue, userAddress, contractAddress);
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Decryption failed');
          setDecryptError(error);
          throw error;
        } finally {
          setIsDecrypting(false);
        }
      },

      uint64: async (encryptedValue: string, userAddress: string, contractAddress: string) => {
        if (!sdk) throw new Error('SDK not initialized');
        setIsDecrypting(true);
        setDecryptError(null);
        try {
          return await sdk.decrypt.uint64(encryptedValue, userAddress, contractAddress);
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Decryption failed');
          setDecryptError(error);
          throw error;
        } finally {
          setIsDecrypting(false);
        }
      },

      bool: async (encryptedValue: string, userAddress: string, contractAddress: string) => {
        if (!sdk) throw new Error('SDK not initialized');
        setIsDecrypting(true);
        setDecryptError(null);
        try {
          return await sdk.decrypt.bool(encryptedValue, userAddress, contractAddress);
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Decryption failed');
          setDecryptError(error);
          throw error;
        } finally {
          setIsDecrypting(false);
        }
      },

      public: async <T = any>(encryptedValue: string) => {
        if (!sdk) throw new Error('SDK not initialized');
        setIsDecrypting(true);
        setDecryptError(null);
        try {
          return await sdk.decrypt.public<T>(encryptedValue);
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Decryption failed');
          setDecryptError(error);
          throw error;
        } finally {
          setIsDecrypting(false);
        }
      },
    },
    [sdk]
  );

  return {
    decrypt,
    isDecrypting,
    decryptError,
    isReady,
  };
}
