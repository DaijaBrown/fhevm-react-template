import { NextRequest, NextResponse } from 'next/server';

/**
 * Homomorphic Computation API Route
 * Server-side endpoint for FHE computation operations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, operands, type } = body;

    // Validate required fields
    if (!operation || !operands || !Array.isArray(operands)) {
      return NextResponse.json(
        { error: 'Missing required fields: operation, operands (array)' },
        { status: 400 }
      );
    }

    // Supported homomorphic operations
    const supportedOperations = [
      'add',
      'sub',
      'mul',
      'div',
      'eq',
      'ne',
      'gte',
      'gt',
      'lte',
      'lt',
      'min',
      'max',
      'and',
      'or',
      'xor',
      'not',
    ];

    if (!supportedOperations.includes(operation)) {
      return NextResponse.json(
        {
          error: `Unsupported operation: ${operation}`,
          supportedOperations,
        },
        { status: 400 }
      );
    }

    // Note: Actual homomorphic computation happens on-chain
    // This endpoint can be used for metadata, validation, or batching
    return NextResponse.json({
      success: true,
      message: 'Homomorphic computation should be performed on-chain',
      data: {
        operation,
        operandCount: operands.length,
        type: type || 'auto',
        hint: 'Submit encrypted values to smart contract for computation',
      },
    });
  } catch (error) {
    console.error('Computation API error:', error);
    return NextResponse.json(
      { error: 'Failed to process computation request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Homomorphic Computation API endpoint',
    note: 'Use POST with operation and operands array',
    supportedOperations: [
      'add',
      'sub',
      'mul',
      'div',
      'eq',
      'ne',
      'gte',
      'gt',
      'lte',
      'lt',
      'min',
      'max',
      'and',
      'or',
      'xor',
      'not',
    ],
  });
}
