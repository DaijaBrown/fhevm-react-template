'use client';

import { useState, useEffect, useCallback } from 'react';
import { FHEClient, FHEClientConfig } from '../lib/fhe/client';

export function useFHE(config: FHEClientConfig) {
  const [client, setClient] = useState<FHEClient | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initClient = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const fheClient = new FHEClient(config);
        await fheClient.init();

        setClient(fheClient);
        setIsReady(true);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize FHE client';
        setError(errorMessage);
        console.error('FHE initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initClient();
  }, [config.network, config.contractAddress]);

  const reinitialize = useCallback(async () => {
    if (client) {
      try {
        setIsLoading(true);
        setError(null);
        await client.init();
        setIsReady(true);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to reinitialize';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  }, [client]);

  return {
    client,
    isReady,
    isLoading,
    error,
    reinitialize,
  };
}
