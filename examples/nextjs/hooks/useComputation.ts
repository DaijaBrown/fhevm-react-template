'use client';

import { useState, useCallback } from 'react';
import { ValidationUtils } from '../lib/utils/validation';

type ComputationOperation = 'add' | 'sub' | 'mul' | 'div' | 'eq' | 'ne' | 'gte' | 'gt' | 'lte' | 'lt' | 'min' | 'max' | 'and' | 'or' | 'xor' | 'not';

export function useComputation() {
  const [isComputing, setIsComputing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const compute = useCallback(
    async (
      operation: ComputationOperation,
      operands: string[]
    ): Promise<string | null> => {
      setIsComputing(true);
      setError(null);

      try {
        // Validate operation
        const validation = ValidationUtils.validateComputationOperation(
          operation,
          operands
        );

        if (!validation.valid) {
          throw new Error(validation.error);
        }

        // Simulate computation
        // In production, this would interact with smart contract
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock result
        const result = `0x${Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join('')}`;

        setLastResult(result);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Computation failed';
        setError(errorMessage);
        return null;
      } finally {
        setIsComputing(false);
      }
    },
    []
  );

  const add = useCallback(
    (a: string, b: string) => compute('add', [a, b]),
    [compute]
  );

  const subtract = useCallback(
    (a: string, b: string) => compute('sub', [a, b]),
    [compute]
  );

  const multiply = useCallback(
    (a: string, b: string) => compute('mul', [a, b]),
    [compute]
  );

  const equals = useCallback(
    (a: string, b: string) => compute('eq', [a, b]),
    [compute]
  );

  const greaterThan = useCallback(
    (a: string, b: string) => compute('gt', [a, b]),
    [compute]
  );

  const lessThan = useCallback(
    (a: string, b: string) => compute('lt', [a, b]),
    [compute]
  );

  return {
    compute,
    add,
    subtract,
    multiply,
    equals,
    greaterThan,
    lessThan,
    isComputing,
    error,
    lastResult,
  };
}
