'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface MedicalRecord {
  id: string;
  type: string;
  encryptedValue: string;
  timestamp: string;
}

export const MedicalExample: React.FC = () => {
  const [recordType, setRecordType] = useState('bloodPressure');
  const [value, setValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const recordTypes = {
    bloodPressure: 'Blood Pressure',
    heartRate: 'Heart Rate',
    glucose: 'Blood Glucose',
    temperature: 'Body Temperature',
    weight: 'Weight',
  };

  const handleAddRecord = async () => {
    setIsProcessing(true);
    setMessage(null);

    try {
      if (!value) {
        throw new Error('Please enter a value');
      }

      // Simulate encrypted storage
      await new Promise(resolve => setTimeout(resolve, 1500));

      const encryptedValue = `0x${Array.from({ length: 32 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`;

      const newRecord: MedicalRecord = {
        id: Date.now().toString(),
        type: recordTypes[recordType as keyof typeof recordTypes],
        encryptedValue,
        timestamp: new Date().toISOString(),
      };

      setRecords([newRecord, ...records]);
      setMessage('Medical record stored securely (encrypted)');
      setValue('');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to store record');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnalyze = async () => {
    setIsProcessing(true);
    setMessage(null);

    try {
      if (records.length === 0) {
        throw new Error('No records to analyze');
      }

      // Simulate encrypted analysis
      await new Promise(resolve => setTimeout(resolve, 2000));

      setMessage('Analysis complete: Trends computed on encrypted data without revealing values');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card
      title="Private Medical Records Example"
      subtitle="Confidential health data storage using FHE"
    >
      <div className="space-y-6">
        {/* Add Record Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900">Add Medical Record</h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Record Type
            </label>
            <select
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(recordTypes).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <Input
            label="Value"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter medical value"
            helperText="Value will be encrypted before storage"
          />

          <Button
            variant="primary"
            onClick={handleAddRecord}
            isLoading={isProcessing}
            disabled={!value}
            className="w-full"
          >
            Store Encrypted Record
          </Button>
        </div>

        {/* Records Display */}
        {records.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900">Your Records</h4>
              <Button
                variant="secondary"
                onClick={handleAnalyze}
                isLoading={isProcessing}
                size="sm"
              >
                Analyze Trends
              </Button>
            </div>

            <div className="space-y-2">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="p-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {record.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(record.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 font-mono break-all">
                    Encrypted: {record.encryptedValue.slice(0, 30)}...
                  </p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                      Private & Secure
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message Display */}
        {message && (
          <div className={`p-3 rounded-lg ${
            message.includes('complete') || message.includes('stored')
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <p className="text-sm">{message}</p>
          </div>
        )}

        {/* Info */}
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>HIPAA Compliance:</strong> Medical records are encrypted using FHE,
            ensuring data privacy while allowing authorized computations for analysis.
          </p>
        </div>
      </div>
    </Card>
  );
};
