'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface WalletConnectProps {
  onConnect: (address: string) => void;
  onContractSet: (address: string) => void;
}

export function WalletConnect({ onConnect, onContractSet }: WalletConnectProps) {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [contractAddress, setContractAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    checkWalletConnection();
  }, []);

  async function checkWalletConnection() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          const address = await accounts[0].getAddress();
          setWalletAddress(address);
          onConnect(address);
        }
      } catch (err) {
        console.error('Error checking wallet connection:', err);
      }
    }
  }

  async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    try {
      setIsConnecting(true);
      setError('');

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setWalletAddress(address);
      onConnect(address);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }

  function handleContractAddressSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (contractAddress && ethers.isAddress(contractAddress)) {
      onContractSet(contractAddress);
      setError('');
    } else {
      setError('Please enter a valid contract address');
    }
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Wallet Connection</h2>

      <div className="space-y-6">
        {/* Wallet Connection */}
        <div>
          <label className="label">Wallet Address</label>
          {walletAddress ? (
            <div className="flex items-center gap-3">
              <div className="flex-1 p-3 rounded bg-green-900/20 border border-green-500/50">
                <p className="text-sm font-mono">{walletAddress}</p>
              </div>
              <div className="text-2xl">✅</div>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="button w-full"
            >
              {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
            </button>
          )}
        </div>

        {/* Contract Address Input */}
        {walletAddress && (
          <form onSubmit={handleContractAddressSubmit}>
            <label className="label">Contract Address</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                placeholder="0x..."
                className="input flex-1"
              />
              <button type="submit" className="button">
                Set Contract
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Enter the address of your deployed FHEVM contract
            </p>
          </form>
        )}

        {/* Error Display */}
        {error && (
          <div className="error bg-red-900/20 p-3 rounded border border-red-500/50">
            {error}
          </div>
        )}

        {/* Instructions */}
        {!walletAddress && (
          <div className="text-sm text-gray-400 space-y-2">
            <p>To get started:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Install MetaMask browser extension</li>
              <li>Connect your wallet</li>
              <li>Make sure you're on the correct network (Sepolia)</li>
              <li>Enter your deployed contract address</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
