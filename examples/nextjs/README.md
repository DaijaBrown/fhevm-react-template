# FHEVM SDK - Next.js Example

This is a comprehensive example demonstrating how to use the FHEVM Universal SDK with Next.js 14 and the App Router.

## Features

- ✅ **Complete SDK Integration**: Uses `@fhevm/sdk` React hooks
- ✅ **Wallet Connection**: MetaMask integration with ethers.js
- ✅ **Encryption Demo**: Interactive UI for encrypting all FHEVM types
- ✅ **Decryption Demo**: User and public decryption examples
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Modern UI**: Responsive design with CSS gradients
- ✅ **Error Handling**: Comprehensive error states and messages

## Quick Start

### Prerequisites

- Node.js 18.x or 20.x
- MetaMask browser extension
- Access to Sepolia testnet or FHEVM testnet

### Installation

```bash
# From the monorepo root
npm run install:all

# Or from this directory
cd examples/nextjs
npm install
```

### Configuration

1. Copy the environment template:

```bash
cp .env.example .env.local
```

2. Edit `.env.local` with your configuration:

```env
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

### Running the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The application will be available at `http://localhost:3000`.

## Usage Guide

### 1. Connect Your Wallet

- Click "Connect MetaMask" button
- Approve the connection in MetaMask
- Ensure you're on the correct network (Sepolia)

### 2. Set Contract Address

- Enter your deployed FHEVM contract address
- Click "Set Contract"

### 3. Encrypt Data

Choose from supported types:
- **Boolean** (ebool): `true` or `false`
- **Unsigned Int 8** (euint8): 0-255
- **Unsigned Int 16** (euint16): 0-65535
- **Unsigned Int 32** (euint32): 0-4294967295
- **Unsigned Int 64** (euint64): Large numbers
- **Address** (eaddress): Ethereum addresses

Enter a value and click "Encrypt Value" to see the encrypted output.

### 4. Decrypt Data

Two decryption methods are available:

#### User Decrypt (With Signature)
- Requires EIP-712 signature from your wallet
- Only authorized users can decrypt
- Used for private data

#### Public Decrypt (No Signature)
- No signature required
- Used for publicly viewable encrypted values
- Faster but less secure

## Code Structure

```
examples/nextjs/
├── app/
│   ├── layout.tsx          # Root layout with Providers
│   ├── page.tsx            # Main page component
│   ├── providers.tsx       # FhevmProvider setup
│   └── globals.css         # Global styles
├── components/
│   ├── DecryptionDemo.tsx  # Decryption UI component
│   ├── EncryptionDemo.tsx  # Encryption UI component
│   ├── SDKStatus.tsx       # SDK status indicator
│   └── WalletConnect.tsx   # Wallet connection UI
├── lib/                    # Utility functions (if needed)
├── public/                 # Static assets
├── .env.example            # Environment template
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
└── README.md              # This file
```

## Key Components

### FhevmProvider

Wraps the application and initializes the FHEVM SDK:

```typescript
import { FhevmProvider } from '@fhevm/sdk/react';

<FhevmProvider network="sepolia" contractAddress="0x...">
  <App />
</FhevmProvider>
```

### Using SDK Hooks

```typescript
import { useFhevm, useEncrypt, useDecrypt } from '@fhevm/sdk/react';

function MyComponent() {
  const { sdk, isReady } = useFhevm();
  const { encrypt, isEncrypting } = useEncrypt();
  const { decrypt, isDecrypting } = useDecrypt();

  // Encrypt a value
  const encrypted = await encrypt.uint32(100, contractAddr, userAddr);

  // Decrypt a value
  const decrypted = await decrypt.uint32(handle, userAddr, contractAddr);
}
```

## Integration with Smart Contracts

### Example Contract Interaction

```typescript
import { ethers } from 'ethers';

// Get SDK and signer
const { sdk } = useFhevm();
const signer = await sdk.getSigner();

// Create contract instance
const contract = new ethers.Contract(
  contractAddress,
  contractABI,
  signer
);

// Encrypt input
const encrypted = await encrypt.uint32(42, contractAddress, userAddress);

// Send to contract
const tx = await contract.submitEncryptedValue(encrypted.handles[0], encrypted.inputProof);
await tx.wait();

// Read encrypted result
const encryptedResult = await contract.getEncryptedValue();

// Decrypt result
const result = await decrypt.uint32(encryptedResult, userAddress, contractAddress);
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_NETWORK` | Network name (sepolia, localhost, mainnet) | No | sepolia |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Your contract address | No | - |
| `NEXT_PUBLIC_RPC_URL` | Custom RPC URL | No | Network default |
| `NEXT_PUBLIC_CHAIN_ID` | Custom chain ID | No | Network default |
| `NEXT_PUBLIC_GATEWAY_URL` | FHEVM gateway URL | No | Network default |

## Troubleshooting

### MetaMask Not Detected

**Issue**: "MetaMask is not installed" error

**Solution**:
- Install MetaMask browser extension
- Refresh the page
- Ensure you're using a supported browser (Chrome, Firefox, Edge)

### Wrong Network

**Issue**: Transactions fail due to wrong network

**Solution**:
- Open MetaMask
- Switch to Sepolia testnet
- Refresh the page

### SDK Initialization Failed

**Issue**: "SDK Initialization Failed" error

**Solution**:
- Check your network configuration in `.env.local`
- Ensure RPC URL is accessible
- Check browser console for detailed error messages

### Encryption/Decryption Errors

**Issue**: Encryption or decryption operations fail

**Solution**:
- Verify contract address is correct
- Ensure wallet is connected
- Check that you're on the correct network
- For decryption, ensure you have permission to decrypt the value

## Performance Optimization

### Production Build

The application is optimized for production with:
- SWC minification enabled
- Code splitting
- Tree shaking
- Static page generation where possible

### Bundle Size

The SDK is tree-shakeable, so only imported functions are included in your bundle.

## Security Considerations

### Private Key Safety

- Never commit `.env.local` to version control
- Never expose private keys in client-side code
- Use environment variables for sensitive data

### Smart Contract Security

- Always verify contract addresses
- Test with small amounts first
- Audit your smart contracts before production

## Next Steps

1. **Deploy Your Contract**: Use the SDK with your own FHEVM contracts
2. **Customize UI**: Modify components to match your brand
3. **Add Features**: Build on top of this example
4. **Production Deploy**: Deploy to Vercel or your hosting provider

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms

Build the application and deploy the `.next` folder:

```bash
npm run build
# Upload .next/ folder to your hosting provider
```

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Zama FHEVM Docs](https://docs.zama.ai/fhevm)
- [Next.js Documentation](https://nextjs.org/docs)
- [fhevmjs Library](https://github.com/zama-ai/fhevmjs)

## Support

For issues or questions:
- Check the main [README](../../README.md)
- Review the [SDK documentation](../../packages/fhevm-sdk/README.md)
- Open an issue on GitHub
- Join the Zama community Discord

---

Built with ❤️ for privacy-first Web3 applications
