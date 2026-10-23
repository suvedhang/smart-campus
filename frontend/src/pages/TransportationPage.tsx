import React, { useCallback } from 'react';
import { api } from '../services/api';
import { useApiData } from '../services/useApiData';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingState, ErrorState, EmptyState } from '../components/StatusStates';
import type { TransportationItem } from '../types';

export const TransportationPage: React.FC = () => {
  const fetcher = useCallback(() => api.getTransportation(), []);
  const { data, loading, error, refetch } = useApiData<TransportationItem[]>(fetcher);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!data || data.length === 0) return <EmptyState message="No transportation data available." />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Transportation</h2>
        <p className="text-sm text-gray-500">Campus shuttle and vehicle tracking (simulated)</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-medium text-emerald-700">In Service</p>
          <p className="mt-1 text-xl font-bold text-emerald-700">
            {data.filter((s) => s.status === 'In Service').length}
          </p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-xs font-medium text-red-700">Out of Service</p>
          <p className="mt-1 text-xl font-bold text-red-700">
            {data.filter((s) => s.status === 'Out of Service').length}
          </p>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-xs font-medium text-blue-700">Charging</p>
          <p className="mt-1 text-xl font-bold text-blue-700">
            {data.filter((s) => s.status === 'Charging').length}
          </p>
        </div>
        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
          <p className="text-xs font-medium text-purple-700">Total Vehicles</p>
          <p className="mt-1 text-xl font-bold text-purple-700">{data.length}</p>
        </div>
      </div>

      {/* Shuttle Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.map((shuttle) => (
          <div key={shuttle.id} className="rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{shuttle.name}</h3>
                <p className="text-xs text-gray-500">{shuttle.id}</p>
              </div>
              <StatusBadge status={shuttle.status} />
            </div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Route</span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">{shuttle.route}</p>
              <div className="flex justify-between">
                <span className="text-gray-500">Location</span>
                <span className="font-medium text-gray-900">{shuttle.currentLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Passengers</span>
                <span className="font-medium">{shuttle.currentPassengers} / {shuttle.capacity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Driver</span>
                <span className="font-medium text-gray-900">{shuttle.driver}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Next Stop</span>
                <span className="font-medium text-gray-900">{shuttle.nextStop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ETA</span>
                <span className="font-medium text-gray-900">{shuttle.estimatedArrival}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
