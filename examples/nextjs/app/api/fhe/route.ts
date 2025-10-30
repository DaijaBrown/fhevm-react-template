import { NextRequest, NextResponse } from 'next/server';

/**
 * FHE Operations API Route
 * Handles general FHE operations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, data } = body;

    if (!operation) {
      return NextResponse.json(
        { error: 'Operation type is required' },
        { status: 400 }
      );
    }

    // Handle different FHE operations
    switch (operation) {
      case 'status':
        return NextResponse.json({
          success: true,
          status: 'ready',
          message: 'FHE service is operational',
        });

      case 'info':
        return NextResponse.json({
          success: true,
          info: {
            supportedTypes: ['uint8', 'uint16', 'uint32', 'uint64', 'bool', 'address'],
            version: '1.0.0',
          },
        });

      default:
        return NextResponse.json(
          { error: 'Unsupported operation' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('FHE API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'FHE API is running',
    endpoints: {
      encrypt: '/api/fhe/encrypt',
      decrypt: '/api/fhe/decrypt',
      compute: '/api/fhe/compute',
    },
  });
}
