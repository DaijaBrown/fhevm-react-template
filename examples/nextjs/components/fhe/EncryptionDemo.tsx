'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const EncryptionDemo: React.FC = () => {
  const [value, setValue] = useState('');
  const [type, setType] = useState<'uint32' | 'uint64' | 'bool' | 'address'>('uint32');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [encryptedResult, setEncryptedResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEncrypt = async () => {
    setIsEncrypting(true);
    setError(null);
    setEncryptedResult(null);

    try {
      // Validation
      if (!value) {
        throw new Error('Please enter a value to encrypt');
      }

      // Simulate encryption
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock encrypted result
      const mockResult = `0x${Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`;

      setEncryptedResult(mockResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Encryption failed');
    } finally {
      setIsEncrypting(false);
    }
  };

  return (
    <Card title="FHE Encryption Demo" subtitle="Encrypt values using Fully Homomorphic Encryption">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Encryption Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="uint32">uint32</option>
            <option value="uint64">uint64</option>
            <option value="bool">bool</option>
            <option value="address">address</option>
          </select>
        </div>

        <Input
          label="Value to Encrypt"
          type={type === 'bool' ? 'checkbox' : 'text'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Enter ${type} value`}
          error={error || undefined}
        />

        <Button
          variant="primary"
          onClick={handleEncrypt}
          isLoading={isEncrypting}
          disabled={!value}
          className="w-full"
        >
          Encrypt Value
        </Button>

        {encryptedResult && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="text-sm font-medium text-green-900 mb-2">
              Encrypted Result:
            </h4>
            <p className="text-xs text-green-700 font-mono break-all">
              {encryptedResult}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
