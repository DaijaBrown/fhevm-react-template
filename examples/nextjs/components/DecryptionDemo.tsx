'use client';

import { useState } from 'react';
import { useDecrypt } from '@fhevm/sdk/react';

interface DecryptionDemoProps {
  walletAddress: string;
  contractAddress: string;
}

type DecryptionType = 'bool' | 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'public';

export function DecryptionDemo({ walletAddress, contractAddress }: DecryptionDemoProps) {
  const { decrypt, isDecrypting, decryptError } = useDecrypt();
  const [decryptionType, setDecryptionType] = useState<DecryptionType>('uint32');
  const [encryptedInput, setEncryptedInput] = useState<string>('');
  const [decryptedResult, setDecryptedResult] = useState<string>('');

  async function handleDecrypt() {
    if (!encryptedInput) {
      return;
    }

    try {
      let result;

      switch (decryptionType) {
        case 'bool':
          result = await decrypt.bool(encryptedInput, walletAddress, contractAddress);
          break;
        case 'uint8':
          result = await decrypt.uint8(encryptedInput, walletAddress, contractAddress);
          break;
        case 'uint16':
          result = await decrypt.uint16(encryptedInput, walletAddress, contractAddress);
          break;
        case 'uint32':
          result = await decrypt.uint32(encryptedInput, walletAddress, contractAddress);
          break;
        case 'uint64':
          result = await decrypt.uint64(encryptedInput, walletAddress, contractAddress);
          break;
        case 'public':
          result = await decrypt.public(encryptedInput);
          break;
      }

      setDecryptedResult(String(result));
    } catch (err) {
      console.error('Decryption error:', err);
    }
  }

  return (
    <div className="space-y-6">
      {/* Type Selection */}
      <div>
        <label className="label">Decryption Type</label>
        <select
          value={decryptionType}
          onChange={(e) => {
            setDecryptionType(e.target.value as DecryptionType);
            setDecryptedResult('');
          }}
          className="input"
        >
          <option value="bool">Boolean (ebool)</option>
          <option value="uint8">Unsigned Int 8 (euint8)</option>
          <option value="uint16">Unsigned Int 16 (euint16)</option>
          <option value="uint32">Unsigned Int 32 (euint32)</option>
          <option value="uint64">Unsigned Int 64 (euint64)</option>
          <option value="public">Public Decrypt (no signature)</option>
        </select>
        {decryptionType !== 'public' && (
          <p className="text-xs text-gray-400 mt-2">
            This will require an EIP-712 signature from your wallet
          </p>
        )}
      </div>

      {/* Encrypted Input */}
      <div>
        <label className="label">Encrypted Value (Handle or Ciphertext)</label>
        <textarea
          value={encryptedInput}
          onChange={(e) => setEncryptedInput(e.target.value)}
          placeholder="Paste encrypted data here..."
          className="input font-mono text-xs"
          rows={4}
          disabled={isDecrypting}
        />
      </div>

      {/* Decrypt Button */}
      <button
        onClick={handleDecrypt}
        disabled={isDecrypting || !encryptedInput}
        className="button w-full"
      >
        {isDecrypting ? 'Decrypting...' : 'Decrypt Value'}
      </button>

      {/* Error Display */}
      {decryptError && (
        <div className="error bg-red-900/20 p-3 rounded border border-red-500/50">
          {decryptError.message}
        </div>
      )}

      {/* Decrypted Result */}
      {decryptedResult && (
        <div>
          <label className="label">Decrypted Output</label>
          <div className="bg-green-900/20 p-4 rounded border border-green-500/50">
            <p className="text-2xl font-bold text-green-400">{decryptedResult}</p>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            This is the original value that was encrypted
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-purple-900/20 p-4 rounded border border-purple-500/50 text-sm">
        <h4 className="font-semibold text-purple-400 mb-2">Decryption Methods:</h4>
        <div className="space-y-2 text-purple-300 text-xs">
          <div>
            <strong>User Decrypt:</strong> Requires EIP-712 signature. Only authorized users can decrypt.
          </div>
          <div>
            <strong>Public Decrypt:</strong> No signature required. Used for publicly viewable encrypted values.
          </div>
        </div>
      </div>

      {/* Usage Example */}
      <div className="bg-gray-900/50 p-4 rounded border border-gray-700 text-sm">
        <h4 className="font-semibold mb-2">Example Workflow:</h4>
        <ol className="list-decimal list-inside space-y-1 text-gray-400 text-xs">
          <li>Encrypt a value using the Encryption Demo</li>
          <li>Copy the encrypted output</li>
          <li>Send it to your smart contract</li>
          <li>Retrieve the encrypted handle from the contract</li>
          <li>Paste it here to decrypt and view the original value</li>
        </ol>
      </div>
    </div>
  );
}
