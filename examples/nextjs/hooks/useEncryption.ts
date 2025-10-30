'use client';

import { useState, useCallback } from 'react';
import { FHEClient } from '../lib/fhe/client';
import { FHEType } from '../lib/fhe/types';
import { ValidationUtils } from '../lib/utils/validation';

export function useEncryption(client: FHEClient | null) {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const encrypt = useCallback(
    async <T,>(
      value: T,
      type: FHEType,
      contractAddress: string,
      userAddress: string
    ): Promise<string | null> => {
      if (!client || !client.isReady()) {
        setError('FHE client not ready');
        return null;
      }

      setIsEncrypting(true);
      setError(null);

      try {
        // Validate input
        const validation = ValidationUtils.validateEncryptionInput(
          value,
          type,
          contractAddress,
          userAddress
        );

        if (!validation.valid) {
          throw new Error(validation.error);
        }

        // Perform encryption
        const encrypted = await client.encrypt(value, type);
        setLastResult(encrypted);
        return encrypted;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Encryption failed';
        setError(errorMessage);
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client]
  );

  const encryptBatch = useCallback(
    async (
      inputs: Array<{
        value: any;
        type: FHEType;
      }>,
      contractAddress: string,
      userAddress: string
    ): Promise<string[] | null> => {
      if (!client || !client.isReady()) {
        setError('FHE client not ready');
        return null;
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const results: string[] = [];

        for (const input of inputs) {
          const encrypted = await encrypt(
            input.value,
            input.type,
            contractAddress,
            userAddress
          );

          if (!encrypted) {
            throw new Error('Batch encryption failed');
          }

          results.push(encrypted);
        }

        return results;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Batch encryption failed';
        setError(errorMessage);
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client, encrypt]
  );

  return {
    encrypt,
    encryptBatch,
    isEncrypting,
    error,
    lastResult,
  };
}
