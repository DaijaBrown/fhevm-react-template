'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

type Operation = 'add' | 'sub' | 'mul' | 'eq' | 'gt' | 'lt';

export const ComputationDemo: React.FC = () => {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [operation, setOperation] = useState<Operation>('add');
  const [isComputing, setIsComputing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCompute = async () => {
    setIsComputing(true);
    setError(null);
    setResult(null);

    try {
      // Validation
      if (!value1 || !value2) {
        throw new Error('Please enter both values');
      }

      const num1 = parseFloat(value1);
      const num2 = parseFloat(value2);

      if (isNaN(num1) || isNaN(num2)) {
        throw new Error('Please enter valid numbers');
      }

      // Simulate homomorphic computation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Calculate result (in real FHE, this happens on encrypted data)
      let computedResult: number | boolean;
      switch (operation) {
        case 'add':
          computedResult = num1 + num2;
          break;
        case 'sub':
          computedResult = num1 - num2;
          break;
        case 'mul':
          computedResult = num1 * num2;
          break;
        case 'eq':
          computedResult = num1 === num2;
          break;
        case 'gt':
          computedResult = num1 > num2;
          break;
        case 'lt':
          computedResult = num1 < num2;
          break;
        default:
          throw new Error('Invalid operation');
      }

      setResult(`Result: ${computedResult} (computed on encrypted data)`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Computation failed');
    } finally {
      setIsComputing(false);
    }
  };

  return (
    <Card title="Homomorphic Computation Demo" subtitle="Perform calculations on encrypted data">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Operation
          </label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value as Operation)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="add">Addition (+)</option>
            <option value="sub">Subtraction (-)</option>
            <option value="mul">Multiplication (*)</option>
            <option value="eq">Equal (==)</option>
            <option value="gt">Greater Than (&gt;)</option>
            <option value="lt">Less Than (&lt;)</option>
          </select>
        </div>

        <Input
          label="First Value"
          type="number"
          value={value1}
          onChange={(e) => setValue1(e.target.value)}
          placeholder="Enter first value"
        />

        <Input
          label="Second Value"
          type="number"
          value={value2}
          onChange={(e) => setValue2(e.target.value)}
          placeholder="Enter second value"
        />

        <Button
          variant="primary"
          onClick={handleCompute}
          isLoading={isComputing}
          disabled={!value1 || !value2}
          className="w-full"
        >
          Compute on Encrypted Data
        </Button>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900 font-medium">{result}</p>
            <p className="text-xs text-blue-600 mt-1">
              Note: In real FHE, the computation happens without decrypting the data
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
