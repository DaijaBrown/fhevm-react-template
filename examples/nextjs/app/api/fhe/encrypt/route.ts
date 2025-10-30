import { NextRequest, NextResponse } from 'next/server';

/**
 * Encryption API Route
 * Server-side encryption endpoint for FHE operations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { value, type, contractAddress, userAddress } = body;

    // Validate required fields
    if (value === undefined || !type || !contractAddress || !userAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: value, type, contractAddress, userAddress' },
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

    // Note: In production, encryption should be done client-side
    // This is a placeholder for server-side processing if needed
    return NextResponse.json({
      success: true,
      message: 'Encryption should be performed client-side using SDK',
      data: {
        type,
        contractAddress,
        userAddress,
        hint: 'Use SDK encrypt methods on the client for security',
      },
    });
  } catch (error) {
    console.error('Encryption API error:', error);
    return NextResponse.json(
      { error: 'Failed to process encryption request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Encryption API endpoint',
    note: 'Use POST with value, type, contractAddress, and userAddress',
    supportedTypes: ['uint8', 'uint16', 'uint32', 'uint64', 'bool', 'address'],
  });
}
