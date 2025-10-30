'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const KeyManager: React.FC = () => {
  const [contractAddress, setContractAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFetchKeys = async () => {
    setIsLoading(true);
    setError(null);
    setPublicKey(null);

    try {
      if (!contractAddress || !contractAddress.startsWith('0x')) {
        throw new Error('Please enter a valid contract address');
      }

      // Simulate fetching public key
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock public key
      const mockKey = `0x${Array.from({ length: 128 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`;

      setPublicKey(mockKey);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch keys');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshKeys = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPublicKey(null);
      alert('Keys refreshed successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh keys');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="Key Management" subtitle="Manage FHE public keys for encryption">
      <div className="space-y-4">
        <Input
          label="Contract Address"
          type="text"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          placeholder="0x..."
          error={error || undefined}
          helperText="Enter the contract address to fetch its public key"
        />

        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={handleFetchKeys}
            isLoading={isLoading}
            disabled={!contractAddress}
            className="flex-1"
          >
            Fetch Public Key
          </Button>

          <Button
            variant="secondary"
            onClick={handleRefreshKeys}
            isLoading={isLoading}
            disabled={!publicKey}
          >
            Refresh
          </Button>
        </div>

        {publicKey && (
          <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="text-sm font-medium text-purple-900 mb-2">
              Public Key:
            </h4>
            <p className="text-xs text-purple-700 font-mono break-all">
              {publicKey}
            </p>
            <div className="mt-3 flex gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                Ready for Encryption
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                Valid
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
