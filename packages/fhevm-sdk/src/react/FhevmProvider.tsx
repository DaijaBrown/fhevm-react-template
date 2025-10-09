import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { FhevmSDK, FhevmConfig } from '../core';

interface FhevmContextValue {
  sdk: FhevmSDK | null;
  isReady: boolean;
  isLoading: boolean;
  error: Error | null;
}

const FhevmContext = createContext<FhevmContextValue>({
  sdk: null,
  isReady: false,
  isLoading: true,
  error: null,
});

export interface FhevmProviderProps {
  children: ReactNode;
  config?: FhevmConfig;
  network?: 'sepolia' | 'localhost' | 'mainnet';
  contractAddress?: string;
}

export function FhevmProvider({ children, config, network, contractAddress }: FhevmProviderProps) {
  const [sdk, setSdk] = useState<FhevmSDK | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initializeSdk() {
      try {
        setIsLoading(true);
        setError(null);

        const sdkConfig: FhevmConfig = config || {
          network: network || 'sepolia',
          contractAddress,
        };

        const instance = await FhevmSDK.init(sdkConfig);

        if (mounted) {
          setSdk(instance);
          setIsReady(true);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to initialize SDK'));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    initializeSdk();

    return () => {
      mounted = false;
    };
  }, [config, network, contractAddress]);

  return (
    <FhevmContext.Provider value={{ sdk, isReady, isLoading, error }}>{children}</FhevmContext.Provider>
  );
}

export function useFhevmContext(): FhevmContextValue {
  const context = useContext(FhevmContext);

  if (!context) {
    throw new Error('useFhevmContext must be used within FhevmProvider');
  }

  return context;
}
