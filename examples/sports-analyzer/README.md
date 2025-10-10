# Sports Performance Analyzer - FHEVM Example

A privacy-preserving sports performance tracking application built with FHEVM (Fully Homomorphic Encryption for Ethereum Virtual Machine) and the FHEVM Universal SDK.

## Overview

This application demonstrates a real-world use case of FHEVM technology: athlete performance tracking with complete privacy. Athletes can:

- Record confidential performance metrics (heart rate, calories, duration, etc.)
- Analyze their progress privately
- Compete on leaderboards without revealing exact scores
- Set and track personal goals with encrypted data

All sensitive data is encrypted on-chain using FHEVM, ensuring athletes' performance metrics remain private while still allowing for computations and comparisons.

## Features

### Core Functionality

- ✅ **Athlete Registration**: Register with your chosen sport
- ✅ **Performance Recording**: Track encrypted performance metrics
  - Heart rate (BPM)
  - Calories burned
  - Duration (minutes)
  - Distance (meters)
  - Intensity level (1-10)
  - Recovery time
- ✅ **Performance Analysis**: Generate encrypted performance analytics
  - Average heart rate
  - Total calories burned
  - Total duration
  - Average intensity
  - Improvement score (0-100)
- ✅ **Privacy-Preserving Leaderboard**: Compete without revealing exact scores
- ✅ **Goal Tracking**: Set and check encrypted fitness goals

### Technical Features

- ✅ **Full SDK Integration**: Uses `@fhevm/sdk` for all encryption operations
- ✅ **React Hooks**: Clean integration with `useFhevm`, `useEncrypt`, `useDecrypt`
- ✅ **TypeScript**: Complete type safety throughout
- ✅ **Smart Contract**: `PrivateSportsAnalyzer.sol` with FHEVM operations
- ✅ **Vite**: Fast development and build tooling

## Quick Start

### Prerequisites

- Node.js 18.x or 20.x
- MetaMask browser extension
- Sepolia testnet ETH
- Deployed `PrivateSportsAnalyzer` contract

### Installation

```bash
# From the monorepo root
npm run install:all

# Or from this directory
cd examples/sports-analyzer
npm install
```

### Configuration

1. Deploy the contract:

```bash
# Deploy to Sepolia testnet
cd ../..
npm run deploy:sports-analyzer
```

2. Create `.env.local`:

```env
VITE_NETWORK=sepolia
VITE_CONTRACT_ADDRESS=0xYourDeployedContractAddress
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

### Running the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm run preview
```

Access at `http://localhost:5173`.

## Usage Guide

### 1. Register as an Athlete

- Connect your MetaMask wallet
- Enter your sport (e.g., "Running", "Cycling", "Swimming")
- Click "Register Athlete"
- Confirm the transaction in MetaMask

### 2. Record a Performance Session

Enter your workout metrics:
- **Heart Rate**: Average BPM (0-300)
- **Calories**: Total burned (0-5000)
- **Duration**: Minutes exercised (0-1440)
- **Distance**: Meters traveled
- **Intensity**: Self-rated 1-10 scale
- **Recovery Time**: Minutes until recovery

Click "Record Performance" and confirm the transaction. All data will be encrypted before sending to the blockchain.

### 3. Update Your Analysis

After recording sessions:
- Click "Update Analysis"
- The contract will compute encrypted analytics:
  - Average heart rate across sessions
  - Total calories burned
  - Total duration
  - Average intensity
  - Improvement score (based on consistency and intensity)

### 4. Join the Leaderboard

- Click "Submit to Leaderboard"
- Choose a category (e.g., "Endurance", "Power", "Consistency")
- Your encrypted improvement score will be submitted
- Other athletes can see you're on the leaderboard but not your exact score

### 5. Track Goals

Set encrypted fitness goals:
- Target average heart rate
- Target total calories
- Target total duration
- Goal type/name

The contract will privately check if you've met your goals without revealing your actual metrics.

## Contract Details

### PrivateSportsAnalyzer.sol

The smart contract provides:

**State Variables:**
- `totalAthletes`: Total registered athletes
- `totalSessions`: Total performance sessions recorded
- `athletes`: Mapping of athlete profiles
- `performanceData`: Encrypted performance metrics per session
- `athleteAnalysis`: Encrypted performance analytics per athlete
- `categoryLeaderboards`: Privacy-preserving leaderboards by category

**Key Functions:**
- `registerAthlete(string sport)`: Register as an athlete
- `recordPerformance(...)`: Record encrypted performance session
- `updateAnalysis()`: Compute encrypted performance analytics
- `submitToLeaderboard(string category)`: Submit encrypted score
- `checkGoalAchievement(...)`: Check encrypted goals privately
- `getAthleteProfile(address)`: Get public profile info
- `getLeaderboardSize(string)`: Get leaderboard entry count
- `getContractStats()`: Get contract statistics

## SDK Integration Examples

### Using Encryption

```typescript
import { useEncrypt } from '@fhevm/sdk/react';

function RecordPerformance() {
  const { encrypt } = useEncrypt();

  async function handleRecord() {
    // Encrypt performance data
    const heartRate = await encrypt.uint32(
      150,
      contractAddress,
      userAddress
    );

    const calories = await encrypt.uint32(
      450,
      contractAddress,
      userAddress
    );

    // Send to contract...
  }
}
```

### Using Decryption

```typescript
import { useDecrypt } from '@fhevm/sdk/react';

function ViewAnalysis() {
  const { decrypt } = useDecrypt();

  async function handleDecrypt(encryptedScore) {
    // Decrypt with EIP-712 signature
    const score = await decrypt.uint32(
      encryptedScore,
      userAddress,
      contractAddress
    );

    console.log('Your improvement score:', score);
  }
}
```

### Full Workflow

```typescript
import { useFhevm, useEncrypt, useDecrypt } from '@fhevm/sdk/react';
import { ethers } from 'ethers';

function SportsAnalyzer() {
  const { sdk, isReady } = useFhevm();
  const { encrypt } = useEncrypt();
  const { decrypt } = useDecrypt();

  async function recordAndAnalyze() {
    if (!isReady) return;

    // Get contract instance
    const contract = sdk.createContract(contractAddress, contractABI);

    // Encrypt inputs
    const encHeartRate = await encrypt.uint32(155, contractAddress, userAddress);
    const encCalories = await encrypt.uint32(500, contractAddress, userAddress);

    // Record performance (plaintext passed to contract, it encrypts)
    await contract.recordPerformance(155, 500, 45, 5000, 8, 60);

    // Update analysis
    await contract.updateAnalysis();

    // Later, decrypt your analysis
    const analysis = await contract.athleteAnalysis(userAddress);
    const avgHeartRate = await decrypt.uint32(
      analysis.avgHeartRate,
      userAddress,
      contractAddress
    );

    console.log('Your average heart rate:', avgHeartRate);
  }
}
```

## Architecture

```
┌─────────────────────────────────────┐
│       React Application             │
│  (Vite + TypeScript + FHEVM SDK)    │
└────────────┬────────────────────────┘
             │
             │ useFhevm, useEncrypt, useDecrypt
             │
┌────────────▼────────────────────────┐
│       @fhevm/sdk Package            │
│   (Framework-agnostic Core)         │
└────────────┬────────────────────────┘
             │
             │ ethers.js + fhevmjs
             │
┌────────────▼────────────────────────┐
│  PrivateSportsAnalyzer.sol          │
│  (FHEVM Smart Contract on Sepolia)  │
└─────────────────────────────────────┘
```

## Privacy Benefits

### What's Private:
- ✅ Exact performance metrics (heart rate, calories, etc.)
- ✅ Personal improvement scores
- ✅ Goal targets and achievement status
- ✅ Detailed analytics

### What's Public:
- ✅ That an athlete is registered
- ✅ Number of sessions recorded
- ✅ Sport/category
- ✅ Leaderboard participation (but not exact scores)

## Development

### Contract Deployment

```bash
# Compile contracts
npx hardhat compile

# Deploy to Sepolia
npx hardhat run scripts/deploy-sports-analyzer.js --network sepolia

# Verify on Etherscan
npx hardhat verify --network sepolia DEPLOYED_ADDRESS
```

### Frontend Development

```bash
# Start dev server
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build
```

## Use Cases

This example demonstrates FHEVM's potential for:

1. **Health & Fitness Tracking**: Private health metrics
2. **Corporate Wellness Programs**: Anonymous employee participation
3. **Athletic Training**: Confidential performance data for professionals
4. **Insurance**: Privacy-preserving fitness verification
5. **Gaming**: Encrypted player stats and rankings

## Limitations & Future Improvements

### Current Limitations

- Simplified analytics (due to FHE computation complexity)
- Gas costs are higher than traditional contracts
- Decryption requires user interaction (EIP-712 signatures)

### Planned Improvements

- [ ] More sophisticated analytics
- [ ] Team competitions with aggregate encrypted scores
- [ ] Historical trend visualization (encrypted)
- [ ] Integration with fitness wearables
- [ ] Multi-sport tracking
- [ ] Coach access with permission management

## Security Considerations

### Smart Contract Security

- Access control modifiers (`onlyOwner`, `onlyRegisteredAthlete`)
- Input validation on all performance metrics
- TFHE library handles encryption/decryption automatically

### Frontend Security

- Never expose private keys
- Use environment variables for sensitive config
- Validate all user inputs before encryption
- Handle decryption errors gracefully

## Troubleshooting

### Common Issues

**"Not registered athlete" error:**
- Ensure you've called `registerAthlete()` first
- Check transaction was confirmed
- Verify you're using the correct wallet address

**Encryption fails:**
- Confirm SDK is initialized (`isReady === true`)
- Check contract address is correct
- Ensure wallet is connected to correct network

**Decryption fails:**
- Verify you have permission to decrypt the value
- Confirm EIP-712 signature was approved
- Check the encrypted handle is valid

**Gas estimation fails:**
- FHE operations are gas-intensive
- Ensure you have enough Sepolia ETH
- Try increasing gas limit manually

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [TFHE Library Reference](https://docs.zama.ai/fhevm/fundamentals/types)
- [Main Repository README](../../README.md)

## License

MIT License - See LICENSE file

---

**Built with ❤️ for privacy-first fitness tracking**

Demonstrating real-world FHEVM applications for the Zama FHEVM Bounty Season
