# @fhevm/sdk

> Universal FHEVM SDK - Framework-agnostic toolkit for confidential dApps

## Installation

```bash
npm install @fhevm/sdk
```

## Quick Start

### Vanilla JavaScript/TypeScript

```typescript
import { FhevmSDK } from '@fhevm/sdk';

const fhevm = await FhevmSDK.init({
  network: 'sepolia',
  contractAddress: '0x...',
});

// Encrypt
const encrypted = await fhevm.encrypt.uint32(100);

// Decrypt
const decrypted = await fhevm.decrypt.uint32(encrypted, userAddress);
```

### React

```typescript
import { FhevmProvider, useFhevm, useEncrypt } from '@fhevm/sdk/react';

function App() {
  return (
    <FhevmProvider network="sepolia" contractAddress="0x...">
      <MyComponent />
    </FhevmProvider>
  );
}

function MyComponent() {
  const { sdk, isReady } = useFhevm();
  const { encrypt } = useEncrypt();

  return <div>{isReady && <button onClick={() => encrypt.uint32(100)}>Encrypt</button>}</div>;
}
```

### Vue

```vue
<script setup>
import { useFhevmSDK } from '@fhevm/sdk/vue';

const { sdk, encrypt, decrypt } = useFhevmSDK({
  network: 'sepolia',
});
</script>
```

## API Reference

### Core

#### `FhevmSDK.init(config)`

Initialize the SDK.

**Parameters:**
- `config.network`: Network to connect to ('sepolia' | 'localhost' | 'mainnet')
- `config.rpcUrl`: Custom RPC URL (optional)
- `config.contractAddress`: Contract address (optional)

**Returns:** Promise<FhevmSDK>

#### Encryption Methods

- `encrypt.bool(value: boolean)`
- `encrypt.uint8(value: number)`
- `encrypt.uint16(value: number)`
- `encrypt.uint32(value: number)`
- `encrypt.uint64(value: bigint)`
- `encrypt.address(value: string)`
- `encrypt.bytes(value: string)`

#### Decryption Methods

- `decrypt.uint8(encrypted, userAddress)`
- `decrypt.uint16(encrypted, userAddress)`
- `decrypt.uint32(encrypted, userAddress)`
- `decrypt.uint64(encrypted, userAddress)`
- `decrypt.public(encrypted)`

### React Hooks

#### `useFhevm()`

Access the FHEVM SDK instance.

```typescript
const { sdk, isReady, error } = useFhevm();
```

#### `useEncrypt()`

Access encryption utilities.

```typescript
const { encrypt, isEncrypting } = useEncrypt();
const result = await encrypt.uint32(100);
```

#### `useDecrypt()`

Access decryption utilities.

```typescript
const { decrypt, isDecrypting } = useDecrypt();
const value = await decrypt.uint32(encrypted, userAddress);
```

### Vue Composables

#### `useFhevmSDK(config)`

Complete SDK access in Vue.

```typescript
const { sdk, encrypt, decrypt, isReady } = useFhevmSDK({
  network: 'sepolia',
});
```

## License

MIT
