'use client';

interface SDKStatusProps {
  isReady: boolean;
  isLoading: boolean;
  error: Error | null;
}

export function SDKStatus({ isReady, isLoading, error }: SDKStatusProps) {
  if (error) {
    return (
      <div className="card bg-red-900/20 border-red-500/50">
        <div className="flex items-center gap-3">
          <div className="text-2xl">❌</div>
          <div>
            <h3 className="font-semibold text-red-400">SDK Initialization Failed</h3>
            <p className="text-sm text-red-300 mt-1">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="card bg-blue-900/20 border-blue-500/50">
        <div className="flex items-center gap-3">
          <div className="animate-spin text-2xl">⚙️</div>
          <div>
            <h3 className="font-semibold text-blue-400">Initializing FHEVM SDK</h3>
            <p className="text-sm text-blue-300 mt-1">Please wait while we set up the encryption environment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isReady) {
    return (
      <div className="card bg-green-900/20 border-green-500/50">
        <div className="flex items-center gap-3">
          <div className="text-2xl">✅</div>
          <div>
            <h3 className="font-semibold text-green-400">SDK Ready</h3>
            <p className="text-sm text-green-300 mt-1">FHEVM SDK is initialized and ready to use</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
