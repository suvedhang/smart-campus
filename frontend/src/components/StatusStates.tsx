import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState: React.FC<{ message?: string }> = ({
  message = 'Loading data...',
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-500">
    <Loader2 className="mb-3 h-8 w-8 animate-spin text-campus-600" />
    <p className="text-sm">{message}</p>
  </div>
);

export const ErrorState: React.FC<{
  message: string;
  onRetry?: () => void;
}> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 py-12 text-center">
    <p className="text-sm font-medium text-red-700">Error</p>
    <p className="mt-1 text-sm text-red-600">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
      >
        Retry
      </button>
    )}
  </div>
);

export const EmptyState: React.FC<{ message?: string }> = ({
  message = 'No data available.',
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
    <p className="text-sm">{message}</p>
  </div>
);
