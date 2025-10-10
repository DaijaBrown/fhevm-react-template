'use client';

import { useState } from 'react';
import { useEncrypt } from '@fhevm/sdk/react';

interface EncryptionDemoProps {
  walletAddress: string;
  contractAddress: string;
}

type EncryptionType = 'bool' | 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address';

export function EncryptionDemo({ walletAddress, contractAddress }: EncryptionDemoProps) {
  const { encrypt, isEncrypting, encryptError } = useEncrypt();
  const [encryptionType, setEncryptionType] = useState<EncryptionType>('uint32');
  const [inputValue, setInputValue] = useState<string>('');
  const [encryptedResult, setEncryptedResult] = useState<string>('');

  async function handleEncrypt() {
    if (!inputValue) {
      return;
    }

    try {
      let result;

      switch (encryptionType) {
        case 'bool':
          result = await encrypt.bool(
            inputValue.toLowerCase() === 'true',
            contractAddress,
            walletAddress
          );
          break;
        case 'uint8':
          result = await encrypt.uint8(
            parseInt(inputValue),
            contractAddress,
            walletAddress
          );
          break;
        case 'uint16':
          result = await encrypt.uint16(
            parseInt(inputValue),
            contractAddress,
            walletAddress
          );
          break;
        case 'uint32':
          result = await encrypt.uint32(
            parseInt(inputValue),
            contractAddress,
            walletAddress
          );
          break;
        case 'uint64':
          result = await encrypt.uint64(
            BigInt(inputValue),
            contractAddress,
            walletAddress
          );
          break;
        case 'address':
          result = await encrypt.address(
            inputValue,
            contractAddress,
            walletAddress
          );
          break;
      }

      setEncryptedResult(JSON.stringify(result, null, 2));
    } catch (err) {
      console.error('Encryption error:', err);
    }
  }

  function getPlaceholder(): string {
    switch (encryptionType) {
      case 'bool':
        return 'true or false';
      case 'uint8':
        return '0-255';
      case 'uint16':
        return '0-65535';
      case 'uint32':
        return '0-4294967295';
      case 'uint64':
        return 'Large number';
      case 'address':
        return '0x...';
      default:
        return 'Enter value';
    }
  }

  return (
    <div className="space-y-6">
      {/* Type Selection */}
      <div>
        <label className="label">Encryption Type</label>
        <select
          value={encryptionType}
          onChange={(e) => {
            setEncryptionType(e.target.value as EncryptionType);
            setInputValue('');
            setEncryptedResult('');
          }}
          className="input"
        >
          <option value="bool">Boolean (ebool)</option>
          <option value="uint8">Unsigned Int 8 (euint8)</option>
          <option value="uint16">Unsigned Int 16 (euint16)</option>
          <option value="uint32">Unsigned Int 32 (euint32)</option>
          <option value="uint64">Unsigned Int 64 (euint64)</option>
          <option value="address">Address (eaddress)</option>
        </select>
      </div>

      {/* Input Value */}
      <div>
        <label className="label">Value to Encrypt</label>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={getPlaceholder()}
          className="input"
          disabled={isEncrypting}
        />
      </div>

      {/* Encrypt Button */}
      <button
        onClick={handleEncrypt}
        disabled={isEncrypting || !inputValue}
        className="button w-full"
      >
        {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
      </button>

      {/* Error Display */}
      {encryptError && (
        <div className="error bg-red-900/20 p-3 rounded border border-red-500/50">
          {encryptError.message}
        </div>
      )}

      {/* Encrypted Result */}
      {encryptedResult && (
        <div>
          <label className="label">Encrypted Output</label>
          <div className="bg-black/30 p-4 rounded border border-gray-700 overflow-auto max-h-96">
            <pre className="text-xs font-mono text-green-400">{encryptedResult}</pre>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            This encrypted data can be safely sent to the blockchain without revealing the original value
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-900/20 p-4 rounded border border-blue-500/50 text-sm">
        <h4 className="font-semibold text-blue-400 mb-2">How it works:</h4>
        <ul className="space-y-1 text-blue-300 text-xs">
          <li>• Your data is encrypted using fully homomorphic encryption (FHE)</li>
          <li>• The encrypted value can be used in smart contracts</li>
          <li>• Computations can be performed on encrypted data</li>
          <li>• Only authorized parties can decrypt the results</li>
        </ul>
      </div>
    </div>
  );
}
