'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface FHEContextValue {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  network: string;
  contractAddress: string | null;
  initializeFHE: (contractAddr: string) => Promise<void>;
}

const FHEContext = createContext<FHEContextValue | undefined>(undefined);

interface FHEProviderProps {
  children: React.ReactNode;
  network?: string;
  defaultContractAddress?: string;
}

export const FHEProvider: React.FC<FHEProviderProps> = ({
  children,
  network = 'sepolia',
  defaultContractAddress,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contractAddress, setContractAddress] = useState<string | null>(
    defaultContractAddress || null
  );

  const initializeFHE = async (contractAddr: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Initialize FHE SDK here
      // This is a placeholder for actual SDK initialization
      await new Promise(resolve => setTimeout(resolve, 1000));

      setContractAddress(contractAddr);
      setIsInitialized(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize FHE';
      setError(errorMessage);
      console.error('FHE initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (defaultContractAddress) {
      initializeFHE(defaultContractAddress);
    }
  }, []);

  const value: FHEContextValue = {
    isInitialized,
    isLoading,
    error,
    network,
    contractAddress,
    initializeFHE,
  };

  return <FHEContext.Provider value={value}>{children}</FHEContext.Provider>;
};

export const useFHEContext = () => {
  const context = useContext(FHEContext);
  if (context === undefined) {
    throw new Error('useFHEContext must be used within a FHEProvider');
  }
  return context;
};
