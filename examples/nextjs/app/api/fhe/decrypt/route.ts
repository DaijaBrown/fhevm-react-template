import { NextRequest, NextResponse } from 'next/server';

/**
 * Decryption API Route
 * Server-side decryption endpoint for FHE operations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { encryptedValue, type, userAddress, contractAddress, signature } = body;

    // Validate required fields
    if (!encryptedValue || !type || !userAddress || !contractAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: encryptedValue, type, userAddress, contractAddress' },
        { status: 400 }
      );
    }

    // Validate supported types
    const supportedTypes = ['uint8', 'uint16', 'uint32', 'uint64', 'bool', 'address'];
    if (!supportedTypes.includes(type)) {
      return NextResponse.json(
        { error: `Unsupported type: ${type}. Supported types: ${supportedTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Note: In production, decryption requires EIP-712 signature verification
    // This is a placeholder for server-side processing
    if (!signature) {
      return NextResponse.json(
        { error: 'EIP-712 signature required for decryption' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Decryption should be performed client-side using SDK',
      data: {
        type,
        contractAddress,
        userAddress,
        hint: 'Use SDK decrypt methods on the client with EIP-712 signatures',
      },
    });
  } catch (error) {
    console.error('Decryption API error:', error);
    return NextResponse.json(
      { error: 'Failed to process decryption request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Decryption API endpoint',
    note: 'Use POST with encryptedValue, type, userAddress, contractAddress, and signature',
    supportedTypes: ['uint8', 'uint16', 'uint32', 'uint64', 'bool', 'address'],
  });
}
