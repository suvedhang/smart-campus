import React, { useCallback, useState } from 'react';
import { Search } from 'lucide-react';
import { api } from '../services/api';
import { useApiData } from '../services/useApiData';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingState, ErrorState, EmptyState } from '../components/StatusStates';
import type { Building } from '../types';

export const BuildingsPage: React.FC = () => {
  const fetcher = useCallback(() => api.getBuildings(), []);
  const { data, loading, error, refetch } = useApiData<Building[]>(fetcher);
  const [search, setSearch] = useState('');

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!data || data.length === 0) return <EmptyState message="No buildings data available." />;

  const filtered = data.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.type.toLowerCase().includes(search.toLowerCase()) ||
      b.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Buildings</h2>
          <p className="text-sm text-gray-500">{data.length} campus buildings</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            id="buildings-search"
            type="text"
            placeholder="Search buildings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-campus-500 focus:outline-none focus:ring-1 focus:ring-campus-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((b) => {
          const utilization = Math.round((b.currentOccupancy / b.capacity) * 100);
          return (
            <div
              key={b.id}
              className="rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{b.name}</h3>
                  <p className="text-xs text-gray-500">{b.type} · {b.floors} floors · {b.totalRooms} rooms</p>
                </div>
                <StatusBadge status={b.status} />
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Occupancy</span>
                  <span className="font-medium">{b.currentOccupancy} / {b.capacity}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div
                    className={`h-2 rounded-full ${
                      utilization > 80 ? 'bg-red-500' : utilization > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(utilization, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Energy</span>
                  <span className="font-medium">{b.energyConsumption} {b.energyUnit}</span>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {b.facilities.slice(0, 3).map((f) => (
                    <span key={f} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      {f}
                    </span>
                  ))}
                  {b.facilities.length > 3 && (
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      +{b.facilities.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {filtered.length === 0 && <EmptyState message={`No buildings match "${search}".`} />}
    </div>
  );
};
