# Demo Video Guide (demo.mp4)

This guide provides a detailed script and outline for creating the demo.mp4 video that demonstrates the FHEVM Universal SDK.

## Video Requirements

- **Duration**: 8-12 minutes
- **Format**: MP4 (1080p recommended)
- **Audio**: Clear narration explaining each step
- **Screen Recording**: Show actual application usage

## Video Structure

### 1. Introduction (1 minute)

**Visual**: Title slide with project name

**Script**:
```
"Welcome to the FHEVM Universal SDK demonstration.

This project provides a framework-agnostic SDK for building confidential
decentralized applications using Fully Homomorphic Encryption on Ethereum.

The SDK works with React, Next.js, Vue, and vanilla JavaScript, making it
easy for any web developer to build privacy-preserving dApps.

Let me show you how it works."
```

**Show**:
- Repository README
- Project structure overview
- Key features list

---

### 2. Installation & Setup (2 minutes)

**Visual**: Terminal and code editor

**Script**:
```
"Getting started is incredibly simple - less than 10 lines of code.

First, clone the repository and install dependencies using our monorepo
setup with npm workspaces."
```

**Show**:
```bash
# Clone repository
git clone <repo-url>
cd fhevm-react-template

# Install all dependencies
npm run install:all

# Build the SDK
npm run build:sdk
```

**Script continues**:
```
"The SDK is now built and ready to use in any of our example applications.
Let's start with the Next.js example."
```

**Show**:
- File structure in VS Code
- Built SDK files in packages/fhevm-sdk/dist

---

### 3. Next.js Example (3 minutes)

**Visual**: Browser showing Next.js application

**Script**:
```
"Our first example is a Next.js 14 application with full SDK integration.

Starting the development server is just one command."
```

**Show**:
```bash
npm run dev:nextjs
```

**Visual**: Application loading in browser

**Script continues**:
```
"The SDK initializes automatically through the FhevmProvider component.

Let's connect a wallet and demonstrate encryption."
```

**Demonstrate**:
1. Click "Connect MetaMask"
2. Approve connection
3. Show connected wallet address
4. Enter contract address
5. Select encryption type (uint32)
6. Enter value to encrypt (e.g., 42)
7. Click "Encrypt Value"
8. Show encrypted output (JSON with handles and proof)

**Script**:
```
"As you can see, the SDK encrypted our value of 42 into a format that
can be sent to our FHEVM smart contract.

The encrypted data includes handles and input proofs that the contract
can process without ever seeing the original value."
```

**Demonstrate Decryption**:
1. Switch to Decryption tab
2. Paste encrypted value
3. Click "Decrypt Value"
4. Approve EIP-712 signature in MetaMask
5. Show decrypted result: 42

**Script**:
```
"Decryption requires an EIP-712 signature to prove you're authorized.
Only the wallet that encrypted the data (or has permission) can decrypt it."
```

---

### 4. Sports Analyzer Example (3 minutes)

**Visual**: Sports Analyzer application

**Script**:
```
"Now let's see a real-world example: our Privacy-Preserving Sports Analyzer.

This application demonstrates how FHEVM can protect sensitive health and
performance data while still allowing athletes to track progress and compete."
```

**Show**:
```bash
npm run dev:sports
```

**Visual**: Sports Analyzer UI

**Demonstrate Registration**:
1. Connect wallet
2. Enter sport: "Running"
3. Click "Register Athlete"
4. Show transaction confirmation

**Script**:
```
"Athletes register with their sport, and all performance metrics are
encrypted on-chain."
```

**Demonstrate Recording Performance**:
1. Fill in performance form:
   - Heart Rate: 155
   - Calories: 450
   - Duration: 45 minutes
   - Distance: 5000 meters
   - Intensity: 8
   - Recovery Time: 60 minutes
2. Click "Record Performance"
3. Show transaction

**Script**:
```
"The contract encrypts these sensitive metrics using TFHE operations.
Nobody can see your exact performance data - not even the contract owner."
```

**Demonstrate Analysis**:
1. Click "Update Analysis"
2. Show transaction
3. Explain encrypted analytics

**Script**:
```
"The contract computes encrypted analytics like average heart rate and
improvement scores. These calculations happen on encrypted data without
ever decrypting it."
```

**Demonstrate Leaderboard**:
1. Enter category: "Endurance"
2. Click "Submit to Leaderboard"
3. Explain privacy benefits

**Script**:
```
"Athletes can compete on leaderboards with their encrypted improvement
scores. You can see who's on the leaderboard, but not their exact scores.
This provides competitive motivation while preserving privacy."
```

---

### 5. SDK Architecture (1 minute)

**Visual**: Architecture diagram from README

**Script**:
```
"The SDK uses a clean architecture with three layers:

At the core is framework-agnostic TypeScript code that handles all FHEVM
operations.

The adapter layer provides React hooks, Vue composables, and other
framework-specific integrations.

Applications simply import the adapter they need - React developers use
hooks, Vue developers use composables, and vanilla JavaScript developers
use the core SDK directly."
```

**Show**:
- Diagram from README
- Code snippets showing different integrations

---

### 6. Code Walkthrough (2 minutes)

**Visual**: VS Code with code examples

**Script**:
```
"Using the SDK is intuitive. Here's a complete example."
```

**Show in editor**:
```typescript
import { FhevmProvider, useFhevm, useEncrypt, useDecrypt } from '@fhevm/sdk/react';

// Wrap your app with the provider
<FhevmProvider network="sepolia" contractAddress="0x...">
  <App />
</FhevmProvider>

// Use hooks in your components
function MyComponent() {
  const { sdk, isReady } = useFhevm();
  const { encrypt } = useEncrypt();
  const { decrypt } = useDecrypt();

  // Encrypt a value
  const encrypted = await encrypt.uint32(100, contractAddr, userAddr);

  // Send to contract
  await contract.submitValue(encrypted.handles[0], encrypted.inputProof);

  // Decrypt a result
  const result = await decrypt.uint32(handle, userAddr, contractAddr);
}
```

**Script**:
```
"Just three hooks give you complete access to FHEVM encryption and
decryption with loading states, error handling, and TypeScript types."
```

---

### 7. Features Summary (1 minute)

**Visual**: Feature list with checkmarks

**Script**:
```
"Let's recap what we've built:

✅ Universal SDK that works with any JavaScript framework
✅ Complete encryption support for all FHEVM types
✅ User decrypt with EIP-712 signatures
✅ Public decrypt for viewable data
✅ React hooks for intuitive integration
✅ Next.js example with modern UI
✅ Real-world Sports Analyzer application
✅ Complete TypeScript support
✅ Comprehensive documentation

All of this with less than 10 lines to get started."
```

**Show**:
- Quick start code from README
- Documentation pages

---

### 8. Conclusion (1 minute)

**Visual**: Repository and links

**Script**:
```
"The FHEVM Universal SDK makes it easy for any web developer to build
privacy-preserving decentralized applications.

Whether you're building health tracking, financial applications, voting
systems, or gaming - any application that needs to compute on sensitive
data - FHEVM and this SDK provide the tools you need.

Check out the repository for complete documentation, more examples, and
deployment guides.

Thank you for watching, and we look forward to seeing what you build
with FHEVM!"
```

**Show**:
- Repository URL
- Documentation links
- Live demo links
- GitHub stars/fork buttons

**End card**:
```
FHEVM Universal SDK
Built with ❤️ for privacy-first Web3

[Repository Link]
[Documentation]
[Live Demos]
```

---

## Recording Tips

### Technical Setup

1. **Screen Resolution**: Record at 1920x1080
2. **Font Size**: Increase terminal and editor font for visibility
3. **Zoom**: Use browser zoom (125-150%) for demos
4. **Mouse Highlighting**: Enable pointer highlighting
5. **Clean Desktop**: Remove personal items from screen

### Recording Software

Recommended tools:
- **OBS Studio** (Free, cross-platform)
- **Loom** (Easy to use, cloud-based)
- **Camtasia** (Professional features)
- **QuickTime** (Mac built-in)

### Audio Quality

1. Use a good microphone (not laptop mic if possible)
2. Record in a quiet room
3. Test audio levels before full recording
4. Use a pop filter if available
5. Speak clearly and not too fast

### Editing

1. Cut out long pauses or mistakes
2. Add smooth transitions between sections
3. Consider background music (low volume, non-distracting)
4. Add text overlays for key points
5. Include timestamps in description

### Before Recording Checklist

- [ ] All dependencies installed
- [ ] Applications running smoothly
- [ ] MetaMask configured with test accounts
- [ ] Contracts deployed to testnet
- [ ] Test transaction confirmed working
- [ ] Browser extensions hidden (except MetaMask)
- [ ] Notifications disabled
- [ ] Script rehearsed
- [ ] Recording software tested
- [ ] Backup plan if live demo fails

### Post-Production

1. Export as MP4 (H.264 codec)
2. Target file size: < 200MB (adjust quality/compression)
3. Add captions/subtitles if possible
4. Include video description with timestamps
5. Create thumbnail image

---

## Video Description Template

```
FHEVM Universal SDK - Complete Demonstration

🔐 A framework-agnostic SDK for building confidential dApps with Fully Homomorphic Encryption

⏱️ Timestamps:
0:00 - Introduction
1:00 - Installation & Setup
3:00 - Next.js Example
6:00 - Sports Analyzer Demo
9:00 - SDK Architecture
10:00 - Code Walkthrough
12:00 - Features Summary & Conclusion

🔗 Links:
Repository: [URL]
Documentation: [URL]
Live Demos: [URL]
Zama FHEVM: https://docs.zama.ai/fhevm

✨ Features:
- Framework-agnostic core (React, Vue, Next.js, vanilla JS)
- Complete FHEVM type support
- Intuitive React hooks
- TypeScript throughout
- < 10 lines to get started

Built for the Zama FHEVM Bounty Season
```

---

## Alternative: Screenshot-Based Demo

If video recording is not possible, create a slide-based demo with:

1. Screenshots of each step
2. Code snippets with syntax highlighting
3. Annotated images showing key features
4. GIF animations of key interactions
5. Markdown document with embedded images

Place in: `DEMO_WALKTHROUGH.md` with inline images
