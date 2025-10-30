'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface Account {
  address: string;
  encryptedBalance: string;
  lastUpdate: string;
}

export const BankingExample: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleDeposit = async () => {
    setIsProcessing(true);
    setMessage(null);

    try {
      if (!amount || parseFloat(amount) <= 0) {
        throw new Error('Please enter a valid amount');
      }

      // Simulate encrypted deposit
      await new Promise(resolve => setTimeout(resolve, 1500));

      const encryptedBalance = `0x${Array.from({ length: 32 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`;

      setAccount({
        address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        encryptedBalance,
        lastUpdate: new Date().toISOString(),
      });

      setMessage(`Successfully deposited ${amount} (encrypted)`);
      setAmount('');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Deposit failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTransfer = async () => {
    setIsProcessing(true);
    setMessage(null);

    try {
      if (!amount || parseFloat(amount) <= 0) {
        throw new Error('Please enter a valid amount');
      }

      if (!recipient || !recipient.startsWith('0x')) {
        throw new Error('Please enter a valid recipient address');
      }

      // Simulate encrypted transfer
      await new Promise(resolve => setTimeout(resolve, 2000));

      setMessage(`Successfully transferred ${amount} to ${recipient.slice(0, 10)}... (encrypted)`);
      setAmount('');
      setRecipient('');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Transfer failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card
      title="Private Banking Example"
      subtitle="Confidential balance and transfers using FHE"
    >
      <div className="space-y-6">
        {/* Account Display */}
        {account && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Your Account</h4>
            <p className="text-xs text-gray-600 mb-1">
              Address: {account.address}
            </p>
            <p className="text-xs text-gray-600 mb-1">
              Encrypted Balance:
              <span className="font-mono ml-1">{account.encryptedBalance.slice(0, 20)}...</span>
            </p>
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 mt-2">
              Balance is encrypted and private
            </span>
          </div>
        )}

        {/* Deposit Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900">Deposit Funds</h4>
          <Input
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to deposit"
            helperText="Your balance will be encrypted"
          />
          <Button
            variant="success"
            onClick={handleDeposit}
            isLoading={isProcessing}
            disabled={!amount}
            className="w-full"
          >
            Deposit (Encrypted)
          </Button>
        </div>

        {/* Transfer Section */}
        <div className="space-y-3 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900">Transfer Funds</h4>
          <Input
            label="Recipient Address"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
          />
          <Input
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to transfer"
          />
          <Button
            variant="primary"
            onClick={handleTransfer}
            isLoading={isProcessing}
            disabled={!amount || !recipient}
            className="w-full"
          >
            Transfer (Encrypted)
          </Button>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`p-3 rounded-lg ${
            message.includes('Successfully')
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <p className="text-sm">{message}</p>
          </div>
        )}

        {/* Info */}
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>Privacy Note:</strong> All balances and transfer amounts are encrypted
            using FHE. Only you can decrypt your balance with your private key.
          </p>
        </div>
      </div>
    </Card>
  );
};
