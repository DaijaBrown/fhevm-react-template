'use client';

import { useState } from 'react';
import { useFhevm, useEncrypt, useDecrypt } from '@fhevm/sdk/react';
import { WalletConnect } from '@/components/WalletConnect';
import { EncryptionDemo } from '@/components/EncryptionDemo';
import { DecryptionDemo } from '@/components/DecryptionDemo';
import { SDKStatus } from '@/components/SDKStatus';

export default function Home() {
  const { sdk, isReady, isLoading, error } = useFhevm();
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [contractAddress, setContractAddress] = useState<string>('');

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            FHEVM Universal SDK
          </h1>
          <p className="text-xl text-gray-400">
            Next.js Example - Fully Homomorphic Encryption for Ethereum
          </p>
        </header>

        {/* SDK Status */}
        <div className="mb-8">
          <SDKStatus isReady={isReady} isLoading={isLoading} error={error} />
        </div>

        {/* Wallet Connection */}
        <div className="mb-8">
          <WalletConnect
            onConnect={(address) => setWalletAddress(address)}
            onContractSet={(address) => setContractAddress(address)}
          />
        </div>

        {/* Main Content */}
        {isReady && walletAddress && contractAddress ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Encryption Section */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Encryption Demo</h2>
              <EncryptionDemo
                walletAddress={walletAddress}
                contractAddress={contractAddress}
              />
            </div>

            {/* Decryption Section */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Decryption Demo</h2>
              <DecryptionDemo
                walletAddress={walletAddress}
                contractAddress={contractAddress}
              />
            </div>
          </div>
        ) : (
          <div className="card text-center py-12">
            <h3 className="text-xl font-semibold mb-4">Getting Started</h3>
            <p className="text-gray-400 mb-4">
              {!isReady
                ? 'Initializing FHEVM SDK...'
                : !walletAddress
                ? 'Please connect your wallet to continue'
                : 'Please set a contract address to continue'}
            </p>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="text-4xl mb-3">🔐</div>
            <h3 className="text-lg font-semibold mb-2">Fully Encrypted</h3>
            <p className="text-sm text-gray-400">
              All data is encrypted using fully homomorphic encryption
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold mb-2">Framework Agnostic</h3>
            <p className="text-sm text-gray-400">
              Works with React, Vue, Next.js, and vanilla JavaScript
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="text-lg font-semibold mb-2">Easy to Use</h3>
            <p className="text-sm text-gray-400">
              Intuitive API with React hooks and TypeScript support
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>
            Built with ❤️ for the privacy-first Web3 community
          </p>
          <p className="mt-2">
            <a
              href="https://github.com/zama-ai/fhevmjs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              Powered by Zama FHEVM
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
