'use client';

import { FhevmProvider } from '@fhevm/sdk/react';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const network = (process.env.NEXT_PUBLIC_NETWORK as 'sepolia' | 'localhost') || 'sepolia';
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  return (
    <FhevmProvider network={network} contractAddress={contractAddress}>
      {children}
    </FhevmProvider>
  );
}
